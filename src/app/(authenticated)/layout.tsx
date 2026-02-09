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
  const { token, isHydrated } = useAuthStore();

  // Wait for hydration to avoid flicker
  if (!isHydrated) return null;

  // Logic: Show if we have a token
  const showBottomNav = !!token;

  return (
    <div className="relative">
      <main className={showBottomNav ? "pb-24" : ""}>
        {children}
      </main>
      {showBottomNav && <NavigationDock pathname={pathname} />}
    </div>
  );
}
