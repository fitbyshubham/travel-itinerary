import React from "react";
import { motion } from "framer-motion";

const NoiseBackground: React.FC = () => {
  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div as any;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none fixed-gpu">
      {/* Deep Space Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-void via-space-DEFAULT to-space-void" />

      {/* Kinetic Fluid Orbs */}
      <MotionDiv
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [-50, 50, -50],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-neon-blue/10 rounded-full blur-[150px]"
      />
      <MotionDiv
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[150px]"
      />
      <MotionDiv
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-neon-lime/5 rounded-full blur-[100px]"
      />

      {/* Grainy Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-overlay" />

      {/* Grid Overlay - Subtle technical feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
};

export default NoiseBackground;
