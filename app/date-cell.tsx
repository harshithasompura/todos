"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Todo } from "./types";
import { playScribble } from "./sound";

const monDayFmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });

export type DateCellProps = {
  iso: string;
  todos: Todo[];
  active: boolean;
  isToday: boolean;
  onFocus: () => void;
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function DateCell({ iso, todos, active, isToday, onFocus, onAdd, onToggle, onRemove }: DateCellProps) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const d = new Date(iso);
  const year = d.getFullYear();

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) {
      setAdding(false);
      return;
    }
    onAdd(t);
    setText("");
  }

  return (
    <article
      onClick={onFocus}
      className={`snap-start shrink-0 w-64 px-6 pt-5 pb-14 border-l-2 transition-all ${
        active
          ? "opacity-100 border-black bg-black/5 dark:border-white dark:bg-white/5"
          : "opacity-60 border-zinc-300 dark:border-zinc-800 hover:opacity-90"
      }`}
      aria-current={active ? "date" : undefined}
    >
      <header className="flex items-baseline gap-2 pb-3">
        <span
          className={`text-3xl font-bold ${
            isToday ? "bg-yellow-300 text-black px-2 -mx-1 rounded-sm" : "text-zinc-900 dark:text-white"
          }`}
        >
          {monDayFmt.format(d)}
        </span>
        <span className={`text-base font-bold ${isToday ? "text-yellow-600 dark:text-yellow-300" : "text-zinc-500 dark:text-zinc-400"}`}>{year}</span>
      </header>

      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="group flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!t.done) playScribble();
                onToggle(t.id);
              }}
              className={`h-3 w-3 rounded-full border-2 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${
                t.done
                  ? "bg-black border-black dark:bg-white dark:border-white"
                  : "border-zinc-500 hover:border-black dark:border-zinc-400 dark:hover:border-white"
              }`}
              aria-label={t.done ? `mark "${t.text}" as not done` : `mark "${t.text}" as done`}
              aria-pressed={t.done}
            />
            <span className={`flex-1 text-base font-bold leading-snug ${t.done ? "text-zinc-400 line-through dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"}`}>
              {t.text}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(t.id); }}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-black dark:text-zinc-300 dark:hover:text-white text-2xl leading-none px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
              aria-label={`delete "${t.text}"`}
            >
              ×
            </button>
          </li>
        ))}

        <li>
          {adding ? (
            <form onSubmit={submit} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full border-2 border-zinc-500 dark:border-zinc-400 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={() => { if (!text.trim()) setAdding(false); }}
                onKeyDown={(e) => { if (e.key === "Escape") { setText(""); setAdding(false); } }}
                placeholder="new todo"
                aria-label={`Add a todo for ${iso}`}
                className="flex-1 bg-transparent border-b border-zinc-400 dark:border-zinc-500 text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-black dark:focus:border-white pb-0.5"
              />
            </form>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onFocus(); setAdding(true); }}
              className="flex items-center gap-3 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
              aria-label={`Add a todo for ${iso}`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center text-2xl leading-none">+</span>
              <span className="text-lg">add</span>
            </button>
          )}
        </li>
      </ul>
    </article>
  );
}
