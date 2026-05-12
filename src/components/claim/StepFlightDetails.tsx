"use client";

import { useState, useRef } from "react";
import { format, subYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AirportSearch from "@/components/claim/AirportSearch";
import AirlineSearch from "@/components/claim/AirlineSearch";
import { cn } from "@/lib/utils";
import type { ClaimData } from "@/app/check/ClaimWizard";

interface Props {
  data: ClaimData;
  updateData: (partial: Partial<ClaimData>) => void;
  onNext: () => void;
}

type FieldKey =
  | "departureAirport"
  | "arrivalAirport"
  | "airline"
  | "flightDate"
  | "eventType"
  | "delayDuration"
  | "flightNumber";

export default function StepFlightDetails({ data, updateData, onNext }: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const departureRef = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const airlineRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const flightNumRef = useRef<HTMLInputElement>(null);
  const delayRef = useRef<HTMLDivElement>(null);

  const getMissingFields = (): FieldKey[] => {
    const missing: FieldKey[] = [];
    if (!data.departureAirport.trim()) missing.push("departureAirport");
    if (!data.arrivalAirport.trim()) missing.push("arrivalAirport");
    if (!data.airline.trim()) missing.push("airline");
    if (!data.flightDate) missing.push("flightDate");
    if (!data.eventType) missing.push("eventType");
    if (data.eventType === "delayed" && !data.delayDuration) missing.push("delayDuration");
    return missing;
  };

  const missing = attempted ? getMissingFields() : [];
  const hasError = (f: FieldKey) => missing.includes(f);

  const scrollToFirstError = (fields: FieldKey[]) => {
    const first = fields[0];
    const refMap: Record<FieldKey, React.RefObject<HTMLElement | null>> = {
      departureAirport: departureRef,
      arrivalAirport: arrivalRef,
      airline: airlineRef,
      flightDate: dateRef,
      eventType: eventRef,
      delayDuration: delayRef,
      flightNumber: { current: flightNumRef.current },
    };
    const target = refMap[first]?.current;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = () => {
    const missingNow = getMissingFields();
    setAttempted(true);
    if (missingNow.length > 0) {
      posthog.capture("flight_details_submit_blocked", {
        missing_fields: missingNow,
        missing_count: missingNow.length,
      });
      setTimeout(() => scrollToFirstError(missingNow), 50);
      return;
    }
    posthog.capture("flight_details_completed", {
      departure_airport: data.departureAirport,
      arrival_airport: data.arrivalAirport,
      departure_custom: data.departureAirportCustom,
      arrival_custom: data.arrivalAirportCustom,
      airline: data.airline,
      airline_custom: data.airlineCustom,
      event_type: data.eventType,
      delay_duration: data.delayDuration || null,
    });
    onNext();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Flight Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2" ref={departureRef}>
          <Label>Departure Airport</Label>
          <AirportSearch
            fieldName="departure"
            value={data.departureAirport}
            isCustom={data.departureAirportCustom}
            error={hasError("departureAirport")}
            onChange={(code, isCustom) => {
              updateData({
                departureAirport: code,
                departureAirportCustom: !!isCustom,
              });
              if (!isCustom && code) {
                setTimeout(() => {
                  const input = arrivalRef.current?.querySelector("input");
                  input?.focus();
                }, 50);
              }
            }}
          />
        </div>

        <div className="space-y-2" ref={arrivalRef}>
          <Label>Arrival Airport</Label>
          <AirportSearch
            fieldName="arrival"
            value={data.arrivalAirport}
            isCustom={data.arrivalAirportCustom}
            error={hasError("arrivalAirport")}
            onChange={(code, isCustom) => {
              updateData({
                arrivalAirport: code,
                arrivalAirportCustom: !!isCustom,
              });
              if (!isCustom && code) {
                setTimeout(() => {
                  const input = airlineRef.current?.querySelector("input");
                  input?.focus();
                }, 50);
              }
            }}
          />
        </div>

        <div className="space-y-2" ref={airlineRef}>
          <Label>Airline</Label>
          <AirlineSearch
            value={data.airline}
            isCustom={data.airlineCustom}
            error={hasError("airline")}
            onChange={(code, isCustom) => {
              const currentFn = data.flightNumber.trim();
              const prevCode = data.airline;
              const shouldSyncFlightNum = !isCustom && (!currentFn || currentFn === prevCode);
              updateData({
                airline: code,
                airlineCustom: !!isCustom,
                ...(shouldSyncFlightNum ? { flightNumber: code } : {}),
              });
              if (!isCustom && code) {
                setTimeout(() => {
                  dateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Flight Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={dateRef}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.flightDate && "text-muted-foreground",
                  hasError("flightDate") && "border-destructive ring-1 ring-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.flightDate ? format(data.flightDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.flightDate}
                onSelect={(date) => {
                  updateData({ flightDate: date });
                  setCalendarOpen(false);
                  setTimeout(() => {
                    eventRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 100);
                }}
                disabled={(date) =>
                  date > new Date() || date < subYears(new Date(), 6)
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div
          className={cn(
            "space-y-3 rounded-md",
            hasError("eventType") && "border border-destructive p-3"
          )}
          ref={eventRef}
        >
          <Label>What happened?</Label>
          <RadioGroup
            value={data.eventType}
            onValueChange={(v) => {
              updateData({ eventType: v, delayDuration: "" });
              if (v === "delayed") {
                setTimeout(() => {
                  delayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
              } else {
                setTimeout(() => {
                  flightNumRef.current?.focus();
                  flightNumRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }
            }}
          >
            {[
              { value: "delayed", label: "Flight was delayed" },
              { value: "cancelled", label: "Flight was cancelled" },
              { value: "denied", label: "Denied boarding (overbooked)" },
              { value: "unsure", label: "I'm not sure" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={opt.value} />
                <Label htmlFor={opt.value} className="font-normal cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {data.eventType === "delayed" && (
          <div
            className={cn(
              "space-y-3 rounded-md",
              hasError("delayDuration") && "border border-destructive p-3"
            )}
            ref={delayRef}
          >
            <Label>How long was the delay at your destination?</Label>
            <RadioGroup
              value={data.delayDuration}
              onValueChange={(v) => {
                updateData({ delayDuration: v });
                setTimeout(() => {
                  flightNumRef.current?.focus();
                  flightNumRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
              }}
            >
              {[
                { value: "less-than-3", label: "Less than 3 hours" },
                { value: "3-or-more", label: "3 hours or more" },
                { value: "unsure", label: "I'm not sure" },
              ].map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={`delay-${opt.value}`} />
                  <Label htmlFor={`delay-${opt.value}`} className="font-normal cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="flightNumber">Flight Number <span className="text-muted-foreground font-normal">(check your booking confirmation)</span></Label>
          <Input
            ref={flightNumRef}
            id="flightNumber"
            className="ph-no-mask"
            placeholder="e.g. BA56"
            value={data.flightNumber}
            onChange={(e) => updateData({ flightNumber: e.target.value.toUpperCase() })}
            maxLength={10}
          />
        </div>

        {attempted && missing.length > 0 && (
          <p className="text-sm text-destructive">
            Please complete the highlighted {missing.length === 1 ? "field" : "fields"} above.
          </p>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-accent text-accent-foreground font-bold text-base hover:bg-accent/90"
        >
          Check Eligibility →
        </Button>
      </CardContent>
    </Card>
  );
}
