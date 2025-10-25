import { useState } from "react";
import { 
  Bell, 
  Check, 
  Settings, 
  Mail, 
  Shield, 
  DollarSign, 
  AlertTriangle,
  X,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

export interface Notification {
  id: string;
  type: "reward" | "security" | "consent" | "alert";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionable?: boolean;
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  onTogglePushNotifications: (enabled: boolean) => void;
  onToggleEmailNotifications: (enabled: boolean) => void;
  rewardNotificationsEnabled?: boolean;
  securityNotificationsEnabled?: boolean;
  consentNotificationsEnabled?: boolean;
  alertNotificationsEnabled?: boolean;
  onToggleRewardNotifications?: (enabled: boolean) => void;
  onToggleSecurityNotifications?: (enabled: boolean) => void;
  onToggleConsentNotifications?: (enabled: boolean) => void;
  onToggleAlertNotifications?: (enabled: boolean) => void;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "reward":
      return DollarSign;
    case "security":
      return Shield;
    case "consent":
      return CheckCircle2;
    case "alert":
      return AlertTriangle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "reward":
      return "text-green-600 bg-green-100";
    case "security":
      return "text-blue-600 bg-blue-100";
    case "consent":
      return "text-purple-600 bg-purple-100";
    case "alert":
      return "text-orange-600 bg-orange-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

export function NotificationsPopover({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  pushNotificationsEnabled,
  emailNotificationsEnabled,
  onTogglePushNotifications,
  onToggleEmailNotifications,
  rewardNotificationsEnabled = true,
  securityNotificationsEnabled = true,
  consentNotificationsEnabled = true,
  alertNotificationsEnabled = true,
  onToggleRewardNotifications = () => {},
  onToggleSecurityNotifications = () => {},
  onToggleConsentNotifications = () => {},
  onToggleAlertNotifications = () => {},
}: NotificationsPopoverProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTogglePush = (enabled: boolean) => {
    onTogglePushNotifications(enabled);
    if (enabled) {
      toast.success("Push notifications enabled", {
        description: "You'll receive real-time updates about your data sharing activities."
      });
    } else {
      toast.info("Push notifications disabled");
    }
  };

  const handleToggleEmail = (enabled: boolean) => {
    onToggleEmailNotifications(enabled);
    if (enabled) {
      toast.success("Email notifications enabled", {
        description: "You'll receive daily summaries of your data sharing activities."
      });
    } else {
      toast.info("Email notifications disabled");
    }
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
  };

  const handleClear = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onClearNotification(id);
    toast.success("Notification removed");
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 hover:bg-red-600"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSettingsOpen(true);
                  setPopoverOpen(false);
                }}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer relative group ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleClear(notification.id, e)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Manage how you receive notifications about your data sharing activities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Push Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Push Notifications</label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time browser notifications
                  </p>
                </div>
                <Switch
                  checked={pushNotificationsEnabled}
                  onCheckedChange={handleTogglePush}
                />
              </div>
              
              {pushNotificationsEnabled && (
                <div className="ml-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    You'll be notified instantly about new rewards, consent updates, and security alerts
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Email Notifications</label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive daily email summaries
                  </p>
                </div>
                <Switch
                  checked={emailNotificationsEnabled}
                  onCheckedChange={handleToggleEmail}
                />
              </div>
              
              {emailNotificationsEnabled && (
                <div className="ml-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-900">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    Daily summaries will be sent to your registered email address
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Notification Types */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Notification Types</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Rewards & Earnings</span>
                  </div>
                  <Switch 
                    checked={rewardNotificationsEnabled} 
                    onCheckedChange={onToggleRewardNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Security Alerts</span>
                  </div>
                  <Switch 
                    checked={securityNotificationsEnabled} 
                    onCheckedChange={onToggleSecurityNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Consent Updates</span>
                  </div>
                  <Switch 
                    checked={consentNotificationsEnabled} 
                    onCheckedChange={onToggleConsentNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm">Expiry Warnings</span>
                  </div>
                  <Switch 
                    checked={alertNotificationsEnabled} 
                    onCheckedChange={onToggleAlertNotifications}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
