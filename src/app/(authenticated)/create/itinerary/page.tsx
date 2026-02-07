"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Map } from "lucide-react";
import { TripForm } from "@/components/itinerary-builder/TripForm";

export default function CreateItineraryPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#000411] text-white pb-32">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px] mix-blend-screen opacity-40" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-lime/5 rounded-full blur-[100px] mix-blend-screen opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#000411]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
            </button>
            <div className="flex flex-col">
              <h1 className="font-sans text-lg font-medium text-white">
                New Itinerary
              </h1>
              <span className="font-tech text-[10px] text-white/30 tracking-widest">
                BUILDER_V.2.0 // ACTIVE
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
            <Map className="w-5 h-5 text-neon-blue" />
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 md:p-8">
        <TripForm />
      </main>
    </div>
  );
}
