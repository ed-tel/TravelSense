"use client";

import { Button } from "./ui/button"; // ✅ Corrected paths to your main UI folder
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Heart, Globe, Users, Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface AboutFooterPageProps {
  onReturnToLanding?: () => void;
}

const teamMembers = [
  { name: "Jazz Winter", role: "Co-founder", email: "jwin696@aucklanduni.ac.nz" },
  { name: "Alisha Govind", role: "Co-founder", email: "agov274@aucklanduni.ac.nz" },
  { name: "Ela Telequido", role: "Co-founder", email: "etel433@aucklanduni.ac.nz" },
  { name: "Roda Ibrahim", role: "Co-founder", email: "ribr221@aucklanduni.ac.nz" },
  { name: "Danyang Fang", role: "Co-founder", email: "dfan638@auckalnduni.ac.nz" },
];

const values = [
  {
    icon: Globe,
    title: "Ethical Data Sharing",
    description:
      "We believe in transparency and responsible analytics that respect traveler privacy.",
  },
  {
    icon: Users,
    title: "Traveler Empowerment",
    description:
      "Helping travelers make informed choices for meaningful and responsible journeys.",
  },
  {
    icon: Sparkles,
    title: "Sustainable Growth",
    description:
      "Enabling tourism partners to grow transparently while building trust.",
  },
];

export function AboutFooterPage({ onReturnToLanding }: AboutFooterPageProps) {
  return (
    <div className="about-footer">
      <div className="min-h-screen bg-background">
        {/* Hero Section with Gradient */}
        <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

          <div className="max-w-6xl mx-auto px-6 py-16 relative">
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
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-slate-200">
                <Heart className="w-4 h-4 text-pink-500" fill="#ec4899" />
                <span className="text-sm text-muted-foreground">
                  Empowering Responsible Travel
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl mb-6 text-foreground">
                About TravelSense
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Reshaping the tourism experience through ethical data sharing,
                responsible analytics, and traveler empowerment.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-slate-800 p-1 rounded-3xl mb-24"
          >
            <div className="bg-white rounded-3xl p-12 text-center">
              <h2 className="text-3xl mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Our mission is to help travelers make informed choices while
                enabling tourism partners to grow transparently and sustainably.
                We believe travel should connect people, cultures, and ideas in
                meaningful ways.
              </p>
            </div>
          </motion.div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-4xl mb-3 text-foreground">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                INFOMGMT 399 Capstone Team 2
              </p>
            </motion.div>
          </div>

          {/* Team Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-24"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-16 h-16"
                          >
                            <circle
                              cx="12"
                              cy="8"
                              r="4"
                              fill="white"
                              stroke="white"
                            />
                            <path
                              d="M6 21v-2a6 6 0 0 1 12 0v2"
                              stroke="white"
                              strokeWidth="2"
                              fill="none"
                            />
                            <path
                              d="M8 8c0-2.5 1-4 4-4s4 1.5 4 4"
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart
                        className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform duration-300"
                        fill="#ec4899"
                      />
                      <h3 className="text-xl text-slate-800">{member.name}</h3>
                    </div>

                    <p className="text-sm text-slate-600 text-center mb-4">
                      {member.role}
                    </p>

                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-pink-600 hover:text-pink-700 hover:underline transition-all px-3 py-2 rounded-lg bg-white/50 backdrop-blur-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{member.email}</span>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 p-12 md:p-16 text-center shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-pink-500/20 backdrop-blur-sm mb-6 border-2 border-pink-400/30">
                <Mail className="w-10 h-10 text-pink-300" />
              </div>

              <h2 className="text-4xl md:text-5xl mb-6 text-white">
                Join Our Journey
              </h2>

              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join us in building a transparent and responsible tourism
                ecosystem that benefits travelers and partners alike. Let's
                connect and create something amazing together.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-0 px-12 py-7 shadow-2xl hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300"
                onClick={() =>
                  window.open("mailto:travelsense.contact@gmail.com", "_blank")
                }
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
