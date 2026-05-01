"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClaimData } from "@/app/check/ClaimWizard";

interface Props {
  data: ClaimData;
  updateData: (partial: Partial<ClaimData>) => void;
  onNext: () => void;
}

export default function StepPersonalDetails({ data, updateData, onNext }: Props) {
  const canProceed =
    data.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phone.length >= 7;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Your Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="As it appears on your ticket"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
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

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full h-12 bg-accent text-accent-foreground font-bold text-base hover:bg-accent/90"
        >
          Review & Submit →
        </Button>
      </CardContent>
    </Card>
  );
}
