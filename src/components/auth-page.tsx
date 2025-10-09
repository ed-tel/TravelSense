import { useState } from "react";
import { Database, Mail, Lock, Eye, EyeOff, Shield, Plane } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AuthPageProps {
  onSignIn?: () => void;
  onReturnToLanding?: () => void;
}

export function AuthPage({ onSignIn, onReturnToLanding }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSignIn) {
      onSignIn();
    }
  };

  import { auth, provider, signInWithPopup } from "../firebaseConfig.ts"; // adjust path if needed

const handleSocialLogin = async (providerName: string) => {
  if (providerName === "google") {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Logged in with Google:", user);
      if (onSignIn) onSignIn();
    } catch (err) {
      console.error("❌ Google sign-in failed:", err);
    }
  } else {
    alert("Only Google sign-in is implemented.");
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
                <Database className="w-5 h-5 text-primary-foreground" />
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
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input-background border-border/50 rounded-lg"
                      required
                    />
                  </div>
                </div>

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
                </div>

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
                  </div>
                )}

                {/* Terms Agreement (Sign Up only) */}
                {isSignUp && (
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm leading-5">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{" "}
                      &{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </Label>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full rounded-lg py-6"
                  disabled={isSignUp && !agreedToTerms}
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>

              {/* Forgot Password / Switch Mode */}
              <div className="text-center">
                {!isSignUp ? (
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline"
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
                  onClick={() => handleSocialLogin('google')}
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
                  onClick={() => handleSocialLogin('facebook')}
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
        <div className="absolute bottom-16 left-16 right-16 text-center space-y-4">
          <h2 className="text-2xl font-medium text-foreground">
            Your Journey Starts Here
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join thousands of travelers who are taking control of their data and earning rewards with TravelSense.
          </p>
        </div>
      </div>
    </div>
  );
}