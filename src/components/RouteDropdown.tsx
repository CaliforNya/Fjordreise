"use client";

import { useEffect, useRef, useState } from "react";

const ROUTE_OPTIONS = ["Bergen", "Stavanger", "Hirtshals"] as const;

const dropdownTriggerClass =
  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-prussian_blue/30 bg-white px-3 py-2.5 text-left text-lg font-semibold text-ink_black shadow-sm transition hover:border-prussian_blue/55 hover:bg-prussian_blue/[0.04] focus:border-school_bus_yellow focus:outline-none focus:ring-2 focus:ring-school_bus_yellow/40";

type RouteDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RouteDropdown({ value, onChange }: RouteDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={dropdownTriggerClass}
      >
        <span>{value}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-prussian_blue opacity-70 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-lg border border-prussian_blue/25 bg-white  shadow-xl ring-1 ring-black/5"
        >
          {ROUTE_OPTIONS.map((opt) => (
            <li key={opt} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                className={`w-full px-3 py-2.5 text-left text-lg font-semibold transition ${
                  opt === value
                    ? "bg-school_bus_yellow/35 text-ink_black"
                    : "text-ink_black hover:bg-prussian_blue/10"
                }`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
