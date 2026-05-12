"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import posthog from "posthog-js";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { airlineNames } from "@/data/airlines";

interface Props {
  value: string;
  onChange: (code: string, isCustom?: boolean) => void;
  placeholder?: string;
  error?: boolean;
  isCustom?: boolean;
}

interface AirlineOption {
  code: string;
  name: string;
}

const allAirlines: AirlineOption[] = Object.entries(airlineNames)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

function formatAirline(a: AirlineOption): string {
  return `${a.name} (${a.code})`;
}

function matchAirline(airline: AirlineOption, query: string): boolean {
  const q = query.toLowerCase();
  return (
    airline.code.toLowerCase().includes(q) ||
    airline.name.toLowerCase().includes(q)
  );
}

export default function AirlineSearch({
  value,
  onChange,
  placeholder = "Type airline name or code...",
  error = false,
  isCustom = false,
}: Props) {
  const selected = isCustom ? null : allAirlines.find((a) => a.code === value);
  const [query, setQuery] = useState(isCustom ? value : "");
  const [focused, setFocused] = useState(false);
  const [freeTextMode, setFreeTextMode] = useState(isCustom);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return allAirlines;
    return allAirlines.filter((a) => matchAirline(a, query.trim()));
  }, [query]);

  useEffect(() => {
    if (freeTextMode) return;
    if (trackTimer.current) clearTimeout(trackTimer.current);
    const q = query.trim();
    if (q.length < 3) return;
    if (filtered.length > 0) return;
    trackTimer.current = setTimeout(() => {
      posthog.capture("airline_search_no_results", { query: q });
    }, 800);
    return () => {
      if (trackTimer.current) clearTimeout(trackTimer.current);
    };
  }, [query, filtered, freeTextMode]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = focused && !freeTextMode && query.trim().length > 0;
  const errorClass = error ? "border-destructive ring-1 ring-destructive" : "";

  if (freeTextMode) {
    return (
      <div ref={wrapperRef} className="relative">
        <Input
          className={cn("ph-no-mask", errorClass)}
          value={value}
          onChange={(e) => onChange(e.target.value, true)}
          placeholder="Enter airline name"
          autoComplete="off"
        />
        <button
          type="button"
          className="mt-1 text-xs text-muted-foreground underline hover:text-foreground"
          onClick={() => {
            setFreeTextMode(false);
            setQuery("");
            onChange("", false);
            posthog.capture("airline_freetext_cancelled");
          }}
        >
          Back to airline list
        </button>
        <p className="mt-1 text-xs text-muted-foreground">
          We&apos;ll review your eligibility manually for this airline.
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        className={cn("ph-no-mask", errorClass)}
        value={focused ? query : selected ? formatAirline(selected) : query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!focused) setFocused(true);
        }}
        onFocus={() => {
          setFocused(true);
          if (selected) setQuery("");
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg max-h-[240px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center space-y-2">
              <div>No airline found.</div>
              <button
                type="button"
                className="text-xs text-primary underline"
                onMouseDown={(e) => {
                  e.preventDefault();
                  posthog.capture("airline_freetext_opened", { query: query.trim() });
                  setFreeTextMode(true);
                  onChange(query.trim(), true);
                  setFocused(false);
                }}
              >
                Can&apos;t find your airline? Type it manually
              </button>
            </div>
          ) : (
            filtered.map((a) => (
              <button
                key={a.code}
                type="button"
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                  value === a.code && "bg-accent/50 font-medium"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(a.code, false);
                  setQuery(formatAirline(a));
                  setFocused(false);
                }}
              >
                {formatAirline(a)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
