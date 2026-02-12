import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Info } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Manage your notification preferences</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          WhatsApp notifications are not enabled in this version. This feature will be available in a future update.
        </AlertDescription>
      </Alert>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>WhatsApp Integration</CardTitle>
          <CardDescription>Receive alerts and updates via WhatsApp (Not available in v1)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label htmlFor="low-stock" className="cursor-not-allowed">
                Low Stock Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
            </div>
            <Switch id="low-stock" disabled />
          </div>
          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label htmlFor="daily-summary" className="cursor-not-allowed">
                Daily Sales Summary
              </Label>
              <p className="text-sm text-muted-foreground">Receive end-of-day sales reports</p>
            </div>
            <Switch id="daily-summary" disabled />
          </div>
          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label htmlFor="new-sale" className="cursor-not-allowed">
                New Sale Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Get instant alerts for each sale</p>
            </div>
            <Switch id="new-sale" disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
