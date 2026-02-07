"use client";

import React from "react";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  // Cast motion.span to any to bypass environment-specific typing issues
  const MotionSpan = motion.span as any;

  return (
    <div className={`flex flex-col gap-2 group ${className}`}>
      <label className="font-tech text-xs text-neon-cyan/70 group-focus-within:text-neon-cyan transition-colors duration-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-neon-lime transition-colors duration-300">
          {icon}
        </div>
        <input
          {...props}
          className="w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm rounded-none py-3 pl-10 pr-4 focus:outline-none focus:border-neon-lime/50 focus:bg-white/[0.05] transition-all duration-300 font-mono tracking-wide"
        />
        {/* Technical Corner Accent */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
      </div>
      {error && (
        <MotionSpan
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-neon-pink text-xs font-mono"
        >
          /!/ {error}
        </MotionSpan>
      )}
    </div>
  );
};

export default Input;
