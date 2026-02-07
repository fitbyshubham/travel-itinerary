"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "white";
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "relative w-full py-4 px-6 font-tech text-sm transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-neon-lime/90 text-space-void hover:bg-neon-lime border border-transparent",
    secondary:
      "bg-transparent text-white border border-white/20 hover:border-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/[0.05]",
    white:
      "bg-gradient-to-b from-white to-gray-200 text-black border border-white/50 hover:to-white shadow-[0_0_20px_rgba(255,255,255,0.2)]",
  };

  // Cast motion.button to any to bypass environment-specific typing issues
  const MotionButton = motion.button as any;

  return (
    <MotionButton
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      <span className="contents">
        {/* Button Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <>
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {children}
          </>
        </span>

        {/* Hover Glitch Effect Overlay */}
        <span className="absolute inset-0 bg-white/20 translate-y-full skew-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
      </span>
    </MotionButton>
  );
};

export default Button;
