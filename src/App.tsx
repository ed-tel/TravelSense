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

import { SecurityInformation } from "./components/security-information";
import { ScrollToTopButton } from "./components/scroll-to-top-button";

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";

// Contact page
import { ContactPage } from "./components/contact-page";

// App states
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
  | "business-reports"
  | "contact";

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
  timestamp: number;
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

// Parse numeric value from strings like "$25.00"
const parseValue = (valueString: string): number => {
  const cleaned = valueString.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

export default function App() {
  // Firebase current user
  const {
    userName: firebaseName,
    userEmail: firebaseEmail,
    userProfileImage: firebaseProfile,
  } = useCurrentUser();

  // Local profile caches
  const [localName] = useState("");
  const [localEmail] = useState("");
  const [localProfileImage] = useState("");

  const [hasCustomProfileImage] = useState(() => {
    return localStorage.getItem("travelsense_hasCustomProfileImage") === "true";
  });

  // Resolved initial values
  const resolvedUserEmail = firebaseEmail || localEmail || "user@example.com";
  const resolvedUserName =
    firebaseName || localName || resolvedUserEmail.split("@")[0] || "User";
  const resolvedUserProfileImage =
    firebaseProfile ||
    localProfileImage ||
    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png?w=400&h=400&fit=crop&crop=face";

  // Main user states
  const [userName, setUserName] = useState(resolvedUserName);
  const [userEmail, setUserEmail] = useState(resolvedUserEmail);
  const [userProfileImage, setUserProfileImage] = useState(
    resolvedUserProfileImage
  );

  // Firestore
  const db = getFirestore();

  // Load profile image from Firestore after login
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

  // Sync with Firebase user
  useEffect(() => {
    if (firebaseName) setUserName(firebaseName);
    if (firebaseEmail) setUserEmail(firebaseEmail);

    setUserProfileImage((prev) => {
      if (hasCustomProfileImage) return prev;
      const isDefault =
        !prev || prev.includes("cdn.pixabay.com") || prev.startsWith("blob:");
      return isDefault && firebaseProfile ? firebaseProfile : prev;
    });
  }, [firebaseName, firebaseEmail, firebaseProfile, hasCustomProfileImage]);

  // Persist profile to localStorage
  useEffect(() => {
    localStorage.setItem("travelsense_userName", userName);
    localStorage.setItem("travelsense_userEmail", userEmail);
    localStorage.setItem("travelsense_userProfileImage", userProfileImage);
  }, [userName, userEmail, userProfileImage]);

  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBusinessAuthenticated, setIsBusinessAuthenticated] =
    useState(false);
  const [highlightedPartnerId, setHighlightedPartnerId] = useState<
    string | undefined
  >(undefined);
  const [highlightedPartnerName, setHighlightedPartnerName] = useState<
    string | undefined
  >(undefined);
  const [rewardsAndPartnersInitialTab, setRewardsAndPartnersInitialTab] =
    useState<"upload" | "partners" | "rewards">("upload");

  // Hash-based navigation (#/contact)
  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash === "contact") setCurrentState("contact");
      else if (hash === "" || hash === "landing") setCurrentState("landing");
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, []);

  // Notification preferences
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("travelsense_pushNotifications");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("travelsense_emailNotifications");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [rewardNotificationsEnabled, setRewardNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("travelsense_rewardNotifications");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [securityNotificationsEnabled, setSecurityNotificationsEnabled] =
    useState(() => {
      const saved = localStorage.getItem("travelsense_securityNotifications");
      return saved !== null ? JSON.parse(saved) : true;
    });
  const [consentNotificationsEnabled, setConsentNotificationsEnabled] =
    useState(() => {
      const saved = localStorage.getItem("travelsense_consentNotifications");
      return saved !== null ? JSON.parse(saved) : true;
    });
  const [alertNotificationsEnabled, setAlertNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("travelsense_alertNotifications");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("travelsense_notifications");
    if (!saved) return [];
    try {
      const parsed: Notification[] = JSON.parse(saved);
      const seenIds = new Set<string>();
      return parsed.map((notif) => {
        let uniqueId = notif.id;
        if (
          seenIds.has(uniqueId) ||
          !uniqueId.includes("-", uniqueId.indexOf("-") + 1)
        ) {
          uniqueId = `notif-${notif.timestamp || Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        }
        seenIds.add(uniqueId);
        return { ...notif, id: uniqueId };
      });
    } catch {
      return [];
    }
  });

  const [recentUpdate, setRecentUpdate] = useState<{
    partnerName: string;
    reward: string;
    timestamp: number;
  } | null>(null);

  const [recentDataShares, setRecentDataShares] = useState<DataShare[]>(() => {
    const saved = localStorage.getItem("travelsense_recentDataShares");
    return saved ? JSON.parse(saved) : [];
  });

  const [transactionEntries, setTransactionEntries] = useState<
    TransactionEntry[]
  >(() => {
    const saved = localStorage.getItem("travelsense_transactionEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(() => {
    const saved = localStorage.getItem("travelsense_activityLog");
    if (saved) return JSON.parse(saved);
    const now = Date.now();
    return [
      {
        id: `activity-${now}`,
        action: "Last login",
        partner: "User Action",
        timestamp: now,
        formattedTimestamp: new Date(now).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        dataType: "Account Access",
        status: "success",
      },
    ];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(
      "travelsense_transactionEntries",
      JSON.stringify(transactionEntries)
    );
  }, [transactionEntries]);

  useEffect(() => {
    localStorage.setItem("travelsense_activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_recentDataShares",
      JSON.stringify(recentDataShares)
    );
  }, [recentDataShares]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_pushNotifications",
      JSON.stringify(pushNotificationsEnabled)
    );
  }, [pushNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_emailNotifications",
      JSON.stringify(emailNotificationsEnabled)
    );
  }, [emailNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_rewardNotifications",
      JSON.stringify(rewardNotificationsEnabled)
    );
  }, [rewardNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_securityNotifications",
      JSON.stringify(securityNotificationsEnabled)
    );
  }, [securityNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_consentNotifications",
      JSON.stringify(consentNotificationsEnabled)
    );
  }, [consentNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "travelsense_alertNotifications",
      JSON.stringify(alertNotificationsEnabled)
    );
  }, [alertNotificationsEnabled]);

  // Daily check for expiring rewards
  useEffect(() => {
    if (!alertNotificationsEnabled) return;

    const checkExpiringRewards = () => {
      const now = new Date();
      const in30 = new Date();
      in30.setDate(in30.getDate() + 30);

      transactionEntries.forEach((entry) => {
        if (entry.status !== "Active") return;
        const expiry = new Date(entry.expiryDate);
        if (expiry > now && expiry <= in30) {
          const days = Math.ceil(
            (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          const hasExisting = notifications.some(
            (n) =>
              n.type === "alert" &&
              n.message.includes(entry.partner) &&
              n.message.includes("expiring")
          );
          if (!hasExisting) {
            addNotification({
              type: "alert",
              title: "Reward Expiring Soon",
              message: `Your reward from ${entry.partner} (${entry.reward}) will expire in ${days} day${
                days > 1 ? "s" : ""
              }. Consider using it before ${expiry.toLocaleDateString()}.`,
              read: false,
            });
          }
        }
      });
    };

    checkExpiringRewards();
    const interval = setInterval(checkExpiringRewards, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [transactionEntries, alertNotificationsEnabled, notifications]);

  // Dashboard KPIs
  const dashboardStats = useMemo<DashboardStats>(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const activeEntries = transactionEntries.filter(
      (e) => e.status === "Active"
    );

    const totalEarned = transactionEntries
      .filter((e) => e.status === "Active")
      .reduce((sum, e) => sum + parseValue(e.value), 0);

    const dataSharesCount = transactionEntries.length;

    const uniqueDataTypes = new Set<string>();
    activeEntries.forEach((e) =>
      e.dataType
        .split(",")
        .map((t) => t.trim())
        .forEach((t) => t && uniqueDataTypes.add(t))
    );
    const activePermissions = uniqueDataTypes.size;

    const monthlyEntries = transactionEntries.filter(
      (e) => e.timestamp >= monthStart
    );
    const monthlyDataShares = monthlyEntries.length;
    const monthlyRewards = monthlyEntries
      .filter((e) => e.status === "Active")
      .reduce((sum, e) => sum + parseValue(e.value), 0);

    const activePartners = new Set(
      transactionEntries
        .filter((e) => e.status === "Active")
        .map((e) => e.partner)
    );

    return {
      totalEarned: Math.round(totalEarned),
      dataSharesCount,
      activePermissions,
      monthlyDataShares,
      monthlyRewards: Math.round(monthlyRewards),
      activePartnerships: activePartners.size,
    };
  }, [transactionEntries]);

  // Navigation helpers
  const handleGetStarted = () => setCurrentState("auth");
  const handleSignIn = () => setCurrentState("auth");

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentState("dashboard");

    addActivityLog({
      action: "Successful login",
      partner: "User Action",
      dataType: "Account Access",
      status: "success",
    });

    if (transactionEntries.length === 0) {
      addNotification({
        type: "security",
        title: `Welcome to TravelSense, ${userName}!`,
        message:
          "Your data is secure and you're in control. Start exploring partner rewards and manage your privacy settings.",
        read: false,
      });
    } else {
      addNotification({
        type: "security",
        title: `Welcome back, ${resolvedUserName}!`,
        message: `You have ${
          transactionEntries.filter((e) => e.status === "Active").length
        } active data shares.`,
        read: false,
      });
    }
  };

  const handleBusinessSignIn = () => setCurrentState("business-auth");
  const handleBusinessAuthSuccess = () => {
    setIsBusinessAuthenticated(true);
    setCurrentState("business-dashboard");
  };
  const handleBusinessSignOut = () => {
    setIsBusinessAuthenticated(false);
    setCurrentState("landing");
  };
  const handleBusinessNavigateToDashboard = () =>
    setCurrentState("business-dashboard");
  const handleBusinessNavigateToReports = () =>
    setCurrentState("business-reports");

  const handleReturnToLanding = () => {
    setCurrentState("landing");
    if (window.location.hash) window.location.hash = "/";
  };
  const handleNavigateToDashboard = () => setCurrentState("dashboard");

  const handleNavigateToRewardsAndPartners = (
    partnerName?: string,
    tab?: "upload" | "partners" | "rewards"
  ) => {
    if (partnerName) {
      setHighlightedPartnerName(partnerName);
      setTimeout(() => setHighlightedPartnerName(undefined), 100);
    }
    if (tab) setRewardsAndPartnersInitialTab(tab);
    setCurrentState("rewards-and-partners");
  };

  const handleNavigateToProfile = () => setCurrentState("profile");
  const handleNavigateToUploadData = () => setCurrentState("rewards-and-partners");
  const handleNavigateToPrivacySettings = () => setCurrentState("privacy-settings");
  const handleNavigateToConsentManagement = () => setCurrentState("consent-management");
  const handleNavigateToContact = () => {
    setCurrentState("contact");
    window.location.hash = "/contact";
  };

  const handleAlertClick = (partnerId: string) => {
    setHighlightedPartnerId(partnerId);
    setCurrentState("dashboard");
    setTimeout(() => setHighlightedPartnerId(undefined), 3000);
  };

  // Profile handlers
  const handleProfileEdited = (name: string, email: string, profileImage: string) => {
    setUserName(name);
    setUserEmail(email);
    setUserProfileImage(profileImage);

    addActivityLog({
      action: "Profile information updated",
      partner: "User Action",
      dataType: "Account Settings",
      status: "success",
    });
  };

  const handleProfileSynced = (name: string, email: string, profileImage: string) => {
    setUserName(name);
    setUserEmail(email);
    setUserProfileImage(profileImage);
  };

  const handleSignOut = () => {
    addActivityLog({
      action: "User signed out",
      partner: "User Action",
      dataType: "Account Access",
      status: "info",
    });
    setIsAuthenticated(false);
    setCurrentState("landing");
  };


// 1) Create a reusable input type
type ActivityLogInput = Omit<ActivityLogEntry, "id" | "timestamp" | "formattedTimestamp">;

// 2) Use it in both places
const addActivityLog = async (entry: ActivityLogInput) => {
  const now = Date.now();
  const newEntry: ActivityLogEntry = {
    ...entry,
    id: `activity-${now}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: now,
    formattedTimestamp: new Date(now).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };

  setActivityLog((prev) => [newEntry, ...prev].slice(0, 50));

  if (auth.currentUser) {
    await saveLogToFirestore(auth.currentUser.uid, entry); // entry has no timestamp
  }
};

const saveLogToFirestore = async (userId: string, entry: ActivityLogInput) => {
  try {
    const logsRef = collection(db, "users", userId, "activityLogs");
    await addDoc(logsRef, {
      action: entry.action,
      partner: entry.partner,
      dataType: entry.dataType,
      status: entry.status,
      // Store server time in Firestore:
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error saving activity log:", err);
  }
};

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePushNotifications = (enabled: boolean) =>
    setPushNotificationsEnabled(enabled);
  const handleToggleEmailNotifications = (enabled: boolean) =>
    setEmailNotificationsEnabled(enabled);
  const handleToggleRewardNotifications = (enabled: boolean) =>
    setRewardNotificationsEnabled(enabled);
  const handleToggleSecurityNotifications = (enabled: boolean) =>
    setSecurityNotificationsEnabled(enabled);
  const handleToggleConsentNotifications = (enabled: boolean) =>
    setConsentNotificationsEnabled(enabled);
  const handleToggleAlertNotifications = (enabled: boolean) =>
    setAlertNotificationsEnabled(enabled);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const isTypeEnabled = () => {
      switch (notification.type) {
        case "reward":
          return rewardNotificationsEnabled;
        case "security":
          return securityNotificationsEnabled;
        case "consent":
          return consentNotificationsEnabled;
        case "alert":
          return alertNotificationsEnabled;
        default:
          return true;
      }
    };
    if (!isTypeEnabled()) return;

    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Reward value extraction heuristic
  const extractRewardValue = (reward: string): number => {
    const dollarMatch = reward.match(/\$(\d+)/);
    if (dollarMatch) return parseInt(dollarMatch[1]);

    const percentMatch = reward.match(/(\d+)%/);
    if (percentMatch) return parseInt(percentMatch[1]);

    const airpointsMatch = reward.match(/(\d+)\s*Airpoints/i);
    if (airpointsMatch) return parseInt(airpointsMatch[1]) * 0.5;

    return 10;
  };

  // Generate next transaction ID
  const generateNextTransactionId = () => {
    const existingIds = transactionEntries.map((entry) => {
      const match = entry.id.match(/DS-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxId = Math.max(...existingIds, 0);
    const nextId = maxId + 1;
    return `DS-${String(nextId).padStart(3, "0")}`;
  };

  // When user accepts a partner's data-share
  const handleDataShareAccepted = (
    partnerName: string,
    reward: string,
    _dataTypesCount: number,
    dataTypes: string[]
  ) => {
    const rewardValue = extractRewardValue(reward);
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const expiryDate = new Date(now);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
    const newTransactionId = generateNextTransactionId();

    const dataTypeString = dataTypes.join(", ");

    const newShare: DataShare = {
      id: Date.now(),
      partner: partnerName,
      dataType: dataTypeString,
      status: "Active",
      progress: 60,
      shareDate: formattedDate,
      reward,
      value: `${rewardValue.toFixed(2)}`,
      timestamp: now.getTime(),
    };

    const newTransaction: TransactionEntry = {
      id: newTransactionId,
      partner: partnerName,
      dataType: dataTypeString,
      status: "Active",
      consentDate: formattedDate,
      expiryDate: formattedExpiryDate,
      reward,
      value: `${rewardValue.toFixed(2)}`,
      timestamp: now.getTime(),
    };

    setRecentDataShares((prev) => [newShare, ...prev].slice(0, 3));
    setTransactionEntries((prev) => [newTransaction, ...prev]);

    setRecentUpdate({ partnerName, reward, timestamp: Date.now() });
    setTimeout(() => setRecentUpdate(null), 5000);

    setTimeout(() => {
      setRecentDataShares((prev) =>
        prev.map((s) => (s.id === newShare.id ? { ...s, progress: 100 } : s))
      );
    }, 500);

    addNotification({
      type: "reward",
      title: "New Data Share Active!",
      message: `You've successfully shared data with ${partnerName} and earned ${reward}.`,
      read: false,
    });

    addActivityLog({
      action: `Data shared with ${partnerName}`,
      partner: partnerName,
      dataType: dataTypeString,
      status: "success",
    });
  };

  // Update a transaction entry's status
  const handleUpdateEntryStatus = (
    entryId: string,
    newStatus: "Active" | "Expired"
  ) => {
    setTransactionEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, status: newStatus } : e))
    );

    const entry = transactionEntries.find((e) => e.id === entryId);
    if (entry) {
      setRecentDataShares((prev) =>
        prev.map((s) =>
          s.partner === entry.partner ? { ...s, status: newStatus } : s
        )
      );
    }
  };

  // Clear all local data and firebase
  const handleDeleteAllData = async () => {
    try {
      localStorage.clear();

      addActivityLog({
        action: "All shared data deleted",
        partner: "User Action",
        dataType: "All Categories",
        status: "warning",
      });

      if (auth.currentUser) {
        const logsRef = collection(db, "users", auth.currentUser.uid, "activityLogs");
        const snapshot = await getDocs(logsRef);
        const deletions = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletions);
        console.log("✅ All audit logs deleted from Firestore.");
      }

      setTransactionEntries([]);
      setRecentDataShares([]);
      setRecentUpdate(null);

      localStorage.removeItem("travelsense_transactionEntries");
      localStorage.removeItem("travelsense_recentDataShares");
      localStorage.removeItem("travelsense_partners");
      localStorage.removeItem("travelsense_uploadedDatasets");
      localStorage.removeItem("travelsense_activeCategories");
      localStorage.removeItem("travelsense_redeemedRewards");
      localStorage.removeItem("travelsense_voucherCodes");
      localStorage.removeItem("travelsense_uploaded_files");
    } catch (err) {
      console.error("❌ Error deleting local or Firestore data:", err);
    }
  };

  // Export all data as JSON
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

  const handlePasswordChange = () => {
    addActivityLog({
      action: "Password changed successfully",
      partner: "User Action",
      dataType: "Account Settings",
      status: "success",
    });
  };

  const handleNewPartnerRequest = (partnerName: string) => {
    addNotification({
      type: "consent",
      title: "New Partner Request",
      message: `${partnerName} is requesting access to your data. Review and accept to earn rewards.`,
      read: false,
    });
  };

  // Render branches
  if (currentState === "landing") {
    if (isAuthenticated) {
      return (
        <>
          <LandingPage
            onGetStarted={handleNavigateToDashboard}
            onSignIn={handleNavigateToDashboard}
            onBusinessSignIn={handleBusinessSignIn}
            onNavigateToContact={handleNavigateToContact}
          />
        </>
      );
    }
    return (
      <>
        <LandingPage
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
          onBusinessSignIn={handleBusinessSignIn}
          onNavigateToContact={handleNavigateToContact}
        />
      </>
    );
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
    return (
      <BusinessAuthPage
        onSignIn={handleBusinessAuthSuccess}
        onReturnToLanding={handleReturnToLanding}
      />
    );
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

  if (currentState === "contact") {
    return (
      <>
        <ContactPage onReturnToLanding={handleReturnToLanding} />
        <CustomToaster />
      </>
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
          onNavigateToContact={handleNavigateToContact}
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
          onNavigateToContact={handleNavigateToContact}
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
          onUpdateProfile={handleProfileEdited}
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
          onNavigateToContact={handleNavigateToContact}
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
          onNavigateToContact={handleNavigateToContact}
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
          onNavigateToContact={handleNavigateToContact}
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

  // Default: dashboard
  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onLogoClick={handleReturnToLanding}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToRewardsAndPartners={handleNavigateToRewardsAndPartners}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToUploadData={handleNavigateToUploadData}
        onNavigateToContact={handleNavigateToContact}
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
        <HeroPanel
          userName={userName}
          stats={dashboardStats}
          transactionEntries={transactionEntries}
        />
        <EntriesTable
          entries={transactionEntries}
          highlightPartnerId={highlightedPartnerId}
          onNavigateToPartners={handleNavigateToRewardsAndPartners}
          onUpdateEntryStatus={handleUpdateEntryStatus}
        />
        <SecurityInformation />
        <ScrollToTopButton />
      </main>
      <CustomToaster />
    </div>
  );
}
