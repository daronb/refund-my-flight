"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import posthog from "posthog-js";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { allAirports, formatAirport, type Airport } from "@/data/airports";

interface Props {
  value: string;
  onChange: (code: string, isCustom?: boolean) => void;
  fieldName: string;
  placeholder?: string;
  error?: boolean;
  isCustom?: boolean;
}

function matchAirport(airport: Airport, query: string): boolean {
  const q = query.toLowerCase();
  return (
    airport.code.toLowerCase().includes(q) ||
    airport.city.toLowerCase().includes(q) ||
    airport.name.toLowerCase().includes(q) ||
    airport.country.toLowerCase().includes(q) ||
    (airport.airlines?.toLowerCase().includes(q) ?? false)
  );
}

export default function AirportSearch({
  value,
  onChange,
  fieldName,
  placeholder = "Type city, country or airport code...",
  error = false,
  isCustom = false,
}: Props) {
  const selected = isCustom ? null : allAirports.find((a) => a.code === value);
  const [query, setQuery] = useState(isCustom ? value : "");
  const [focused, setFocused] = useState(false);
  const [freeTextMode, setFreeTextMode] = useState(isCustom);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return allAirports.filter((a) => matchAirport(a, query.trim()));
  }, [query]);

  useEffect(() => {
    if (freeTextMode) return;
    if (trackTimer.current) clearTimeout(trackTimer.current);
    const q = query.trim();
    if (q.length < 3) return;
    if (filtered.length > 0) return;
    trackTimer.current = setTimeout(() => {
      posthog.capture("airport_search_no_results", {
        field: fieldName,
        query: q,
      });
    }, 800);
    return () => {
      if (trackTimer.current) clearTimeout(trackTimer.current);
    };
  }, [query, filtered, fieldName, freeTextMode]);

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
          placeholder="Enter airport name or city"
          autoComplete="off"
        />
        <button
          type="button"
          className="mt-1 text-xs text-muted-foreground underline hover:text-foreground"
          onClick={() => {
            setFreeTextMode(false);
            setQuery("");
            onChange("", false);
            posthog.capture("airport_freetext_cancelled", { field: fieldName });
          }}
        >
          Back to airport list
        </button>
        <p className="mt-1 text-xs text-muted-foreground">
          We&apos;ll review your eligibility manually for this airport.
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        className={cn("ph-no-mask", errorClass)}
        value={focused ? query : selected ? formatAirport(selected) : query}
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
              <div>No airport found.</div>
              <button
                type="button"
                className="text-xs text-primary underline"
                onMouseDown={(e) => {
                  e.preventDefault();
                  posthog.capture("airport_freetext_opened", {
                    field: fieldName,
                    query: query.trim(),
                  });
                  setFreeTextMode(true);
                  onChange(query.trim(), true);
                  setFocused(false);
                }}
              >
                Can&apos;t find your airport? Type it manually
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
                  setQuery(formatAirport(a));
                  setFocused(false);
                }}
              >
                {formatAirport(a)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
