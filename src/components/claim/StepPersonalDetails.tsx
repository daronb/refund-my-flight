"use client";

import { useState, useRef } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ClaimData } from "@/app/check/ClaimWizard";

interface Props {
  data: ClaimData;
  updateData: (partial: Partial<ClaimData>) => void;
  onNext: () => void;
}

type FieldKey = "fullName" | "email" | "phone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function StepPersonalDetails({ data, updateData, onNext }: Props) {
  const [attempted, setAttempted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const getMissingFields = (): FieldKey[] => {
    const missing: FieldKey[] = [];
    if (data.fullName.trim().length < 2) missing.push("fullName");
    if (!EMAIL_RE.test(data.email.trim())) missing.push("email");
    if (data.phone.trim().length < 7) missing.push("phone");
    return missing;
  };

  const missing = attempted ? getMissingFields() : [];
  const hasError = (f: FieldKey) => missing.includes(f);
  const errorClass = (f: FieldKey) =>
    hasError(f) ? "border-red-500 ring-2 ring-red-500" : "";

  const handleSubmit = () => {
    const missingNow = getMissingFields();
    setAttempted(true);
    if (missingNow.length > 0) {
      posthog.capture("personal_details_submit_blocked", {
        missing_fields: missingNow,
        missing_count: missingNow.length,
      });
      const refMap: Record<FieldKey, React.RefObject<HTMLInputElement | null>> = {
        fullName: nameRef,
        email: emailRef,
        phone: phoneRef,
      };
      const first = missingNow[0];
      setTimeout(() => {
        const el = refMap[first]?.current;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }, 50);
      return;
    }
    posthog.capture("personal_details_completed");
    onNext();
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Your Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            ref={nameRef}
            id="fullName"
            className={cn("ph-mask", errorClass("fullName"))}
            placeholder="As it appears on your ticket"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            ref={emailRef}
            id="email"
            type="email"
            className={cn("ph-mask", errorClass("email"))}
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            ref={phoneRef}
            id="phone"
            type="tel"
            className={cn("ph-mask", errorClass("phone"))}
            placeholder="+27 82 123 4567"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bookingRef">Booking Reference (optional)</Label>
          <Input
            id="bookingRef"
            className="ph-mask"
            placeholder="e.g. ABC123"
            value={data.bookingReference}
            onChange={(e) => updateData({ bookingReference: e.target.value.toUpperCase() })}
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengers">Number of Passengers</Label>
          <Input
            id="passengers"
            type="number"
            min={1}
            max={20}
            value={data.passengerCount}
            onChange={(e) => updateData({ passengerCount: parseInt(e.target.value) || 1 })}
          />
          <p className="text-xs text-muted-foreground">Including yourself. Each passenger may be entitled to separate compensation.</p>
        </div>

        {attempted && missing.length > 0 && (
          <p className="text-sm font-medium text-red-600">
            Please complete the highlighted {missing.length === 1 ? "field" : "fields"} above.
          </p>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-accent text-accent-foreground font-bold text-base hover:bg-accent/90"
        >
          Review & Submit →
        </Button>
      </CardContent>
    </Card>
  );
}
