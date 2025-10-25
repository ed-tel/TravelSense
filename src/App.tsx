import { useState, useMemo, useEffect } from "react";
import { LandingPage } from "./components/landing-page";
import { AuthPage } from "./components/auth-page";
import { RewardsAndPartnersPage } from "./components/rewards-and-partners-page";
import { ProfilePage } from "./components/profile-page";
import { UploadDataPage } from "./components/upload-data-page";
import { PrivacySettingsPage } from "./components/privacy-settings-page";
import { ConsentManagementPage } from "./components/consent-management-page";
import { BusinessAuthPage } from "./components/business-auth-page";
import { BusinessDashboardPage } from "./components/business-dashboard-page";
import { BusinessReportsPage } from "./components/business-reports-page";
import { BusinessNavigation } from "./components/business-navigation";
import { Navigation } from "./components/navigation";
import { HeroPanel } from "./components/hero-panel";
import { EntriesTable } from "./components/entries-table";
import { UpdateNotificationBanner } from "./components/update-notification-banner";
import { ToastContainer } from "react-toastify";
import { CustomToaster } from "./components/ui/sonner";
import "react-toastify/dist/ReactToastify.css";
import type { Notification } from "./components/notifications-popover";
import { useCurrentUser } from "../src/hooks/useCurrentUser";

import { Card, CardContent } from "./components/ui/card";
import { Shield } from "lucide-react";
import { SecurityInformation } from "./components/security-information";
import { ScrollToTopButton } from "./components/scroll-to-top-button";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig"



// 🔹 App State Definition
type AppState =
  | "landing"
  | "auth"
  | "dashboard"
  | "rewards-and-partners"
  | "profile"
  | "upload-data"
  | "privacy-settings"
  | "consent-management"
  | "business-auth"
  | "business-dashboard"
  | "business-reports";

export interface DashboardStats {
  totalEarned: number;
  dataSharesCount: number;
  activePermissions: number;
  monthlyDataShares: number;
  monthlyRewards: number;
  activePartnerships: number;
}

export interface DataShare {
  id: number;
  partner: string;
  dataType: string;
  status: "Active" | "Expired";
  progress: number;
  shareDate: string;
  reward: string;
  value: string;
  timestamp: number; // For sorting
}

export interface TransactionEntry {
  id: string;
  partner: string;
  dataType: string;
  status: "Active" | "Expired";
  consentDate: string;
  expiryDate: string;
  reward: string;
  value: string;
  timestamp: number;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  partner: string;
  timestamp: number;
  formattedTimestamp: string;
  dataType: string;
  status: "success" | "warning" | "info";
}

// Helper function to parse value from string (removes $ sign and other non-numeric characters)
const parseValue = (valueString: string): number => {
  const cleaned = valueString.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export default function App() {
  // 🔹 Firebase user sync (🔥)
  const {
    userName: firebaseName,
    userEmail: firebaseEmail,
    userProfileImage: firebaseProfile,
  } = useCurrentUser();

// -----------------------------
// 🔹 User profile state (simplified + ordered correctly)
// -----------------------------

const [localName, setLocalName] = useState("");
const [localEmail, setLocalEmail] = useState("");
const [localProfileImage, setLocalProfileImage] = useState("");

const [hasCustomProfileImage, setHasCustomProfileImage] = useState(() => {
  return localStorage.getItem("travelsense_hasCustomProfileImage") === "true";
});

// ✅ Compute resolved initial values
const resolvedUserEmail =
  firebaseEmail || localEmail || "user@example.com";
const resolvedUserName =
  firebaseName || localName || resolvedUserEmail.split("@")[0] || "User";
const resolvedUserProfileImage =
  firebaseProfile ||
  localProfileImage ||
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png?w=400&h=400&fit=crop&crop=face";

// ✅ Main user states (declare them BEFORE any useEffect that references them)
const [userName, setUserName] = useState(resolvedUserName);
const [userEmail, setUserEmail] = useState(resolvedUserEmail);
const [userProfileImage, setUserProfileImage] = useState(resolvedUserProfileImage);

// 🔹 Firestore setup
const db = getFirestore();

// 🔹 Fetch Firestore profile (runs after login)
useEffect(() => {
  const fetchFirestoreProfile = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.profileImage && !hasCustomProfileImage) {
          setUserProfileImage(data.profileImage);
        }
      }
    } catch (err) {
      console.error("Error fetching Firestore profile:", err);
    }
  };
  fetchFirestoreProfile();
}, [auth.currentUser, hasCustomProfileImage]);

// 🔹 Firebase sync effect
useEffect(() => {
  if (firebaseName) setUserName(firebaseName);
  if (firebaseEmail) setUserEmail(firebaseEmail);

  setUserProfileImage((prev) => {
    if (hasCustomProfileImage) return prev;
    const isDefault =
      !prev ||
      prev.includes("cdn.pixabay.com") ||
      prev.startsWith("blob:");
    return isDefault && firebaseProfile ? firebaseProfile : prev;
  });
}, [firebaseName, firebaseEmail, firebaseProfile, hasCustomProfileImage]);

// 🔹 Persist profile to localStorage
useEffect(() => {
  localStorage.setItem("travelsense_userName", userName);
  localStorage.setItem("travelsense_userEmail", userEmail);
  localStorage.setItem("travelsense_userProfileImage", userProfileImage);
}, [userName, userEmail, userProfileImage]);

  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBusinessAuthenticated, setIsBusinessAuthenticated] = useState(false);
  const [highlightedPartnerId, setHighlightedPartnerId] = useState<string | undefined>(undefined);
  const [highlightedPartnerName, setHighlightedPartnerName] = useState<string | undefined>(undefined);
  const [rewardsAndPartnersInitialTab, setRewardsAndPartnersInitialTab] = useState<'upload' | 'partners' | 'rewards'>('upload');

  // Notification settings - Load from localStorage
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('travelsense_pushNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('travelsense_emailNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Notification type settings - Load from localStorage
  const [rewardNotificationsEnabled, setRewardNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('travelsense_rewardNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [securityNotificationsEnabled, setSecurityNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('travelsense_securityNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [consentNotificationsEnabled, setConsentNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('travelsense_consentNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [alertNotificationsEnabled, setAlertNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('travelsense_alertNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Notifications state - Load from localStorage or start empty
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('travelsense_notifications');
    if (!saved) return [];
    
    try {
      const parsed: Notification[] = JSON.parse(saved);
      // Ensure all notifications have unique IDs (migration for old data)
      const seenIds = new Set<string>();
      return parsed.map((notif) => {
        let uniqueId = notif.id;
        // If ID is duplicate or missing random part, regenerate it
        if (seenIds.has(uniqueId) || !uniqueId.includes('-', uniqueId.indexOf('-') + 1)) {
          uniqueId = `notif-${notif.timestamp || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        seenIds.add(uniqueId);
        return { ...notif, id: uniqueId };
      });
    } catch (e) {
      return [];
    }
  });

  // Track if there's a recent update to show notification
  const [recentUpdate, setRecentUpdate] = useState<{
    partnerName: string;
    reward: string;
    timestamp: number;
  } | null>(null);

  // Track recent data shares (keep last 3) - Load from localStorage or start empty
  const [recentDataShares, setRecentDataShares] = useState<DataShare[]>(() => {
    const saved = localStorage.getItem('travelsense_recentDataShares');
    return saved ? JSON.parse(saved) : [];
  });

  // Track all transaction entries - Load from localStorage or start empty
  const [transactionEntries, setTransactionEntries] = useState<TransactionEntry[]>(() => {
    const saved = localStorage.getItem('travelsense_transactionEntries');
    return saved ? JSON.parse(saved) : [];
  });

  // Track activity log - Load from localStorage or start empty
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(() => {
    const saved = localStorage.getItem('travelsense_activityLog');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with last login activity
    const now = Date.now();
    return [{
      id: `activity-${now}`,
      action: 'Last login',
      partner: 'User Action',
      timestamp: now,
      formattedTimestamp: new Date(now).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      dataType: 'Account Access',
      status: 'success' as const,
    }];
  });

  // Persist transaction entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_transactionEntries', JSON.stringify(transactionEntries));
  }, [transactionEntries]);

  // Persist activity log to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('travelsense_activityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  // Persist recent data shares to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_recentDataShares', JSON.stringify(recentDataShares));
  }, [recentDataShares]);

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelsense_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Persist notification settings to localStorage
  useEffect(() => {
    localStorage.setItem('travelsense_pushNotifications', JSON.stringify(pushNotificationsEnabled));
  }, [pushNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('travelsense_emailNotifications', JSON.stringify(emailNotificationsEnabled));
  }, [emailNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('travelsense_rewardNotifications', JSON.stringify(rewardNotificationsEnabled));
  }, [rewardNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('travelsense_securityNotifications', JSON.stringify(securityNotificationsEnabled));
  }, [securityNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('travelsense_consentNotifications', JSON.stringify(consentNotificationsEnabled));
  }, [consentNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('travelsense_alertNotifications', JSON.stringify(alertNotificationsEnabled));
  }, [alertNotificationsEnabled]);

  // Check for expiring rewards (check once per day)
  useEffect(() => {
    // Only check if alert notifications are enabled
    if (!alertNotificationsEnabled) return;

    const checkExpiringRewards = () => {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      // Check transaction entries for rewards expiring within 30 days
      transactionEntries.forEach(entry => {
        if (entry.status === 'Active') {
          const expiryDate = new Date(entry.expiryDate);
          
          // If expiring within 30 days
          if (expiryDate > now && expiryDate <= thirtyDaysFromNow) {
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            // Check if we already have a notification for this expiry
            const hasExistingNotification = notifications.some(
              notif => notif.type === 'alert' && notif.message.includes(entry.partner) && notif.message.includes('expiring')
            );
            
            if (!hasExistingNotification) {
              addNotification({
                type: 'alert',
                title: 'Reward Expiring Soon',
                message: `Your reward from ${entry.partner} (${entry.reward}) will expire in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}. Consider using it before ${expiryDate.toLocaleDateString()}.`,
                read: false,
              });
            }
          }
        }
      });
    };
    
    // Check immediately on mount
    checkExpiringRewards();
    
    // Check once per day
    const interval = setInterval(checkExpiringRewards, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [transactionEntries, alertNotificationsEnabled, notifications]);

  // Compute dashboard statistics dynamically from transaction entries
  const dashboardStats = useMemo<DashboardStats>(() => {
    // Get current month start
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    // Filter active entries (only Active status)
    const activeEntries = transactionEntries.filter(
      entry => entry.status === "Active"
    );
    
    // Calculate total earned from all Active entries
    const totalEarned = transactionEntries
      .filter(entry => entry.status === "Active")
      .reduce((sum, entry) => {
        const value = parseValue(entry.value);
        return sum + value;
      }, 0);
    
    // Total data shares count (all entries regardless of status)
    const dataSharesCount = transactionEntries.length;
    
    // Active permissions: count unique data types from active entries
    const uniqueDataTypes = new Set<string>();
    activeEntries.forEach(entry => {
      const types = entry.dataType.split(",").map(t => t.trim());
      types.forEach(type => {
        if (type) uniqueDataTypes.add(type);
      });
    });
    const activePermissions = uniqueDataTypes.size;
    
    // Monthly stats: count entries and rewards from current month
    const monthlyEntries = transactionEntries.filter(
      entry => entry.timestamp >= currentMonthStart
    );
    const monthlyDataShares = monthlyEntries.length;
    const monthlyRewards = monthlyEntries
      .filter(entry => entry.status === "Active")
      .reduce((sum, entry) => {
        const value = parseValue(entry.value);
        return sum + value;
      }, 0);
    
    // Active partnerships: count unique partners with Active status
    const activePartners = new Set(
      transactionEntries
        .filter(entry => entry.status === "Active")
        .map(entry => entry.partner)
    );
    const activePartnerships = activePartners.size;
    
    return {
      totalEarned: Math.round(totalEarned),
      dataSharesCount,
      activePermissions,
      monthlyDataShares,
      monthlyRewards: Math.round(monthlyRewards),
      activePartnerships,
    };
  }, [transactionEntries]);

  const handleGetStarted = () => {
    setCurrentState("auth");
  };

  const handleSignIn = () => {
    setCurrentState("auth");
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentState("dashboard");
    
    // Log login activity
    addActivityLog({
      action: 'Successful login',
      partner: 'User Action',
      dataType: 'Account Access',
      status: 'success',
    });
    
    // Only add welcome notification for new users (no transaction history)
    if (transactionEntries.length === 0) {
      addNotification({
        type: "security",
        title: `Welcome to TravelSense, ${userName}!`,
        message: "Your data is secure and you're in control. Start exploring partner rewards and manage your privacy settings.",
        read: false,
      });
    } else {
      // Welcome back message for returning users
      addNotification({
        type: "security",
        title: `Welcome back, ${resolvedUserName}!`,
        message: `You have ${transactionEntries.filter(e => e.status === "Active").length} active data shares.`,
        read: false,
      });
    }
  };

  const handleBusinessSignIn = () => {
    setCurrentState("business-auth");
  };

  const handleBusinessAuthSuccess = () => {
    setIsBusinessAuthenticated(true);
    setCurrentState("business-dashboard");
  };

  const handleBusinessSignOut = () => {
    setIsBusinessAuthenticated(false);
    setCurrentState("landing");
  };

  const handleBusinessNavigateToDashboard = () => {
    setCurrentState("business-dashboard");
  };

  const handleBusinessNavigateToReports = () => {
    setCurrentState("business-reports");
  };

  const handleReturnToLanding = () => {
    setCurrentState("landing");
  };

  const handleNavigateToDashboard = () => {
    setCurrentState("dashboard");
  };

  const handleNavigateToRewardsAndPartners = (partnerName?: string, tab?: 'upload' | 'partners' | 'rewards') => {
    if (partnerName) {
      setHighlightedPartnerName(partnerName);
      // Clear after component mounts
      setTimeout(() => setHighlightedPartnerName(undefined), 100);
    }
    if (tab) {
      setRewardsAndPartnersInitialTab(tab);
    }
    setCurrentState("rewards-and-partners");
  };

  const handleNavigateToProfile = () => {
    setCurrentState("profile");
  };

  const handleNavigateToUploadData = () => {
    // Upload Data is now nested inside Rewards & Partners
    setCurrentState("rewards-and-partners");
  };

  const handleNavigateToPrivacySettings = () => {
    setCurrentState("privacy-settings");
  };

  const handleNavigateToConsentManagement = () => {
    setCurrentState("consent-management");
  };

  const handleAlertClick = (partnerId: string) => {
    setHighlightedPartnerId(partnerId);
    setCurrentState("dashboard");
    // Clear highlight after scrolling
    setTimeout(() => setHighlightedPartnerId(undefined), 3000);
  };

  // This is called when the user actually edits and saves
const handleProfileEdited = (name: string, email: string, profileImage: string) => {
  setUserName(name);
  setUserEmail(email);
  setUserProfileImage(profileImage);

  // ✅ Log only when user really changes something
  addActivityLog({
    action: 'Profile information updated',
    partner: 'User Action',
    dataType: 'Account Settings',
    status: 'success',
  });
};

// This is called when Firebase just syncs the user info (no activity log)
const handleProfileSynced = (name: string, email: string, profileImage: string) => {
  setUserName(name);
  setUserEmail(email);
  setUserProfileImage(profileImage);
};


  const handleSignOut = () => {
    // Log sign out activity
    addActivityLog({
      action: 'User signed out',
      partner: 'User Action',
      dataType: 'Account Access',
      status: 'info',
    });
    
    setIsAuthenticated(false);
    setCurrentState("landing");
  };

  // Add activity log entry
  const addActivityLog = (entry: Omit<ActivityLogEntry, "id" | "timestamp" | "formattedTimestamp">) => {
    const now = Date.now();
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `activity-${now}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now,
      formattedTimestamp: new Date(now).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
    };
    setActivityLog(prev => [newEntry, ...prev].slice(0, 50)); // Keep only last 50 activities
  };

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleTogglePushNotifications = (enabled: boolean) => {
    setPushNotificationsEnabled(enabled);
  };

  const handleToggleEmailNotifications = (enabled: boolean) => {
    setEmailNotificationsEnabled(enabled);
  };

  const handleToggleRewardNotifications = (enabled: boolean) => {
    setRewardNotificationsEnabled(enabled);
  };

  const handleToggleSecurityNotifications = (enabled: boolean) => {
    setSecurityNotificationsEnabled(enabled);
  };

  const handleToggleConsentNotifications = (enabled: boolean) => {
    setConsentNotificationsEnabled(enabled);
  };

  const handleToggleAlertNotifications = (enabled: boolean) => {
    setAlertNotificationsEnabled(enabled);
  };

  // Add notification when data share is accepted
  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    // Check if this notification type is enabled
    const isTypeEnabled = () => {
      switch (notification.type) {
        case 'reward':
          return rewardNotificationsEnabled;
        case 'security':
          return securityNotificationsEnabled;
        case 'consent':
          return consentNotificationsEnabled;
        case 'alert':
          return alertNotificationsEnabled;
        default:
          return true;
      }
    };
    
    // Only add notification if the type is enabled
    if (!isTypeEnabled()) {
      return;
    }
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Function to extract dollar value from reward string
  const extractRewardValue = (reward: string): number => {
    // Handle dollar amounts like "$25 Voucher", "$50 Credit"
    const dollarMatch = reward.match(/\$(\d+)/);
    if (dollarMatch) {
      return parseInt(dollarMatch[1]);
    }
    
    // Handle percentages (estimate $10 per 10%)
    const percentMatch = reward.match(/(\d+)%/);
    if (percentMatch) {
      return parseInt(percentMatch[1]);
    }
    
    // Handle Airpoints (estimate $0.50 per point)
    const airpointsMatch = reward.match(/(\d+)\s*Airpoints/i);
    if (airpointsMatch) {
      return parseInt(airpointsMatch[1]) * 0.5;
    }
    
    // Default value for other rewards
    return 10;
  };

  // Generate next transaction ID
  const generateNextTransactionId = () => {
    const existingIds = transactionEntries.map(entry => {
      const match = entry.id.match(/DS-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxId = Math.max(...existingIds, 0);
    const nextId = maxId + 1;
    return `DS-${String(nextId).padStart(3, '0')}`;
  };

  // Handle accepting a new data share from partners page
  const handleDataShareAccepted = (partnerName: string, reward: string, dataTypesCount: number, dataTypes: string[]) => {
    const rewardValue = extractRewardValue(reward);
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const expiryDate = new Date(now);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // One year from now
    const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
    const newTransactionId = generateNextTransactionId();

    const dataTypeString = dataTypes.join(", ");

    // Add new data share to recent shares (keep only 3 most recent)
    const newShare: DataShare = {
      id: Date.now(), // Use timestamp as unique ID
      partner: partnerName,
      dataType: dataTypeString,
      status: "Active",
      progress: 60, // Start at 60%, will animate to 100%
      shareDate: formattedDate,
      reward: reward,
      value: `${rewardValue.toFixed(2)}`,
      timestamp: now.getTime(),
    };

    // Add new transaction entry
    const newTransaction: TransactionEntry = {
      id: newTransactionId,
      partner: partnerName,
      dataType: dataTypeString,
      status: "Active",
      consentDate: formattedDate,
      expiryDate: formattedExpiryDate,
      reward: reward,
      value: `${rewardValue.toFixed(2)}`,
      timestamp: now.getTime(),
    };

    // Update both states simultaneously
    setRecentDataShares(prev => {
      // Add new share at the beginning and keep only last 3
      const updated = [newShare, ...prev].slice(0, 3);
      return updated;
    });

    setTransactionEntries(prev => {
      // Add new transaction at the beginning
      const updated = [newTransaction, ...prev];
      return updated;
    });

    // Set recent update notification
    setRecentUpdate({
      partnerName,
      reward,
      timestamp: Date.now(),
    });

    // Auto-clear after 5 seconds
    setTimeout(() => {
      setRecentUpdate(null);
    }, 5000);

    // Animate progress to 100% after a short delay
    setTimeout(() => {
      setRecentDataShares(prev => 
        prev.map(share => 
          share.id === newShare.id 
            ? { ...share, progress: 100 }
            : share
        )
      );
    }, 500);

    // Add notification
    addNotification({
      type: "reward",
      title: "New Data Share Active!",
      message: `You've successfully shared data with ${partnerName} and earned ${reward}.`,
      read: false,
    });

    // Log data sharing activity
    addActivityLog({
      action: `Data shared with ${partnerName}`,
      partner: partnerName,
      dataType: dataTypeString,
      status: 'success',
    });
  };

  // Handle status updates that need to sync between both components
  const handleUpdateEntryStatus = (entryId: string, newStatus: "Active" | "Expired") => {
    // Update transaction entry
    setTransactionEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: newStatus } : entry
      )
    );

    // Find the partner name from the entry
    const entry = transactionEntries.find(e => e.id === entryId);
    if (entry) {
      // Update recent data shares if this partner is in there
      setRecentDataShares(prev =>
        prev.map(share =>
          share.partner === entry.partner
            ? { ...share, status: newStatus as "Active" | "Expired" }
            : share
        )
      );
    }
  };

  // Handle deleting all shared data
  const handleDeleteAllData = () => {
    localStorage.clear();
    setActivityLog([]);
    // Log data deletion activity
    addActivityLog({
      action: 'All shared data deleted',
      partner: 'User Action',
      dataType: 'All Categories',
      status: 'warning',
    });
    
    // Reset all transaction entries (keep empty array)
    setTransactionEntries([]);
    
    // Clear all recent data shares
    setRecentDataShares([]);
    
    // Clear any pending notifications
    setRecentUpdate(null);
    
    // Clear localStorage as well
    localStorage.removeItem('travelsense_transactionEntries');
    localStorage.removeItem('travelsense_recentDataShares');
    localStorage.removeItem('travelsense_partners');
    localStorage.removeItem('travelsense_uploadedDatasets');
    localStorage.removeItem('travelsense_activeCategories');
    localStorage.removeItem('travelsense_redeemedRewards');
    localStorage.removeItem('travelsense_voucherCodes');
    localStorage.removeItem('travelsense_uploaded_files');
    
    // Note: dashboardStats is now computed automatically from transactionEntries,
    // so it will automatically reset to zeros when entries are cleared
  };

  // Handle data export request
  const handleDataExport = () => {
  try {
    const exportObject = {
      profile: {
        name: userName,
        email: userEmail,
      },
      transactions: transactionEntries,
      activityLog,
      exportsAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `TravelSense_Full_Export_${new Date()
      .toISOString()
      .split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addActivityLog({
      action: "Full data export completed",
      partner: "User Action",
      dataType: "All Account Data",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    addActivityLog({
      action: "Full data export failed",
      partner: "System",
      dataType: "All Account Data",
      status: "warning",
    });
  }
};

  // Handle password change
  const handlePasswordChange = () => {
    addActivityLog({
      action: 'Password changed successfully',
      partner: 'User Action',
      dataType: 'Account Settings',
      status: 'success',
    });
  };

  // Handle new partner request notification
  const handleNewPartnerRequest = (partnerName: string) => {
    addNotification({
      type: "consent",
      title: "New Partner Request",
      message: `${partnerName} is requesting access to your data. Review and accept to earn rewards.`,
      read: false,
    });
  };

  if (currentState === "landing") {
    if (isAuthenticated) {
      return <LandingPage onGetStarted={handleNavigateToDashboard} onSignIn={handleNavigateToDashboard} onBusinessSignIn={handleBusinessSignIn} />;
    }
    return <LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} onBusinessSignIn={handleBusinessSignIn} />;
  }

  if (currentState === "auth") {
  return (
    <>
      <AuthPage
        onSignIn={handleAuthSuccess}
        onReturnToLanding={handleReturnToLanding}
      />
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}


  if (currentState === "business-auth") {
    return <BusinessAuthPage onSignIn={handleBusinessAuthSuccess} onReturnToLanding={handleReturnToLanding} />;
  }

  if (currentState === "business-dashboard") {
    return (
      <div className="min-h-screen bg-slate-900">
        <BusinessNavigation 
          onSignOut={handleBusinessSignOut}
          onNavigateToDashboard={handleBusinessNavigateToDashboard}
          onNavigateToReports={handleBusinessNavigateToReports}
          currentPage="dashboard"
        />
        <BusinessDashboardPage />
        <CustomToaster />
      </div>
    );
  }

  if (currentState === "business-reports") {
    return (
      <div className="min-h-screen bg-slate-900">
        <BusinessNavigation 
          onSignOut={handleBusinessSignOut}
          onNavigateToDashboard={handleBusinessNavigateToDashboard}
          onNavigateToReports={handleBusinessNavigateToReports}
          currentPage="reports"
        />
        <BusinessReportsPage />
        <CustomToaster />
      </div>
    );
  }

  if (currentState === "rewards-and-partners") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onLogoClick={handleReturnToLanding}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToUploadData={handleNavigateToUploadData}
          onSignOut={handleSignOut}
          userName={userName}
          userEmail={userEmail}
          userProfileImage={userProfileImage}
          currentPage="rewards-and-partners"
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onClearNotification={handleClearNotification}
          pushNotificationsEnabled={pushNotificationsEnabled}
          emailNotificationsEnabled={emailNotificationsEnabled}
          onTogglePushNotifications={handleTogglePushNotifications}
          onToggleEmailNotifications={handleToggleEmailNotifications}
          rewardNotificationsEnabled={rewardNotificationsEnabled}
          securityNotificationsEnabled={securityNotificationsEnabled}
          consentNotificationsEnabled={consentNotificationsEnabled}
          alertNotificationsEnabled={alertNotificationsEnabled}
          onToggleRewardNotifications={handleToggleRewardNotifications}
          onToggleSecurityNotifications={handleToggleSecurityNotifications}
          onToggleConsentNotifications={handleToggleConsentNotifications}
          onToggleAlertNotifications={handleToggleAlertNotifications}
        />
        <RewardsAndPartnersPage 
          onNavigateToUploadData={handleNavigateToUploadData}
          onDataShareAccepted={handleDataShareAccepted}
          highlightPartnerName={highlightedPartnerName}
          onNewPartnerRequest={handleNewPartnerRequest}
          initialTab={rewardsAndPartnersInitialTab}
          addActivityLog={addActivityLog} 
        />
        <ScrollToTopButton /> 
        <CustomToaster />
      </div>
    );
  }


  if (currentState === "profile") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onLogoClick={handleReturnToLanding}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToUploadData={handleNavigateToUploadData}
          onSignOut={handleSignOut}
          userName={userName}
          userEmail={userEmail}
          userProfileImage={userProfileImage}
          currentPage="profile"
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onClearNotification={handleClearNotification}
          pushNotificationsEnabled={pushNotificationsEnabled}
          emailNotificationsEnabled={emailNotificationsEnabled}
          onTogglePushNotifications={handleTogglePushNotifications}
          onToggleEmailNotifications={handleToggleEmailNotifications}
          rewardNotificationsEnabled={rewardNotificationsEnabled}
          securityNotificationsEnabled={securityNotificationsEnabled}
          consentNotificationsEnabled={consentNotificationsEnabled}
          alertNotificationsEnabled={alertNotificationsEnabled}
          onToggleRewardNotifications={handleToggleRewardNotifications}
          onToggleSecurityNotifications={handleToggleSecurityNotifications}
          onToggleConsentNotifications={handleToggleConsentNotifications}
          onToggleAlertNotifications={handleToggleAlertNotifications}
        />
        <ProfilePage 
          userName={userName}
          userEmail={userEmail}
          userProfileImage={userProfileImage}
          onUpdateProfile={handleProfileEdited}   // only logs real user edits
          onSyncProfile={handleProfileSynced} 
          onDeleteAllData={handleDeleteAllData}
          activityLog={activityLog}
          onDataExport={handleDataExport}
          onPasswordChange={handlePasswordChange}
          dataSharesCount={dashboardStats.dataSharesCount}
          totalEarned={dashboardStats.totalEarned}
        />
        <ScrollToTopButton /> 
        <CustomToaster />
      </div>
    );
  }

  if (currentState === "upload-data") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onLogoClick={handleReturnToLanding}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToUploadData={handleNavigateToUploadData}
          onSignOut={handleSignOut}
          userName={userName}
          userEmail={userEmail}
          userProfileImage={userProfileImage}
          currentPage="upload-data"
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onClearNotification={handleClearNotification}
          pushNotificationsEnabled={pushNotificationsEnabled}
          emailNotificationsEnabled={emailNotificationsEnabled}
          onTogglePushNotifications={handleTogglePushNotifications}
          onToggleEmailNotifications={handleToggleEmailNotifications}
          rewardNotificationsEnabled={rewardNotificationsEnabled}
          securityNotificationsEnabled={securityNotificationsEnabled}
          consentNotificationsEnabled={consentNotificationsEnabled}
          alertNotificationsEnabled={alertNotificationsEnabled}
          onToggleRewardNotifications={handleToggleRewardNotifications}
          onToggleSecurityNotifications={handleToggleSecurityNotifications}
          onToggleConsentNotifications={handleToggleConsentNotifications}
          onToggleAlertNotifications={handleToggleAlertNotifications}
        />
        <UploadDataPage />
        <ScrollToTopButton /> 
        <CustomToaster />
      </div>
    );
  }

  if (currentState === "privacy-settings") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onLogoClick={handleReturnToLanding}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToUploadData={handleNavigateToUploadData}
          onSignOut={handleSignOut}
          userName={userName}
          userEmail={userEmail}
          userProfileImage={userProfileImage}
          currentPage="dashboard"
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onClearNotification={handleClearNotification}
          pushNotificationsEnabled={pushNotificationsEnabled}
          emailNotificationsEnabled={emailNotificationsEnabled}
          onTogglePushNotifications={handleTogglePushNotifications}
          onToggleEmailNotifications={handleToggleEmailNotifications}
          rewardNotificationsEnabled={rewardNotificationsEnabled}
          securityNotificationsEnabled={securityNotificationsEnabled}
          consentNotificationsEnabled={consentNotificationsEnabled}
          alertNotificationsEnabled={alertNotificationsEnabled}
          onToggleRewardNotifications={handleToggleRewardNotifications}
          onToggleSecurityNotifications={handleToggleSecurityNotifications}
          onToggleConsentNotifications={handleToggleConsentNotifications}
          onToggleAlertNotifications={handleToggleAlertNotifications}
        />
        <PrivacySettingsPage />
        <CustomToaster />
      </div>
    );
  }

  if (currentState === "consent-management") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onLogoClick={handleReturnToLanding}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToUploadData={handleNavigateToUploadData}
          onSignOut={handleSignOut}
          userName={userName}
          userEmail={userEmail}
          userProfileImage={userProfileImage}
          currentPage="dashboard"
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onClearNotification={handleClearNotification}
          pushNotificationsEnabled={pushNotificationsEnabled}
          emailNotificationsEnabled={emailNotificationsEnabled}
          onTogglePushNotifications={handleTogglePushNotifications}
          onToggleEmailNotifications={handleToggleEmailNotifications}
          rewardNotificationsEnabled={rewardNotificationsEnabled}
          securityNotificationsEnabled={securityNotificationsEnabled}
          consentNotificationsEnabled={consentNotificationsEnabled}
          alertNotificationsEnabled={alertNotificationsEnabled}
          onToggleRewardNotifications={handleToggleRewardNotifications}
          onToggleSecurityNotifications={handleToggleSecurityNotifications}
          onToggleConsentNotifications={handleToggleConsentNotifications}
          onToggleAlertNotifications={handleToggleAlertNotifications}
        />
        <ConsentManagementPage />
        <CustomToaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        onLogoClick={handleReturnToLanding}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToUploadData={handleNavigateToUploadData}
        onSignOut={handleSignOut}
        userName={userName}
        userEmail={userEmail}
        userProfileImage={userProfileImage}
        currentPage="dashboard"
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearNotification={handleClearNotification}
        pushNotificationsEnabled={pushNotificationsEnabled}
        emailNotificationsEnabled={emailNotificationsEnabled}
        onTogglePushNotifications={handleTogglePushNotifications}
        onToggleEmailNotifications={handleToggleEmailNotifications}
        rewardNotificationsEnabled={rewardNotificationsEnabled}
        securityNotificationsEnabled={securityNotificationsEnabled}
        consentNotificationsEnabled={consentNotificationsEnabled}
        alertNotificationsEnabled={alertNotificationsEnabled}
        onToggleRewardNotifications={handleToggleRewardNotifications}
        onToggleSecurityNotifications={handleToggleSecurityNotifications}
        onToggleConsentNotifications={handleToggleConsentNotifications}
        onToggleAlertNotifications={handleToggleAlertNotifications}
      />
      
      {recentUpdate && (
        <UpdateNotificationBanner
          partnerName={recentUpdate.partnerName}
          reward={recentUpdate.reward}
          onDismiss={() => setRecentUpdate(null)}
        />
      )}
      <main className="container mx-auto px-6 py-8 space-y-8">
        <HeroPanel userName={userName} stats={dashboardStats} transactionEntries={transactionEntries} />
        <EntriesTable 
          entries={transactionEntries}
          highlightPartnerId={highlightedPartnerId}
          onNavigateToPartners={handleNavigateToRewardsAndPartners}
          onUpdateEntryStatus={handleUpdateEntryStatus}
        />
        {/* Security Information */}
        <SecurityInformation/>
        <ScrollToTopButton /> 
      </main>
      <CustomToaster />
    </div>
  );
}
