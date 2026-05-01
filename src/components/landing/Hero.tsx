import Link from "next/link";
import { Plane, Shield, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: Shield, text: "No Win, No Fee" },
  { icon: Clock, text: "Takes 2 Minutes" },
  { icon: CalendarDays, text: "Claims Go Back 3 Years" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 rotate-12">
          <Plane className="h-64 w-64 text-primary-foreground" />
        </div>
        <div className="absolute bottom-10 left-10 -rotate-12">
          <Plane className="h-48 w-48 text-primary-foreground" />
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center animate-hero-fade-in">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Flight Delayed? <span className="text-accent">Get Paid.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            Airlines owe you up to <strong className="text-primary-foreground">R11,000</strong> for delayed, cancelled,
            or overbooked flights — and most passengers never claim it. We handle everything. You only pay if we win.
          </p>

          <div className="animate-hero-scale-in">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-xl bg-accent px-8 text-lg font-bold text-accent-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent/90"
            >
              <Link href="/check">Check My Flight Free →</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {trustItems.map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm font-medium text-primary-foreground/70">
                <item.icon className="h-5 w-5 text-accent" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
