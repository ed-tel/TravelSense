import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Building2, ArrowLeft, Shield, TrendingUp, Users } from "lucide-react";

interface BusinessAuthPageProps {
  onSignIn: () => void;
  onReturnToLanding: () => void;
}

export function BusinessAuthPage({ onSignIn, onReturnToLanding }: BusinessAuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl">TravelSense</h1>
              <p className="text-slate-400">Business Portal</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg">Access User Insights</h3>
                <p className="text-slate-400 text-sm">Get anonymized, aggregated data from tourists who consent to share their information.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg">Real-Time Analytics</h3>
                <p className="text-slate-400 text-sm">Track engagement, conversion rates, and ROI from your data partnerships.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg">Privacy-First Platform</h3>
                <p className="text-slate-400 text-sm">All data is ethically sourced with explicit user consent and full transparency.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReturnToLanding}
              className="w-fit mb-4 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <CardTitle className="text-white">Business Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Access your company dashboard and data reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-slate-300">
                  Company Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In to Dashboard
              </Button>

              <div className="text-center pt-4 space-y-2">
                <p className="text-sm text-slate-400">
                  Don't have an account?{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Contact Sales
                  </a>
                </p>
                <p className="text-xs text-slate-500">
                  Demo credentials: Any email and password
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
