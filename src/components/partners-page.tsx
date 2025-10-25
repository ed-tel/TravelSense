import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Building2, MapPin, CreditCard, Calendar, User, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Available partners pool - partners that can be added to requests
const partnerPool = [
  {
    name: 'Air New Zealand',
    logo: '✈️',
    dataTypesRequired: ['Travel Preferences', 'Booking History'],
    reward: '15 Airpoints',
  },
  {
    name: 'Booking.com',
    logo: '🏨',
    dataTypesRequired: ['Booking History', 'Spending Data'],
    reward: '10% Discount',
  },
  {
    name: 'Tourism New Zealand',
    logo: '🇳🇿',
    dataTypesRequired: ['Travel Preferences', 'Location'],
    reward: '$25 Voucher',
  },
  {
    name: 'Queenstown Tours',
    logo: '🏔️',
    dataTypesRequired: ['Travel Preferences', 'Location', 'Spending Data'],
    reward: '20% Off Tours',
  },
  {
    name: 'Rental Cars NZ',
    logo: '🚗',
    dataTypesRequired: ['Booking History', 'Demographics', 'Contact Information'],
    reward: '$50 Credit',
  },
  {
    name: 'Auckland Adventures',
    logo: '🎢',
    dataTypesRequired: ['Demographics', 'Spending Data', 'Booking History'],
    reward: 'Free Activity Pass',
  },
  {
    name: 'Kiwi Experience',
    logo: '🚌',
    dataTypesRequired: ['Travel Preferences', 'Location'],
    reward: '$30 Voucher',
  },
  {
    name: 'Milford Sound Cruises',
    logo: '⛴️',
    dataTypesRequired: ['Contact Information', 'Demographics', 'Location'],
    reward: '15% Discount',
  },
  {
    name: 'Skyline Gondola',
    logo: '🚠',
    dataTypesRequired: ['Travel Preferences', 'Demographics'],
    reward: '$20 Credit',
  },
  {
    name: 'Franz Josef Tours',
    logo: '🏔️',
    dataTypesRequired: ['Location', 'Spending Data'],
    reward: '25% Off',
  },
  {
    name: 'Rotorua Adventures',
    logo: '♨️',
    dataTypesRequired: ['Travel Preferences', 'Booking History'],
    reward: '$35 Voucher',
  },
  {
    name: 'Bay of Islands Cruises',
    logo: '⛵',
    dataTypesRequired: ['Contact Information', 'Location'],
    reward: 'Free Upgrade',
  },
];

// Mock uploaded datasets
const mockDatasets = [
  { id: 1, name: 'travel_data_september.csv', category: 'Location', uploadDate: 'Oct 10, 2024', status: 'success', size: '2.4 MB', recordsCount: 1234 },
  { id: 2, name: 'booking_history.json', category: 'Booking History', uploadDate: 'Oct 8, 2024', status: 'success', size: '1.8 MB', recordsCount: 856 },
  { id: 3, name: 'spending_october.csv', category: 'Spending Data', uploadDate: 'Oct 5, 2024', status: 'processing', size: '5.2 MB', recordsCount: 3421 },
  { id: 4, name: 'preferences_profile.json', category: 'Travel Preferences', uploadDate: 'Oct 3, 2024', status: 'success', size: '0.8 MB', recordsCount: 45 },
  { id: 5, name: 'location_history_aug.json', category: 'Location', uploadDate: 'Sep 28, 2024', status: 'success', size: '3.1 MB', recordsCount: 2456 },
  { id: 6, name: 'receipts_q3.csv', category: 'Spending Data', uploadDate: 'Sep 20, 2024', status: 'success', size: '4.2 MB', recordsCount: 987 },
  { id: 7, name: 'demographics.json', category: 'Demographics', uploadDate: 'Sep 15, 2024', status: 'success', size: '1.2 MB', recordsCount: 320 },
  { id: 8, name: 'contact_info.csv', category: 'Contact Information', uploadDate: 'Sep 10, 2024', status: 'success', size: '0.5 MB', recordsCount: 150 },
];

interface PartnerRequest {
  id: number;
  name: string;
  logo: string;
  dataTypesRequired: string[];
  reward: string;
  status: 'Pending' | 'Active' | 'Rejected';
  addedAt: number;
  isNew: boolean;
}

const getDataTypeIcon = (dataType: string) => {
  switch (dataType.toLowerCase()) {
    case 'travel preferences':
      return MapPin;
    case 'spending data':
      return CreditCard;
    case 'booking history':
      return Calendar;
    case 'location':
      return MapPin;
    case 'demographics':
    case 'contact information':
      return User;
    default:
      return Building2;
  }
};

const extractRewardValue = (reward: string): number => {
  const dollarMatch = reward.match(/\$(\d+)/);
  if (dollarMatch) return parseInt(dollarMatch[1]);
  
  const percentMatch = reward.match(/(\d+)%/);
  if (percentMatch) return parseInt(percentMatch[1]);
  
  const airpointsMatch = reward.match(/(\d+)\s*Airpoints/i);
  if (airpointsMatch) return parseInt(airpointsMatch[1]) * 0.5;
  
  return 10;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Location':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Spending Data':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Booking History':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Travel Preferences':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'Contact Information':
    case 'Demographics':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Calculate time elapsed since partner was added
const getTimeElapsed = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

interface PartnersPageProps {
  onNavigateToUploadData?: () => void;
  onDataShareAccepted?: (partnerName: string, reward: string, dataTypesCount: number, dataTypes: string[]) => void;
  onNewPartnerRequest?: (partnerName: string) => void;
}

export function PartnersPage({ onNavigateToUploadData, onDataShareAccepted, onNewPartnerRequest }: PartnersPageProps = {}) {
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>(() => {
    // Initialize with 3 random partners
    const initialPartners: PartnerRequest[] = [];
    const selectedIndices = new Set<number>();
    
    while (selectedIndices.size < 3) {
      const randomIndex = Math.floor(Math.random() * partnerPool.length);
      selectedIndices.add(randomIndex);
    }
    
    Array.from(selectedIndices).forEach((index, i) => {
      const partner = partnerPool[index];
      initialPartners.push({
        id: Date.now() + i,
        ...partner,
        status: 'Pending',
        addedAt: Date.now() - (i * 3600000), // Stagger initial times
        isNew: false,
      });
    });
    
    return initialPartners;
  });

  const [selectedPartner, setSelectedPartner] = useState<PartnerRequest | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [fadingOutIds, setFadingOutIds] = useState<Set<number>>(new Set());
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every minute to refresh timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Add new partner every 5 minutes
  useEffect(() => {
    const addNewPartner = () => {
      // Get partners not currently in requests
      const currentPartnerNames = new Set(partnerRequests.map(p => p.name));
      const availablePartners = partnerPool.filter(p => !currentPartnerNames.has(p.name));
      
      if (availablePartners.length === 0) return; // No more partners to add
      
      const randomPartner = availablePartners[Math.floor(Math.random() * availablePartners.length)];
      const newPartner: PartnerRequest = {
        id: Date.now(),
        ...randomPartner,
        status: 'Pending',
        addedAt: Date.now(),
        isNew: true,
      };
      
      setPartnerRequests(prev => [newPartner, ...prev]);
      
      // Notify parent about new partner (for notification)
      if (onNewPartnerRequest) {
        onNewPartnerRequest(newPartner.name);
      }
      
      // Show toast notification
      toast.info('New Partner Request', {
        description: `${newPartner.name} wants to access your data. Reward: ${newPartner.reward}`,
      });
      
      // Remove "new" badge after 30 seconds
      setTimeout(() => {
        setPartnerRequests(prev =>
          prev.map(p =>
            p.id === newPartner.id ? { ...p, isNew: false } : p
          )
        );
      }, 30000);
    };
    
    // Add first new partner after 5 minutes (300000 ms)
    // For demo purposes, you can change this to a shorter interval like 10000 (10 seconds)
    const interval = setInterval(addNewPartner, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [partnerRequests, onNewPartnerRequest]);

  const handleAccept = (partner: PartnerRequest) => {
    setSelectedPartner(partner);
    setSelectedDatasets([]);
  };

  const toggleDatasetSelection = (datasetId: number) => {
    setSelectedDatasets(prev =>
      prev.includes(datasetId)
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const handleConfirmAccept = () => {
    if (!selectedPartner || selectedDatasets.length === 0) return;
    
    // Update partner status to Active
    setPartnerRequests(prev =>
      prev.map(p =>
        p.id === selectedPartner.id ? { ...p, status: 'Active', isNew: false } : p
      )
    );
    
    // Notify parent component to update dashboard stats
    if (onDataShareAccepted) {
      onDataShareAccepted(
        selectedPartner.name, 
        selectedPartner.reward, 
        selectedPartner.dataTypesRequired.length,
        selectedPartner.dataTypesRequired
      );
    }
    
    const rewardValue = extractRewardValue(selectedPartner.reward);
    
    toast.success('Partnership Accepted', {
      description: `You are now sharing ${selectedDatasets.length} dataset(s) with ${selectedPartner.name}. Reward: ${selectedPartner.reward} (+${rewardValue})`,
    });
    
    setSelectedPartner(null);
    setSelectedDatasets([]);
  };

  const areAllRequirementsMet = () => {
    if (!selectedPartner || selectedDatasets.length === 0) return false;
    
    const selectedCategories = mockDatasets
      .filter(d => selectedDatasets.includes(d.id))
      .map(d => d.category);
    
    return selectedPartner.dataTypesRequired.every(requiredType =>
      selectedCategories.includes(requiredType)
    );
  };

  const handleReject = (partner: PartnerRequest) => {
    // Add to fading out set
    setFadingOutIds(prev => new Set(prev).add(partner.id));
    
    toast.info('Request Rejected', {
      description: `You've rejected the data sharing request from ${partner.name}.`,
    });
    
    // Remove from list after fade animation (5 seconds)
    setTimeout(() => {
      setPartnerRequests(prev => prev.filter(p => p.id !== partner.id));
      setFadingOutIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(partner.id);
        return newSet;
      });
    }, 5000);
  };

  // Filter out rejected partners
  const visiblePartners = partnerRequests.filter(p => p.status !== 'Rejected');
  const activeRequests = visiblePartners.filter(p => p.status === 'Pending');
  const activePartnerships = visiblePartners.filter(p => p.status === 'Active');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Active Partner Requests</h1>
        <p className="text-gray-600">
          Manage partnership requests from tourism operators. Accept to share your data and earn rewards.
        </p>
      </div>

      {/* Active Requests Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#2D4AFF]" />
            Pending Requests
            <Badge variant="secondary" className="ml-2">{activeRequests.length}</Badge>
          </h2>
          {activeRequests.length === 0 && activePartnerships.length > 0 && (
            <p className="text-sm text-green-600">All partner requests are up to date.</p>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {activeRequests.length === 0 && activePartnerships.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No pending partner requests</p>
                  <p className="text-sm mt-2">New requests will appear here automatically</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeRequests.map(partner => {
                const isFadingOut = fadingOutIds.has(partner.id);
                
                return (
                  <motion.div
                    key={partner.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ 
                      opacity: isFadingOut ? 0.3 : 1, 
                      scale: isFadingOut ? 0.95 : 1,
                      y: 0 
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`${partner.isNew ? 'ring-2 ring-[#2D4AFF] ring-offset-2' : ''}`}
                  >
                    <Card className="hover:shadow-lg transition-all border-[#2D4AFF]/10 relative overflow-hidden">
                      {/* New badge overlay */}
                      {partner.isNew && (
                        <motion.div
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            New
                          </Badge>
                        </motion.div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#2D4AFF]/10 to-[#2D4AFF]/5 rounded-xl flex items-center justify-center text-3xl">
                              {partner.logo}
                            </div>
                            <div>
                              <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                Pending
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <CardDescription className="space-y-3">
                          {/* Timestamp */}
                          <p className="text-xs text-gray-500">
                            Added {getTimeElapsed(partner.addedAt)}
                          </p>
                          
                          {/* Data Types Required */}
                          <div>
                            <p className="text-xs uppercase tracking-wide mb-2">Data Types Requested</p>
                            <div className="flex flex-wrap gap-1">
                              {partner.dataTypesRequired.map(dataType => {
                                const DataIcon = getDataTypeIcon(dataType);
                                return (
                                  <Badge
                                    key={dataType}
                                    variant="outline"
                                    className="text-xs border-[#2D4AFF]/30"
                                  >
                                    <DataIcon className="w-3 h-3 mr-1" />
                                    {dataType}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Reward */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-xs uppercase tracking-wide text-green-700 mb-1">Reward Offered</p>
                            <p className="text-green-700">{partner.reward}</p>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAccept(partner)}
                            className="flex-1 bg-[#2D4AFF] hover:bg-[#2D4AFF]/90"
                            disabled={isFadingOut}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleReject(partner)}
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            disabled={isFadingOut}
                          >
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Active Partnerships Section */}
      {activePartnerships.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Active Partnerships
              <Badge className="ml-2 bg-green-100 text-green-700">{activePartnerships.length}</Badge>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePartnerships.map(partner => (
              <motion.div
                key={partner.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center text-3xl">
                          {partner.logo}
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">{partner.name}</CardTitle>
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <CardDescription className="space-y-3">
                      {/* Data Types */}
                      <div>
                        <p className="text-xs uppercase tracking-wide mb-2 text-gray-600">Sharing Data Types</p>
                        <div className="flex flex-wrap gap-1">
                          {partner.dataTypesRequired.map(dataType => {
                            const DataIcon = getDataTypeIcon(dataType);
                            return (
                              <Badge
                                key={dataType}
                                variant="outline"
                                className="text-xs border-green-300 bg-white"
                              >
                                <DataIcon className="w-3 h-3 mr-1" />
                                {dataType}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Reward */}
                      <div className="bg-white border border-green-200 rounded-lg p-3">
                        <p className="text-xs uppercase tracking-wide text-green-700 mb-1">Earning</p>
                        <p className="text-green-700">{partner.reward}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-green-700">✓ Partnership Active</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Dataset Selection Modal */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Datasets to Share</DialogTitle>
            <DialogDescription>
              Select all datasets that match the partner's data requirements below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedPartner && (
              <>
                {/* Partner Info */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2D4AFF]/10 to-[#2D4AFF]/5 rounded-lg flex items-center justify-center text-2xl">
                    {selectedPartner.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedPartner.name}</p>
                    <p className="text-sm text-gray-600">Reward: {selectedPartner.reward}</p>
                  </div>
                </div>

                {/* Required Data Types */}
                <div>
                  <Label className="mb-2 block">Required Data Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.dataTypesRequired.map(dataType => {
                      const DataIcon = getDataTypeIcon(dataType);
                      const selectedCategories = mockDatasets
                        .filter(d => selectedDatasets.includes(d.id))
                        .map(d => d.category);
                      const isMet = selectedCategories.includes(dataType);
                      
                      return (
                        <Badge
                          key={dataType}
                          variant="outline"
                          className={`${
                            isMet
                              ? 'bg-green-100 border-green-300 text-green-700'
                              : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                        >
                          {isMet && <CheckCircle className="w-3 h-3 mr-1" />}
                          <DataIcon className="w-3 h-3 mr-1" />
                          {dataType}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Dataset list */}
                <div className="space-y-3">
                  <Label>Available Datasets</Label>
                  <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                    {mockDatasets
                      .filter(dataset => 
                        selectedPartner.dataTypesRequired.includes(dataset.category)
                      )
                      .map(dataset => {
                        const DataIcon = getDataTypeIcon(dataset.category);
                        const isProcessing = dataset.status === 'processing';
                        const isSelected = selectedDatasets.includes(dataset.id);
                        
                        return (
                          <div
                            key={dataset.id}
                            onClick={() => {
                              if (!isProcessing) {
                                toggleDatasetSelection(dataset.id);
                              }
                            }}
                            className={`flex items-center gap-3 p-4 transition-colors ${
                              isProcessing
                                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                : 'cursor-pointer hover:bg-[#EAF1FF]'
                            } ${isSelected && !isProcessing ? 'bg-blue-50' : ''}`}
                          >
                            <Checkbox
                              checked={isSelected}
                              disabled={isProcessing}
                              onCheckedChange={() => {
                                if (!isProcessing) {
                                  toggleDatasetSelection(dataset.id);
                                }
                              }}
                              className="shrink-0"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={isProcessing ? 'text-gray-500' : ''}>{dataset.name}</span>
                                {dataset.status === 'success' ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getCategoryColor(dataset.category)}`}
                                >
                                  <DataIcon className="w-3 h-3 mr-1" />
                                  {dataset.category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {dataset.size} • {dataset.recordsCount.toLocaleString()} records
                                </span>
                                {isProcessing && (
                                  <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                                    Processing
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {mockDatasets.filter(dataset => 
                      selectedPartner.dataTypesRequired.includes(dataset.category)
                    ).length === 0 && (
                      <div className="px-3 py-8 text-center text-gray-500 text-sm">
                        <p>No datasets available for the required data types</p>
                        <p className="text-xs mt-1">Upload data matching the required types</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Link to Upload Data */}
                  <button 
                    onClick={() => {
                      if (onNavigateToUploadData) {
                        onNavigateToUploadData();
                      }
                    }}
                    className="text-sm text-[#2D4AFF] hover:underline"
                  >
                    + Upload new datasets
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setSelectedPartner(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmAccept}
                    disabled={!areAllRequirementsMet()}
                    className="flex-1 bg-[#2D4AFF] hover:bg-[#2D4AFF]/90"
                  >
                    {areAllRequirementsMet() ? 'Confirm & Share' : 'Select Required Datasets'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
