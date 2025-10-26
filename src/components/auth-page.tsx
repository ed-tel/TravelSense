import { useState } from "react";

import { Database, Mail, Lock, Eye, EyeOff, Shield, Plane, Loader2, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PoliciesDialog } from "./policies-dialog"; // Adjust path as needed

import { GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider, linkWithCredential, fetchSignInMethodsForEmail } from 'firebase/auth';

import { doc, setDoc } from "firebase/firestore";
import { useRef } from "react"; // ✅ make sure useRef is imported
// ✅ Move these OUTSIDE the component so they are not recreated every render
import { auth, googleProvider, facebookProvider, signInWithPopup } from "../firebaseConfig";
import {
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  multiFactor,
  RecaptchaVerifier,
  getMultiFactorResolver
} from "firebase/auth";

interface AuthPageProps {
  onSignIn?: () => void;
  onReturnToLanding?: () => void;
}

export function AuthPage({ onSignIn, onReturnToLanding }: AuthPageProps) {
  const [popupActive, setPopupActive] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [verificationUser, setVerificationUser] = useState<any | null>(null);
  // 🧩 ADD THIS LINE BELOW
  const pendingCredRef = useRef<any>(null);

  // Initialize Firebase Auth and Firestore
  const [loading, setLoading] = useState(false);
  const [showMfaCodeInput, setShowMfaCodeInput] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");


  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error.message);
      toast.error("Failed to send reset email. Please try again.");
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true); // 🟢 Start loading

  if (isSignUp) {
    if (!agreedToTerms) {
      alert("You must agree to the terms and privacy policy.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setVerificationUser(user);
      await sendEmailVerification(user);

      toast.success(
        "A verification email has been sent. Please check your inbox and spam folder before signing in."
      );

      // Reset form state
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreedToTerms(false);
      setEmailError("");
      setSignInError("");
      setIsSignUp(false);
    } catch (error: any) {
      console.error("Sign-up error:", error.message);
      if (error.code === "auth/email-already-in-use") {
        setEmailError("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false); // 🔵 Stop loading
    }
 } else {
  // 🟦 Sign-in flow
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      setSignInError("Please verify your email before signing in.");
      setVerificationUser(user);
      await auth.signOut();
      return;
    }

    setVerificationUser(null);
    console.log("User signed in successfully!");
    if (onSignIn) onSignIn();

  } catch (error: any) {
    // 🟡 Handle MFA-required case
    if (error.code === "auth/multi-factor-auth-required") {
  console.warn("🔒 MFA required for this account");

  const resolver = getMultiFactorResolver(auth, error);
  (window as any).mfaResolver = resolver;

  // ✅ Initialize reCAPTCHA (new syntax)
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
    await window.recaptchaVerifier.render();
    setLoading(true);
  }

  const phoneInfoOptions = {
    multiFactorHint: resolver.hints[0],
    session: resolver.session,
  };

  const phoneAuthProvider = new PhoneAuthProvider(auth);
  const verificationId = await phoneAuthProvider.verifyPhoneNumber(
    phoneInfoOptions,
    window.recaptchaVerifier
  );

  // ✅ Show inline MFA input and stop spinner
  setVerificationId(verificationId);
  setShowMfaCodeInput(true);
  setLoading(false);
  toast.info("Enter the 6-digit code sent to your phone.");
  return; // ⛔ wait for Verify click
}
    // 🟥 Regular error handling for non-MFA cases
    console.error("Sign-in error:", error.message);

    if (error.code === "auth/user-not-found") {
      setSignInError("No account found with this email.");
    } else if (error.code === "auth/network-request-failed") {
      setSignInError("Network error. Check your connection.");
    } else if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      setSignInError("Invalid email or password.");
    } else {
      setSignInError("An unexpected error occurred.");
    }

  } finally {
    setLoading(false); // 🔵 Stop loading
  }
}
};

  const handleSocialLogin = async (providerName: string) => {
  if (popupActive) return; // 🧩 Prevent multiple concurrent popups
  setPopupActive(true);
  setLoading(true);

  let provider = providerName === "Google" ? googleProvider : facebookProvider;

  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Signed in user:", result.user);
    toast.success(`Signed in with ${providerName} successfully!`);
    onSignIn?.();
  } catch (err: any) {
    console.error(`${providerName} sign-in failed:`, err);
    if (err.code === "auth/account-exists-with-different-credential") {
      toast.info("This email is already registered with another provider. Try signing in with that provider.");
    } else {
      toast.error(`Login failed: ${err.message}`);
    }
  } finally {
    setPopupActive(false);
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <button
              onClick={onReturnToLanding}
              className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity mb-8"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-medium">TravelSense</span>
            </button>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-medium">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Start your journey with secure data sharing"
                : "Sign in to your TravelSense account"
              }
            </p>
          </div>

          {/* Form */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-0 pb-6">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure authentication</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(""); // Clear error when typing
                    }}
                    className="pl-10 bg-input-background border-border/50 rounded-lg"
                    required
                  />
                </div>
                
                {/* Show inline email error */}
                {emailError && (
                    <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                {/* Sign in: invalid email or password error */}
                {!isSignUp && signInError && (
                <div className="space-y-2">
                  <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span>{signInError}</span>
                  </p>

                  {signInError === "Please verify your email before signing in." && (
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          if (!verificationUser) {
                            console.error("No verification user stored – cannot resend verification email.");
                            return;
                          }
                          if (verificationUser.emailVerified) {
                            console.log("User already verified.");
                            return;
                          }

                          try {
                            await sendEmailVerification(verificationUser);
                            toast.success("Verification email resent.");
                          } catch (err: any) {
                            console.error("Error resending verification:", err);
                            toast.error("Failed to resend verification email. Try again later.");
                          }
                        }}
                      >
                        <Send/>Resend Verification Email
                      </Button>

                    </div>
                  )}
                </div>
              )}



                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-input-background border-border/50 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* 🔴 Password too short warning */}
                  {isSignUp && password && password.length < 6 && (
                    <p className="mt-1 text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="w-4 h-4  text-destructive" />
                      <span>Password must be at least 6 characters</span>
                      </p>
                    )}
                </div>

                {/* 🔐 Inline MFA code input (only shown when needed) */}
{showMfaCodeInput && (
  <div className="space-y-2 animate-fadeIn">
    <Label htmlFor="verificationCode">Enter 6-digit verification code</Label>
    <div className="flex space-x-2">
      <Input
        id="verificationCode"
        type="text"
        placeholder="123456"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        maxLength={6}
        className="text-center tracking-widest font-mono"
      />
      <Button
  type="button"
  className="bg-green-600 text-white hover:bg-green-700"
  onClick={async () => {
    setLoading(true);
    try {
      if (!verificationId) {
        toast.error("Missing verification ID. Please sign in again.");
        return;
      }

      const resolver = (window as any).mfaResolver;
      if (!resolver) {
        toast.error("Missing MFA session. Please sign in again.");
        return;
      }

      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);

      const finalUserCred = await resolver.resolveSignIn(assertion);
      toast.success("✅ Signed in successfully with MFA!");
      setShowMfaCodeInput(false);
      setVerificationCode("");
      delete (window as any).mfaResolver;

      if (onSignIn) onSignIn();
    } catch (err: any) {
      console.error("❌ MFA verification error:", err);
      toast.error(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }}
>
  {loading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Verifying...
    </>
  ) : (
    "Verify"
  )}
</Button>
    </div>
  </div>
)}


                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 bg-input-background border-border/50 rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Real-time password mismatch error */}
                    {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-destructive flex items-center gap-2 mt-1">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span>Passwords do not match</span>
                    </p>
                    )}
                  </div>
                )}

                {/* Terms Agreement (Sign Up only) */}
                {/* Policies Dialog */}
                {isSignUp && (
                <PoliciesDialog
                  agreedToTerms={agreedToTerms}
                  setAgreedToTerms={setAgreedToTerms}
                />
              )}
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full rounded-lg py-6 py-6 flex items-center justify-center"
                  disabled={
                    loading || 
                    (isSignUp && (!agreedToTerms || password !== confirmPassword || password.length < 6 || !!emailError)) ||
                    !email || !password
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isSignUp ? "Signing Up..." : "Signing In..."}
                    </>
                  ) : (
                    <>{isSignUp ? "Sign Up" : "Sign In"}</>
                  )}
                </Button>
              </form>

              {/* Forgot Password / Switch Mode */}
              <div className="text-center">
                {!isSignUp ? (
                  <a
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </a>
                ) : (
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Already have an account? Sign In
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  className="rounded-lg py-6 border-border/50"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="rounded-lg py-6 border-border/50"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {/* Switch to Sign Up */}
              {!isSignUp && (
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Security Note */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Your data is protected with MFA and encryption</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="relative w-full h-full max-w-lg max-h-lg">
            {/* Background abstract shape */}
            <div className="absolute inset-0 opacity-20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhdGElMjBzZWN1cml0eSUyMG5ldHdvcmt8ZW58MXx8fHwxNzU4NjkxNjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Abstract Data Network"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            {/* Floating icons */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute top-1/2 right-1/3 w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Database className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-16 left-16 right-16 text-center space-y-4 p-8">
          <h2 className="text-2xl font-medium text-foreground">
            Your Journey Starts Here
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join thousands of travelers who are taking control of their data and earning rewards with TravelSense.
          </p>
        </div>
      </div>
      {/* Invisible reCAPTCHA for MFA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
