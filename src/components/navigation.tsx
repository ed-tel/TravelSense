import { Search, Plus, Bell, Settings, User, LogOut, Shield, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavigationProps {
  onLogoClick?: () => void;
  onNavigateToMyData?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToRewards?: () => void;
  onNavigateToPrivacy?: () => void;
  currentPage?: "dashboard" | "my-data" | "rewards" | "privacy";
}

export function Navigation({ onLogoClick, onNavigateToMyData, onNavigateToDashboard, onNavigateToRewards, onNavigateToPrivacy, currentPage = "dashboard" }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Navigation Links */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={onLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-medium">TravelSense</span>
          </button>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={onNavigateToDashboard}
              className={`hover:text-primary transition-colors ${
                currentPage === "dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={onNavigateToMyData}
              className={`hover:text-primary transition-colors ${
                currentPage === "my-data" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Data
            </button>
            <button 
              onClick={onNavigateToPrivacy}
              className={`hover:text-primary transition-colors ${
                currentPage === "privacy" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Privacy
            </button>
            <button 
              onClick={onNavigateToRewards}
              className={`hover:text-primary transition-colors ${
                currentPage === "rewards" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Rewards
            </button>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Partners
            </a>
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search data activity..."
              className="pl-10 w-64 bg-muted/50"
            />
          </div>
          
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Shield className="w-4 h-4 mr-2" />
            Data Settings
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}