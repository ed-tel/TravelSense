import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Shield, Lock, Eye, Database, Bell, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export function PrivacySettingsPage() {
  const [dataRetention, setDataRetention] = useState([12]);
  const [anonymization, setAnonymization] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [monthlyReports, setMonthlyReports] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [shareSpending, setShareSpending] = useState(true);
  const [shareBookingHistory, setShareBookingHistory] = useState(true);
  const [shareDemographics, setShareDemographics] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Privacy Settings Updated', {
      description: 'Your privacy preferences have been saved successfully.'
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Privacy & Security Settings</h1>
        <p className="text-gray-600">
          Manage how your data is collected, stored, and shared. You're always in control.
        </p>
      </div>

      {/* Data Sharing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Sharing Preferences
          </CardTitle>
          <CardDescription>
            Choose which types of data you're willing to share with partners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Location Data</Label>
              <p className="text-sm text-muted-foreground">
                Share your travel routes and destinations
              </p>
            </div>
            <Switch
              checked={shareLocation}
              onCheckedChange={setShareLocation}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Spending Patterns</Label>
              <p className="text-sm text-muted-foreground">
                Share your purchasing and spending behavior
              </p>
            </div>
            <Switch
              checked={shareSpending}
              onCheckedChange={setShareSpending}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Booking History</Label>
              <p className="text-sm text-muted-foreground">
                Share your past bookings and reservations
              </p>
            </div>
            <Switch
              checked={shareBookingHistory}
              onCheckedChange={setShareBookingHistory}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Demographics</Label>
              <p className="text-sm text-muted-foreground">
                Share age, gender, and other demographic information
              </p>
            </div>
            <Switch
              checked={shareDemographics}
              onCheckedChange={setShareDemographics}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Protection
          </CardTitle>
          <CardDescription>
            How we protect your information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Anonymization</Label>
              <p className="text-sm text-muted-foreground">
                Remove personally identifiable information before sharing
              </p>
            </div>
            <Switch
              checked={anonymization}
              onCheckedChange={setAnonymization}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>End-to-End Encryption</Label>
              <p className="text-sm text-muted-foreground">
                Encrypt all data transfers (Recommended)
              </p>
            </div>
            <Switch
              checked={dataEncryption}
              onCheckedChange={setDataEncryption}
              disabled
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <Label>Data Retention Period</Label>
              <p className="text-sm text-muted-foreground">
                Automatically delete shared data after: {dataRetention[0]} months
              </p>
            </div>
            <Slider
              value={dataRetention}
              onValueChange={setDataRetention}
              min={3}
              max={24}
              step={3}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 months</span>
              <span>24 months</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Stay informed about your data activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about new data requests
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get text alerts for important privacy events
              </p>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Monthly Privacy Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive detailed reports of your data activity
              </p>
            </div>
            <Switch
              checked={monthlyReports}
              onCheckedChange={setMonthlyReports}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
          <CardDescription>
            Exercise your rights over your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <span>Download All My Data</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span>Request Data Correction</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between text-destructive border-destructive hover:bg-destructive/10">
            <span>Delete All My Data</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} className="bg-[#2D4AFF] hover:bg-[#2D4AFF]/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
