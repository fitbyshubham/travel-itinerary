import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HUD: React.FC = () => {
  // Simple clock for the travel-tech feel
  const [time, setTime] = useState("");

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div as any;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none p-6 md:p-12 flex flex-col justify-between mix-blend-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <MotionDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col gap-1"
        >
          {/* Placeholder text removed */}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="hidden md:flex gap-8 items-center"
        >
          <div className="h-px w-16 bg-white/20 self-center" />
          <div className="flex flex-col items-center">
            <span className="font-tech text-[10px] text-neon-lime/80 tracking-widest">
              {time} UTC
            </span>
            <span className="font-tech text-[8px] text-white/30">
              LAT 35.6762° N // LON 139.6503° E
            </span>
          </div>
          <div className="h-px w-16 bg-white/20 self-center" />
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-right"
        >
          <div className="flex items-center justify-end gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-neon-lime animate-pulse rounded-full" />
          </div>
        </MotionDiv>
      </div>

      {/* Crosshair Center (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/50 to-transparent absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent absolute top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden md:block"
        >
          <div className="border-l border-b border-white/20 w-8 h-8" />
        </MotionDiv>



        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden md:block"
        >
          <div className="border-r border-b border-white/20 w-8 h-8" />
        </MotionDiv>
      </div>
    </div>
  );
};

export default HUD;
