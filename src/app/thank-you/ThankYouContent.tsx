"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, Mail, Search, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

const timeline = [
  { icon: CheckCircle, label: "Claim Submitted", desc: "We've received your details." },
  { icon: Search, label: "Review (1–3 days)", desc: "Our team verifies your eligibility." },
  { icon: Mail, label: "Airline Contacted", desc: "We submit the claim to the airline on your behalf." },
  { icon: Clock, label: "Resolution (8–16 weeks)", desc: "We negotiate, escalate if needed, and keep you updated." },
];

function ThankYouInner() {
  const searchParams = useSearchParams();
  const claimReference = searchParams.get("ref");

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
        <div className="mx-auto max-w-2xl">
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="bg-green-50 p-8 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="mt-4 text-2xl font-bold text-foreground">Claim Submitted!</h1>
              {claimReference ? (
                <>
                  <p className="mt-2 text-muted-foreground">Your reference number is:</p>
                  <p className="mt-1 text-3xl font-extrabold text-foreground tracking-wider">{claimReference}</p>
                </>
              ) : (
                <p className="mt-2 text-muted-foreground">Thank you for submitting your claim. Check your email for your reference number.</p>
              )}
            </div>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="mb-4 font-bold text-foreground">What Happens Next</h2>
                <div className="space-y-4">
                  {timeline.map((step, i) => (
                    <div
                      key={step.label}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                        <step.icon className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{step.label}</p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted" />}>
      <ThankYouInner />
    </Suspense>
  );
}
