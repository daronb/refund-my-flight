"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { airlineNames } from "@/data/airlines";

interface Props {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
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

export default function AirlineSearch({ value, onChange, placeholder = "Type airline name or code..." }: Props) {
  const selected = allAirlines.find((a) => a.code === value);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return allAirlines;
    return allAirlines.filter((a) => matchAirline(a, query.trim()));
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <Input
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
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">No airline found.</div>
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
                  onChange(a.code);
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
