"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { ClaimData } from "@/app/check/ClaimWizard";
import { allAirports } from "@/data/airports";
import { airlineNames, getAirlineFromFlightNumber } from "@/data/airlines";
import { getUtmParams } from "@/lib/tracking";
import { trackCompleteRegistration } from "@/lib/metaPixel";
import posthog from "posthog-js";

interface Props {
  data: ClaimData;
  updateData: (partial: Partial<ClaimData>) => void;
  onSubmitted: (claimReference: string) => void;
}

function airportLabel(code: string): string {
  const a = allAirports.find((ap) => ap.code === code);
  return a ? `${a.code} (${a.city})` : code;
}

const eventLabels: Record<string, string> = {
  delayed: "Flight delayed",
  cancelled: "Flight cancelled",
  denied: "Denied boarding",
  unsure: "Not sure",
};

export default function StepAuthorise({ data, updateData, onSubmitted }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const airlineCode = getAirlineFromFlightNumber(data.flightNumber);
  const airline = airlineCode ? airlineNames[airlineCode] ?? airlineCode : "Unknown";

  const canSubmit = data.consentAuth && data.consentAccuracy && !submitting;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const utm = getUtmParams();
      const distinctId = posthog.get_distinct_id();
      const sessionId = posthog.get_session_id();

      const response = await fetch("/api/submit-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-POSTHOG-DISTINCT-ID": distinctId ?? "",
          "X-POSTHOG-SESSION-ID": sessionId ?? "",
        },
        body: JSON.stringify({
          flight_number: data.flightNumber,
          flight_date: data.flightDate ? format(data.flightDate, "yyyy-MM-dd") : "",
          departure_airport: data.departureAirport,
          arrival_airport: data.arrivalAirport,
          event_type: data.eventType,
          delay_duration: data.delayDuration || "",
          full_name: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          booking_reference: data.bookingReference || null,
          passenger_count: data.passengerCount,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        posthog.capture("claim_submission_failed", {
          error: responseData.error ?? "unknown",
          status_code: response.status,
        });
        toast({
          title: "Submission failed",
          description: responseData.error || "Something unexpected happened. Please try again.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const claimRef = responseData.claim_reference;
      if (!claimRef) {
        posthog.capture("claim_submission_failed", { error: "missing_claim_reference" });
        toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const email = data.email.trim().toLowerCase();
      posthog.identify(email, {
        email,
        name: data.fullName.trim(),
      });
      posthog.capture("claim_submitted", {
        claim_reference: claimRef,
        passenger_count: data.passengerCount,
        event_type: data.eventType,
        departure_airport: data.departureAirport,
        arrival_airport: data.arrivalAirport,
      });

      trackCompleteRegistration();
      onSubmitted(claimRef);
    } catch (err) {
      posthog.captureException(err, { error_context: "claim_submission_network" });
      posthog.capture("claim_submission_failed", { error: "network_error" });
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Review & Authorise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
          <SummaryRow label="Flight" value={`${data.flightNumber} (${airline})`} />
          <SummaryRow label="Date" value={data.flightDate ? format(data.flightDate, "PPP") : "—"} />
          <SummaryRow label="Route" value={`${airportLabel(data.departureAirport)} → ${airportLabel(data.arrivalAirport)}`} />
          <SummaryRow label="Event" value={eventLabels[data.eventType] ?? data.eventType} />
          {data.delayDuration && <SummaryRow label="Delay" value={data.delayDuration === "3-or-more" ? "3+ hours" : data.delayDuration === "less-than-3" ? "Under 3 hours" : "Unsure"} />}
          <SummaryRow label="Name" value={data.fullName} />
          <SummaryRow label="Email" value={data.email} />
          <SummaryRow label="Phone" value={data.phone} />
          {data.bookingReference && <SummaryRow label="Booking Ref" value={data.bookingReference} />}
          <SummaryRow label="Passengers" value={String(data.passengerCount)} />
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consentAuth"
              checked={data.consentAuth}
              onCheckedChange={(c) => updateData({ consentAuth: c === true })}
            />
            <Label htmlFor="consentAuth" className="text-sm font-normal leading-snug cursor-pointer">
              I authorise Refund My Flight to pursue this compensation claim on my behalf, including engaging with the airline and, if necessary, taking legal action.
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="consentAccuracy"
              checked={data.consentAccuracy}
              onCheckedChange={(c) => updateData({ consentAccuracy: c === true })}
            />
            <Label htmlFor="consentAccuracy" className="text-sm font-normal leading-snug cursor-pointer">
              I confirm that the information provided is accurate and complete to the best of my knowledge.
            </Label>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-12 bg-accent text-accent-foreground font-bold text-base hover:bg-accent/90"
        >
          {submitting ? "Submitting..." : "Submit My Claim"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          No win, no fee. Commission of 25% + VAT on successful claims only.
        </p>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
