import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const criteria = [
  "Your flight departed from an EU or UK airport",
  "Your flight was delayed by 3+ hours, cancelled, or you were denied boarding",
  "The disruption happened within the last 3 years",
  "You had a confirmed booking (even if the ticket was free or a gift)",
  "The disruption was the airline's fault (not extraordinary circumstances)",
];

export default function Eligibility() {
  return (
    <section className="bg-muted py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
          Am I Eligible?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
          EU Regulation 261/2004 protects all passengers — regardless of nationality — on flights departing from EU/UK airports.
        </p>
        <Card className="mx-auto max-w-2xl border-0 shadow-md">
          <CardContent className="p-6 md:p-8">
            <ul className="space-y-4">
              {criteria.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
