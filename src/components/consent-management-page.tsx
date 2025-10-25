import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Shield, MapPin, CreditCard, Calendar, User, Eye, Info } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for partner consents
const mockConsents = [
  {
    id: 'DS-001',
    partner: 'Air New Zealand',
    dataTypes: ['Travel Preferences', 'Booking History'],
    status: 'Active' as const,
    consentDate: '2024-12-15',
    expiryDate: '2025-12-15',
    reward: '25 Airpoints',
  },
  {
    id: 'DS-002',
    partner: 'Tourism New Zealand',
    dataTypes: ['Location History', 'Travel Preferences'],
    status: 'Active' as const,
    consentDate: '2024-12-20',
    expiryDate: '2025-12-20',
    reward: 'NZ$15 Voucher',
  },
  {
    id: 'DS-003',
    partner: 'Booking.com',
    dataTypes: ['Accommodation Preferences', 'Spending Data'],
    status: 'Active' as const,
    consentDate: '2025-01-05',
    expiryDate: '2026-01-05',
    reward: '10% Discount',
  },
  {
    id: 'DS-005',
    partner: 'Queenstown Tourism',
    dataTypes: ['Spending Patterns', 'Demographics'],
    status: 'Active' as const,
    consentDate: '2024-11-30',
    expiryDate: '2025-11-30',
    reward: 'Activity Discount',
  },
];

const getDataTypeIcon = (dataType: string) => {
  if (dataType.toLowerCase().includes('travel') || dataType.toLowerCase().includes('location')) {
    return MapPin;
  }
  if (dataType.toLowerCase().includes('spending') || dataType.toLowerCase().includes('accommodation')) {
    return CreditCard;
  }
  if (dataType.toLowerCase().includes('booking') || dataType.toLowerCase().includes('history')) {
    return Calendar;
  }
  return User;
};

interface ConsentDetails {
  id: string;
  partner: string;
  dataTypes: string[];
  permissions: Record<string, boolean>;
}

export function ConsentManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [consents, setConsents] = useState(mockConsents);
  const [selectedConsent, setSelectedConsent] = useState<ConsentDetails | null>(null);
  const [consentToRevoke, setConsentToRevoke] = useState<typeof mockConsents[0] | null>(null);

  const filteredConsents = consents.filter(consent =>
    consent.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consent.dataTypes.some(dt => dt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (consent: typeof mockConsents[0]) => {
    // Convert to detailed view with granular permissions
    const permissions: Record<string, boolean> = {};
    consent.dataTypes.forEach(dataType => {
      permissions[dataType] = true;
    });
    
    setSelectedConsent({
      id: consent.id,
      partner: consent.partner,
      dataTypes: consent.dataTypes,
      permissions,
    });
  };

  const handleTogglePermission = (dataType: string) => {
    if (!selectedConsent) return;
    
    setSelectedConsent({
      ...selectedConsent,
      permissions: {
        ...selectedConsent.permissions,
        [dataType]: !selectedConsent.permissions[dataType],
      },
    });
  };

  const handleSaveConsent = () => {
    if (!selectedConsent) return;
    
    toast.success('Consent Updated', {
      description: `Updated permissions for ${selectedConsent.partner}`
    });
    
    setSelectedConsent(null);
  };

  const handleRevokeConsent = (consent: typeof mockConsents[0]) => {
    setConsentToRevoke(consent);
  };

  const handleConfirmRevoke = () => {
    if (!consentToRevoke) return;
    
    setConsents(prev => prev.filter(c => c.id !== consentToRevoke.id));
    
    toast.success('Access Revoked', {
      description: `Data sharing with ${consentToRevoke.partner} has been revoked.`
    });
    
    setConsentToRevoke(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Expired':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Consent Management</h1>
        <p className="text-gray-600">
          Review and manage your data sharing consents with all partners
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Consents</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search partners or data types..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consent ID</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Data Types</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Consent Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsents.map((consent) => (
                  <TableRow key={consent.id}>
                    <TableCell className="font-medium">
                      {consent.id}
                    </TableCell>
                    <TableCell>{consent.partner}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {consent.dataTypes.slice(0, 2).map(dt => {
                          const Icon = getDataTypeIcon(dt);
                          return (
                            <Badge key={dt} variant="outline" className="text-xs">
                              <Icon className="w-3 h-3 mr-1" />
                              {dt}
                            </Badge>
                          );
                        })}
                        {consent.dataTypes.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{consent.dataTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(consent.status)}>
                        {consent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(consent.consentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(consent.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {consent.reward}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(consent)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleRevokeConsent(consent)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredConsents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No consents found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Consent Dialog */}
      <Dialog open={!!selectedConsent} onOpenChange={() => setSelectedConsent(null)}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Consent - {selectedConsent?.partner}</DialogTitle>
            <DialogDescription>
              Control which data types you're sharing with this partner
            </DialogDescription>
          </DialogHeader>
          
          {selectedConsent && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    Consent ID: {selectedConsent.id}
                  </span>
                </div>
                <p className="text-sm text-blue-800">
                  Toggle individual data types to control what you share with {selectedConsent.partner}
                </p>
              </div>

              <div className="space-y-4">
                {selectedConsent.dataTypes.map(dataType => {
                  const Icon = getDataTypeIcon(dataType);
                  return (
                    <div key={dataType} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{dataType}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedConsent.permissions[dataType] ? 'Currently sharing' : 'Not sharing'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={selectedConsent.permissions[dataType]}
                        onCheckedChange={() => handleTogglePermission(dataType)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedConsent(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConsent} className="bg-[#2D4AFF] hover:bg-[#2D4AFF]/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!consentToRevoke} onOpenChange={() => setConsentToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Data Access?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke {consentToRevoke?.partner}'s access to your data?
              This will immediately stop all data sharing and you may lose access to rewards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRevoke}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
