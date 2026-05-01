"use client";

import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { checkEligibility, type EligibilityInput } from "@/lib/eligibility";

interface Props {
  input: EligibilityInput;
  onNext: () => void;
}

export default function StepEligibilityResult({ input, onNext }: Props) {
  const result = checkEligibility(input);

  if (result.eligible && result.uncertain) {
    return (
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="bg-secondary/10 p-8 text-center">
          <HelpCircle className="mx-auto h-20 w-20 text-secondary" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Let&apos;s Find Out Together
          </h2>
        </div>
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-muted-foreground">
            No worries — we can&apos;t be sure from the details so far, but that doesn&apos;t mean you can&apos;t claim.
            Submit your details and our team will review your case for free.
          </p>
          <p className="text-sm text-muted-foreground">
            Many claims that start as &ldquo;not sure&rdquo; end up being successful. There&apos;s no cost to you if it doesn&apos;t work out.
          </p>
          <Button
            onClick={onNext}
            className="w-full h-12 bg-accent text-accent-foreground font-bold text-base hover:bg-accent/90"
          >
            Submit My Claim & See What Happens →
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (result.eligible) {
    return (
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="bg-green-50 p-8 text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Great News — You Likely Qualify!
          </h2>
        </div>
        <CardContent className="p-6 text-center space-y-4">
          <div>
            <p className="text-muted-foreground">The airline owes you up to</p>
            <p className="text-4xl font-extrabold text-foreground">
              R{result.estimatedCompensation!.zar.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            No win, no fee — you pay nothing if we don&apos;t succeed.
          </p>
          <Button
            onClick={onNext}
            className="w-full h-12 bg-accent text-accent-foreground font-bold text-base hover:bg-accent/90"
          >
            Continue to Claim →
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="bg-amber-50 p-8 text-center">
        <XCircle className="mx-auto h-20 w-20 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold text-foreground">
          This One Might Not Qualify
        </h2>
      </div>
      <CardContent className="p-6 space-y-4">
        <ul className="space-y-2">
          {result.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              {reason}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Not sure? You can still submit your details and we&apos;ll review your case manually — at no cost to you.
        </p>
        <Button
          onClick={onNext}
          variant="outline"
          className="w-full h-12 font-bold text-base"
        >
          Submit Anyway →
        </Button>
      </CardContent>
    </Card>
  );
}
