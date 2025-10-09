import { useState } from "react";
import { Info, Shield, MapPin, CreditCard, Calendar, Heart, User, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface DataCategory {
  id: string;
  name: string;
  description: string;
  detailedInfo: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  examples: string[];
}

export function MyDataPage() {
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    {
      id: "location",
      name: "Location Data",
      description: "Helps businesses recommend better travel offers and local experiences based on your location.",
      detailedInfo: "This includes your current location, frequently visited places, and travel routes. We use this data to provide personalized recommendations for nearby attractions, restaurants, and services. Your exact location is never shared without your permission.",
      icon: MapPin,
      enabled: true,
      examples: ["Current city/region", "Frequently visited destinations", "Travel routes"]
    },
    {
      id: "spending",
      name: "Spending Data",
      description: "Enables partners to offer personalized discounts and rewards based on your spending patterns.",
      detailedInfo: "This includes your spending categories, average transaction amounts, and preferred price ranges. Tourism partners use this to offer relevant deals and promotions. Specific transaction details are never shared.",
      icon: CreditCard,
      enabled: true,
      examples: ["Spending categories (hotels, dining, activities)", "Average budget ranges", "Preferred price points"]
    },
    {
      id: "booking",
      name: "Booking History",
      description: "Allows partners to understand your travel style and suggest similar experiences you might enjoy.",
      detailedInfo: "This includes your booking patterns, preferred accommodation types, and travel frequency. Partners use this to recommend similar properties and experiences that match your preferences.",
      icon: Calendar,
      enabled: false,
      examples: ["Hotel preferences", "Booking timing patterns", "Trip duration preferences"]
    },
    {
      id: "preferences",
      name: "Travel Preferences",
      description: "Helps create a personalized travel experience tailored to your interests and needs.",
      detailedInfo: "This includes your interests, dietary requirements, accessibility needs, and travel style preferences. This helps partners provide more relevant and personalized recommendations.",
      icon: Heart,
      enabled: true,
      examples: ["Activity interests", "Dietary preferences", "Accessibility requirements", "Travel style (luxury, budget, adventure)"]
    },
    {
      id: "contact",
      name: "Contact Information",
      description: "Enables partners to send you relevant offers and important travel updates directly.",
      detailedInfo: "This includes your email address and communication preferences. Partners use this to send personalized offers, booking confirmations, and important travel information. You can unsubscribe from any communications at any time.",
      icon: User,
      enabled: false,
      examples: ["Email address", "Communication preferences", "Preferred contact times"]
    }
  ]);

  const [showStopAllDialog, setShowStopAllDialog] = useState(false);

  const enabledCount = dataCategories.filter(category => category.enabled).length;

  const toggleCategory = (categoryId: string) => {
    setDataCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
  };

  const stopSharingAll = () => {
    setDataCategories(prev => 
      prev.map(category => ({ ...category, enabled: false }))
    );
    setShowStopAllDialog(false);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-medium">My Data – Control What You Share</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Take full control of your personal data. Choose exactly what information you're comfortable sharing with our tourism partners.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Data Sharing Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">
                You are currently sharing: <span className="font-medium text-primary">{enabledCount} out of {dataCategories.length} categories</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {enabledCount === 0 && "No data is being shared. You won't receive personalized offers."}
                {enabledCount > 0 && enabledCount < dataCategories.length && "You're sharing some data for personalized experiences."}
                {enabledCount === dataCategories.length && "All data categories are enabled for maximum personalization."}
              </p>
            </div>
            <Badge variant={enabledCount > 0 ? "default" : "secondary"} className="text-sm px-3 py-1">
              {enabledCount > 0 ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-medium">Data Categories</h2>
        <div className="grid gap-4">
          {dataCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      category.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{category.name}</h3>
                          <button 
                            className="text-muted-foreground hover:text-foreground" 
                            title={category.detailedInfo}
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Label htmlFor={category.id} className="text-sm">
                            {category.enabled ? "Enabled" : "Disabled"}
                          </Label>
                          <Switch
                            id={category.id}
                            checked={category.enabled}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      
                      {category.enabled && (
                        <div className="text-xs text-primary bg-primary/5 rounded-md p-2">
                          ✓ This data is being shared with verified tourism partners
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Emergency Controls */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Privacy Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Stop Sharing All Data</p>
              <p className="text-sm text-muted-foreground mt-1">
                Immediately disable all data sharing. You can always re-enable categories later.
              </p>
            </div>
            
            {showStopAllDialog ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowStopAllDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={stopSharingAll}
                >
                  Confirm Stop All
                </Button>
              </div>
            ) : (
              <Button 
                variant="destructive" 
                disabled={enabledCount === 0}
                onClick={() => setShowStopAllDialog(true)}
                className="ml-4"
              >
                Stop All Sharing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card className="mt-8 bg-muted/30 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">Your Privacy is Protected</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• All shared data is encrypted and anonymized before being sent to partners</p>
                <p>• You can change these settings at any time</p>
                <p>• Partners never receive your personal identity information</p>
                <p>• We comply with New Zealand's Privacy Act and international data protection standards</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}