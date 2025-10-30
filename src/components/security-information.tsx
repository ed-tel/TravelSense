"use client";

import React, { useRef } from "react";
import { Shield, Check } from "lucide-react"; // ✅ Only Lucide icons here
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  FileText,
  Database,
  Eye,
  Lock,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Gift,
  Server,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export function SecurityInformation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <Card className="mt-8 bg-muted/30 border-border/50 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-medium">Your Privacy is Protected</h3>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>• All shared data is encrypted and anonymized before being sent to partners</p>
              <p>• You can change these settings at any time</p>
              <p>• Partners never receive your personal identity information</p>
              <p>• We comply with New Zealand’s Privacy Act 2020 and international standards</p>

              <p>
  • Learn more in our{" "}
  <Dialog>
    <DialogTrigger asChild>
      <button className="text-sm text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1 transition-colors">
        Privacy Policy & Terms of Service
      </button>
    </DialogTrigger>

    <DialogContent className="p-0 bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-3xl max-h-[85vh]">
      {/* Header */}
      <div className="border-b bg-gradient-to-br from-slate-50 via-blue-50 to-white p-4 sticky top-0 z-10">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <DialogTitle className="text-xl">Privacy & Terms</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Review how TravelSense protects your information and outlines your rights.
          </DialogDescription>
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 mt-2 w-fit text-xs">
            Last Updated: October 17, 2025
          </Badge>
        </DialogHeader>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="privacy"
        onValueChange={() => {
          if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="border-b bg-background px-4 py-1 sticky top-0 z-10">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 mb-4 sticky top-0">
            <TabsTrigger value="privacy" className="text-sm rounded-xl">
              <Shield className="w-3.5 h-3.5" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="text-sm rounded-xl">
              <FileText className="w-3.5 h-3.5" />
              Terms of Service
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1 px-6 py-6 scrollbar-minimal"
          style={{ maxHeight: "calc(85vh - 240px)" }}
        >
          {/* === Privacy Policy === */}
          <TabsContent value="privacy" className="mt-0">
            <div className="space-y-4">
              {/* Intro */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  TravelSense is committed to protecting your privacy in line with the{" "}
                  <strong>New Zealand Privacy Act 2020</strong>.
                </p>
              </div>

              {/* Section 1 */}
              <div className="border-l-2 border-blue-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">1. Information We Collect</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Account information (name, email)",
                    "Tourism-related activity data you voluntarily provide",
                    "Reward participation data",
                    "System analytics (anonymised where possible)",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 2 */}
              <div className="border-l-2 border-purple-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">2. How We Use Your Data</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Provide platform functionality and personalised features",
                    "Enable reward systems with verified tourism partners",
                    "Generate anonymised insights for tourism operators",
                    "Improve TravelSense through analytics",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-100">
                  <p className="text-xs text-purple-900">
                    No personal data is shared without your explicit consent.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-l-2 border-green-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">3. Data Storage & Security</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Secure cloud-based infrastructure",
                    "Encrypted storage and controlled access",
                    "Automatic anonymisation of sensitive data",
                    "Optional Multi-factor Authentication (MFA)",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 4 */}
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">4. Data Retention & Deletion</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Personal data retained for 12 months",
                    "Automatic deletion after retention period",
                    "Anonymised data may remain for research or reporting",
                    "Data shared only during active consent window",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 5 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">5. Third-Party Sharing</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Only anonymised data is shared with verified tourism partners. Identifiable data is shared{" "}
                  <strong className="text-foreground">only with your consent</strong>.
                </p>
              </div>

              {/* Section 6 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">6. Your Rights</h4>
                </div>
                <ul className="space-y-1.5 mb-2">
                  {[
                    "Access or request deletion of your data",
                    "Withdraw consent at any time",
                    "Request correction or data export",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  Contact{" "}
                  <a href="mailto:travelsense.contact@gmail.com" className="text-primary hover:underline">
                    travelsense.contact@gmail.com
                  </a>{" "}
                  for privacy inquiries.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* === Terms of Service === */}
          <TabsContent value="terms" className="mt-0">
            <div className="space-y-4">
              {/* Intro */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  By using TravelSense, you agree to the following Terms of Service.
                </p>
              </div>

              {/* Section 1 */}
              <div className="border-l-2 border-blue-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">1. Use of the Platform</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Use TravelSense only for lawful and ethical purposes",
                    "Keep account details accurate and up to date",
                    "Protect your login credentials and do not share your account",
                    "Comply with all applicable laws and regulations",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 2 */}
              <div className="border-l-2 border-purple-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">2. Data Contribution & Rewards</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Tourism data may be used for anonymised research and reporting",
                    "Rewards may be offered via partner programs",
                    "Rewards depend on availability and eligibility",
                    "We reserve the right to modify or discontinue reward programs",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 3 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">3. Cloud Infrastructure</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TravelSense operates on secure cloud-based systems. While we aim for consistent uptime, occasional
                  service interruptions may occur for maintenance.
                </p>
              </div>

              {/* Section 4 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">4. Privacy Compliance</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All data processing complies with the Privacy Policy and the New Zealand Privacy Act 2020. Your
                  consent is required before sharing identifiable data.
                </p>
              </div>

              {/* Section 5 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">5. Account Termination</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You may delete your account at any time. Personal data will be erased following our 12-month retention
                  policy. Anonymised data may be retained for research purposes.
                </p>
              </div>

              {/* Section 6 */}
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm text-amber-900 font-semibold">6. Limitation of Liability</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TravelSense is provided "as-is" without warranties. We are not liable for changes in rewards or partner
                  offers, downtime, or third-party partner actions.
                </p>
              </div>

              {/* Section 7 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">7. Amendments</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Terms may be updated periodically. Continued use constitutes acceptance of any changes. We will notify
                  you of material updates.
                </p>
              </div>

              {/* Section 8 */}
              <div className="border-l-2 border-slate-300 pl-3 py-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <h4 className="text-sm text-slate-900 font-semibold">8. Contact</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  For questions or support, email{" "}
                  <a href="mailto:travelsense.contact@gmail.com" className="text-primary hover:underline">
                    travelsense.contact@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="border-t bg-slate-50 p-4 flex justify-between items-center sticky bottom-0 z-10">
        <p className="text-xs text-muted-foreground">
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="flex items-center gap-2 shadow-sm">
              <Check className="w-4 h-4" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</p>


            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
