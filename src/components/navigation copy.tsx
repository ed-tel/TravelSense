// src/components/Navigation.tsx
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { Input } from "./ui/input";


import { Bell, Upload, User, LogOut, Plane, AlertCircle } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { NotificationsPopover, type Notification } from "./notifications-popover";

interface NavigationProps {
  onLogoClick?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToRewards?: () => void;
  onNavigateToPartners?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToUploadData?: () => void;
  onOpenManageConsent?: () => void;
  onSignOut?: () => void;
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
  currentPage?: "dashboard" | "rewards" | "partners" | "profile" | "upload-data";
  notifications?: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onClearNotification?: (id: string) => void;
  pushNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  onTogglePushNotifications?: (enabled: boolean) => void;
  onToggleEmailNotifications?: (enabled: boolean) => void;
}


export function Navigation({
  onLogoClick,
  onNavigateToDashboard,
  onNavigateToRewards,
  onNavigateToPartners,
  onNavigateToProfile,
  onNavigateToUploadData,
  onOpenManageConsent,
  onSignOut,
  userName: propName,
  userEmail: propEmail,
  userProfileImage: propProfile,
  currentPage = "dashboard",
  notifications = [],
  onMarkNotificationAsRead = () => {},
  onMarkAllNotificationsAsRead = () => {},
  onClearNotification = () => {},
  pushNotificationsEnabled = true,
  emailNotificationsEnabled = true,
  onTogglePushNotifications = () => {},
  onToggleEmailNotifications = () => {},
}: NavigationProps) {
  const { userName: firebaseName, userEmail: firebaseEmail, userProfileImage: firebaseProfile } = useCurrentUser();


  // Merge Firebase values with props (props take precedence if provided)
  const userName = propName || firebaseName || "";
  const userEmail = propEmail || firebaseEmail || "";
  const userProfileImage = propProfile || firebaseProfile || "";


  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };


  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogoClick}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Plane className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium">TravelSense</span>
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Go to Homepage</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
         
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={onNavigateToDashboard}
              className={`hover:text-primary transition-colors ${currentPage === "dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Dashboard
            </button>
            <button
              onClick={onNavigateToRewards}
              className={`hover:text-primary transition-colors ${currentPage === "rewards" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Rewards
            </button>
            <button
              onClick={onNavigateToPartners}
              className={`hover:text-primary transition-colors ${currentPage === "partners" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Partners
            </button>
          </nav>
        </div>


        {/* Actions */}
        <div className="flex items-center space-x-4">
        <NotificationsPopover
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onClearNotification={onClearNotification}
            pushNotificationsEnabled={pushNotificationsEnabled}
            emailNotificationsEnabled={emailNotificationsEnabled}
            onTogglePushNotifications={onTogglePushNotifications}
            onToggleEmailNotifications={onToggleEmailNotifications}
          />
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open notifications">
                <Bell className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-sm text-muted-foreground">Privacy & Consent Alerts</div>
              <DropdownMenuItem className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="text-sm">Air New Zealand</div>
                  <div className="text-xs text-muted-foreground">Data usage report available • 2d ago</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <div className="text-sm">Tourism New Zealand</div>
                  <div className="text-xs text-muted-foreground">Consent expires in 7 days • Today</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <div>
                  <div className="text-sm">Booking.com</div>
                  <div className="text-xs text-muted-foreground">New data request received • 1d ago</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-xs text-muted-foreground">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2 p-2">
                <Button variant="outline" className="h-8" onClick={onOpenManageConsent}>Privacy Settings</Button>
                <Button variant="outline" className="h-8" onClick={onNavigateToUploadData}>Manage Consent</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfileImage} />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onNavigateToProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNavigateToUploadData}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Data</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}



