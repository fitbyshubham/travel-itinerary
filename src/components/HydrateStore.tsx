// src/components/HydrateStore.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export default function HydrateStore() {
  const hydrate = useAuthStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
