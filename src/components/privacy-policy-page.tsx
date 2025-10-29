"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Lock,
  Database,
  FileText,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  Mail,
} from "lucide-react";

interface PrivacyPolicyFooterPageProps {
  onReturnToLanding?: () => void;
}

export function PrivacyPolicyFooterPage({ onReturnToLanding }: PrivacyPolicyFooterPageProps) {
  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      items: [
        "Account information (name, email)",
        "Tourism-related activity data you voluntarily provide",
        "Reward participation data",
        "System analytics (anonymised where possible)",
      ],
    },
    {
      icon: Eye,
      title: "2. How We Use Your Data",
      items: [
        "Provide platform functionality and personalised features",
        "Enable reward systems with verified tourism partners",
        "Generate anonymised insights for tourism operators",
        "Improve TravelSense through analytics",
      ],
    },
    {
      icon: Lock,
      title: "3. Data Storage & Security",
      items: [
        "Secure cloud-based infrastructure",
        "Encrypted storage and controlled access",
        "Automatic anonymisation of sensitive data",
        "Optional Multi-factor Authentication (MFA)",
      ],
    },
    {
      icon: Clock,
      title: "4. Data Retention & Deletion",
      items: [
        "Personal data retained for 12 months",
        "Automatic deletion after retention period",
        "Anonymised data may remain for research or reporting",
        "Data shared only during active consent window",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Button
            variant="ghost"
            onClick={onReturnToLanding}
            className="mb-8 hover:bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-slate-200">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Your Privacy Matters
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-6 text-foreground">
              Privacy Policy
            </h1>

            <p className="text-lg text-muted-foreground mb-2">
              Last Updated: October 17, 2025
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              TravelSense is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, store, and delete your information in line with the New Zealand
              Privacy Act 2020.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <Card className="border-0 shadow-lg h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Third-Party Sharing */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">5. Third-Party Sharing</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Only anonymised data is shared with verified tourism partners. Identifiable data is
                shared <strong className="text-foreground">only with your consent</strong>.
              </p>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  You have complete control over who can access your data and can revoke consent at any time through your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">6. Your Rights</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Access or request deletion of your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Withdraw consent at any time</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Request correction or data export</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="mb-2">7. Contact Us</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For privacy-related inquiries or to exercise your rights, please contact us at:
                  </p>
                  <a
                    href="mailto:travelsense.contact@gmail.com"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    travelsense.contact@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-200"
          >
            <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-2 text-amber-900">Important Notice</h4>
              <p className="text-sm text-amber-800">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes through email or a prominent notice on our platform.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
