import Link from "next/link";
import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-primary py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold text-primary-foreground">Refund My Flight</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/60">
            <Link href="/check" className="hover:text-primary-foreground transition-colors">
              Check My Flight
            </Link>
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:daron@refundmyflight.co.za" className="hover:text-primary-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Refund My Flight. Claims are pursued under EU Regulation 261/2004.
          Results are not guaranteed. Commission of 25% + VAT applies to successful claims only.
        </p>
      </div>
    </footer>
  );
}
