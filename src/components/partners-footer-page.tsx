"use client";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, CheckCircle, Mail, Handshake } from "lucide-react";
import { motion } from "framer-motion";

interface PartnersFooterPageProps {
  onReturnToLanding?: () => void;
}

const partners = [
  {
    name: "Air New Zealand",
    icon: "✈️",
    description:
      "New Zealand's flagship airline, connecting travelers domestically and internationally with world-class service.",
    category: "Transportation",
  },
  {
    name: "Booking.com",
    icon: "🏨",
    description:
      "A global platform offering accommodation, travel packages, and experiences for millions of travelers worldwide.",
    category: "Accommodation",
  },
  {
    name: "Queenstown Tourism",
    icon: "🏔️",
    description:
      "Promoting Queenstown as a leading adventure and leisure destination with stunning scenery and local culture.",
    category: "Tourism",
  },
  {
    name: "Tourism New Zealand",
    icon: "🌿",
    description:
      "The national tourism organization, showcasing the best of Aotearoa to inspire international and domestic travelers.",
    category: "Tourism",
  },
  {
    name: "Rental Cars NZ",
    icon: "🚗",
    description:
      "Providing flexible car rental options for tourists to explore New Zealand's cities, beaches, and rural landscapes.",
    category: "Transportation",
  },
  {
    name: "InterCity Bus",
    icon: "🚌",
    description:
      "New Zealand's largest bus network, offering affordable and sustainable transport across the country.",
    category: "Transportation",
  },
];

export function PartnersFooterPage({
  onReturnToLanding,
}: PartnersFooterPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 overflow-hidden border-b border-border">
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
              <Handshake className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Trusted Partnerships
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl mb-6 text-foreground">
              Our Business Partners
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We proudly collaborate with New Zealand's most trusted tourism
              and travel organizations to promote sustainable travel and
              meaningful data partnerships.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Partner Cards Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="relative rounded-2xl border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-white h-full group overflow-hidden">
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-green-50 rounded-full p-1.5 border border-green-200 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="text-green-600 w-4 h-4" />
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <CardContent className="flex flex-col h-full p-8 relative">
                  {/* Partner Icon & Name */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                      <span className="text-3xl">{partner.icon}</span>
                    </div>
                    <h3 className="text-xl mb-2 text-foreground">
                      {partner.name}
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700">
                      {partner.category}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed text-center flex-grow">
                    {partner.description}
                  </p>

                  {/* Partnership Status */}
                  <div className="mt-6 pt-4 border-t border-border text-center">
                    <span className="text-xs text-green-600 font-medium flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified Partner
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-blue-600 to-slate-800 p-1 rounded-3xl mb-20"
        >
          <div className="bg-white rounded-3xl p-12">
            <h2 className="text-3xl text-center mb-8 text-foreground">
              Partnership Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2 text-foreground">
                  Data Transparency
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Full visibility into data usage with ethical consent
                  frameworks
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
                  <Handshake className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2 text-foreground">
                  Mutual Trust
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Building lasting relationships through responsible data
                  practices
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2 text-foreground">
                  Dedicated Support
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Access to our team for seamless integration and support
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 p-12 md:p-16 text-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm mb-6 border-2 border-white/20">
              <Handshake className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl mb-6 text-white">
              Become a TravelSense Partner
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Partner with us to promote responsible tourism and gain valuable
              insights while maintaining full transparency and user trust. Join
              New Zealand's leading data-sharing ecosystem.
            </p>

            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 border-0 px-12 py-7 shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
              onClick={() =>
                window.open("mailto:travelsense.contact@gmail.com", "_blank")
              }
            >
              <Mail className="w-5 h-5 mr-2" />
              Join as a Partner
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}