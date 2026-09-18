"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { DateCell } from "./date-cell";
import type { TodosMap, Todo } from "./types";

export type DateGridProps = {
  dates: string[];
  value: string;
  todayIso: string;
  todosMap: TodosMap;
  onChange: (iso: string) => void;
  onAdd: (iso: string, text: string) => void;
  onToggle: (iso: string, id: string) => void;
  onRemove: (iso: string, id: string) => void;
};

export function DateGrid({ dates, value, todayIso, todosMap, onChange, onAdd, onToggle, onRemove }: DateGridProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const isProgrammaticScroll = useRef(false);
  const scrollEndTimer = useRef<number | null>(null);

  const setItemRef = useCallback((iso: string) => (el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(iso, el);
    else itemRefs.current.delete(iso);
  }, []);

  const scrollToIso = useCallback((iso: string, behavior: ScrollBehavior) => {
    const scroller = scrollerRef.current;
    const el = itemRefs.current.get(iso);
    if (!scroller || !el) return;
    const target = el.offsetLeft + el.clientWidth / 2 - scroller.clientWidth / 2;
    isProgrammaticScroll.current = true;
    scroller.scrollTo({ left: target, behavior });
  }, []);

  const didInit = useRef(false);

  useLayoutEffect(() => {
    let cancelled = false;
    function center() {
      if (cancelled) return;
      scrollToIso(value, "auto");
    }
    // First paint
    const raf = requestAnimationFrame(center);
    // After fonts settle (Annie font swap shifts widths)
    document.fonts?.ready.then(() => {
      requestAnimationFrame(() => {
        center();
        didInit.current = true;
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!didInit.current) return;
    scrollToIso(value, "smooth");
  }, [value, scrollToIso]);

  const findCenteredIso = useCallback((): string | null => {
    const scroller = scrollerRef.current;
    if (!scroller) return null;
    const center = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
    let best: { iso: string; dist: number } | null = null;
    for (const [iso, el] of itemRefs.current) {
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(itemCenter - center);
      if (!best || dist < best.dist) best = { iso, dist };
    }
    return best?.iso ?? null;
  }, []);

  const onScroll = useCallback(() => {
    if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(() => {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
        return;
      }
      const iso = findCenteredIso();
      if (iso && iso !== value) onChange(iso);
    }, 100);
  }, [findCenteredIso, onChange, value]);

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, []);

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      onWheel={onWheel}
      className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
      role="listbox"
      aria-label="Days"
    >
      <div className="flex">
        <div className="shrink-0" style={{ width: "calc(50% - 8rem)" }} aria-hidden="true" />
        {dates.map((iso) => {
          const active = iso === value;
          return (
            <div key={iso} ref={setItemRef(iso)}>
              <DateCell
                iso={iso}
                active={active}
                isToday={iso === todayIso}
                todos={todosMap[iso] ?? emptyTodos}
                onFocus={() => onChange(iso)}
                onAdd={(text) => onAdd(iso, text)}
                onToggle={(id) => onToggle(iso, id)}
                onRemove={(id) => onRemove(iso, id)}
              />
            </div>
          );
        })}
        <div className="shrink-0" style={{ width: "calc(50% - 8rem)" }} aria-hidden="true" />
      </div>
    </div>
  );
}

const emptyTodos: Todo[] = [];
