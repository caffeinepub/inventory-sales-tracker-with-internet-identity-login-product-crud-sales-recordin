import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileSettings() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [displayName, setDisplayName] = useState('');
  const [threshold, setThreshold] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName);
      setThreshold(userProfile.defaultLowStockThreshold.toString());
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    const thresholdNum = parseInt(threshold);
    if (isNaN(thresholdNum) || thresholdNum < 0) {
      setError('Please enter a valid threshold (0 or greater)');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        displayName: displayName.trim(),
        defaultLowStockThreshold: BigInt(thresholdNum),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={saveProfile.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Default Low Stock Threshold</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                placeholder="10"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                disabled={saveProfile.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Products below this quantity will trigger low stock alerts
              </p>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Profile updated successfully!</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
