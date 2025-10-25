import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Camera,
  Save,
  X,
  AlertTriangle,
  Shield,
  Lock,
  Key,
  Trash2,
  Eye,
  Activity,
  CheckCircle,
  EyeOff,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import {
  getAuth,
  updateProfile,
  onAuthStateChanged,
  multiFactor,
  PhoneMultiFactorGenerator,
  PhoneAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebaseConfig";
import { SecurityInformation } from "./security-information";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, sendPasswordResetEmail, } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, updateDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { auth } from "../firebaseConfig";
import { RecaptchaVerifier } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const storage = getStorage();

export interface ActivityLogEntry {
  id: string;
  action: string;
  partner: string;
  timestamp: number;
  formattedTimestamp: string;
  dataType: string;
  status: "success" | "warning" | "info";
}

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
  onUpdateProfile?: (
    name: string,
    email: string,
    profileImage: string,
  ) => void;
  onSyncProfile?: (name: string, email: string, profileImage: string) => void; // ✅ new
  onDeleteAllData?: () => void;
  activityLog?: ActivityLogEntry[];
  onDataExport?: () => void;
  onPasswordChange?: () => void;
  dataSharesCount?: number;
  totalEarned?: number;
}


interface DeletionResponse {
  success: boolean;
  error?: string;
}


export function ProfilePage({ userName: propName, userEmail: propEmail, userProfileImage: propProfile, onUpdateProfile, onDeleteAllData,
  activityLog = [],
  onDataExport,
  onPasswordChange,
  dataSharesCount = 0,
  totalEarned = 0,
  onSyncProfile, // ✅ added
}: ProfilePageProps) {
  const [name, setName] = useState(propName || "User Name");
  const [email, setEmail] = useState(propEmail || "user@example.com");
  const [profileImage, setProfileImage] = useState(propProfile || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png?w=400&h=400&fit=crop&crop=face");
  const [tempName, setTempName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [memberSince, setMemberSince] = useState<string>("—");
  const [lastLogin, setLastLogin] = useState<string>("—");
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
  old?: string;
  new?: string;
  confirm?: string;
}>({});
const [isEmailProvider, setIsEmailProvider] = useState(false);
const activitySectionRef = useRef<HTMLDivElement>(null);
const [visibleLogs, setVisibleLogs] = useState(5);
const [phoneNumber, setPhoneNumber] = useState("+64"); // ✅ Default NZ prefix
const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);
const [showPhoneInput, setShowPhoneInput] = useState(false);
const [verificationCode, setVerificationCode] = useState("");
const [verificationId, setVerificationId] = useState<string | null>(null);
const [isCodeSent, setIsCodeSent] = useState(false);



const checkMfaStatus = () => {
  const user = auth.currentUser;
  if (!user) return false;
  return multiFactor(user).enrolledFactors.length > 0;
};

useEffect(() => {
  const initializeRecaptcha = () => {
    if (!auth?.app || !auth.currentUser) {
      console.warn("⏳ Auth not ready yet, waiting...");
      setTimeout(initializeRecaptcha, 1000);
      return;
    }

    const container = document.getElementById("recaptcha-container");
    if (!container) {
      console.warn("⏳ reCAPTCHA container not yet in DOM, waiting...");
      setTimeout(initializeRecaptcha, 500);
      return;
    }

    if (!window.recaptchaVerifier) {
      // 👇 REPLACE the existing try/catch block here
      try {
        console.log("✅ Auth ready, initializing reCAPTCHA…");

        // ✅ FIXED: Correct runtime argument order for Firebase 12.x
        const verifier = new (RecaptchaVerifier as any)(
          auth, // ✅ Auth instance first
          "recaptcha-container", // ✅ then the container ID
          { size: "invisible" }  // ✅ config last
        );

        window.recaptchaVerifier = verifier;
        console.log("🎉 reCAPTCHA successfully initialized");
      } catch (err) {
        console.error("❌ reCAPTCHA init error:", err);
      }
    } else {
      console.log("⚠️ reCAPTCHA already initialized");
    }
  };

  initializeRecaptcha();
}, []);

useEffect(() => {
  setMfaEnabled(checkMfaStatus());
}, []);

useEffect(() => {
  if (auth.currentUser) {
    const hasEmailProvider = auth.currentUser.providerData.some(
      (p) => p.providerId === "password"
    );
    setIsEmailProvider(hasEmailProvider);
  }
}, [auth.currentUser]);

useEffect(() => {
  if (propName) setName(propName);
  if (propEmail) setEmail(propEmail);
  if (propProfile) setProfileImage(propProfile);
}, [propName, propEmail, propProfile]);

  // Sync Firebase if props not provided
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const hasEmailProvider = user.providerData.some(
        (p) => p.providerId === "password"
      );
      setIsEmailProvider(hasEmailProvider);

      const userEmail = user.email || email;
      const displayName =
        user.displayName || (userEmail ? userEmail.split("@")[0] : "John Doe");

      // 🔹 Get any Firestore-saved profile image FIRST
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const docSnap = await import("firebase/firestore").then(({ getDoc }) => getDoc(docRef));

      const firestoreImage = docSnap.exists() ? docSnap.data().profileImage : null;

      // 🔹 Determine the final profile image priority
      const photoURL =
        firestoreImage ||                 // ✅ use uploaded Firestore image first
        user.photoURL ||                  // fallback: provider image
        profileImage ||                   // local fallback
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png?w=400&h=400&fit=crop&crop=face";

      // Only update local state if not already showing same image
      setName(displayName);
      setEmail(userEmail);
      setProfileImage(photoURL);
      setTempName(displayName);

      // Member since
      if (user.metadata?.creationTime) {
        const creationDate = new Date(user.metadata.creationTime);
        setMemberSince(
          creationDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      }

      // Last login
      if (user.metadata?.lastSignInTime) {
        const lastLoginDate = new Date(user.metadata.lastSignInTime);
        setLastLogin(
          lastLoginDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      }

      // 🔹 Sync to parent (App.tsx)
      onSyncProfile?.(displayName, userEmail, photoURL);
    }
  });

  return () => unsubscribe();
}, []);


  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setTempName(name);
    setIsEditing(false);
  };


  const handleSaveName = async () => {
  if (!auth.currentUser) return;
  try {
    await updateProfile(auth.currentUser, { 
      displayName: tempName, 
      photoURL: profileImage 
    });
    setName(tempName);
    setIsEditing(false);
    onUpdateProfile?.(tempName, email, profileImage);
    toast.success("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile.");
  }
};


const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !auth.currentUser) return;

  const uid = auth.currentUser.uid;
  const fileRef = ref(storage, `profileImages/${uid}`);

  try {
    console.log("Uploading file to storage path:", `profileImages/${uid}`);
    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);
    console.log("Uploaded file URL:", downloadURL);

    // 3️⃣ Update Firebase Auth profile photo (so navbar and next login match)
    await updateProfile(auth.currentUser, { photoURL: downloadURL });

    // ✅ Update Firestore user profile
    const db = getFirestore();
    await setDoc(doc(db, "users", uid), { profileImage: downloadURL }, { merge: true });

    // ✅ Immediately update the local state and parent (navbar)
    setProfileImage(downloadURL); // updates the profile page preview
    onUpdateProfile?.(name, email, downloadURL); // ✅ use `name` and `email` from useState

    toast.success("Profile image updated!");
  } catch (error) {
    console.error("❌ Error uploading or saving profile image:", error);
    toast.error("Failed to upload profile image. Please try again.");
  }
};

const handleToggleMfa = async (enabled: boolean) => {
  const user = auth.currentUser;

  if (!isEmailProvider) {
    toast.info("MFA is available only for email/password accounts.");
    return;
  }

  if (!user) {
    toast.error("No authenticated user found.");
    return;
  }

  if (!enabled) {
    // Disable MFA
    try {
      const enrolledFactors = multiFactor(user).enrolledFactors;
      for (const factor of enrolledFactors) {
        await multiFactor(user).unenroll(factor.uid);
      }
      toast.success("MFA disabled successfully.");
      setMfaEnabled(false);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to disable MFA.");
    }
    return;
  }

  // Enable MFA
  try {
    const phoneProvider = new PhoneAuthProvider(auth);
    if (!phoneNumber || phoneNumber.length < 8) {
  toast.error("Please enter a valid phone number.");
  return;
}


    const recaptchaVerifier = window.recaptchaVerifier;
    const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
    const code = prompt("Enter the verification code sent to your phone:");
    if (!code) return;

    const credential = PhoneAuthProvider.credential(verificationId, code);
    const assertion = PhoneMultiFactorGenerator.assertion(credential);

    await multiFactor(user).enroll(assertion, "Primary phone");
    toast.success("MFA enabled successfully!");
    setMfaEnabled(true);
  } catch (error: any) {
    console.error("MFA enable error:", error);
    toast.error(error.message || "Failed to enable MFA.");
  }
};

// ✅ Handles deleting all shared data (used by "Delete Data" dialog)
const handleDeleteAllData = () => {
  if (onDeleteAllData) {
    onDeleteAllData();
   // ✅ Clear local storage and reset states (local only)
    localStorage.clear();

    // ✅ Success feedback
    toast.success("All account data deleted successfully.", {
      description: "All shared data has been permanently deleted from partner systems.",
    });
  }
};
 
 const handleDeleteAccount = async () => {
  if (!auth.currentUser) return;

  const userName = auth.currentUser.displayName || "Unknown";
  const userEmail = auth.currentUser.email || "unknown@example.com";
  const userId = auth.currentUser.uid;


  try {
    const sendDeletionRequestFn = httpsCallable(functions, "sendDeletionRequest");
    const result = await sendDeletionRequestFn({ userName, userEmail, userId });


    const data = result.data as { success: boolean; error?: string };


    if (data.success) {
      toast.success("Account deletion request submitted. You will receive a confirmation email.");
    } else {
      toast.error(`Failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong while sending deletion request.");
  }
};


const handleChangePassword = async () => {
  const user = auth.currentUser;
  setFieldErrors({});

  if (!user?.email) {
    setFieldErrors({ old: "No authenticated email user found." });
    return;
  }

  if (!oldPassword) {
    setFieldErrors({ old: "Please enter your current password." });
    return;
  }

  if (newPassword.length < 6) {
    setFieldErrors({ new: "Password must be at least 6 characters long." });
    return;
  }

  if (newPassword !== confirmPassword) {
    setFieldErrors({ confirm: "Passwords do not match." });
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    // ✅ Trigger log in App.tsx
    onPasswordChange?.();
    toast.success("Password updated successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  } catch (error: any) {
    console.error("Password change error:", error);

    const errorCode = error.code || "";

    if (
      errorCode === "auth/wrong-password" ||
      errorCode === "auth/invalid-credential" ||
      errorCode === "auth/missing-password"
    ) {
      setFieldErrors({ old: "Incorrect current password." });
    } else if (errorCode === "auth/weak-password") {
      setFieldErrors({
        new: "Password too weak. Try adding numbers or symbols.",
      });
    } else if (errorCode === "auth/requires-recent-login") {
      toast.error("Please re-login before changing your password.");
    } else {
      toast.error("Unexpected error. Please try again later.");
    }
  }
};





const getInitials = (name: string) =>
  name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return (
          <CheckCircle className="w-4 h-4 text-green-600" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        );
      case "info":
        return <Activity className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Success
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Warning
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Info
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <main className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1>Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and security settings
          </p>
        </div>


        {/* Tabs for different sections */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Security
            </TabsTrigger>
          </TabsList>


          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">


        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details and manage your public
              information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback>
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-lg">{name}</h3>
                <p className="text-muted-foreground">{email}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click the camera icon to update your profile
                  picture
                </p>
              </div>
            </div>


            <Separator />


            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="name"
                    value={isEditing ? tempName : name}
                    onChange={(e) =>
                      setTempName(e.target.value)
                    }
                    disabled={!isEditing}
                    className="pl-10 bg-input-background border-border/50"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email} // <- use `email` directly
                    disabled={true} // always read-only
                    className="pl-10 bg-input-background border-border/50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                {!isEditing ? (
                  <Button
                    onClick={handleEditClick}
                    className="bg-primary text-primary-foreground"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveName}
                      className="bg-primary text-primary-foreground"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              View your account status and membership details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Member Since
                </p>
                <p>{memberSince}</p>
              </div>
              {/* 
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p>{lastLogin}</p>
              </div> 
              */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Account Status
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p>Active</p>
                </div>
              </div>
              <div className="space-y-1">
  <p className="text-sm text-muted-foreground">Sign-In Method</p>
  <p>
    {auth.currentUser?.providerData
      .map((p) => p.providerId.replace(".com", "").toUpperCase())
      .join(", ")}
  </p>
</div>

              <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Data Shares
                    </p>
                    <p>{dataSharesCount} {dataSharesCount === 1 ? 'partner' : 'partners'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total Rewards
                    </p>
                    <p>${totalEarned.toLocaleString()}</p>
                  </div>
                </div>
          </CardContent>
        </Card>


        {/* Privacy Notice Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <h4 className="text-blue-900">
                  Your Privacy Matters
                </h4>
                <p className="text-sm text-blue-800">
                  Your profile information is only used to
                  personalize your TravelSense experience. We
                  never share your personal details with third
                  parties without your explicit consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Danger Zone Card */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that will permanently affect
              your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="space-y-1">
                <h4 className="text-destructive">
                  Delete Account
                </h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all
                  associated data. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="ml-4"
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <span>Are you absolutely sure?</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        This action cannot be undone. This will
                        permanently delete your account and
                        remove all your data from our servers.
                      </p>
                      <p className="text-destructive">
                        You will lose:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          All your accumulated rewards points
                        </li>
                        <li>
                          Your data sharing preferences and
                          history
                        </li>
                        <li>
                          Access to all partner discounts and
                          benefits
                        </li>
                        <li>
                          Your profile and account settings
                        </li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Delete My Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
          </TabsContent>


          {/* Privacy & Security Tab */}
          <TabsContent
            value="security"
            className="space-y-6 mt-6"
          >
            {/* Security Settings */}
            <div className="space-y-4">
              <h3>Security Settings</h3>

              <div className="grid gap-4">
                {/* Multi-Factor Authentication */}
<Card className="hover:shadow-md transition-shadow">
  <CardContent className="p-6 space-y-4">
    {/* Header Row */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Lock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4>Multi-Factor Authentication</h4>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account with SMS MFA
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Label htmlFor="mfa-toggle" className="text-sm">
          {mfaEnabled ? "Enabled" : "Disabled"}
        </Label>
        <Switch
          id="mfa-toggle"
          checked={mfaEnabled}
          onCheckedChange={(checked) => {
            if (checked) {
              // User is turning MFA on → show input
              setShowPhoneInput(true);
            } else {
              // User turning MFA off → disable MFA directly
              handleToggleMfa(false);
            }
          }}
        />
      </div>
    </div>

    {/* ✅ Inline phone number input - show only when user enabling MFA */}
    {showPhoneInput && !mfaEnabled && (
  <div className="flex flex-col space-y-3 mt-3 animate-fadeIn">
    <Label htmlFor="phone">Phone Number</Label>

    {/* Phone Input */}
    <PhoneInput
      country="nz"
      value={phoneNumber}
      onChange={(val) => setPhoneNumber("+" + val)}
      inputStyle={{
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #ccc",
        height: "40px",
        fontSize: "14px",
      }}
      containerStyle={{ width: "100%" }}
    />

    {/* ✅ Step 1: Send SMS */}
    {!isCodeSent && (
      <div className="flex space-x-2 mt-2">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={async () => {
            try {
              const recaptchaVerifier = window.recaptchaVerifier;
              if (!recaptchaVerifier) {
                toast.error("reCAPTCHA not ready. Please reload the page.");
                return;
              }

              if (!phoneNumber || phoneNumber.trim().length < 8) {
                toast.error("Please enter a valid phone number.");
                return;
              }

              console.log("📱 Sending SMS to:", phoneNumber);

              const phoneProvider = new PhoneAuthProvider(auth);
              const id = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);

              setVerificationId(id);
              setIsCodeSent(true);
              toast.success("Verification code sent! Check your SMS.");
            } catch (err: any) {
              console.error("❌ SMS send error:", err);
              toast.error(err.message || "Failed to send SMS.");
            }
          }}
        >
          Send Code
        </Button>

        <Button variant="outline" onClick={() => setShowPhoneInput(false)}>
          Cancel
        </Button>
      </div>
    )}

    {/* ✅ Step 2: Code input + Verify button */}
    {isCodeSent && (
      <div className="flex flex-col space-y-2">
        <Label htmlFor="verificationCode">Enter 6-digit Code</Label>
        <div className="flex space-x-2">
          <Input
            id="verificationCode"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="text-center tracking-widest font-mono"
            maxLength={6}
          />
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={async () => {
              try {
                if (!verificationId) {
                  toast.error("Missing verification ID. Try sending the code again.");
                  return;
                }

                if (verificationCode.trim().length !== 6) {
                  toast.error("Please enter a valid 6-digit code.");
                  return;
                }

                const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                const assertion = PhoneMultiFactorGenerator.assertion(credential);

                await multiFactor(auth.currentUser!).enroll(assertion, "Primary phone");

                toast.success("✅ MFA enabled successfully!");
                setMfaEnabled(true);
                setShowPhoneInput(false);
                setIsCodeSent(false);
                setVerificationCode("");
              } catch (err: any) {
                console.error("❌ Code verification error:", err);
                toast.error(err.message || "Invalid or expired code.");
              }
            }}
          >
            Verify Code
          </Button>
        </div>
      </div>
    )}
  </div>
)}
    {/* ✅ reCAPTCHA container */}
    <div id="recaptcha-container"></div>

    {/* ✅ Status message after enabled */}
    {mfaEnabled && (
      <div className="mt-4 text-xs text-green-700 bg-green-50 rounded-md p-2">
        ✓ Your account is protected with SMS-based two-factor authentication
      </div>
    )}
  </CardContent>
</Card>


                {/* Change Password */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Key className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4>Password</h4>
                          <p className="text-sm text-muted-foreground">
                            Secure your account with a new password
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setIsChangingPassword((prev) => !prev)}
                      >
                        {isChangingPassword ? "Cancel" : "Change Password"}
                      </Button>

                    </div>

                    {isChangingPassword && (
                      <div className="mt-4 space-y-3 border-t pt-4 animate-fadeIn">
                        {!isEmailProvider ? (
  <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
    ⚠️ Your account is connected through{" "}
    <strong>
      {auth.currentUser?.providerData
        ?.map((p) => p.providerId.replace(".com", "").toUpperCase())
        .join(", ")}
    </strong>.  
    Password changes must be done through your linked provider.
  </div>
) : (
  <>
    {/* ✅ Forgot Password link */}
    <div className="flex justify-end mb-3">
      <button
        onClick={async () => {
          if (!auth.currentUser?.email) {
            toast.error("No email associated with this account.");
            return;
          }
          try {
            await sendPasswordResetEmail(auth, auth.currentUser.email);
            toast.success("Password reset email sent! Check your inbox.");
          } catch (error: any) {
            console.error(error);
            toast.error("Failed to send reset email. Please try again later.");
          }
        }}
        className="text-sm text-blue-600 hover:underline"
      >
        Forgot Password?
      </button>
    </div>
                            {/* Current Password */}
                            <div className="space-y-1">
                              <Label htmlFor="oldPassword">Current Password</Label>
                              <div className="relative">
                                <Input
                                  id="oldPassword"
                                  type={showOld ? "text" : "password"}
                                  placeholder="Enter current password"
                                  value={oldPassword}
                                  onChange={(e) => setOldPassword(e.target.value)}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowOld(!showOld)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>

                              {/* Real-time invalid current password error */}
                              {fieldErrors.old && (
                                <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                  <span>{fieldErrors.old}</span>
                                </p>
                              )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1">
                              <Label htmlFor="newPassword">New Password</Label>
                              <div className="relative">
                                <Input
                                  id="newPassword"
                                  type={showNew ? "text" : "password"}
                                  placeholder="Enter new password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNew(!showNew)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>

                              {/* Real-time weak password error */}
                              {newPassword && newPassword.length < 6 && (
                                <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                  <span>Password must be at least 6 characters long</span>
                                </p>
                              )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-1">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <div className="relative">
                                <Input
                                  id="confirmPassword"
                                  type={showConfirm ? "text" : "password"}
                                  placeholder="Re-enter new password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirm(!showConfirm)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showConfirm ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              {/* Real-time password mismatch error */}
                              {newPassword &&
                                confirmPassword &&
                                newPassword !== confirmPassword && (
                                  <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                                    <AlertCircle className="w-4 h-4 text-destructive" />
                                    <span>Passwords do not match</span>
                                  </p>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                              <Button
                                onClick={handleChangePassword}
                                disabled={
                                  !oldPassword ||
                                  !newPassword ||
                                  !confirmPassword ||
                                  newPassword !== confirmPassword ||
                                  newPassword.length < 6
                                }
                                className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                              >
                                Save Password
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>





              </div>
            </div>

            {/* Activity Log */}
<div ref={activitySectionRef} className="space-y-4">
  <h3>Recent Activity</h3>
  <Card>
    <CardContent className="p-0">
      {activityLog.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent activity to display</p>
        </div>
      ) : (
        <>
          {/* Log Entries */}
          <div className="divide-y">
            {activityLog.slice(0, visibleLogs).map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 hover:bg-muted/30 transition-colors animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(entry.status)}
                    <div className="flex-1">
                      <p className="text-sm">{entry.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {entry.partner}
                        </p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {entry.formattedTimestamp}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Data: {entry.dataType}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(entry.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Load More / Show Less */}
          {activityLog.length > 5 && (
            <div className="text-center pt-3">
              {visibleLogs < activityLog.length ? (
                <Button
                  variant="outline"
                  onClick={() => setVisibleLogs((prev) => prev + 5)}
                  className="transition-all duration-200 hover:shadow-sm"
                >
                  Load More
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setVisibleLogs(5);
                    activitySectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  Show Less
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </CardContent>
  </Card>
</div>


            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4>Export Your Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data in JSON
                        format
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (onDataExport) {
                        onDataExport();
                      }
                      toast.success('Data export started', {
                        description: 'You will receive a download link shortly.'
                      });
                    }}
                  >
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center space-x-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <div>
                      <h4 className="text-destructive">
                        Delete All Data
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all your shared data
                        from partner systems
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                          <span>Delete All Shared Data?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            This action will permanently delete
                            all your shared data from partner
                            systems and reset your dashboard.
                          </p>
                          <p className="text-destructive">
                            This will:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>
                              Remove all data sharing agreements
                            </li>
                            <li>
                              Delete all transaction history
                            </li>
                            <li>
                              Reset your earned rewards to zero
                            </li>
                            <li>
                              Clear all active permissions
                            </li>
                          </ul>
                          <p className="mt-3">
                            Note: Your account will remain
                            active. You can start sharing data
                            again at any time.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAllData}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Delete All Data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Security Information */}
      <SecurityInformation />
    </main>
  );
}
