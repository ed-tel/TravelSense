import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Calendar, Clock, Database, AlertCircle, Shield, Gift } from "lucide-react";

const recentDataShares = [
  {
    id: 1,
    partner: "Air New Zealand",
    dataType: "Travel Preferences",
    status: "Active",
    progress: 100,
    shareDate: "2025-01-20",
    reward: "25 Airpoints",
    value: "$12.50",
  },
  {
    id: 2,
    partner: "Tourism New Zealand",
    dataType: "Location History",
    status: "Pending",
    progress: 60,
    shareDate: "2025-01-18",
    reward: "NZ$15 Voucher",
    value: "$15.00",
  },
  {
    id: 3,
    partner: "Booking.com",
    dataType: "Accommodation Preferences",
    status: "Review",
    progress: 90,
    shareDate: "2025-01-15",
    reward: "10% Discount",
    value: "$8.00",
  },
];

const privacyAlerts = [
  {
    partner: "Air New Zealand",
    alert: "Data usage report available",
    daysAgo: 2,
    status: "info",
  },
  {
    partner: "Tourism New Zealand",
    alert: "Consent expires in 7 days",
    daysAgo: 0,
    status: "warning",
  },
  {
    partner: "Booking.com",
    alert: "New data request received",
    daysAgo: 1,
    status: "urgent",
  },
];

export function SummaryCards() {
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
          {recentDataShares.map((share) => (
            <div key={share.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{share.partner}</h4>
                <Badge 
                  variant={
                    share.status === "Pending" ? "destructive" :
                    share.status === "Active" ? "default" :
                    "secondary"
                  }
                >
                  {share.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Data: {share.dataType}</span>
                <span className="flex items-center gap-1">
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
            </div>
          ))}
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
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">{alert.partner}</h4>
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
              <button className="p-3 text-sm border rounded-lg hover:bg-muted transition-colors">
                Privacy Settings
              </button>
              <button className="p-3 text-sm border rounded-lg hover:bg-muted transition-colors">
                Manage Consent
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}