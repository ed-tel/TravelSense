// src/components/navigation.tsx
"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import {
  User,
  LogOut,
  Plane,
  LayoutDashboard,
  Gift,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { NotificationsPopover, type Notification } from "./notifications-popover";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface NavigationProps {
  onLogoClick?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToRewardsAndPartners?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToUploadData?: () => void;

  // Keep this prop so App.tsx can still pass it, but we won't render a Contact link here.
  onNavigateToContact?: () => void;

  onSignOut?: () => void;
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
  currentPage?: "dashboard" | "rewards-and-partners" | "profile" | "upload-data";
  notifications?: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  onClearNotification?: (id: string) => void;
  pushNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  onTogglePushNotifications?: (enabled: boolean) => void;
  onToggleEmailNotifications?: (enabled: boolean) => void;
  rewardNotificationsEnabled?: boolean;
  securityNotificationsEnabled?: boolean;
  consentNotificationsEnabled?: boolean;
  alertNotificationsEnabled?: boolean;
  onToggleRewardNotifications?: (enabled: boolean) => void;
  onToggleSecurityNotifications?: (enabled: boolean) => void;
  onToggleConsentNotifications?: (enabled: boolean) => void;
  onToggleAlertNotifications?: (enabled: boolean) => void;
  onOpenManageConsent?: () => void;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
export function Navigation({
  onLogoClick,
  onNavigateToDashboard,
  onNavigateToRewardsAndPartners,
  onNavigateToProfile,
  onNavigateToUploadData,
  onNavigateToContact, // kept but unused
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
  rewardNotificationsEnabled = true,
  securityNotificationsEnabled = true,
  consentNotificationsEnabled = true,
  alertNotificationsEnabled = true,
  onToggleRewardNotifications = () => {},
  onToggleSecurityNotifications = () => {},
  onToggleConsentNotifications = () => {},
  onToggleAlertNotifications = () => {},
  onOpenManageConsent,
}: NavigationProps) {
  const {
    userName: firebaseName,
    userEmail: firebaseEmail,
    userProfileImage: firebaseProfile,
  } = useCurrentUser();

  const userName = propName || firebaseName || "User";
  const userEmail = propEmail || firebaseEmail || "user@example.com";
  const userProfileImage =
    propProfile ||
    firebaseProfile ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
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
              <TooltipContent>
                <p>Go to Homepage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Center Navigation (desktop) */}
        <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <button
            onClick={onNavigateToDashboard}
            className={`flex items-center gap-2 hover:text-primary transition-colors ${
              currentPage === "dashboard"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={onNavigateToRewardsAndPartners}
            className={`flex items-center gap-2 hover:text-primary transition-colors ${
              currentPage === "rewards-and-partners"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gift className="w-4 h-4" />
            Rewards &amp; Partners
          </button>

          {/* Contact button removed here so it won't show after sign-in */}
        </nav>

        {/* Right actions */}
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
            rewardNotificationsEnabled={rewardNotificationsEnabled}
            securityNotificationsEnabled={securityNotificationsEnabled}
            consentNotificationsEnabled={consentNotificationsEnabled}
            alertNotificationsEnabled={alertNotificationsEnabled}
            onToggleRewardNotifications={onToggleRewardNotifications}
            onToggleSecurityNotifications={onToggleSecurityNotifications}
            onToggleConsentNotifications={onToggleConsentNotifications}
            onToggleAlertNotifications={onToggleAlertNotifications}
          />

          {/* Profile Dropdown */}
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onSignOut || (() => signOut(auth))}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
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
