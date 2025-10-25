import { Building2, BarChart3, FileText, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface BusinessNavigationProps {
  onSignOut: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToReports?: () => void;
  currentPage?: "dashboard" | "reports";
  companyName?: string;
}

export function BusinessNavigation({ 
  onSignOut,
  onNavigateToDashboard,
  onNavigateToReports,
  currentPage = "dashboard",
  companyName = "Air New Zealand"
}: BusinessNavigationProps) {
  return (
    <nav className="border-b border-slate-700 bg-slate-900/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">TravelSense Business</h1>
              <p className="text-xs text-slate-400">{companyName}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={currentPage === "dashboard" ? "secondary" : "ghost"}
              size="sm"
              onClick={onNavigateToDashboard}
              className={currentPage === "dashboard" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === "reports" ? "secondary" : "ghost"}
              size="sm"
              onClick={onNavigateToReports}
              className={currentPage === "reports" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}
            >
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" />
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
                <span className="text-white hidden sm:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Company Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
