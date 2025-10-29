"use client";

import React from "react";
import { Shield, Check } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useRef } from "react";

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
                    <button className="text-primary hover:underline cursor-pointer">
                      Privacy Policy & Terms of Service
                    </button>
                  </DialogTrigger>

                  {/* === Compact, Scrollable Dialog === */}
                  <DialogContent
                    className="p-0 bg-background rounded-2xl shadow-xl flex flex-col overflow-hidden 
                    z-50 w-full max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2"
                  >
                    {/* Header */}
                    <div className="border-b p-6 bg-background sticky top-0 z-10">
                      <DialogHeader>
                        <DialogTitle>Privacy Policy & Terms of Service</DialogTitle>
                        <DialogDescription>
                          Review how TravelSense protects your information and outlines your rights.
                        </DialogDescription>
                      </DialogHeader>
                    </div>

                    {/* Scrollable Main Body */}
<div
  ref={scrollRef}
  className="overflow-y-auto flex-1 px-6 py-4 space-y-4 scroll-smooth"
>
  <Tabs
    defaultValue="privacy"
    onValueChange={() => {
      // When user changes tab, scroll the dialog body to the top
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }}
  >
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 mb-4 sticky top-0">
                          <TabsTrigger value="privacy" className="text-sm rounded-xl">
                            Privacy Policy
                          </TabsTrigger>
                          <TabsTrigger value="terms" className="text-sm rounded-xl">
                            Terms of Service
                          </TabsTrigger>
                        </TabsList>

                        {/* === Privacy Policy === */}
                        <TabsContent value="privacy">
                          <div className="space-y-6 text-sm text-muted-foreground pr-2">
                            <section>
                              <h4 className="text-base font-semibold mb-2">Last Updated: 17/10/25</h4>
                              <p>
                                TravelSense (“we”, “our”, “us”) is committed to protecting your
                                privacy. This Privacy Policy explains how we collect, use, store,
                                and delete your information in line with the New Zealand Privacy Act
                                2020.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">1. Information We Collect</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Account information (name, email)</li>
                                <li>Tourism-related activity data you voluntarily provide</li>
                                <li>Reward participation data</li>
                                <li>System analytics (anonymised where possible)</li>
                              </ul>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">2. How We Use Your Data</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Provide platform functionality and personalised features</li>
                                <li>Enable reward systems with verified tourism partners</li>
                                <li>Generate anonymised insights for tourism operators</li>
                                <li>Improve TravelSense through analytics</li>
                              </ul>
                              <p className="mt-2">No personal data is shared without your consent.</p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">3. Data Storage & Security</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Secure cloud-based infrastructure</li>
                                <li>Encrypted storage and controlled access</li>
                                <li>Automatic anonymisation of sensitive data</li>
                                <li>Optional Multi-factor Authentication (MFA)</li>
                              </ul>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">4. Data Retention & Deletion</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Personal data retained for 12 months</li>
                                <li>Automatic deletion after retention period</li>
                                <li>Anonymised data may remain for research or reporting</li>
                                <li>Data shared only during active consent window</li>
                              </ul>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">5. Third-Party Sharing</h4>
                              <p>
                                Only anonymised data is shared with verified tourism partners. 
                                Identifiable data is shared <strong>only with your consent</strong>.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">6. Your Rights</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Access or request deletion of your data</li>
                                <li>Withdraw consent at any time</li>
                                <li>Request correction or data export</li>
                              </ul>
                              <p className="mt-2">
                                Contact{" "}
                                <span className="text-primary font-medium">
                                  travelsense.contact@gmail.com
                                </span>{" "}
                                for privacy-related inquiries.
                              </p>
                            </section>
                          </div>
                        </TabsContent>

                        {/* === Terms of Service === */}
                        <TabsContent value="terms">
                          <div className="space-y-6 text-sm text-muted-foreground pr-2">
                            <section>
                              <h4 className="text-base font-semibold mb-2">Last Updated: 17/10/25</h4>
                              <p>
                                By using TravelSense, you agree to the following Terms of Service.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">1. Use of the Platform</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Use TravelSense only for lawful and ethical purposes</li>
                                <li>Keep account details accurate and up to date</li>
                              </ul>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">2. Data Contribution & Rewards</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Tourism data may be used for anonymised research and reporting</li>
                                <li>Rewards may be offered via partner programs</li>
                                <li>Rewards depend on availability and eligibility</li>
                              </ul>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">3. Cloud Infrastructure</h4>
                              <p>
                                TravelSense operates on secure cloud-based systems. While we aim for
                                consistent uptime, occasional service interruptions may occur.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">4. Privacy Compliance</h4>
                              <p>
                                All data processing complies with the Privacy Policy and NZ Privacy
                                Act 2020.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">5. Account Termination</h4>
                              <p>
                                You may delete your account anytime. Personal data will be erased
                                following our 12-month retention policy.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">6. Limitation of Liability</h4>
                              <p>
                                TravelSense is provided “as-is.” We are not liable for changes in
                                rewards, downtime, or third-party partner actions.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">7. Amendments</h4>
                              <p>
                                Terms may be updated periodically. Continued use constitutes
                                acceptance of any changes.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-base font-semibold mb-2">8. Contact</h4>
                              <p>
                                For questions or support, email:{" "}
                                <span className="text-primary font-medium">
                                  travelsense.contact@gmail.com
                                </span>
                                .
                              </p>
                            </section>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Footer */}
                    <div className="border-t bg-background p-4 flex justify-end sticky bottom-0 z-10">
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button className="flex items-center gap-1">
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
