import { useState } from "react";
import { Gift, Zap, Plane, Utensils, ShoppingBag, Calendar, MapPin, Percent, Clock, Star, Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { CustomToaster } from "./ui/sonner";

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
  redeemed?: boolean;
  voucherCode?: string;
}

export function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([
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
      available: true,
      redeemed: false
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
      available: true,
      redeemed: false
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
      available: true,
      redeemed: false
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
      available: false,
      redeemed: false
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
      available: false,
      redeemed: false
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
      available: true,
      redeemed: false
    }
  ]);

  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedemptionDialogOpen, setIsRedemptionDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock user data
  const redeemedCount = rewards.filter(r => r.redeemed).length;
  const userBalance = {
    points: 750,
    vouchers: 3 + redeemedCount,
    nextRewardAt: 1000,
    categoriesShared: 4,
    categoriesNeeded: 1
  };

  const progressPercentage = (userBalance.points / userBalance.nextRewardAt) * 100;

  const generateVoucherCode = (rewardId: string) => {
    const prefix = rewardId.substring(0, 3).toUpperCase();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomString}`;
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRedemptionDialogOpen(true);
  };

  const handleConfirmRedemption = () => {
    if (selectedReward) {
      const voucherCode = generateVoucherCode(selectedReward.id);
      
      // Update the reward with redeemed status and voucher code
      setRewards(prevRewards =>
        prevRewards.map(r =>
          r.id === selectedReward.id
            ? { ...r, redeemed: true, voucherCode }
            : r
        )
      );

      // Update the selected reward to show the voucher code
      setSelectedReward({ ...selectedReward, redeemed: true, voucherCode });
      
      toast.success("Reward redeemed successfully!", {
        description: `Your voucher code is ${voucherCode}`
      });
    }
  };

  const handleCopyVoucherCode = async () => {
    if (selectedReward?.voucherCode) {
      try {
        await navigator.clipboard.writeText(selectedReward.voucherCode);
        setCopiedCode(true);
        toast.success("Voucher code copied to clipboard!");
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (error) {
        // Fallback if clipboard API is not available
        toast.info(`Code: ${selectedReward.voucherCode}`);
      }
    }
  };

  const handleCloseDialog = () => {
    setIsRedemptionDialogOpen(false);
    setCopiedCode(false);
    setTimeout(() => setSelectedReward(null), 200);
  };

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

  const RewardCard = ({ reward }: { reward: Reward }) => {
    const IconComponent = reward.icon;
    const TypeIcon = getTypeIcon(reward.type);
    
    return (
      <Card className={`hover:shadow-lg transition-shadow ${
        !reward.available ? 'opacity-60' : ''
      } ${reward.redeemed ? 'border-green-300 bg-green-50/30' : ''}`}>
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
              {reward.redeemed ? (
                <Badge className="bg-green-600 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Redeemed
                </Badge>
              ) : (
                <div className="font-medium text-lg text-green-600">
                  {reward.value}
                </div>
              )}
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
          
          {reward.redeemed && reward.voucherCode && (
            <div className="bg-green-100 border border-green-300 p-3 rounded-lg">
              <p className="text-xs text-green-800 mb-1">Your Voucher Code:</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-green-900">{reward.voucherCode}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(reward.voucherCode!);
                      toast.success("Code copied!");
                    } catch (error) {
                      toast.info(`Code: ${reward.voucherCode}`);
                    }
                  }}
                  className="h-6 text-green-700 hover:text-green-900"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            className="w-full" 
            disabled={!reward.available || reward.redeemed}
            variant={reward.available && !reward.redeemed ? "default" : "secondary"}
            onClick={() => handleRedeemClick(reward)}
          >
            {reward.redeemed ? "Already Redeemed" : reward.available ? "Redeem Now" : "Not Available"}
          </Button>
        </CardContent>
      </Card>
    );
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
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards("travel").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dining" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards("dining").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRewards("shopping").map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
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

      {/* Redemption Dialog */}
      <Dialog open={isRedemptionDialogOpen} onOpenChange={setIsRedemptionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span>{selectedReward?.redeemed ? "Voucher Details" : "Redeem Reward"}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedReward?.redeemed 
                ? "Your reward has been successfully redeemed. Save your voucher code below."
                : "Confirm that you want to redeem this reward. You'll receive a voucher code to use with the partner."}
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              {/* Reward Summary */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{selectedReward.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedReward.description}
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white shrink-0">
                    {selectedReward.value}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedReward.partner}</span>
                  </div>
                  {selectedReward.expiryDate && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Valid until {selectedReward.expiryDate}</span>
                    </div>
                  )}
                </div>

                {selectedReward.terms && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <strong>Terms:</strong> {selectedReward.terms}
                  </div>
                )}
              </div>

              {/* Voucher Code (after redemption) */}
              {selectedReward.redeemed && selectedReward.voucherCode && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-green-900">Your Voucher Code:</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyVoucherCode}
                      className="h-8 text-green-700 hover:text-green-900"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <code className="block text-center text-xl font-mono font-medium text-green-900 py-2">
                    {selectedReward.voucherCode}
                  </code>
                  <p className="text-xs text-green-700 text-center mt-2">
                    Present this code to the partner when making your booking or purchase
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedReward?.redeemed ? (
              <Button onClick={handleCloseDialog} className="w-full">
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleConfirmRedemption} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  Confirm Redemption
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CustomToaster />
    </div>
  );
}