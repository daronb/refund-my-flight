import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  { id: "1", name: "Jenny", rating: 5, review: "Great personalized service! Airline did take its time but the team at Refund My Flight kept us up to date throughout. Highly recommend." },
  { id: "2", name: "Mathew", rating: 5, review: "Genuinely amazing that we could get a payout for a flight delay. We went to visit family in the UK and it basically made the trip free!" },
  { id: "3", name: "Shan", rating: 5, review: "Thank you so much for assisting my family after our flight was delayed for more than 24hrs!" },
  { id: "4", name: "Nate", rating: 5, review: "Amazing service, really impressed with how efficiently it was done. Received my money without a hassle" },
];

const airlines = ["British Airways", "KLM", "Lufthansa", "Air France", "Turkish Airlines", "Swiss", "Virgin Atlantic", "TAP Portugal"];

export default function SocialProof() {
  return (
    <section className="bg-muted py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 grid max-w-5xl gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <Card key={r.id} className="flex flex-col border-0 shadow-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < r.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="mb-4 text-foreground">&ldquo;{r.review}&rdquo;</p>
                <p className="mt-auto font-bold text-foreground">{r.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {airlines.map((name) => (
            <span key={name} className="text-sm font-medium text-muted-foreground/60">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
