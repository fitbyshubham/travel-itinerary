// src/app/dashboard/create-itinerary/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { TripForm } from "@/components/itinerary-builder/TripForm";

export default function CreateItineraryPage() {
  const { token, isHydrated, reset } = useAuthStore();
  const router = useRouter();

  // Only check auth after hydration is complete
  const shouldRedirect = useMemo(() => {
    if (!isHydrated) return null; // still loading
    if (!token) return "/login";
    return null; // allow render
  }, [isHydrated, token]);

  useEffect(() => {
    if (shouldRedirect === "/login") {
      router.push("/login");
      return;
    }
    if (shouldRedirect === null && isHydrated && token) {
      reset(); // only reset when fully ready
    }
  }, [shouldRedirect, isHydrated, token, router, reset]);

  // Show nothing (or loading spinner) while hydrating
  if (!isHydrated) {
    return null; // or <div>Loading...</div>
  }

  if (shouldRedirect === "/login") {
    return null; // redirect already triggered
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <TripForm />
      </div>
    </div>
  );
}
