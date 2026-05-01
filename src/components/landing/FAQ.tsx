"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What does 'no win, no fee' mean?",
    a: "If your claim is unsuccessful, you pay absolutely nothing. We only charge a commission (25% + VAT) if we successfully recover compensation for you.",
  },
  {
    q: "How long does the process take?",
    a: "Most claims are resolved within 8–16 weeks, though complex cases involving legal action can take longer. We keep you updated at every stage.",
  },
  {
    q: "I'm South African — can I really claim under EU law?",
    a: "Absolutely. EU Regulation 261/2004 protects all passengers on flights departing from EU/UK airports, regardless of nationality or where you bought your ticket.",
  },
  {
    q: "How far back can I claim?",
    a: "You can claim for disruptions that happened up to 3 years ago (6 years for UK departures). So even old delays could be worth money.",
  },
  {
    q: "What counts as a qualifying delay?",
    a: "If you arrived at your final destination 3 or more hours late, you likely qualify. Cancellations and denied boarding also qualify regardless of delay length.",
  },
  {
    q: "Do connecting flights qualify?",
    a: "Yes! If your journey started from an EU/UK airport and you arrived 3+ hours late at your final destination due to a missed connection, you can claim.",
  },
  {
    q: "What if the airline blames 'extraordinary circumstances'?",
    a: "Airlines often use this defence, but it's narrowly defined. Staff strikes, technical faults, and overbooking are NOT extraordinary circumstances. We know how to challenge these excuses.",
  },
  {
    q: "Do I need my boarding pass or booking confirmation?",
    a: "They help speed things up, but they're not essential. As long as you know your flight number and date, we can usually verify your booking with the airline.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-foreground md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
