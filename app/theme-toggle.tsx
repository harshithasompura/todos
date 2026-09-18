"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const KEY = "orbit:theme";
const EVENT = "orbit:theme-change";

function readTheme(): Theme {
  try {
    return (localStorage.getItem(KEY) as Theme | null) ?? "light";
  } catch {
    return "light";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getServerSnapshot(): Theme {
  return "light";
}

function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
      className="fixed top-4 right-4 z-30 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-white/85 text-zinc-900 backdrop-blur hover:bg-zinc-100 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-zinc-600 dark:bg-black/70 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus-visible:ring-white transition-colors"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
