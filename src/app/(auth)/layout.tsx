import Link from 'next/link';
import { Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-text-primary">Kaput</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
