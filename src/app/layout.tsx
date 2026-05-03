import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Refund My Flight | Claim Up to R12,000 for Delayed EU Flights",
  description:
    "Your delayed, cancelled or overbooked European flight could be worth up to R12,000. Free eligibility check. No win, no fee. Claims go back 3 years.",
  openGraph: {
    type: "website",
    title: "Refund My Flight | Claim Up to R12,000 for Delayed EU Flights",
    description:
      "Your delayed, cancelled or overbooked European flight could be worth up to R12,000. Free eligibility check. No win, no fee. Claims go back 3 years.",
  },
  twitter: {
    card: "summary",
    title: "Refund My Flight | Claim Up to R12,000 for Delayed EU Flights",
    description:
      "Your delayed, cancelled or overbooked European flight could be worth up to R12,000. Free eligibility check. No win, no fee. Claims go back 3 years.",
  },
  alternates: {
    canonical: "https://refundmyflight.co.za",
  },
  icons: {
    icon: "https://storage.googleapis.com/gpt-engineer-file-uploads/FZdVfviAPVdCOBGKfMTnR3H4jlp1/uploads/1770648862175-Screenshot_2026-02-09_at_15.38.17.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11384511509"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-11384511509');
            `,
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
