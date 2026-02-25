import { AuthGuard } from '@/components/layout/AuthGuard';

export const dynamic = 'force-dynamic';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
