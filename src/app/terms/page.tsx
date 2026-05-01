import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/landing/Footer";

export default function TermsOfService() {
  return (
    <>
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: 14 April 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mt-8 [&_h2]:mb-3">
          <h2>1. About Our Service</h2>
          <p>Refund My Flight assists passengers in claiming compensation from airlines under EU Regulation 261/2004 for flight delays (3+ hours), cancellations, and denied boarding on flights departing from the EU/UK.</p>

          <h2>2. No Win, No Fee</h2>
          <p>Our service operates on a &ldquo;no win, no fee&rdquo; basis. You only pay if your claim is successful. Our commission is <strong>25% + VAT</strong> of the compensation amount received.</p>

          <h2>3. Your Obligations</h2>
          <p>By submitting a claim, you confirm that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>All information provided is accurate and complete</li>
            <li>You authorise us to act on your behalf with the airline</li>
            <li>You have not already appointed another representative for the same claim</li>
            <li>You will inform us of any direct communication from the airline regarding your claim</li>
          </ul>

          <h2>4. Eligibility</h2>
          <p>Our initial eligibility assessment is indicative only. Final eligibility depends on the airline&apos;s response and the specific circumstances of your disruption. We cannot guarantee the outcome of any claim.</p>

          <h2>5. Payment</h2>
          <p>Upon successful resolution of your claim:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The airline pays the compensation to us or directly to you</li>
            <li>If paid to you directly, you agree to pay our commission within 14 days of receipt</li>
            <li>If paid to us, we will deduct our commission and transfer the balance to you within 14 business days</li>
          </ul>

          <h2>6. Cancellation</h2>
          <p>You may cancel your claim at any time before settlement by emailing us. If we have already incurred significant costs pursuing your claim, we reserve the right to charge a reasonable administration fee.</p>

          <h2>7. Limitation of Liability</h2>
          <p>We are not liable for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Unsuccessful claims or airline refusals</li>
            <li>Delays in processing caused by airlines or third parties</li>
            <li>Any indirect or consequential losses</li>
          </ul>
          <p>Our total liability is limited to the commission amount payable on your claim.</p>

          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of South Africa. Any disputes will be subject to the jurisdiction of the South African courts.</p>

          <h2>9. Changes to These Terms</h2>
          <p>We may update these terms from time to time. Continued use of our service constitutes acceptance of any changes.</p>

          <h2>10. Contact</h2>
          <p>For any questions about these terms, email us at <a href="mailto:daron@refundmyflight.co.za" className="text-accent hover:underline">daron@refundmyflight.co.za</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
