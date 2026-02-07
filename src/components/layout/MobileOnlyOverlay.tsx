import React from "react";
import { Smartphone, ScanLine } from "lucide-react";

export const MobileOnlyOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#000411] hidden md:flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-neon-lime/5 border border-neon-lime/20 flex items-center justify-center mb-8 relative mx-auto">
          <div className="absolute inset-0 rounded-full border border-neon-lime/30 animate-ping opacity-20" />
          <Smartphone className="w-10 h-10 text-neon-lime" />
        </div>
        
        <h1 className="text-4xl font-sans font-light tracking-tight mb-4">
          Mobile Experience <span className="text-neon-lime font-serif italic">Only</span>
        </h1>
        
        <p className="text-white/50 max-w-md font-light leading-relaxed mx-auto mb-10">
          Narfe is designed exclusively for mobile exploration. 
          Please access this frequency on your handheld device.
        </p>
        
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <ScanLine className="w-4 h-4 text-red-400" />
          <p className="text-[10px] font-tech text-red-400 tracking-widest uppercase mb-0">
            Desktop_Environment_Detected // Access_Denied
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] text-white/20 font-mono">
          N A R F E _ S Y S T E M S
        </p>
      </div>
    </div>
  );
};
