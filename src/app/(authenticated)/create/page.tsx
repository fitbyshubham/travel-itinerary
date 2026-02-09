"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Map,
  Box,
  Plus,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export default function CreateSelectionPage() {
  const router = useRouter();

  const options = [
    {
      title: "Share a Post",
      description: "Upload photos and videos of your latest trip.",
      icon: FileText,
      path: "/create/post",
      color: "text-neon-blue",
      bgColor: "bg-neon-blue/10",
      borderColor: "border-neon-blue/20",
    },
    {
      title: "Build Itinerary",
      description: "Plan your route, stays, and activities day-by-day.",
      icon: Map,
      path: "/create/itinerary",
      color: "text-neon-lime",
      bgColor: "bg-neon-lime/10",
      borderColor: "border-neon-lime/20",
    },
    {
      title: "Create Package",
      description: "Bundle itineraries and sell your expertise.",
      icon: Box,
      path: "/create/package",
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#000411] text-white p-6 relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] mix-blend-screen opacity-30" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-12 pt-8">
        <header className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-sans font-light tracking-tight">
              Create <span className="text-white/40">New</span>
            </h1>
            <span className="font-tech text-xs text-white/20 tracking-widest">
              SELECT_INTENT // MODULE_V.1
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {options.map((option, i) => (
            <motion.button
              key={option.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => router.push(option.path)}
              className={`w-full text-left p-6 rounded-3xl border ${option.borderColor} ${option.bgColor} backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-6 group`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 ${option.color} group-hover:scale-110 transition-transform`}>
                <option.icon className="w-7 h-7" />
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-medium text-white group-hover:translate-x-1 transition-transform">
                  {option.title}
                </h3>
                <p className="text-sm text-white/40 font-light">
                  {option.description}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white/40 group-hover:translate-x-2 transition-all" />
            </motion.button>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-20">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-tech text-white/10 uppercase tracking-widest text-center">
            New modules arriving soon
          </p>
        </div>
      </div>
    </div>
  );
}
