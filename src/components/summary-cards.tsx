import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Calendar, Clock, Database, AlertCircle, Shield, Gift, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DataShare } from "../App";

interface SummaryCardsProps {
  recentDataShares: DataShare[];
  onNavigateToPartners: (partnerName?: string) => void;
  onNavigateToPrivacySettings?: () => void;
  onNavigateToConsentManagement?: () => void;
  onAlertClick?: (partnerId: string) => void;
}

const privacyAlerts = [
  {
    id: "DS-001",
    partner: "Air New Zealand",
    alert: "Data usage report available",
    daysAgo: 2,
    status: "info",
  },
  {
    id: "DS-002",
    partner: "Tourism New Zealand",
    alert: "Consent expires in 7 days",
    daysAgo: 0,
    status: "warning",
  },
  {
    id: "DS-003",
    partner: "Booking.com",
    alert: "New data request received",
    daysAgo: 1,
    status: "urgent",
  },
];

export function SummaryCards({ 
  recentDataShares, 
  onNavigateToPartners,
  onNavigateToPrivacySettings,
  onNavigateToConsentManagement,
  onAlertClick
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Data Shares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Recent Data Shares
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="popLayout">
            {recentDataShares.map((share) => (
              <motion.div
                key={share.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                layout
                onClick={() => onNavigateToPartners(share.partner)}
                className="border rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md hover:border-[#2D4AFF]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    {share.partner}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </h4>
                  <Badge 
                    variant={
                      share.status === "Active" ? "default" : "secondary"
                    }
                    className={share.status === "Active" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {share.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="truncate mr-2">Data: {share.dataType}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Gift className="h-3 w-3" />
                    {share.reward}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sharing Progress</span>
                    <span>{share.progress}%</span>
                  </div>
                  <Progress value={share.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Shared: {new Date(share.shareDate).toLocaleDateString()}
                  </div>
                  <span className="font-medium text-green-600">{share.value}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Privacy Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Consent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {privacyAlerts.map((alert, index) => (
            <div 
              key={index} 
              onClick={() => onAlertClick?.(alert.id)}
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:shadow-md hover:border-[#2D4AFF]/30 transition-all"
            >
              <div className="space-y-1">
                <h4 className="font-medium flex items-center gap-2">
                  {alert.partner}
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  {alert.alert}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertCircle 
                  className={`h-5 w-5 ${
                    alert.status === "urgent" ? "text-destructive" :
                    alert.status === "warning" ? "text-yellow-500" :
                    "text-blue-500"
                  }`} 
                />
                <div className="text-right">
                  <div className="font-medium">{alert.daysAgo === 0 ? "Today" : `${alert.daysAgo}d ago`}</div>
                  <div className="text-xs text-muted-foreground">
                    {alert.status === "urgent" ? "Action needed" : 
                     alert.status === "warning" ? "Review soon" : "Info"}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <h5 className="font-medium mb-3">Quick Actions</h5>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={onNavigateToPrivacySettings}
                className="p-3 text-sm border rounded-lg hover:bg-muted transition-colors"
              >
                Privacy Settings
              </button>
              <button 
                onClick={onNavigateToConsentManagement}
                className="p-3 text-sm border rounded-lg hover:bg-muted transition-colors"
              >
                Manage Consent
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}