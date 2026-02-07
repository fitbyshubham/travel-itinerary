// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) return null; // or loading spinner

  return (
    <div className="min-h-screen pb-16">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {token && <BottomNav />}
      </div>
    </div>
  );
}
