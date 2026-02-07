// src/components/auth/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
