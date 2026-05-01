import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
          Don&apos;t Leave Money on the Table
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
          Thousands of South Africans are owed compensation and don&apos;t even know it.
          Check your flight in under 2 minutes — it&apos;s completely free.
        </p>
        <Button
          asChild
          size="lg"
          className="h-14 rounded-xl bg-accent px-8 text-lg font-bold text-accent-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent/90"
        >
          <Link href="/check">Check My Flight Free →</Link>
        </Button>
      </div>
    </section>
  );
}
