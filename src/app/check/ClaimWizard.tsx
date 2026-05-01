"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plane } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StepFlightDetails from "@/components/claim/StepFlightDetails";
import StepEligibilityResult from "@/components/claim/StepEligibilityResult";
import StepPersonalDetails from "@/components/claim/StepPersonalDetails";
import StepAuthorise from "@/components/claim/StepAuthorise";
import { Toaster } from "@/components/ui/toaster";
import type { EligibilityInput } from "@/lib/eligibility";

export interface ClaimData {
  flightNumber: string;
  flightDate: Date | undefined;
  departureAirport: string;
  arrivalAirport: string;
  airline: string;
  eventType: string;
  delayDuration: string;
  fullName: string;
  email: string;
  phone: string;
  bookingReference: string;
  passengerCount: number;
  consentAuth: boolean;
  consentAccuracy: boolean;
  claimReference: string;
}

const initialData: ClaimData = {
  flightNumber: "",
  flightDate: undefined,
  departureAirport: "",
  arrivalAirport: "",
  airline: "",
  eventType: "",
  delayDuration: "",
  fullName: "",
  email: "",
  phone: "+27",
  bookingReference: "",
  passengerCount: 1,
  consentAuth: false,
  consentAccuracy: false,
  claimReference: "",
};

const stepLabels = ["Flight Details", "Eligibility", "Your Details", "Authorise"];

export default function ClaimWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ClaimData>(initialData);

  const updateData = useCallback((partial: Partial<ClaimData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const eligibilityInput: EligibilityInput = {
    flightNumber: data.flightNumber,
    flightDate: data.flightDate,
    departureAirport: data.departureAirport,
    arrivalAirport: data.arrivalAirport,
    airline: data.airline,
    eventType: data.eventType,
    delayDuration: data.delayDuration,
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b bg-primary">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity">
            <Plane className="h-5 w-5 text-accent" />
            <span className="font-bold text-primary-foreground">Refund My Flight</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Progress bar */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex justify-between mb-2">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={`text-xs font-medium ${i <= step ? "text-secondary" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Back button */}
        {step > 0 && (
          <div className="mx-auto max-w-2xl mb-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>
        )}

        {/* Steps */}
        <div className="mx-auto max-w-2xl">
          {step === 0 && (
            <StepFlightDetails
              data={data}
              updateData={updateData}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepEligibilityResult
              input={eligibilityInput}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepPersonalDetails
              data={data}
              updateData={updateData}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepAuthorise
              data={data}
              updateData={updateData}
              onSubmitted={(ref) => {
                router.push(`/thank-you?ref=${encodeURIComponent(ref)}`);
              }}
            />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
