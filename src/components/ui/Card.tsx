import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'rounded-[var(--radius-lg)] border border-border bg-bg-card p-6 shadow-[var(--shadow-card)]',
        hover && 'transition-all hover:border-accent/30 hover:shadow-[var(--shadow-elevated)]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
