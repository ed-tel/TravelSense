import { useState, useEffect } from 'react';
import { Gift, Building2, Plane, Utensils, ShoppingBag, Calendar, MapPin, User, CreditCard, Shield, Check, Copy, Search, CheckCircle, Sparkles, TrendingUp, X, Filter, Bus, Ship, Mountain, Waves, TreePine, Camera, Zap, Mail, Upload, FileText, XCircle, AlertCircle, Download, FileSpreadsheet, FileJson, FileCode, Archive, Trash2, Info, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { AIVerificationModal } from './ai-verification-modal';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { CustomToaster } from './ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { SecurityInformation } from './security-information';

interface Partner {
  id: number;
  name: string;
  logo: string;
  dataTypesRequired: string[];
  reward: {
    id: string;
    title: string;
    description: string;
    type: 'travel' | 'dining' | 'shopping';
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    expiryDate?: string;
    terms?: string;
  };
  status: 'Pending' | 'Active' | 'Rejected';
  verificationStatus?: 'pending' | 'verified' | 'failed';
}

interface UploadedDataset {
  id: number;
  name: string;
  category: string;
  uploadDate: string;
  status: 'success' | 'error';
  size: string;
  recordsCount: number;
  fileType: string;
}

// Large static list of 25 partners with connected rewards
const initialPartners: Partner[] = [
  {
    id: 1,
    name: 'Air New Zealand',
    logo: '✈️',
    dataTypesRequired: ['Travel Preferences', 'Booking History'],
    reward: {
      id: 'air-nz-flight',
      title: '10% Off Flights',
      description: 'Save on your next domestic or international flight with Air New Zealand',
      type: 'travel',
      value: '10% OFF',
      icon: Plane,
      expiryDate: 'Dec 31, 2025',
      terms: 'Valid for bookings over $300. Cannot be combined with other offers.',
    },
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Booking.com',
    logo: '🏨',
    dataTypesRequired: ['Booking History', 'Spending Data'],
    reward: {
      id: 'booking-hotel',
      title: 'Free Night Stay',
      description: 'Complimentary night at participating hotels across New Zealand',
      type: 'travel',
      value: 'FREE NIGHT',
      icon: MapPin,
      expiryDate: 'Mar 15, 2026',
      terms: 'Minimum 2-night stay required. Subject to availability.',
    },
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Tourism New Zealand',
    logo: '🇳🇿',
    dataTypesRequired: ['Travel Preferences', 'Location'],
    reward: {
      id: 'tourism-nz-voucher',
      title: '$25 Dining Credit',
      description: 'Enjoy fine dining at premium restaurants in Auckland and Wellington',
      type: 'dining',
      value: '$25',
      icon: Utensils,
      expiryDate: 'Jan 30, 2026',
      terms: 'Valid at participating restaurants. Minimum spend $50.',
    },
    status: 'Pending',
  },
  {
    id: 4,
    name: 'Queenstown Tours',
    logo: '🏔️',
    dataTypesRequired: ['Travel Preferences', 'Location', 'Spending Data'],
    reward: {
      id: 'queenstown-adventure',
      title: '20% Off Adventures',
      description: 'Discount on adventure activities and tours in Queenstown',
      type: 'travel',
      value: '20% OFF',
      icon: Mountain,
      expiryDate: 'Apr 20, 2026',
      terms: 'Valid for most adventure activities. Some exclusions apply.',
    },
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Rental Cars NZ',
    logo: '🚗',
    dataTypesRequired: ['Booking History', 'Demographics'],
    reward: {
      id: 'rental-cars-credit',
      title: '$50 Rental Credit',
      description: 'Credit towards your next car rental booking',
      type: 'travel',
      value: '$50',
      icon: MapPin,
      expiryDate: 'Jun 30, 2026',
      terms: 'Valid for rentals 3 days or more.',
    },
    status: 'Pending',
  },
  {
    id: 6,
    name: 'Auckland Restaurants',
    logo: '🍽️',
    dataTypesRequired: ['Demographics', 'Spending Data', 'Location'],
    reward: {
      id: 'auckland-dining',
      title: 'Wine Tasting Experience',
      description: 'Complimentary wine tasting for 2 at premium Marlborough wineries',
      type: 'dining',
      value: 'FREE',
      icon: Utensils,
      expiryDate: 'May 15, 2026',
      terms: 'Advance booking required. Transport not included.',
    },
    status: 'Pending',
  },
  {
    id: 7,
    name: 'Retail Partners NZ',
    logo: '🛍️',
    dataTypesRequired: ['Spending Data', 'Demographics'],
    reward: {
      id: 'retail-shopping',
      title: '$50 Shopping Voucher',
      description: 'Use at participating retail stores and online shopping platforms',
      type: 'shopping',
      value: '$50',
      icon: ShoppingBag,
      expiryDate: 'Feb 28, 2026',
      terms: 'Cannot be used for gift cards or sale items.',
    },
    status: 'Pending',
  },
  {
    id: 8,
    name: 'Kiwi Experience',
    logo: '🚌',
    dataTypesRequired: ['Travel Preferences', 'Location'],
    reward: {
      id: 'kiwi-experience',
      title: '$30 Bus Pass Voucher',
      description: 'Discount on hop-on hop-off bus passes around New Zealand',
      type: 'travel',
      value: '$30',
      icon: Bus,
      expiryDate: 'Jul 15, 2026',
      terms: 'Valid on all routes. Not combinable with other discounts.',
    },
    status: 'Pending',
  },
  {
    id: 9,
    name: 'Milford Sound Cruises',
    logo: '⛴️',
    dataTypesRequired: ['Contact Information', 'Demographics', 'Location'],
    reward: {
      id: 'milford-cruise',
      title: '15% Discount on Cruises',
      description: 'Save on scenic cruises through Milford Sound',
      type: 'travel',
      value: '15% OFF',
      icon: Ship,
      expiryDate: 'Aug 20, 2026',
      terms: 'Subject to availability. Advance booking recommended.',
    },
    status: 'Pending',
  },
  {
    id: 10,
    name: 'Skyline Gondola',
    logo: '🚠',
    dataTypesRequired: ['Travel Preferences', 'Demographics'],
    reward: {
      id: 'skyline-gondola',
      title: '$20 Attraction Credit',
      description: 'Credit towards gondola rides and dining experiences',
      type: 'travel',
      value: '$20',
      icon: Mountain,
      expiryDate: 'Sep 10, 2026',
      terms: 'Valid at Queenstown and Rotorua locations.',
    },
    status: 'Pending',
  },
  {
    id: 11,
    name: 'Franz Josef Tours',
    logo: '🏔️',
    dataTypesRequired: ['Location', 'Spending Data'],
    reward: {
      id: 'franz-josef',
      title: '25% Off Glacier Tours',
      description: 'Discount on guided glacier hiking and scenic flights',
      type: 'travel',
      value: '25% OFF',
      icon: Mountain,
      expiryDate: 'Oct 30, 2026',
      terms: 'Weather dependent. Bookings subject to availability.',
    },
    status: 'Pending',
  },
  {
    id: 12,
    name: 'Rotorua Adventures',
    logo: '♨️',
    dataTypesRequired: ['Travel Preferences', 'Booking History'],
    reward: {
      id: 'rotorua-adventure',
      title: '$35 Activity Voucher',
      description: 'Use for hot pools, Māori cultural experiences, and adventure activities',
      type: 'travel',
      value: '$35',
      icon: Waves,
      expiryDate: 'Nov 15, 2026',
      terms: 'Valid at participating Rotorua attractions.',
    },
    status: 'Pending',
  },
  {
    id: 13,
    name: 'Bay of Islands Cruises',
    logo: '⛵',
    dataTypesRequired: ['Contact Information', 'Location'],
    reward: {
      id: 'bay-islands',
      title: 'Free Cruise Upgrade',
      description: 'Upgrade to premium cruise experience at no extra cost',
      type: 'travel',
      value: 'FREE UPGRADE',
      icon: Ship,
      expiryDate: 'Dec 20, 2026',
      terms: 'Subject to availability. Premium lunch included.',
    },
    status: 'Pending',
  },
  {
    id: 14,
    name: 'Wellington Dining',
    logo: '🍷',
    dataTypesRequired: ['Spending Data', 'Location'],
    reward: {
      id: 'wellington-dining',
      title: '$40 Restaurant Voucher',
      description: 'Enjoy fine dining at top Wellington restaurants',
      type: 'dining',
      value: '$40',
      icon: Utensils,
      expiryDate: 'Jan 15, 2027',
      terms: 'Minimum spend $80. Excludes alcohol.',
    },
    status: 'Pending',
  },
  {
    id: 15,
    name: 'Christchurch Shopping',
    logo: '🛒',
    dataTypesRequired: ['Demographics', 'Spending Data'],
    reward: {
      id: 'christchurch-shopping',
      title: '$60 Shopping Credit',
      description: 'Shop at major retail centers in Christchurch',
      type: 'shopping',
      value: '$60',
      icon: ShoppingBag,
      expiryDate: 'Feb 10, 2027',
      terms: 'Valid at participating stores only.',
    },
    status: 'Pending',
  },
  {
    id: 16,
    name: 'Abel Tasman Kayaks',
    logo: '🛶',
    dataTypesRequired: ['Travel Preferences', 'Location'],
    reward: {
      id: 'abel-tasman',
      title: '18% Off Kayaking Tours',
      description: 'Explore the stunning Abel Tasman National Park by kayak',
      type: 'travel',
      value: '18% OFF',
      icon: Waves,
      expiryDate: 'Mar 25, 2027',
      terms: 'Full-day and half-day tours available.',
    },
    status: 'Pending',
  },
  {
    id: 17,
    name: 'Hokitika Adventures',
    logo: '🌲',
    dataTypesRequired: ['Booking History', 'Location'],
    reward: {
      id: 'hokitika',
      title: '$28 Nature Tour Credit',
      description: 'Credit for rainforest walks and glow worm tours',
      type: 'travel',
      value: '$28',
      icon: TreePine,
      expiryDate: 'Apr 30, 2027',
      terms: 'Valid for guided tours only.',
    },
    status: 'Pending',
  },
  {
    id: 18,
    name: 'Taupo Activities',
    logo: '🎯',
    dataTypesRequired: ['Demographics', 'Travel Preferences'],
    reward: {
      id: 'taupo',
      title: 'Free Skydive Photo Package',
      description: 'Complimentary photo and video package with any tandem skydive',
      type: 'travel',
      value: 'FREE ($150 value)',
      icon: Camera,
      expiryDate: 'May 20, 2027',
      terms: 'Book skydive separately. Weather dependent.',
    },
    status: 'Pending',
  },
  {
    id: 19,
    name: 'Napier Wine Tours',
    logo: '🍇',
    dataTypesRequired: ['Spending Data', 'Demographics'],
    reward: {
      id: 'napier-wine',
      title: '$45 Wine Tour Voucher',
      description: 'Visit premium Hawke\'s Bay wineries with guided tour',
      type: 'dining',
      value: '$45',
      icon: Utensils,
      expiryDate: 'Jun 10, 2027',
      terms: 'Includes tastings at 3 wineries. Transport included.',
    },
    status: 'Pending',
  },
  {
    id: 20,
    name: 'Dunedin Experiences',
    logo: '🐧',
    dataTypesRequired: ['Location', 'Contact Information'],
    reward: {
      id: 'dunedin',
      title: '20% Off Wildlife Tours',
      description: 'See penguins, albatross, and seals in their natural habitat',
      type: 'travel',
      value: '20% OFF',
      icon: Mountain,
      expiryDate: 'Jul 5, 2027',
      terms: 'Evening tours available. Binoculars provided.',
    },
    status: 'Pending',
  },
  {
    id: 21,
    name: 'Waiheke Island Ferries',
    logo: '🚢',
    dataTypesRequired: ['Booking History', 'Travel Preferences'],
    reward: {
      id: 'waiheke-ferry',
      title: '$22 Ferry Voucher',
      description: 'Round-trip ferry tickets to beautiful Waiheke Island',
      type: 'travel',
      value: '$22',
      icon: Ship,
      expiryDate: 'Aug 15, 2027',
      terms: 'Valid weekdays only. Book in advance.',
    },
    status: 'Pending',
  },
  {
    id: 22,
    name: 'Gourmet NZ',
    logo: '🍴',
    dataTypesRequired: ['Spending Data', 'Location'],
    reward: {
      id: 'gourmet-nz',
      title: '$55 Fine Dining Voucher',
      description: 'Premium dining experience at award-winning restaurants nationwide',
      type: 'dining',
      value: '$55',
      icon: Utensils,
      expiryDate: 'Sep 20, 2027',
      terms: 'Reservations required. Tasting menu available.',
    },
    status: 'Pending',
  },
  {
    id: 23,
    name: 'Adventure Zone',
    logo: '🪂',
    dataTypesRequired: ['Demographics', 'Travel Preferences'],
    reward: {
      id: 'adventure-zone',
      title: '30% Off Extreme Sports',
      description: 'Bungy jumping, zip-lining, and other adrenaline activities',
      type: 'travel',
      value: '30% OFF',
      icon: Zap,
      expiryDate: 'Oct 10, 2027',
      terms: 'All safety gear included. Age restrictions apply.',
    },
    status: 'Pending',
  },
  {
    id: 24,
    name: 'Luxury Shopping NZ',
    logo: '💎',
    dataTypesRequired: ['Spending Data', 'Demographics'],
    reward: {
      id: 'luxury-shopping',
      title: '$75 Premium Shopping',
      description: 'Voucher for high-end boutiques and designer stores',
      type: 'shopping',
      value: '$75',
      icon: ShoppingBag,
      expiryDate: 'Nov 5, 2027',
      terms: 'Excludes sale items. Valid at luxury retailers.',
    },
    status: 'Pending',
  },
  {
    id: 25,
    name: 'Coastal Retreats',
    logo: '🏖️',
    dataTypesRequired: ['Booking History', 'Location', 'Spending Data'],
    reward: {
      id: 'coastal-retreats',
      title: 'Free Spa Treatment',
      description: 'Complimentary spa session at beachfront wellness centers',
      type: 'travel',
      value: 'FREE ($120 value)',
      icon: Waves,
      expiryDate: 'Dec 15, 2027',
      terms: '60-minute treatment. Booking required 48 hours ahead.',
    },
    status: 'Pending',
  },
];

const getDataTypeIcon = (dataType: string) => {
  switch (dataType.toLowerCase()) {
    case 'travel preferences':
      return Plane;
    case 'spending data':
      return CreditCard;
    case 'booking history':
      return Calendar;
    case 'location':
      return MapPin;
    case 'demographics':
      return User;
    case 'contact information':
      return Mail;
    default:
      return Shield;
  }
};

const getDataTypeColor = (dataType: string) => {
  switch (dataType.toLowerCase()) {
    case 'travel preferences':
      return 'text-blue-600 bg-blue-100';
    case 'spending data':
      return 'text-green-600 bg-green-100';
    case 'booking history':
      return 'text-purple-600 bg-purple-100';
    case 'location':
      return 'text-yellow-600 bg-yellow-100';
    case 'demographics':
      return 'text-gray-600 bg-gray-100';
    case 'contact information':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Define all data categories with their status
const DATA_CATEGORIES = [
  { id: 'Travel Preferences', label: 'Travel Preferences', icon: Plane, description: 'Interests, dietary requirements, accessibility needs, and travel style' },
  { id: 'Spending Data', label: 'Spending Data', icon: CreditCard, description: 'Transaction history, spending patterns, and budget information' },
  { id: 'Booking History', label: 'Booking History', icon: Calendar, description: 'Hotel bookings, flight reservations, and activity confirmations' },
  { id: 'Location', label: 'Location', icon: MapPin, description: 'GPS coordinates, check-ins, travel routes, and frequently visited places' },
  { id: 'Demographics', label: 'Demographics', icon: User, description: 'Age, gender, nationality, and other demographic information' },
  { id: 'Contact Information', label: 'Contact Information', icon: Mail, description: 'Communication preferences and notification settings' },
] as const;

interface RewardsAndPartnersPageProps {
  onNavigateToUploadData?: () => void;
  onDataShareAccepted?: (partnerName: string, reward: string, dataTypesCount: number, dataTypes: string[]) => void;
  highlightPartnerName?: string;
  onNewPartnerRequest?: (partnerName: string) => void;
  initialTab?: 'upload' | 'partners' | 'rewards';
  addActivityLog?: (entry: {
    action: string;
    partner: string;
    dataType: string;
    status: 'success' | 'warning' | 'info';
  }) => void; // ✅ NEW
}

export function RewardsAndPartnersPage({ onNavigateToUploadData, onDataShareAccepted, highlightPartnerName, onNewPartnerRequest, initialTab = 'upload', addActivityLog, }: RewardsAndPartnersPageProps = {}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Load partners from localStorage or use initial partners
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('travelsense_partners');
    return saved ? JSON.parse(saved) : initialPartners;
  });
  
  const [newlyUnlockedRewardId, setNewlyUnlockedRewardId] = useState<string | null>(null);
  
  // Data category toggles - Load from localStorage
  const [activeCategories, setActiveCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('travelsense_activeCategories');
    if (saved) {
      return new Set(JSON.parse(saved));
    }
    return new Set(['Travel Preferences', 'Spending Data', 'Booking History', 'Location']);
  });
  
  // Uploaded datasets state - Load from localStorage
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>(() => {
    const saved = localStorage.getItem('travelsense_uploadedDatasets');
    return saved ? JSON.parse(saved) : [];
  });

  // Upload state
  const [selectedUploadCategory, setSelectedUploadCategory] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [filterUploadCategory, setFilterUploadCategory] = useState<string>('all');
  const [uploadSearchQuery, setUploadSearchQuery] = useState('');
  const [uploadCurrentPage, setUploadCurrentPage] = useState(1);
  const UPLOAD_ITEMS_PER_PAGE = 5;
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [rewardCategoryFilter, setRewardCategoryFilter] = useState('all');
  const [partnerSearchFilter, setPartnerSearchFilter] = useState('');
  
  // Dialogs
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  
  // Reward redemption - Load from localStorage
  const [redeemedRewards, setRedeemedRewards] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('travelsense_redeemedRewards');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedReward, setSelectedReward] = useState<Partner['reward'] & { partnerName: string } | null>(null);
  const [isRedemptionDialogOpen, setIsRedemptionDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [voucherCodes, setVoucherCodes] = useState<Map<string, string>>(() => {
    const saved = localStorage.getItem('travelsense_voucherCodes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return new Map(Object.entries(parsed));
    }
    return new Map();
  });
  
  // AI Verification
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifyingPartner, setVerifyingPartner] = useState<Partner | null>(null);

  // Get active partners (those accepted by user)
  const activePartners = partners.filter(p => p.status === 'Active');
  const pendingPartners = partners.filter(p => p.status === 'Pending');
  const rejectedPartners = partners.filter(p => p.status === 'Rejected');
  
  // Get available rewards (only from active partners)
  const availableRewards = activePartners.map(partner => ({
    ...partner.reward,
    partnerName: partner.name,
    partnerId: partner.id,
    partnerLogo: partner.logo,
    verificationStatus: partner.verificationStatus || 'verified',
  }));

  // Calculate stats
  const connectedPartnersCount = activePartners.length;
  const totalRewardsAvailable = availableRewards.length;
  const totalPartners = partners.length;
  const totalCategories = DATA_CATEGORIES.length;
  const activeCategoriesCount = activeCategories.size;
  const uploadedDatasetsCount = uploadedDatasets.filter(d => d.status === 'success').length;
  
  // Toggle category filter
  const toggleCategory = (categoryId: string) => {
    setActiveCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Persist partners to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_partners', JSON.stringify(partners));
  }, [partners]);

  // Persist uploaded datasets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_uploadedDatasets', JSON.stringify(uploadedDatasets));
  }, [uploadedDatasets]);

  // Persist active categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_activeCategories', JSON.stringify(Array.from(activeCategories)));
  }, [activeCategories]);

  // Persist redeemed rewards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_redeemedRewards', JSON.stringify(Array.from(redeemedRewards)));
  }, [redeemedRewards]);

  // Persist voucher codes to localStorage whenever they change
  useEffect(() => {
    const obj = Object.fromEntries(voucherCodes);
    localStorage.setItem('travelsense_voucherCodes', JSON.stringify(obj));
  }, [voucherCodes]);

  useEffect(() => {
    if (highlightPartnerName) {
      setActiveTab('partners');
    }
  }, [highlightPartnerName]);

  // Scroll to newly unlocked reward
  useEffect(() => {
    if (newlyUnlockedRewardId && activeTab === 'rewards') {
      setTimeout(() => {
        setNewlyUnlockedRewardId(null);
      }, 3000);
    }
  }, [activeTab, newlyUnlockedRewardId]);

  // Check if partner requirements are met (all required categories toggled AND have datasets)
  const arePartnerRequirementsMet = (partner: Partner) => {
    // Check if all required categories are toggled on
    const allCategoriesToggled = partner.dataTypesRequired.every(dataType =>
      activeCategories.has(dataType)
    );
    
    if (!allCategoriesToggled) {
      return { met: false, reason: 'categories' };
    }
    
    // Check if all required categories have at least one uploaded dataset
    const allCategoriesHaveData = partner.dataTypesRequired.every(dataType => {
      return uploadedDatasets.some(dataset => 
        dataset.category === dataType && dataset.status === 'success'
      );
    });
    
    if (!allCategoriesHaveData) {
      return { met: false, reason: 'datasets' };
    }
    
    return { met: true, reason: null };
  };

  const filteredPartners = partners
    .filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.reward.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if partner requires at least one active category
      const hasActiveCategory = partner.dataTypesRequired.some(dataType =>
        activeCategories.has(dataType)
      );
      
      return matchesSearch && partner.status === 'Pending' && hasActiveCategory;
    })
    .sort((a, b) => {
      // Sort by whether partner requirements are met
      const aRequirements = arePartnerRequirementsMet(a);
      const bRequirements = arePartnerRequirementsMet(b);
      
      // Partners that can be accepted come first
      if (aRequirements.met && !bRequirements.met) return -1;
      if (!aRequirements.met && bRequirements.met) return 1;
      
      // Within each group, maintain original order
      return 0;
    });

  const filteredRewards = availableRewards
    .filter(reward => {
      const matchesCategory = rewardCategoryFilter === 'all' || reward.type === rewardCategoryFilter;
      const matchesPartner = !partnerSearchFilter || reward.partnerName.toLowerCase().includes(partnerSearchFilter.toLowerCase());
      return matchesCategory && matchesPartner;
    })
    .sort((a, b) => {
      // Sort by redemption status: unredeemed first, then redeemed
      const aRedeemed = redeemedRewards.has(a.id);
      const bRedeemed = redeemedRewards.has(b.id);
      
      if (aRedeemed && !bRedeemed) return 1; // a is redeemed, b is not - b comes first
      if (!aRedeemed && bRedeemed) return -1; // a is not redeemed, b is - a comes first
      return 0; // both same status, maintain original order
    });

  const handleAccept = (partner: Partner) => {
    const requirements = arePartnerRequirementsMet(partner);
    
    if (!requirements.met) {
      if (requirements.reason === 'categories') {
        toast.error('Enable all required data categories first', {
          description: `This partner requires: ${partner.dataTypesRequired.join(', ')}`
        });
        return;
      } else if (requirements.reason === 'datasets') {
        toast.error('Upload required datasets first', {
          description: 'You need at least one dataset for each required category. Switch to Upload Data tab.',
          action: {
            label: 'Upload Data',
            onClick: () => setActiveTab('upload')
          }
        });
        return;
      }
    }
    
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
    
    // Close dataset selection modal
    setSelectedPartner(null);
    
    // Open AI verification modal
    setVerifyingPartner(selectedPartner);
    setIsVerificationModalOpen(true);
  };
  
  const handleVerificationComplete = (success: boolean) => {
    if (!verifyingPartner) return;
    
    if (success) {
      // Update partner status to Active with verified status
      setPartners(prev =>
        prev.map(p =>
          p.id === verifyingPartner.id ? { ...p, status: 'Active' as const, verificationStatus: 'verified' as const } : p
        )
      );
      
      // Set newly unlocked reward for animation
      setNewlyUnlockedRewardId(verifyingPartner.reward.id);
      
      // Notify parent component
      if (onDataShareAccepted) {
        onDataShareAccepted(
          verifyingPartner.name, 
          verifyingPartner.reward.value, 
          verifyingPartner.dataTypesRequired.length,
          verifyingPartner.dataTypesRequired
        );
      }
      
      // Show success notification
      if (onNewPartnerRequest) {
        onNewPartnerRequest(verifyingPartner.name);
      }
      
      toast.success(`🎉 AI verified your dataset!`, {
        description: `Your reward from ${verifyingPartner.name} is now available.`
      });
      
      // Switch to rewards tab to show the new reward
      setTimeout(() => {
        setActiveTab('rewards');
      }, 500);
    } else {
      // Verification failed - go to upload tab
      toast.error('Verification failed', {
        description: 'Please upload valid datasets matching the required categories.',
        action: {
          label: 'Upload Data',
          onClick: () => setActiveTab('upload')
        }
      });
      
      setActiveTab('upload');
    }
    
    // Close modal and reset
    setIsVerificationModalOpen(false);
    setVerifyingPartner(null);
  };

  const areAllDatasetRequirementsMet = () => {
    if (!selectedPartner || selectedDatasets.length === 0) return false;
    
    const selectedCategories = uploadedDatasets
      .filter(d => selectedDatasets.includes(d.id))
      .map(d => d.category);
    
    return selectedPartner.dataTypesRequired.every(requiredType =>
      selectedCategories.includes(requiredType)
    );
  };

  const handleReject = (partner: Partner) => {
    setPartners(prev =>
      prev.map(p =>
        p.id === partner.id ? { ...p, status: 'Rejected' as const } : p
      )
    );
    
    toast.info('Request Rejected', {
      description: `You've rejected the data sharing request from ${partner.name}.`
    });
  };

  const generateVoucherCode = (rewardId: string) => {
    const prefix = rewardId.substring(0, 3).toUpperCase();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomString}`;
  };

  const handleRedeemClick = (reward: Partner['reward'] & { partnerName: string; partnerLogo: string }) => {
    setSelectedReward(reward);
    setIsRedemptionDialogOpen(true);
  };

  const handleConfirmRedemption = () => {
    if (!selectedReward) return;
    
    const code = generateVoucherCode(selectedReward.id);
    setVoucherCodes(prev => new Map(prev).set(selectedReward.id, code));
    setRedeemedRewards(prev => new Set(prev).add(selectedReward.id));
    
    toast.success('Reward redeemed successfully!', {
      description: `Your voucher code is ${code}`
    });
    addActivityLog?. ({
  action: `Reward redeemed: ${selectedReward.title}`,
  partner: selectedReward.partnerName,
  dataType: selectedReward.type,
  status: "success",
});

  };

  const handleCopyVoucherCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      toast.success('Voucher code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      toast.info(`Code: ${code}`);
    }
  };

  const handleCloseDialog = () => {
    setIsRedemptionDialogOpen(false);
    setCopiedCode(false);
    setTimeout(() => setSelectedReward(null), 200);
  };

  // Upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    setUploadError('');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setUploadError('');
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
async function sendToAI(file: File): Promise<{ ok: boolean; result?: string; error?: string; recordsCount?: number }> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://localhost:5000/ai-validate", {
    method: "POST",
    body: form,
  });

  // If your server is not running or CORS blocked:
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `AI server error (${res.status}). ${text}` };
  }
  return res.json();
}

const handleFileUpload = async (file: File) => {
  setUploadError('');

  if (!selectedUploadCategory) {
    toast.error('Please select a data category first.');
    return;
  }

  const allowedTypes = ['.csv', '.json', '.xlsx', '.xls', '.pdf', '.txt', '.xml', '.docx', '.zip'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!allowedTypes.includes(fileExtension)) {
    const errorMsg = 'Unsupported file type. Please upload in one of the accepted formats.';
    setUploadError(errorMsg);
    toast.error(errorMsg);
    return;
  }

  // Start your UI progress
  setIsUploading(true);
  setUploadProgress(0);

  // Animate progress up to 95% while AI runs
  const uploadInterval = setInterval(() => {
    setUploadProgress((prev) => (prev >= 95 ? 95 : prev + 7));
  }, 200);

  try {
    // 🔥 Step 6: call your AI server here
    const ai = await sendToAI(file);

    // Stop progress animation and finish
    clearInterval(uploadInterval);
    setUploadProgress(100);
    setIsUploading(false);

    const uploadSuccess = !!ai.ok;
    const categoryName = DATA_CATEGORIES.find(c => c.id === selectedUploadCategory)?.label;

    const newDataset: UploadedDataset = {
      id: Date.now(),
      name: file.name,
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: uploadSuccess ? 'success' : 'error',
      recordsCount: ai.recordsCount ?? (uploadSuccess ? Math.floor(Math.random() * 5000) + 100 : 0),
      category: selectedUploadCategory,
      fileType: fileExtension.replace('.', '')
    };

    setUploadedDatasets((prev) => [newDataset, ...prev]);

    if (uploadSuccess) {
      toast.success(`${file.name} passed AI validation for ${categoryName || selectedUploadCategory}!`, {
        description: (ai.result || 'This dataset is now available for partner requests.').slice(0, 300)
      });
      addActivityLog?.({
        action: "File uploaded successfully",
        partner: "User Upload",
        dataType: categoryName || selectedUploadCategory,
        status: "success",
      });
    } else {
      const msg = ai.error || ai.result || 'AI validation failed.';
      setUploadError(msg);
      toast.error(`Failed to upload ${file.name}`, {
        description: msg.slice(0, 300),
      });
      addActivityLog?.({
        action: "File upload failed",
        partner: "User Upload",
        dataType: categoryName || selectedUploadCategory,
        status: "warning",
      });
    }
  } catch (err: any) {
    // Hard error talking to AI
    clearInterval(uploadInterval);
    setIsUploading(false);
    setUploadProgress(0);

    const msg = String(err?.message || err);
    setUploadError(msg);
    toast.error('Upload failed', { description: msg });
    addActivityLog?.({
      action: "File upload failed",
      partner: "User Upload",
      dataType: selectedUploadCategory,
      status: "warning",
    });
  }
};

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDeleteDataset = (datasetId: number) => {
    setUploadedDatasets(prev => prev.filter(d => d.id !== datasetId));
    toast.success('Dataset deleted successfully');
  };

  const handleDownloadDataset = (dataset: UploadedDataset) => {
    // Create sample data based on the dataset category
    let data = '';
    const fileName = dataset.name;
    
    // Generate sample CSV data based on category
    if (dataset.fileType === 'csv') {
      if (dataset.category === 'Travel Preferences') {
        data = 'preference_id,user_id,preference_type,value,date\n';
        for (let i = 0; i < Math.min(dataset.recordsCount, 100); i++) {
          data += `${i + 1},USER001,dietary,vegetarian,${dataset.uploadDate}\n`;
        }
      } else if (dataset.category === 'Booking History') {
        data = 'booking_id,user_id,destination,date,amount\n';
        for (let i = 0; i < Math.min(dataset.recordsCount, 100); i++) {
          data += `BK${String(i + 1).padStart(5, '0')},USER001,Auckland,${dataset.uploadDate},${Math.floor(Math.random() * 500) + 100}\n`;
        }
      } else {
        data = 'id,category,value,date\n';
        for (let i = 0; i < Math.min(dataset.recordsCount, 100); i++) {
          data += `${i + 1},${dataset.category},sample_value_${i},${dataset.uploadDate}\n`;
        }
      }
    } else if (dataset.fileType === 'json') {
      const records = [];
      for (let i = 0; i < Math.min(dataset.recordsCount, 100); i++) {
        records.push({
          id: i + 1,
          category: dataset.category,
          value: `sample_value_${i}`,
          date: dataset.uploadDate
        });
      }
      data = JSON.stringify(records, null, 2);
    } else {
      // For other file types, create a simple text file
      data = `Dataset: ${dataset.name}\nCategory: ${dataset.category}\nRecords: ${dataset.recordsCount}\nUploaded: ${dataset.uploadDate}\n`;
    }
    
    // Create blob and download
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Download started', {
      description: `Downloading ${dataset.name}...`
    });
  };

  // Filter and search uploaded datasets
  const filteredUploadedDatasets = uploadedDatasets
    .filter(d => {
      // Filter by category
      const matchesCategory = filterUploadCategory === 'all' || d.category === filterUploadCategory;
      
      // Filter by search query
      const matchesSearch = uploadSearchQuery === '' || 
        d.name.toLowerCase().includes(uploadSearchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(uploadSearchQuery.toLowerCase()) ||
        d.fileType.toLowerCase().includes(uploadSearchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  
  // Calculate pagination for upload history
  const uploadTotalPages = Math.ceil(filteredUploadedDatasets.length / UPLOAD_ITEMS_PER_PAGE);
  const uploadStartIndex = (uploadCurrentPage - 1) * UPLOAD_ITEMS_PER_PAGE;
  const uploadEndIndex = uploadStartIndex + UPLOAD_ITEMS_PER_PAGE;
  const paginatedUploadedDatasets = filteredUploadedDatasets.slice(uploadStartIndex, uploadEndIndex);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setUploadCurrentPage(1);
  }, [filterUploadCategory, uploadSearchQuery]);

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'csv':
      case 'xlsx':
      case 'xls':
        return FileSpreadsheet;
      case 'json':
        return FileJson;
      case 'xml':
        return FileCode;
      case 'zip':
        return Archive;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-6 h-6 text-[#2563EB]" />
            <h1 className="text-3xl">Rewards & Partners</h1>
          </div>
          <p className="text-muted-foreground">
            Accept partner requests to unlock exclusive rewards. Your data, your choice, your benefits.
          </p>
        </div>

        {/* Summary Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6 border-[#2563EB]/20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-8">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                  <div>
                    <span className="text-sm text-muted-foreground block">Active Partners</span>
                    <span className="text-2xl">
                      <span className="text-[#2563EB]">{connectedPartnersCount}</span>
                      <span className="text-muted-foreground"> / {totalPartners}</span>
                    </span>
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="text-sm text-muted-foreground block">Rewards Unlocked</span>
                    <span className="text-2xl">
                      <span className="text-green-600">{totalRewardsAvailable}</span>
                      <span className="text-muted-foreground"> / {totalPartners}</span>
                    </span>
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="text-sm text-muted-foreground block">Datasets Uploaded</span>
                    <span className="text-2xl">
                      <span className="text-purple-600">{uploadedDatasetsCount}</span>
                      <span className="text-muted-foreground"> / {totalCategories}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "upload" | "partners" | "rewards")} 
        className="mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
            <TabsTrigger value="upload" className="text-base">
              <Upload className="w-4 h-4 mr-2" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger 
              value="partners" 
              className="text-base"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Partners
              {pendingPartners.length > 0 && (
                <Badge variant="destructive" className="ml-2 bg-[#2563EB] h-5 min-w-5 px-1.5">
                  {pendingPartners.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-base">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
              {newlyUnlockedRewardId && (
                <Sparkles className="w-4 h-4 ml-2 text-yellow-500 animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            {/* Active Data Categories Bar */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-[#2563EB]" />
                Data Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {DATA_CATEGORIES.map(category => {
                  const IconComponent = category.icon;
                  const isActive = activeCategories.has(category.id);
                  
                  return (
                    <TooltipProvider key={category.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => toggleCategory(category.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                              isActive
                                ? 'bg-[#2563EB] text-white shadow-md'
                                : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="text-sm">{category.label}</span>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{category.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
            
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search partners or rewards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            {/* Partner Cards Grid */}
            <section className="space-y-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#2563EB]" />
                  Partner Requests
                  <Badge variant="secondary" className="ml-2">{filteredPartners.length}</Badge>
                </h2>
              </div>

              {filteredPartners.length === 0 ? (
                <Card className="border-dashed rounded-2xl">
                  <CardContent className="py-12 text-center text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No pending partner requests</p>
                    <p className="text-sm mt-2">
                      {activeCategories.size === 0 
                        ? 'Enable data categories to view eligible partners'
                        : 'All partners have been reviewed'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Ready to Accept Section */}
                  {filteredPartners.some(p => arePartnerRequirementsMet(p).met) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg">Ready to Accept</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {filteredPartners.filter(p => arePartnerRequirementsMet(p).met).length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {filteredPartners
                            .filter(p => arePartnerRequirementsMet(p).met)
                            .map((partner, index) => {
                              const requirements = arePartnerRequirementsMet(partner);
                              const isAcceptable = requirements.met;
                      
                      return (
                        <motion.div
                          key={partner.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                        >
                          <Card className="hover:shadow-lg transition-all rounded-2xl h-full flex flex-col border border-gray-300 bg-white">
                            <CardHeader>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-gray-400/10 to-gray-400/5">
                                    {partner.logo}
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                        Pending
                                      </Badge>
                                      {isAcceptable && (
                                        <Badge className="bg-green-600 text-white">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Ready
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <CardDescription className="space-y-3">
                                {/* Data Types Required */}
                                <div>
                                  <p className="text-xs uppercase tracking-wide mb-2">Data Types Requested</p>
                                  <div className="flex flex-wrap gap-1">
                                    {partner.dataTypesRequired.map(dataType => {
                                      const DataIcon = getDataTypeIcon(dataType);
                                      const isToggled = activeCategories.has(dataType);
                                      const hasDatasets = uploadedDatasets.some(d => 
                                        d.category === dataType && d.status === 'success'
                                      );
                                      
                                      return (
                                        <Badge
                                          key={dataType}
                                          variant="outline"
                                          className={`text-xs ${
                                            isToggled && hasDatasets
                                              ? 'border-green-300 bg-green-50 text-green-700'
                                              : isToggled
                                              ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                              : 'border-[#2563EB]/30'
                                          }`}
                                        >
                                          <DataIcon className="w-3 h-3 mr-1" />
                                          {dataType}
                                          {isToggled && hasDatasets && (
                                            <CheckCircle className="w-3 h-3 ml-1" />
                                          )}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                {/* Reward Offered */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-xs uppercase tracking-wide text-green-700 mb-1">Reward Offered</p>
                                  <p className="text-green-700">{partner.reward.value}</p>
                                  <p className="text-xs text-green-600 mt-1">{partner.reward.title}</p>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="pt-0 mt-auto">
                              <div className="flex gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex-1">
                                        <Button
                                          onClick={() => handleAccept(partner)}
                                          disabled={!isAcceptable}
                                          className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-xl disabled:opacity-50"
                                        >
                                          Accept
                                        </Button>
                                      </div>
                                    </TooltipTrigger>
                                    {!isAcceptable && (
                                      <TooltipContent>
                                        <p className="max-w-xs">
                                          {requirements.reason === 'categories' 
                                            ? 'Enable all required data categories to accept this request'
                                            : 'Upload your data first to activate this partner request.'}
                                        </p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                                <Button
                                  onClick={() => handleReject(partner)}
                                  variant="outline"
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                  Reject
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Not Ready Section */}
                  {filteredPartners.some(p => !arePartnerRequirementsMet(p).met) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg">Requires Additional Data</h3>
                        <Badge className="bg-orange-100 text-orange-800">
                          {filteredPartners.filter(p => !arePartnerRequirementsMet(p).met).length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {filteredPartners
                            .filter(p => !arePartnerRequirementsMet(p).met)
                            .map((partner, index) => {
                              const requirements = arePartnerRequirementsMet(partner);
                              const isAcceptable = requirements.met;
                              
                              return (
                        <motion.div
                          key={partner.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                        >
                          <Card className="hover:shadow-lg transition-all rounded-2xl h-full flex flex-col border border-gray-300 bg-white">
                            <CardHeader>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-gray-400/10 to-gray-400/5">
                                    {partner.logo}
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                        Pending
                                      </Badge>
                                      {isAcceptable && (
                                        <Badge className="bg-green-600 text-white">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Ready
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <CardDescription className="space-y-3">
                                {/* Data Types Required */}
                                <div>
                                  <p className="text-xs uppercase tracking-wide mb-2">Data Types Requested</p>
                                  <div className="flex flex-wrap gap-1">
                                    {partner.dataTypesRequired.map(dataType => {
                                      const DataIcon = getDataTypeIcon(dataType);
                                      const isToggled = activeCategories.has(dataType);
                                      const hasDatasets = uploadedDatasets.some(d => 
                                        d.category === dataType && d.status === 'success'
                                      );
                                      
                                      return (
                                        <Badge
                                          key={dataType}
                                          variant="outline"
                                          className={`text-xs ${
                                            isToggled && hasDatasets
                                              ? 'border-green-300 bg-green-50 text-green-700'
                                              : isToggled
                                              ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                              : 'border-[#2563EB]/30'
                                          }`}
                                        >
                                          <DataIcon className="w-3 h-3 mr-1" />
                                          {dataType}
                                          {isToggled && hasDatasets && (
                                            <CheckCircle className="w-3 h-3 ml-1" />
                                          )}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                {/* Reward Offered */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-xs uppercase tracking-wide text-green-700 mb-1">Reward Offered</p>
                                  <p className="text-green-700">{partner.reward.value}</p>
                                  <p className="text-xs text-green-600 mt-1">{partner.reward.title}</p>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="pt-0 mt-auto">
                              <div className="flex gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex-1">
                                        <Button
                                          onClick={() => handleAccept(partner)}
                                          disabled={!isAcceptable}
                                          className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-xl disabled:opacity-50"
                                        >
                                          Accept
                                        </Button>
                                      </div>
                                    </TooltipTrigger>
                                    {!isAcceptable && (
                                      <TooltipContent>
                                        <p className="max-w-xs">
                                          {requirements.reason === 'categories' 
                                            ? 'Enable all required data categories to accept this request'
                                            : 'Upload your data first to activate this partner request.'}
                                        </p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                                <Button
                                  onClick={() => handleReject(partner)}
                                  variant="outline"
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                  Reject
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            {availableRewards.length === 0 ? (
              <Card className="border-dashed rounded-2xl">
                <CardContent className="py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl mb-2">No rewards yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Accept partner requests to unlock exclusive offers
                    </p>
                    <Button
                      onClick={() => setActiveTab('partners')}
                      className="bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-xl"
                    >
                      View Partner Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={rewardCategoryFilter} onValueChange={setRewardCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[200px] rounded-xl">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by partner name..."
                      value={partnerSearchFilter}
                      onChange={(e) => setPartnerSearchFilter(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Rewards Grid */}
                <div className="space-y-8">
                  {/* Available Rewards Section */}
                  {filteredRewards.some(r => !redeemedRewards.has(r.id)) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Gift className="w-5 h-5 text-[#2563EB]" />
                        <h3 className="text-lg">Available to Redeem</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {filteredRewards.filter(r => !redeemedRewards.has(r.id)).length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {filteredRewards
                            .filter(r => !redeemedRewards.has(r.id))
                            .map((reward, index) => {
                              const IconComponent = reward.icon;
                              const isRedeemed = false;
                              const voucherCode = voucherCodes.get(reward.id);
                              const isNewlyUnlocked = newlyUnlockedRewardId === reward.id;
                              
                              return (
                                <motion.div
                                  key={reward.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    boxShadow: isNewlyUnlocked ? '0 0 0 3px rgba(37, 99, 235, 0.3)' : 'none',
                                  }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.3, delay: index * 0.03 }}
                                >
                                  <Card className={`hover:shadow-lg transition-all rounded-2xl h-full flex flex-col bg-white border-[#0E1E3D]/10 ${isNewlyUnlocked ? 'ring-2 ring-[#2563EB]' : ''}`}>
                                    <CardHeader>
                                      {isNewlyUnlocked && (
                                        <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-fit">
                                          <Sparkles className="w-3 h-3 mr-1" />
                                          Just Unlocked!
                                        </Badge>
                                      )}
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                          <div className="text-3xl">{reward.partnerLogo}</div>
                                          <div>
                                            <p className="text-sm text-muted-foreground">{reward.partnerName}</p>
                                            <Badge variant="secondary" className="text-xs mt-1">
                                              {reward.type}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                          {reward.verificationStatus === 'pending' ? (
                                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                              <Clock className="w-3 h-3 mr-1" />
                                              Awaiting AI Approval
                                            </Badge>
                                          ) : reward.verificationStatus === 'verified' ? (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                              <CheckCircle className="w-3 h-3 mr-1" />
                                              Reward Active
                                            </Badge>
                                          ) : null}
                                        </div>
                                      </div>
                                      <CardTitle className="text-lg mb-1">{reward.title}</CardTitle>
                                      <div className="inline-block px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                                        <span className="text-green-700">{reward.value}</span>
                                      </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4 flex-1 flex flex-col">
                                      <p className="text-sm text-muted-foreground flex-1">
                                        {reward.description}
                                      </p>
                                      
                                      {reward.expiryDate && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Calendar className="w-3 h-3" />
                                          <span>Expires: {reward.expiryDate}</span>
                                        </div>
                                      )}
                                      
                                      {reward.terms && (
                                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                                          <strong>Terms:</strong> {reward.terms}
                                        </div>
                                      )}
                                      
                                      <Button 
                                        className="w-full rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90" 
                                        disabled={reward.verificationStatus === 'pending'}
                                        onClick={() => handleRedeemClick(reward)}
                                      >
                                        {reward.verificationStatus === 'pending' 
                                          ? 'Awaiting Verification' 
                                          : 'Redeem Now'}
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Redeemed Rewards Section */}
                  {filteredRewards.some(r => redeemedRewards.has(r.id)) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg">Already Redeemed</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {filteredRewards.filter(r => redeemedRewards.has(r.id)).length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {filteredRewards
                            .filter(r => redeemedRewards.has(r.id))
                            .map((reward, index) => {
                              const IconComponent = reward.icon;
                              const isRedeemed = true;
                              const voucherCode = voucherCodes.get(reward.id);
                              const isNewlyUnlocked = false;
                              
                              return (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            boxShadow: isNewlyUnlocked ? '0 0 0 3px rgba(37, 99, 235, 0.3)' : 'none',
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                        >
                          <Card className={`hover:shadow-lg transition-all rounded-2xl h-full flex flex-col ${
                            isRedeemed ? 'border-gray-300 bg-gray-50/50 opacity-75' : 'border-[#0E1E3D]/10 bg-white'
                          } ${isNewlyUnlocked ? 'ring-2 ring-[#2563EB]' : ''}`}>
                            <CardHeader>
                              {isNewlyUnlocked && (
                                <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-fit">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Just Unlocked!
                                </Badge>
                              )}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="text-3xl">{reward.partnerLogo}</div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">{reward.partnerName}</p>
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      {reward.type}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                  {reward.verificationStatus === 'pending' ? (
                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Awaiting AI Approval
                                    </Badge>
                                  ) : isRedeemed ? (
                                    <Badge className="bg-green-600 text-white">
                                      <Check className="w-3 h-3 mr-1" />
                                      Redeemed
                                    </Badge>
                                  ) : reward.verificationStatus === 'verified' ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Reward Active
                                    </Badge>
                                  ) : null}
                                </div>
                              </div>
                              <CardTitle className="text-lg mb-1">{reward.title}</CardTitle>
                              <div className="inline-block px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                                <span className="text-green-700">{reward.value}</span>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4 flex-1 flex flex-col">
                              <p className="text-sm text-muted-foreground flex-1">
                                {reward.description}
                              </p>
                              
                              {reward.expiryDate && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>Expires: {reward.expiryDate}</span>
                                </div>
                              )}
                              
                              {reward.terms && (
                                <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                                  <strong>Terms:</strong> {reward.terms}
                                </div>
                              )}
                              
                              {isRedeemed && voucherCode && (
                                <div className="bg-green-100 border border-green-300 p-3 rounded-lg">
                                  <p className="text-xs text-green-800 mb-1">Your Voucher Code:</p>
                                  <div className="flex items-center justify-between">
                                    <code className="text-sm font-mono text-green-900">{voucherCode}</code>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleCopyVoucherCode(voucherCode)}
                                      className="h-6 text-green-700 hover:text-green-900"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              <Button 
                                className="w-full rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90" 
                                disabled={isRedeemed || reward.verificationStatus === 'pending'}
                                onClick={() => handleRedeemClick(reward)}
                              >
                                {reward.verificationStatus === 'pending' 
                                  ? 'Awaiting Verification' 
                                  : isRedeemed 
                                    ? 'Already Redeemed' 
                                    : 'Redeem Now'}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Upload Data Tab */}
          <TabsContent value="upload" className="space-y-6">
            {/* Information Alert */}
            <Alert className="border-blue-200 bg-blue-50/50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Supported formats:</strong> CSV, JSON, Excel (.xlsx, .xls), PDF, TXT, XML, DOCX, ZIP. 
                Maximum file size: 50MB. Your data will be encrypted and processed securely.
              </AlertDescription>
            </Alert>

            {/* Category Selection */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Step 1: Select Data Category</CardTitle>
                <CardDescription>
                  Choose the category that best matches your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DATA_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedUploadCategory === category.id;
                    const color = getDataTypeColor(category.id);
                    
                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedUploadCategory(category.id)}
                        className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#2563EB] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4>{category.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#2563EB]" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Step 2: Upload Your File</CardTitle>
                <CardDescription>
                  {selectedUploadCategory 
                    ? 'Drag and drop your file here or click to browse'
                    : 'Please select a category first'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                    !selectedUploadCategory
                      ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                      : isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedUploadCategory ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <Upload className={`w-8 h-8 ${selectedUploadCategory ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="space-y-2">
                      <h3>
                        {!selectedUploadCategory 
                          ? 'Select a category to upload' 
                          : isDragging 
                          ? 'Drop your file here' 
                          : 'Upload your travel data'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedUploadCategory ? 'Upload anonymised data files (.csv, .json, .xlsx, .pdf, .txt, .xml, .docx, .zip)' : 'Category selection required'}
                      </p>
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".csv,.json,.xlsx,.xls,.pdf,.txt,.xml,.docx,.zip"
                      onChange={handleFileSelect}
                      disabled={!selectedUploadCategory}
                    />
                    <label htmlFor="file-upload">
                      <Button asChild className="cursor-pointer rounded-xl" disabled={!selectedUploadCategory}>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                </div>

                {uploadError && (
                  <Alert className="mt-4 border-red-200 bg-red-50/50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-900">
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                )}

                {isUploading && (
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload History */}
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upload History</CardTitle>
                    <CardDescription>
                      View and manage your uploaded data files
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search uploads..."
                        className="pl-10 w-64 rounded-xl"
                        value={uploadSearchQuery}
                        onChange={(e) => setUploadSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={filterUploadCategory} onValueChange={setFilterUploadCategory}>
                      <SelectTrigger className="w-[180px] rounded-xl">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {DATA_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {uploadedDatasets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No datasets uploaded yet.</p>
                    <p className="text-sm mt-2">Upload files to make data available for partner requests.</p>
                  </div>
                ) : filteredUploadedDatasets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No datasets match your search criteria.</p>
                    <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Records</TableHead>
                            <TableHead>Upload Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedUploadedDatasets.map((dataset) => {
                            const categoryData = DATA_CATEGORIES.find(c => c.id === dataset.category);
                            const IconComponent = categoryData?.icon || FileText;
                            const FileIcon = getFileTypeIcon(dataset.fileType);
                            
                            return (
                              <TableRow key={dataset.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium truncate max-w-[200px]">{dataset.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`text-xs border-0 ${getDataTypeColor(dataset.category)}`}>
                                    <IconComponent className="w-3 h-3 mr-1" />
                                    {categoryData?.label || 'Unknown'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs uppercase">
                                    {dataset.fileType}
                                  </Badge>
                                </TableCell>
                                <TableCell>{dataset.size}</TableCell>
                                <TableCell>{dataset.recordsCount.toLocaleString()}</TableCell>
                                <TableCell>{dataset.uploadDate}</TableCell>
                                <TableCell>
                                  {dataset.status === 'success' ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Complete
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-100 text-red-800 border-red-200">
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Failed
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => handleDownloadDataset(dataset)}
                                          >
                                            <Download className="w-4 h-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Download</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteDataset(dataset.id)}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination Controls */}
                    {filteredUploadedDatasets.length > UPLOAD_ITEMS_PER_PAGE && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {uploadStartIndex + 1} to {Math.min(uploadEndIndex, filteredUploadedDatasets.length)} of {filteredUploadedDatasets.length} uploads
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={uploadCurrentPage === 1}
                            className="rounded-lg"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">
                              Page {uploadCurrentPage} of {uploadTotalPages}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadCurrentPage(prev => Math.min(uploadTotalPages, prev + 1))}
                            disabled={uploadCurrentPage === uploadTotalPages}
                            className="rounded-lg"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Data Upload Guidelines */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Data Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>What to Include</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Travel booking confirmations</li>
                      <li>Location check-ins</li>
                      <li>Spending transactions</li>
                      <li>Preference surveys</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>What Not to Include</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Credit card numbers</li>
                      <li>Passport information</li>
                      <li>Personal ID numbers</li>
                      <li>Unrelated personal data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Security Information */}
        <SecurityInformation/>
      </div>

      {/* Dataset Selection Modal */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Select Datasets to Share</DialogTitle>
            <DialogDescription>
              Select datasets that match the partner's data requirements to unlock the reward.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {selectedPartner && (
              <>
                {/* Partner Info */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/5 rounded-xl flex items-center justify-center text-2xl">
                    {selectedPartner.logo}
                  </div>
                  <div className="flex-1">
                    <p>{selectedPartner.name}</p>
                    <p className="text-sm text-gray-600">Reward: {selectedPartner.reward.value}</p>
                  </div>
                </div>

                {/* Required Data Types */}
                <div>
                  <Label className="mb-2 block">Required Data Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.dataTypesRequired.map(dataType => {
                      const DataIcon = getDataTypeIcon(dataType);
                      const selectedCategories = uploadedDatasets
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
                  {uploadedDatasets.filter(dataset => 
                    selectedPartner.dataTypesRequired.includes(dataset.category) && dataset.status === 'success'
                  ).length === 0 ? (
                    <div className="border-2 border-dashed rounded-xl p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No datasets available for this category.
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please upload a file first.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPartner(null);
                          setActiveTab('upload');
                        }}
                        className="rounded-xl"
                      >
                        Go to Upload Data
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-xl divide-y max-h-[300px] overflow-y-auto">
                      {uploadedDatasets
                        .filter(dataset => 
                          selectedPartner.dataTypesRequired.includes(dataset.category) && dataset.status === 'success'
                        )
                        .map(dataset => {
                          const DataIcon = getDataTypeIcon(dataset.category);
                          const isSelected = selectedDatasets.includes(dataset.id);
                          
                          return (
                            <div
                              key={dataset.id}
                              onClick={() => toggleDatasetSelection(dataset.id)}
                              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-[#EAF1FF] transition-colors ${
                                isSelected ? 'bg-blue-50' : ''
                              }`}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleDatasetSelection(dataset.id)}
                                className="shrink-0"
                              />
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span>{dataset.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <DataIcon className="w-3 h-3 mr-1" />
                                    {dataset.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{dataset.size}</span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-500">{dataset.recordsCount.toLocaleString()} records</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPartner(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAccept}
              disabled={!areAllDatasetRequirementsMet()}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90 rounded-xl"
            >
              Confirm & Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Redemption Dialog */}
      <Dialog open={isRedemptionDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span>{selectedReward && voucherCodes.has(selectedReward.id) ? 'Voucher Details' : 'Redeem Reward'}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedReward && voucherCodes.has(selectedReward.id)
                ? 'Your reward has been successfully redeemed. Save your voucher code below.'
                : 'Confirm that you want to redeem this reward. You\'ll receive a voucher code to use with the partner.'}
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              {/* Reward Summary */}
              <div className="border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4>{selectedReward.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedReward.description}
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white shrink-0">
                    {selectedReward.value}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedReward.partnerName}</span>
                  </div>
                  {selectedReward.expiryDate && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Valid until {selectedReward.expiryDate}</span>
                    </div>
                  )}
                </div>

                {selectedReward.terms && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                    <strong>Terms:</strong> {selectedReward.terms}
                  </div>
                )}
              </div>

              {/* Voucher Code (after redemption) */}
              {voucherCodes.has(selectedReward.id) && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-900">Your Voucher Code:</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyVoucherCode(voucherCodes.get(selectedReward.id)!)}
                      className="h-8 text-green-700 hover:text-green-900"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <code className="block text-center text-xl font-mono text-green-900 py-2">
                    {voucherCodes.get(selectedReward.id)}
                  </code>
                  <p className="text-xs text-green-700 text-center mt-2">
                    Present this code to the partner when making your booking or purchase
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedReward && voucherCodes.has(selectedReward.id) ? (
              <Button onClick={handleCloseDialog} className="w-full rounded-xl">
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleConfirmRedemption} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 rounded-xl">
                  Confirm Redemption
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Verification Modal */}
      <AIVerificationModal
        isOpen={isVerificationModalOpen}
        partnerName={verifyingPartner?.name || ''}
        dataTypes={verifyingPartner?.dataTypesRequired || []}
        onVerificationComplete={handleVerificationComplete}
        onCancel={() => {
          setIsVerificationModalOpen(false);
          setVerifyingPartner(null);
        }}
      />
      <CustomToaster />
    </div>
  );
}
