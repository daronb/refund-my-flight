import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/landing/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: 14 April 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mt-8 [&_h2]:mb-3">
          <h2>1. Who We Are</h2>
          <p>Refund My Flight (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a South African service that helps travellers claim compensation under EU Regulation 261/2004 for delayed, cancelled, or overbooked flights. Contact us at <a href="mailto:daron@refundmyflight.co.za" className="text-accent hover:underline">daron@refundmyflight.co.za</a>.</p>

          <h2>2. Information We Collect</h2>
          <p>When you submit a claim, we collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Full name, email address, and phone number</li>
            <li>Flight details (flight number, date, airports, event type)</li>
            <li>Booking reference (optional)</li>
            <li>Uploaded documents such as boarding passes or tickets</li>
            <li>UTM parameters for marketing analytics</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your personal data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Assess your eligibility for compensation</li>
            <li>Pursue your claim with the relevant airline</li>
            <li>Communicate with you about the status of your claim</li>
            <li>Improve our services and website</li>
          </ul>

          <h2>4. Sharing Your Information</h2>
          <p>We may share your data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Airlines and regulatory bodies as required to process your claim</li>
            <li>Legal representatives if necessary</li>
            <li>Service providers who assist us (e.g. email delivery, hosting)</li>
          </ul>
          <p>We will never sell your personal information to third parties.</p>

          <h2>5. Data Security</h2>
          <p>We use industry-standard security measures including encrypted storage and secure data transmission (TLS/SSL) to protect your information.</p>

          <h2>6. Data Retention</h2>
          <p>We retain your claim data for as long as necessary to process your claim and for up to 5 years thereafter for legal and accounting purposes.</p>

          <h2>7. Your Rights</h2>
          <p>Under the Protection of Personal Information Act (POPIA), you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Object to the processing of your data</li>
          </ul>
          <p>To exercise these rights, email us at <a href="mailto:daron@refundmyflight.co.za" className="text-accent hover:underline">daron@refundmyflight.co.za</a>.</p>

          <h2>8. Cookies</h2>
          <p>Our website uses essential cookies for functionality and analytics cookies to understand how visitors use our site. You can disable cookies in your browser settings.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
