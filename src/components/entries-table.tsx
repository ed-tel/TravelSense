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
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
} from "lucide-react";

const entries = [
  {
    id: "DS-001",
    partner: "Air New Zealand",
    dataType: "Travel Preferences",
    status: "Active",
    consentDate: "2024-12-15",
    expiryDate: "2025-12-15",
    reward: "25 Airpoints",
    value: "$12.50",
  },
  {
    id: "DS-002",
    partner: "Tourism New Zealand",
    dataType: "Location History",
    status: "Pending",
    consentDate: "2024-12-20",
    expiryDate: "2025-12-20",
    reward: "NZ$15 Voucher",
    value: "$15.00",
  },
  {
    id: "DS-003",
    partner: "Booking.com",
    dataType: "Accommodation Preferences",
    status: "Review",
    consentDate: "2025-01-05",
    expiryDate: "2026-01-05",
    reward: "10% Discount",
    value: "$8.00",
  },
  {
    id: "DS-004",
    partner: "Rental Cars NZ",
    dataType: "Demographics",
    status: "Expired",
    consentDate: "2023-10-15",
    expiryDate: "2024-10-15",
    reward: "Free Upgrade",
    value: "$35.00",
  },
  {
    id: "DS-005",
    partner: "Queenstown Tourism",
    dataType: "Spending Patterns",
    status: "Active",
    consentDate: "2024-11-30",
    expiryDate: "2025-11-30",
    reward: "Activity Discount",
    value: "$22.00",
  },
  {
    id: "DS-006",
    partner: "InterCity Bus",
    dataType: "Travel Routes",
    status: "Revoked",
    consentDate: "2024-09-22",
    expiryDate: "2025-09-22",
    reward: "Student Discount",
    value: "$5.00",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Review":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Expired":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    case "Revoked":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export function EntriesTable() {
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
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.id}
                  </TableCell>
                  <TableCell>{entry.partner}</TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Consent
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing 6 of 142 data shares
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}