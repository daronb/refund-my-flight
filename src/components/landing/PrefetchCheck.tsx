"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrefetchCheck() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/check");
  }, [router]);
  return null;
}
