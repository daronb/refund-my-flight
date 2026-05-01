"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 200;
      setVisible((prev) => (prev === shouldShow ? prev : shouldShow));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-3 backdrop-blur-sm md:hidden">
      <Button
        asChild
        className="h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground shadow-lg hover:bg-accent/90"
      >
        <Link href="/check">Check My Flight Free →</Link>
      </Button>
    </div>
  );
}
