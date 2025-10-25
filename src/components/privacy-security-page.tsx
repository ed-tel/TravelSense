import { useState } from "react";
import { Shield, Lock, Key, Trash2, Eye, Calendar, MapPin, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface AuditLogEntry {
  id: string;
  action: string;
  partner: string;
  timestamp: string;
  dataType: string;
  status: "success" | "warning" | "info";
}

export function PrivacySecurityPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const auditLog: AuditLogEntry[] = [
    {
      id: "1",
      action: "Data shared with TravelSense Analytics",
      partner: "TravelSense Analytics",
      timestamp: "12 Sept 2024, 2:34 PM",
      dataType: "Location & Spending Data",
      status: "success"
    },
    {
      id: "2",
      action: "Profile accessed by Air New Zealand",
      partner: "Air New Zealand",
      timestamp: "11 Sept 2024, 9:15 AM",
      dataType: "Travel Preferences",
      status: "success"
    },
    {
      id: "3",
      action: "Data export requested",
      partner: "User Request",
      timestamp: "10 Sept 2024, 4:22 PM",
      dataType: "All Categories",
      status: "info"
    },
    {
      id: "4",
      action: "Unusual access attempt detected",
      partner: "Security System",
      timestamp: "8 Sept 2024, 11:45 PM",
      dataType: "Account Access",
      status: "warning"
    },
    {
      id: "5",
      action: "Password changed successfully",
      partner: "User Action",
      timestamp: "5 Sept 2024, 3:18 PM",
      dataType: "Account Settings",
      status: "success"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "info": return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case "warning": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Warning</Badge>;
      case "info": return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-medium">Privacy & Security</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage your account security settings and monitor how your data is being used.
        </p>
      </div>

      {/* Security Settings */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-medium">Security Settings</h2>
        
        <div className="grid gap-4">
          {/* Multi-Factor Authentication */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Multi-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Label htmlFor="mfa-toggle" className="text-sm">
                    {mfaEnabled ? "Enabled" : "Disabled"}
                  </Label>
                  <Switch
                    id="mfa-toggle"
                    checked={mfaEnabled}
                    onCheckedChange={setMfaEnabled}
                  />
                </div>
              </div>
              {mfaEnabled && (
                <div className="mt-4 text-xs text-green-700 bg-green-50 rounded-md p-2">
                  ✓ Your account is protected with SMS-based two-factor authentication
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Key className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Last changed 5 Sept 2024
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-red-200 bg-red-50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-900">Delete My Account</h3>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </div>
                {showDeleteConfirm ? (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        // Handle account deletion
                        setShowDeleteConfirm(false);
                      }}
                    >
                      Confirm Delete
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Data Protection Information */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Shield className="w-5 h-5" />
            <span>Data Protection & Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-700">
            <p>
              <strong>Your data is anonymised and encrypted.</strong> You control how long it is stored, 
              in compliance with the NZ Privacy Act and GDPR.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Data anonymisation</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">GDPR compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">NZ Privacy Act compliant</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Audit Log</h2>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-gray-600" />
              <span>Recent Data Access Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLog.map((entry, index) => (
                <div key={entry.id}>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getStatusIcon(entry.status)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{entry.action}</h4>
                        {getStatusBadge(entry.status)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Partner: {entry.partner}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{entry.timestamp}</span>
                          </div>
                        </div>
                        <p>Data Type: {entry.dataType}</p>
                      </div>
                    </div>
                  </div>
                  {index < auditLog.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Load More Entries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Security Tips */}
      <Card className="mt-8 bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Security Tips</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Use a strong, unique password for your TravelSense account</p>
                <p>• Keep your contact information up to date for security notifications</p>
                <p>• Review your audit log regularly to monitor account activity</p>
                <p>• Report any suspicious activity to our security team immediately</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}