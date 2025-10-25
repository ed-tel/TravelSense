import { useState } from "react";
import { ArrowRight, Shield, Database, Gift, Users, Star, CheckCircle, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const features = [
  {
    icon: Shield,
    title: "Complete Data Control",
    description: "You decide what data to share, when to share it, and with whom. Full transparency and control at your fingertips."
  },
  {
    icon: Gift,
    title: "Earn Real Rewards",
    description: "Get paid for your data with cash, discounts, loyalty points, and exclusive offers from New Zealand's top tourism partners."
  },
  {
    icon: Database,
    title: "Secure & Private",
    description: "Your data is encrypted and stored securely. We never sell your data without your explicit consent."
  },
  {
    icon: Users,
    title: "Trusted Partners",
    description: "Work with verified tourism businesses including Air New Zealand, Tourism New Zealand, and local operators."
  }
];

const benefits = [
  "Control exactly what data you share",
  "Earn money from your travel data",
  "Get personalized travel recommendations",
  "Support better tourism experiences",
  "Complete transparency on data usage",
  "Revoke access anytime you want"
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Frequent Traveler",
    content: "I've earned over $200 just by sharing my travel preferences. It's amazing to finally get value from my data!",
    rating: 5
  },
  {
    name: "James Thompson",
    role: "Tourism Professional",
    content: "TravelSense helps us understand travelers better while respecting their privacy. It's a win-win for everyone.",
    rating: 5
  },
  {
    name: "Lisa Chen",
    role: "Digital Privacy Advocate",
    content: "Finally, a platform that puts users in control. TravelSense is setting the standard for ethical data sharing.",
    rating: 5
  }
];

interface LandingPageProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps = {}) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-medium">TravelSense</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={onSignIn}>Sign In</Button>
              <Button onClick={onGetStarted}>Get Started</Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isNavOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" onClick={onSignIn}>Sign In</Button>
                  <Button onClick={onGetStarted}>Get Started</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1750203524332-130f67889512?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB6ZWFsYW5kJTIwdG91cmlzbSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTg1OTI2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="New Zealand Landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6">🇳🇿 Revolutionizing New Zealand Tourism</Badge>
            <h1 className="text-4xl md:text-6xl font-medium mb-6">
              Your Data, Your Control, <br />
              <span className="text-primary">Your Rewards</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join TravelSense and take control of your travel data. Share what you want, 
              earn real rewards, and help create better tourism experiences across New Zealand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" onClick={onGetStarted}>
                Start Earning Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-medium text-primary">$456</div>
                <div className="text-sm text-muted-foreground">Average earnings per user</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-primary">98%</div>
                <div className="text-sm text-muted-foreground">User privacy satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Trusted tourism partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              Why Choose TravelSense?
            </h2>
            <p className="text-xl text-muted-foreground">
              We're changing how tourism data works in New Zealand. 
              Put yourself in control and get rewarded for your valuable insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              How TravelSense Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple, transparent, and rewarding. Here's how you can start earning from your travel data.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-2">Sign Up & Set Preferences</h3>
                  <p className="text-muted-foreground">Create your account and choose what types of data you're comfortable sharing. You're always in control.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-2">Connect with Partners</h3>
                  <p className="text-muted-foreground">Browse and connect with verified tourism partners who want to provide you with better services.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-2">Share & Earn</h3>
                  <p className="text-muted-foreground">Share relevant data and earn real rewards - cash, discounts, points, and exclusive offers.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-medium mb-2">Track & Withdraw</h3>
                  <p className="text-muted-foreground">Monitor your earnings and privacy settings in your dashboard. Withdraw rewards anytime.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1639503547276-90230c4a4198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwcHJpdmFjeSUyMHNlY3VyaXR5JTIwc2hpZWxkfGVufDF8fHx8MTc1ODU5MjY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Data Security"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium mb-6">
                Take Control of Your Digital Footprint
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Every day, your data creates value for tourism companies. 
                Now it's time for you to benefit from that value too.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8" onClick={onGetStarted}>
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1719550371336-7bb64b5cacfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbmV0d29yayUyMGNvbm5lY3Rpb258ZW58MXx8fHwxNzU4NTkyNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Digital Network"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of New Zealanders who are already earning from their travel data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">
            Ready to Take Control of Your Data?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join TravelSense today and start earning from your travel data. 
            It's free to join and you can start earning immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" onClick={onGetStarted}>
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={onGetStarted}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-medium">TravelSense</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering tourists to control their data and earn rewards in New Zealand's tourism industry.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">News</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 TravelSense. All rights reserved. Made with ❤️ in New Zealand.
          </div>
        </div>
      </footer>
    </div>
  );
}