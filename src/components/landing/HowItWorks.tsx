import { Search, FileText, Banknote } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Check Your Flight",
    description: "Enter your flight details and we'll instantly tell you if you're eligible for compensation.",
  },
  {
    icon: FileText,
    title: "We Handle the Claim",
    description: "Our experts deal with the airline on your behalf — all the paperwork, negotiations, and legal bits.",
  },
  {
    icon: Banknote,
    title: "You Get Paid",
    description: "Once successful, we transfer your compensation directly. We only charge a fee if you win.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          How It Works
        </h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                <step.icon className="h-8 w-8 text-secondary" />
              </div>
              <div className="mb-1 text-sm font-bold uppercase tracking-wider text-amber-700">
                Step {i + 1}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
