"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Shield,
  Gift,
  Server,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Mail,
  CheckCircle2,
  Info,
} from "lucide-react";

interface TermsOfServiceFooterPageProps {
  onReturnToLanding?: () => void;
}

export function TermsOfServiceFooterPage({ onReturnToLanding }: TermsOfServiceFooterPageProps) {
  const sections = [
    {
      icon: UserCheck,
      title: "1. Use of the Platform",
      content: [
        "Use TravelSense only for lawful and ethical purposes",
        "Keep account details accurate and up to date",
        "Protect your login credentials and do not share your account",
        "Comply with all applicable laws and regulations",
      ],
    },
    {
      icon: Gift,
      title: "2. Data Contribution & Rewards",
      content: [
        "Tourism data may be used for anonymised research and reporting",
        "Rewards may be offered via partner programs",
        "Rewards depend on availability and eligibility",
        "We reserve the right to modify or discontinue reward programs",
      ],
    },
    {
      icon: Server,
      title: "3. Cloud Infrastructure",
      content: [
        "TravelSense operates on secure cloud-based systems",
        "We aim for consistent uptime and reliability",
        "Occasional service interruptions may occur for maintenance",
        "We are not liable for temporary service disruptions",
      ],
    },
    {
      icon: Shield,
      title: "4. Privacy Compliance",
      content: [
        "All data processing complies with our Privacy Policy",
        "We adhere to the New Zealand Privacy Act 2020",
        "Your consent is required before sharing identifiable data",
        "You can manage your privacy settings at any time",
      ],
    },
    {
      icon: RefreshCw,
      title: "5. Account Termination",
      content: [
        "You may delete your account at any time",
        "Personal data will be erased following our 12-month retention policy",
        "Anonymised data may be retained for research purposes",
        "Active rewards will be forfeited upon account deletion",
      ],
    },
    {
      icon: AlertTriangle,
      title: "6. Limitation of Liability",
      content: [
        "TravelSense is provided \"as-is\" without warranties",
        "We are not liable for changes in rewards or partner offers",
        "We are not responsible for third-party partner actions",
        "Our liability is limited to the maximum extent permitted by law",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-white border-b border-slate-200">
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
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Terms & Conditions
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-6 text-foreground">
              Terms of Service
            </h1>

            <p className="text-lg text-muted-foreground mb-4">
              Last Updated: October 17, 2025
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              By using TravelSense, you agree to the following Terms of Service. Please read them
              carefully to understand your rights and obligations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Terms Sections Grid */}
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
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
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
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-6"
        >
          {/* Amendments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">7. Amendments</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Terms may be updated periodically. Continued use constitutes acceptance of any changes.
              </p>
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  We will notify you of any material changes to these Terms through email or a prominent notice on the platform. We encourage you to review the Terms periodically.
                </p>
              </div>
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
                  <h4 className="mb-2">8. Contact</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For questions or support regarding these Terms of Service, please contact us at:
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

          {/* Acceptance Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-start gap-4 p-6 bg-green-50 rounded-2xl border border-green-200"
          >
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-2 text-green-900">Acceptance of Terms</h4>
              <p className="text-sm text-green-800">
                By creating an account and using TravelSense, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service. If you do not agree to these terms, 
                please do not use the platform.
              </p>
            </div>
          </motion.div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200"
          >
            <Shield className="w-6 h-6 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-2 text-slate-900">Governing Law</h4>
              <p className="text-sm text-slate-700">
                These Terms of Service are governed by the laws of New Zealand. Any disputes arising from 
                these terms will be subject to the exclusive jurisdiction of the courts of New Zealand.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
