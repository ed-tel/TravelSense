import { useState } from "react";
import { Gift, Zap, Plane, Utensils, ShoppingBag, Calendar, MapPin, Percent, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Reward {
  id: string;
  title: string;
  description: string;
  type: "travel" | "dining" | "shopping";
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  partner: string;
  expiryDate?: string;
  terms?: string;
  available: boolean;
}

export function RewardsPage() {
  const [rewards] = useState<Reward[]>([
    {
      id: "flight-discount",
      title: "10% Off Flights",
      description: "Save on your next domestic or international flight with Air New Zealand",
      type: "travel",
      value: "10% OFF",
      icon: Plane,
      partner: "Air New Zealand",
      expiryDate: "Dec 31, 2024",
      terms: "Valid for bookings over $300. Cannot be combined with other offers.",
      available: true
    },
    {
      id: "hotel-voucher",
      title: "Free Night Stay",
      description: "Complimentary night at participating hotels across New Zealand",
      type: "travel",
      value: "FREE NIGHT",
      icon: MapPin,
      partner: "Tourism Holdings",
      expiryDate: "Mar 15, 2025",
      terms: "Minimum 2-night stay required. Subject to availability.",
      available: true
    },
    {
      id: "restaurant-credit",
      title: "$25 Dining Credit",
      description: "Enjoy fine dining at premium restaurants in Auckland and Wellington",
      type: "dining",
      value: "$25",
      icon: Utensils,
      partner: "Fine Dining Network",
      expiryDate: "Jan 30, 2025",
      terms: "Valid at participating restaurants. Minimum spend $50.",
      available: true
    },
    {
      id: "activity-discount",
      title: "20% Off Adventures",
      description: "Discount on adventure activities and tours nationwide",
      type: "travel",
      value: "20% OFF",
      icon: Star,
      partner: "Adventure Tourism NZ",
      expiryDate: "Apr 20, 2025",
      terms: "Valid for most adventure activities. Some exclusions apply.",
      available: false
    },
    {
      id: "shopping-voucher",
      title: "$50 Shopping Voucher",
      description: "Use at participating retail stores and online shopping platforms",
      type: "shopping",
      value: "$50",
      icon: ShoppingBag,
      partner: "Retail Partners NZ",
      expiryDate: "Feb 28, 2025",
      terms: "Cannot be used for gift cards or sale items.",
      available: false
    },
    {
      id: "wine-tasting",
      title: "Wine Tasting Experience",
      description: "Complimentary wine tasting for 2 at premium Marlborough wineries",
      type: "dining",
      value: "FREE",
      icon: Utensils,
      partner: "Marlborough Wine Co.",
      expiryDate: "May 15, 2025",
      terms: "Advance booking required. Transport not included.",
      available: true
    }
  ]);

  // Mock user data
  const userBalance = {
    points: 750,
    vouchers: 3,
    nextRewardAt: 1000,
    categoriesShared: 4,
    categoriesNeeded: 1
  };

  const progressPercentage = (userBalance.points / userBalance.nextRewardAt) * 100;

  const filterRewards = (type: string) => {
    if (type === "all") return rewards;
    return rewards.filter(reward => reward.type === type);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "travel": return "bg-blue-500";
      case "dining": return "bg-orange-500";
      case "shopping": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "travel": return Plane;
      case "dining": return Utensils;
      case "shopping": return ShoppingBag;
      default: return Gift;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Gift className="w-6 h-6 text-green-600" />
          <h1 className="text-3xl font-medium">Your Rewards</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Enjoy the benefits of sharing your data with our trusted tourism partners.
        </p>
      </div>

      {/* Rewards Balance */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Zap className="w-5 h-5" />
              <span>Points Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-green-900 mb-1">
              {userBalance.points.toLocaleString()}
            </div>
            <p className="text-sm text-green-700">Points earned this month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Gift className="w-5 h-5" />
              <span>Available Vouchers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-blue-900 mb-1">
              {userBalance.vouchers}
            </div>
            <p className="text-sm text-blue-700">Ready to redeem</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Star className="w-5 h-5" />
              <span>Member Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium text-purple-900 mb-1">
              Premium
            </div>
            <p className="text-sm text-purple-700">Sharing {userBalance.categoriesShared}/5 categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Reward */}
      <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Calendar className="w-5 h-5" />
            <span>Progress to Next Reward</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-700">
              Share {userBalance.categoriesNeeded} more category to unlock 15% off flights
            </span>
            <span className="font-medium text-orange-800">
              {userBalance.points}/{userBalance.nextRewardAt} points
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-orange-600">
            You're {userBalance.nextRewardAt - userBalance.points} points away from your next reward!
          </p>
        </CardContent>
      </Card>

      {/* Rewards Grid with Filters */}
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Available Rewards</h2>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
            <TabsTrigger value="travel" className="text-sm">Travel</TabsTrigger>
            <TabsTrigger value="dining" className="text-sm">Dining</TabsTrigger>
            <TabsTrigger value="shopping" className="text-sm">Shopping</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const IconComponent = reward.icon;
                const TypeIcon = getTypeIcon(reward.type);
                return (
                  <Card key={reward.id} className={`hover:shadow-lg transition-shadow ${
                    !reward.available ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(reward.type)} text-white`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <Badge variant="secondary" className="text-xs">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {reward.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg text-green-600">
                            {reward.value}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>Partner: {reward.partner}</span>
                        </div>
                        {reward.expiryDate && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Expires: {reward.expiryDate}</span>
                          </div>
                        )}
                      </div>
                      
                      {reward.terms && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          <strong>Terms:</strong> {reward.terms}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        disabled={!reward.available}
                        variant={reward.available ? "default" : "secondary"}
                      >
                        {reward.available ? "Redeem Now" : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards("travel").map((reward) => {
                const IconComponent = reward.icon;
                return (
                  <Card key={reward.id} className={`hover:shadow-lg transition-shadow ${
                    !reward.available ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500 text-white">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Plane className="w-3 h-3 mr-1" />
                            travel
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg text-green-600">
                            {reward.value}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>Partner: {reward.partner}</span>
                        </div>
                        {reward.expiryDate && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Expires: {reward.expiryDate}</span>
                          </div>
                        )}
                      </div>
                      
                      {reward.terms && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          <strong>Terms:</strong> {reward.terms}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        disabled={!reward.available}
                        variant={reward.available ? "default" : "secondary"}
                      >
                        {reward.available ? "Redeem Now" : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="dining" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards("dining").map((reward) => {
                const IconComponent = reward.icon;
                return (
                  <Card key={reward.id} className={`hover:shadow-lg transition-shadow ${
                    !reward.available ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500 text-white">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Utensils className="w-3 h-3 mr-1" />
                            dining
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg text-green-600">
                            {reward.value}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>Partner: {reward.partner}</span>
                        </div>
                        {reward.expiryDate && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Expires: {reward.expiryDate}</span>
                          </div>
                        )}
                      </div>
                      
                      {reward.terms && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          <strong>Terms:</strong> {reward.terms}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        disabled={!reward.available}
                        variant={reward.available ? "default" : "secondary"}
                      >
                        {reward.available ? "Redeem Now" : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards("shopping").map((reward) => {
                const IconComponent = reward.icon;
                return (
                  <Card key={reward.id} className={`hover:shadow-lg transition-shadow ${
                    !reward.available ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500 text-white">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            shopping
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg text-green-600">
                            {reward.value}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>Partner: {reward.partner}</span>
                        </div>
                        {reward.expiryDate && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Expires: {reward.expiryDate}</span>
                          </div>
                        )}
                      </div>
                      
                      {reward.terms && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          <strong>Terms:</strong> {reward.terms}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        disabled={!reward.available}
                        variant={reward.available ? "default" : "secondary"}
                      >
                        {reward.available ? "Redeem Now" : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call to Action */}
      <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-medium text-green-800">Want More Rewards?</h3>
              <p className="text-sm text-green-700">
                Share additional data categories to unlock exclusive partner offers and earn more points.
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Update Data Sharing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}