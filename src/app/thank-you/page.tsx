import type { Metadata } from "next";
import ThankYouContent from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Claim Submitted | Refund My Flight",
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
