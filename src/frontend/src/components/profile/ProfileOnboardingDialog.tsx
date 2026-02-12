import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useUserProfile';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProfileOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileOnboardingDialog({ open, onOpenChange }: ProfileOnboardingDialogProps) {
  const [displayName, setDisplayName] = useState('');
  const [threshold, setThreshold] = useState('10');
  const [error, setError] = useState('');

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Let's set up your profile</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself to get started with your inventory tracker
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Your Name</Label>
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
              You'll be alerted when products fall below this quantity
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
