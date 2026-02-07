"use client"
import React, { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavigationDock from "@/components/layout/NavigationDock";
import { useAuthStore } from "@/lib/store";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Safe token check: Check store first, fall back to localStorage to avoid flicker before hydration
  const { token: storeToken } = useAuthStore();
  const [hasToken, setHasToken] = useState(!!storeToken);

  useEffect(() => {
    // Sync token state
    if (storeToken) {
      setHasToken(true);
    } else if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("auth_token");
      setHasToken(!!localToken);
    }
  }, [storeToken]);



  // Routes where the Dock should NOT appear (e.g. creation flows, details)
  const hideBottomNav = [
    "/create",
    "/create/itinerary",
    "/create/package",
    "/create/post",
    "/package",
    "/post", // Hide on post detail view
    "/explore", // Explore page renders its own NavigationDock
  ].some((route) => pathname?.startsWith(route));

  // Logic: Show if we have a token (store or local) AND not on a hidden route
  const showBottomNav = hasToken && !hideBottomNav;

  return (
    <div className="relative">
      <main className={showBottomNav ? "pb-24" : ""}>
        {children}
      </main>
      {showBottomNav && <NavigationDock pathname={pathname} />}
    </div>
  );
}
