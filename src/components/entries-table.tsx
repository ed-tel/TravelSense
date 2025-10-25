import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import type { TransactionEntry } from "../App";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Expired":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

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
  if (dataType.toLowerCase().includes('demographics')) {
    return User;
  }
  return Shield;
};

interface EntriesTableProps {
  entries: TransactionEntry[];
  highlightPartnerId?: string;
  onNavigateToConsentManagement?: () => void;
  onNavigateToPartners?: (partnerName?: string, tab?: 'upload' | 'partners' | 'rewards') => void;
  onUpdateEntryStatus?: (entryId: string, newStatus: "Active" | "Expired") => void;
}

export function EntriesTable({ 
  entries, 
  highlightPartnerId, 
  onNavigateToConsentManagement,
  onNavigateToPartners,
  onUpdateEntryStatus 
}: EntriesTableProps) {
  const [selectedEntry, setSelectedEntry] = useState<TransactionEntry | null>(null);
  const [entryToRevoke, setEntryToRevoke] = useState<TransactionEntry | null>(null);
  const highlightedRowRef = useRef<HTMLTableRowElement>(null);
  const [visibleEntries, setVisibleEntries] = useState<TransactionEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "expired" | "partner-asc" | "value-desc">("all");

  // Filter and sort entries based on search and filter
  useEffect(() => {
    let filtered = [...entries];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        entry =>
          entry.partner.toLowerCase().includes(query) ||
          entry.dataType.toLowerCase().includes(query)
      );
    }

    // Apply status/sort filter
    if (filterType === "active") {
      filtered = filtered.filter(entry => entry.status === "Active");
    } else if (filterType === "expired") {
      filtered = filtered.filter(entry => entry.status === "Expired");
    } else if (filterType === "partner-asc") {
      filtered.sort((a, b) => a.partner.localeCompare(b.partner));
    } else if (filterType === "value-desc") {
      filtered.sort((a, b) => {
        const valueA = parseFloat(a.value.replace(/[^0-9.]/g, '')) || 0;
        const valueB = parseFloat(b.value.replace(/[^0-9.]/g, '')) || 0;
        return valueB - valueA;
      });
    } else {
      // Default: sort by timestamp (most recent first)
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    setVisibleEntries(filtered.slice(0, 6));
  }, [entries, searchQuery, filterType]);

  // Scroll to highlighted row when highlightPartnerId changes
  useEffect(() => {
    if (highlightPartnerId && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a flash effect
      highlightedRowRef.current.classList.add('bg-blue-100');
      setTimeout(() => {
        highlightedRowRef.current?.classList.remove('bg-blue-100');
      }, 2000);
    }
  }, [highlightPartnerId]);

  const handleViewDetails = (entry: typeof entries[0]) => {
    setSelectedEntry(entry);
  };

  const handleManageConsent = () => {
    if (onNavigateToConsentManagement) {
      onNavigateToConsentManagement();
    }
  };

  const handleRevokeAccess = (entry: typeof entries[0]) => {
    setEntryToRevoke(entry);
  };

  const handleConfirmRevoke = () => {
    if (!entryToRevoke) return;

    if (onUpdateEntryStatus) {
      onUpdateEntryStatus(entryToRevoke.id, 'Expired');
    }

    toast.success('Access Revoked', {
      description: `Data sharing with ${entryToRevoke.partner} has been marked as expired.`
    });

    setEntryToRevoke(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Data Sharing Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search data shares..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Entries
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("active")}>
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("expired")}>
                  Expired Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("partner-asc")}>
                  Partner (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("value-desc")}>
                  Value (Highest First)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Shield className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Shares Yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Start by visiting the Partners page to share your data and unlock rewards.
            </p>
            <Button onClick={() => onNavigateToPartners?.(undefined, 'partners')} variant="default">
              Browse Partners
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Share ID</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Consent Date</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No entries match your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleEntries.map((entry, index) => {
                      const isHighlighted = entry.id === highlightPartnerId;
                      const isNewEntry = index === 0 && entries.length > 0 && entries[0]?.id === entry.id;
                      
                      return (
                        <TableRow 
                          key={entry.id}
                          ref={isHighlighted ? highlightedRowRef : null}
                          className={`${isHighlighted ? 'transition-colors duration-500' : ''} ${isNewEntry ? 'animate-in fade-in slide-in-from-top-2 duration-400' : ''}`}
                          style={isNewEntry ? {
                            animation: 'fadeSlideIn 0.4s ease-out forwards',
                          } : undefined}
                        >
                          <TableCell className="font-medium">
                            {entry.id}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => onNavigateToPartners?.(entry.partner)}
                              className="text-[#2D4AFF] hover:underline hover:text-[#2D4AFF]/80 transition-colors cursor-pointer text-left"
                            >
                              {entry.partner}
                            </button>
                          </TableCell>
                          <TableCell>{entry.dataType}</TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(entry.status)}
                            >
                              {entry.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              entry.consentDate,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              entry.expiryDate,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{entry.reward}</TableCell>
                          <TableCell className="font-medium text-green-600">
                            {entry.value}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(entry)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(visibleEntries.length, 6)} of {entries.length} data shares
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={entries.length <= 6}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* View Details Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Data Sharing Details - {selectedEntry?.partner}</DialogTitle>
            <DialogDescription>
              Full consent information and data type details
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Share ID</p>
                  <p className="font-medium">{selectedEntry.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedEntry.status)}>
                    {selectedEntry.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consent Date</p>
                  <p className="font-medium">{new Date(selectedEntry.consentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{new Date(selectedEntry.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">Data Type Shared</p>
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  {(() => {
                    const Icon = getDataTypeIcon(selectedEntry.dataType);
                    return <Icon className="w-5 h-5 text-blue-600" />;
                  })()}
                  <span className="font-medium">{selectedEntry.dataType}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Reward Information</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">{selectedEntry.reward}</p>
                      <p className="text-sm text-green-700">Estimated Value: {selectedEntry.value}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Data Protection</p>
                    <p>All shared data is anonymized and encrypted before transmission. You can revoke access at any time.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEntry(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!entryToRevoke} onOpenChange={() => setEntryToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Data Access?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke {entryToRevoke?.partner}'s access to your {entryToRevoke?.dataType}?
              This will immediately stop all data sharing and you may lose access to the reward ({entryToRevoke?.reward}).
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
    </Card>
  );
}