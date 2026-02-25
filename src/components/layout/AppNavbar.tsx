'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map, LayoutDashboard, Settings, LogOut, Menu, X, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { logOut } from '@/lib/auth';

const appLinks = [
  { href: '/map', label: 'Map', icon: Map },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logOut();
    router.replace('/login');
  };

  const initial = user?.displayName?.charAt(0).toUpperCase() ?? '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">Kaput</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {appLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            {initial}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-card md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-96' : 'max-h-0 border-t-0'
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {appLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <div className="mt-4 border-t border-border pt-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
