"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DateGrid } from "./date-grid";
import { Keycap, ArrowLeftIcon, ArrowRightIcon } from "./keycap";
import type { TodosMap } from "./types";

const DAYS_BEFORE = 60;
const DAYS_AFTER = 0;
const STORAGE_KEY = "orbit:todos";

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildRange(): { dates: string[]; todayIso: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates: string[] = [];
  for (let i = -DAYS_BEFORE; i <= DAYS_AFTER; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(toIso(d));
  }
  return { dates, todayIso: toIso(today) };
}

function loadAll(): TodosMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TodosMap;
  } catch {
    return {};
  }
}

function saveAll(map: TodosMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function Calendar() {
  const { dates, todayIso } = useMemo(buildRange, []);
  const [selected, setSelected] = useState(todayIso);
  const [todosMap, setTodosMap] = useState<TodosMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTodosMap(loadAll());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAll(todosMap);
  }, [hydrated, todosMap]);

  const addTodo = useCallback((iso: string, text: string) => {
    setTodosMap((prev) => ({
      ...prev,
      [iso]: [...(prev[iso] ?? []), { id: crypto.randomUUID(), text, done: false }],
    }));
  }, []);

  const toggleTodo = useCallback((iso: string, id: string) => {
    setTodosMap((prev) => ({
      ...prev,
      [iso]: (prev[iso] ?? []).map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);

  const removeTodo = useCallback((iso: string, id: string) => {
    setTodosMap((prev) => ({
      ...prev,
      [iso]: (prev[iso] ?? []).filter((t) => t.id !== id),
    }));
  }, []);

  const step = useCallback(
    (delta: number) => {
      const idx = dates.indexOf(selected);
      if (idx === -1) return;
      const next = dates[Math.min(dates.length - 1, Math.max(0, idx + delta))];
      setSelected(next);
    },
    [dates, selected],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "Home") { e.preventDefault(); setSelected(todayIso); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, todayIso]);

  return (
    <>
      <div className="w-full" style={{ paddingTop: "24px" }}>
        <DateGrid
          dates={dates}
          value={selected}
          todayIso={todayIso}
          todosMap={todosMap}
          onChange={setSelected}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
      </div>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 text-base text-zinc-900 bg-white/85 backdrop-blur border border-zinc-300 rounded-xl px-4 py-2.5 shadow-sm dark:text-white dark:bg-black/85 dark:border-zinc-700 dark:shadow-none">
        <Keycap label="Previous day"><ArrowLeftIcon /></Keycap>
        <Keycap label="Next day"><ArrowRightIcon /></Keycap>
        <span className="ml-2 mr-3">navigate</span>
        <button
          onClick={() => setSelected(todayIso)}
          className="cursor-pointer rounded-md border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-900 hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-500 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black transition-colors"
        >
          Today
        </button>
      </div>
    </>
  );
}
