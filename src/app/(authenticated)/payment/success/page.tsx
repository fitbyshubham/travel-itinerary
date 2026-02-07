"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Globe,
  Zap,
  Trophy,
  CreditCard,
} from "lucide-react";
import NoiseBackground from "../../../../components/layout/NoiseBackground";

export default function PaymentSuccessPage() {
  const router = useRouter();
  // Cast motion components to any for environment compatibility
  const MotionDiv = motion.div as any;
  const [orderId] = useState(
    () => `TRV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  );

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#000411] text-white flex items-center justify-center p-6">
      <NoiseBackground />

      {/* HUD Trajectory Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-neon-lime to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] relative z-10"
      >
        <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 relative overflow-hidden text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-lime/40 rounded-tl-[40px]" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-blue/40 rounded-br-[40px]" />

          {/* Glowing Background Glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-lime/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-blue/10 blur-[80px] rounded-full" />

          {/* Success Animation Ring */}
          <div className="relative inline-flex items-center justify-center mb-10">
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-neon-lime/20 rounded-full scale-[1.6]"
            />
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-28 h-28 rounded-full bg-gradient-to-tr from-neon-lime/20 to-emerald-500/10 border-2 border-neon-lime/40 flex items-center justify-center shadow-[0_0_60px_rgba(204,255,0,0.2)] relative z-10"
            >
              <Trophy className="w-12 h-12 text-neon-lime drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
            </MotionDiv>
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-neon-lime animate-pulse" />
            <Zap className="absolute -bottom-2 -left-4 w-6 h-6 text-neon-blue animate-bounce" />
          </div>

          <div className="space-y-4 mb-12">
            <div className="flex flex-col gap-2">
              <MotionDiv
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.4em" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-tech text-[10px] text-neon-lime uppercase"
              >
                Transaction_Verified // Success
              </MotionDiv>
              <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-white">
                CONGRATS
                <span className="text-neon-lime font-serif italic">!</span>
              </h1>
            </div>
            <p className="text-white/60 text-base font-light leading-relaxed max-w-sm mx-auto">
              Your travel protocol has been successfully synced. Your journey
              coordinates are now active in your profile grid.
            </p>
          </div>

          {/* Secure Transaction Card */}
          <div className="grid grid-cols-2 gap-4 mb-12 text-left">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-neon-lime/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-neon-lime" />
                <span className="text-[10px] font-tech text-white/40 uppercase tracking-widest">
                  Protocol_ID
                </span>
              </div>
              <span className="font-mono text-xs text-white/80 tracking-tighter">
                {orderId}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-neon-blue/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-neon-blue" />
                <span className="text-[10px] font-tech text-white/40 uppercase tracking-widest">
                  Network
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white/80 uppercase">
                  Grid_Link_1
                </span>
                <div className="w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse shadow-[0_0_8px_rgba(204,255,0,1)]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <MotionDiv whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => navigate("/profile?tab=packages")}
                className="group w-full py-5 bg-neon-lime text-black font-bold text-xs font-tech tracking-[0.25em] rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(204,255,0,0.15)] flex items-center justify-center gap-4 relative overflow-hidden"
              >
                {/* Glitch Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                <Package className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>VIEW_PURCHASED_ORDERS</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </MotionDiv>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 text-white/20 hover:text-white transition-colors font-tech text-[10px] tracking-[0.3em] uppercase"
            >
              Return_to_Grid_Mainframe
            </button>
          </div>
        </div>

        {/* Global Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-8 text-[9px] font-tech text-white/10 tracking-[0.5em] uppercase">
          <div className="flex items-center gap-2">
            <CreditCard className="w-3 h-3" />
            <span>Encrypted_SSL</span>
          </div>
          <div className="w-1.5 h-1.5 bg-white/5 rounded-full" />
          <span>Server_Asia_V4</span>
        </div>
      </MotionDiv>
    </div>
  );
}
