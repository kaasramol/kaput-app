# /new-component [ComponentName]

Scaffold a new React component for the Kaput project.

## Steps
1. Create `src/components/{directory}/{ComponentName}.tsx` with:
   - `'use client'` directive only if the component needs hooks or event handlers
   - Import `cn` from `@/lib/utils`
   - TypeScript interface `{ComponentName}Props` with `className?: string`
   - Named export (not default) using dark theme Tailwind classes
   - Use design tokens: bg-bg-card, text-text-primary, border-border, etc.

2. Follow these conventions:
   - PascalCase filename matching component name
   - One component per file
   - Use `cn()` for conditional class merging
   - Use Tailwind utility classes only (no inline styles)
   - Use CSS variables for theme tokens: `var(--radius-md)`, `var(--shadow-card)`

## Template
```tsx
'use client';

import { cn } from '@/lib/utils';

interface {ComponentName}Props {
  className?: string;
}

export function {ComponentName}({ className }: {ComponentName}Props) {
  return (
    <div className={cn('rounded-[var(--radius-md)] border border-border bg-bg-card p-4', className)}>
      {/* Component content */}
    </div>
  );
}
```
