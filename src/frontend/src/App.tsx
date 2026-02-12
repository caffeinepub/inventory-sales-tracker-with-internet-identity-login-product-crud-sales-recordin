import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Loader2 } from 'lucide-react';
import LoginButton from './components/auth/LoginButton';
import ProfileOnboardingDialog from './components/profile/ProfileOnboardingDialog';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import ProfileSettings from './pages/ProfileSettings';
import Notifications from './pages/Notifications';
import { useState } from 'react';

type Page = 'dashboard' | 'products' | 'sales' | 'profile' | 'notifications';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show signed-out screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Inventory & Sales Tracker</CardTitle>
            <CardDescription>
              Manage your products, track sales, and monitor inventory with ease
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Sign in to access your inventory management dashboard
            </p>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show onboarding if profile doesn't exist
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <ProfileOnboardingDialog open={true} onOpenChange={() => {}} />
      </div>
    );
  }

  // Show loading while fetching profile
  if (profileLoading || !isFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Render main app
  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'products' && <Products />}
      {currentPage === 'sales' && <Sales />}
      {currentPage === 'profile' && <ProfileSettings />}
      {currentPage === 'notifications' && <Notifications />}
    </AppShell>
  );
}
