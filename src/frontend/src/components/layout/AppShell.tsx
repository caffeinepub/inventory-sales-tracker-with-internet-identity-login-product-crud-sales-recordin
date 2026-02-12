import { ReactNode } from 'react';
import { Menu, LayoutDashboard, Package, ShoppingCart, User, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Separator } from '../ui/separator';
import LoginButton from '../auth/LoginButton';
import { useGetCallerUserProfile } from '../../hooks/useUserProfile';
import { SiCaffeine } from 'react-icons/si';

type Page = 'dashboard' | 'products' | 'sales' | 'profile' | 'notifications';

interface AppShellProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as Page, label: 'Products', icon: Package },
    { id: 'sales' as Page, label: 'Sales', icon: ShoppingCart },
    { id: 'notifications' as Page, label: 'Notifications', icon: Bell },
    { id: 'profile' as Page, label: 'Profile', icon: User },
  ];

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentPage === item.id ? 'secondary' : 'ghost'}
            className="justify-start gap-2"
            onClick={() => onNavigate(item.id)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold">Inventory Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {userProfile.displayName}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 border-r bg-card md:block">
          <div className="sticky top-16 p-4">
            <NavContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container max-w-7xl p-4 md:p-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Built with <SiCaffeine className="h-4 w-4 text-primary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Inventory Tracker</p>
        </div>
      </footer>
    </div>
  );
}
