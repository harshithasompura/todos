import type { ReactNode } from "react";

export function Keycap({ children, label }: { children: ReactNode; label: string }) {
  return (
    <kbd
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-zinc-100 text-zinc-900 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] dark:border-zinc-500 dark:bg-zinc-800 dark:text-white dark:shadow-[inset_0_-2px_0_rgba(0,0,0,0.6)]"
    >
      {children}
    </kbd>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
