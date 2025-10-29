"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  FileQuestion,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebaseConfig";

interface ContactFooterPageProps {
  onReturnToLanding?: () => void;
}

// Single source of truth for support email
const SUPPORT_EMAIL = "travelsense.contact@gmail.com";

export function ContactFooterPage({ onReturnToLanding }: ContactFooterPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ Get reference to Firebase Cloud Function
      const functions = getFunctions(app);
      const sendContactMessage = httpsCallable(functions, "sendContactMessage");

      // ✅ Call backend Cloud Function
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success("✅ Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("❌ Error sending contact message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Our team is here to help",
      value: SUPPORT_EMAIL,
      link: `mailto:${SUPPORT_EMAIL}`,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm",
      value: "+64 9 123 4567",
      link: "tel:+6491234567",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello",
      value: "123 Queen Street, Auckland 1010, New Zealand",
      link: "https://maps.google.com",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're available",
      value: "Monday - Friday: 8:00 AM - 6:00 PM NZST",
      link: null,
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "General Inquiry",
      description: "Questions about our platform",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Need help with your account",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: FileQuestion,
      title: "Partnership",
      description: "Interested in partnering with us",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative">
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
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                We're Here to Help
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl mb-6 text-foreground">
              Get in Touch
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-3xl">Send us a Message</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and our team will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={8}
                      required
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Contact Methods */}
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-base">
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1">{method.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{method.description}</p>
                        {method.link ? (
                          <a
                            href={method.link}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-words"
                            target={method.link.startsWith("http") ? "_blank" : undefined}
                            rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className="text-sm">{method.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section - Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-12">
          {/* Support Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">What can we help you with?</CardTitle>
                <CardDescription>
                  Choose the topic that best matches your inquiry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-200">
                      <div className={`w-10 h-10 rounded-lg ${option.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <option.icon className={`w-5 h-5 ${option.color}`} />
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm">{option.title}</h4>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Time Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-slate-50 shadow-md h-full">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2">Expected Response Time</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our support team typically responds within 24 hours on business days. For urgent matters, please call us directly.
                    </p>
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-muted-foreground">Average response: 4-6 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50 shadow-md h-full">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-3">Why Contact Us?</h4>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2.5"></span>
                        Get expert guidance on data sharing
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2.5"></span>
                        Learn about partnership opportunities
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2.5"></span>
                        Resolve technical issues quickly
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2.5"></span>
                        Understand our privacy policies
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
