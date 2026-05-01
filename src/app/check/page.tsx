import type { Metadata } from "next";
import ClaimWizard from "./ClaimWizard";

export const metadata: Metadata = {
  title: "Check My Flight | Refund My Flight",
  description: "Check if your delayed, cancelled, or overbooked flight qualifies for compensation under EU Regulation 261/2004.",
};

export default function CheckPage() {
  return <ClaimWizard />;
}
