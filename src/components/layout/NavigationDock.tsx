"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Search, User, Plus, FileText, Box, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationDock({ pathname: externalPathname }: { pathname?: string }) {
  const router = useRouter();
  const pathnameFromNext = usePathname();
  const activePathname = externalPathname || pathnameFromNext || "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MotionButton = motion.button;
  const MotionDiv = motion.div;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigate = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const tabs = [
    { name: "NARFE", path: "/", icon: Home },
    { name: "SEARCH", path: "/search", icon: Search },
    { name: "PROFILE", path: "/profile", icon: User },
  ];

  const menuItems = [
    { label: "Create Post", icon: FileText, path: "/create/post", color: "text-neon-blue" },
    { label: "Create Itinerary", icon: Map, path: "/create/itinerary", color: "text-neon-lime" },
    { label: "Create Package", icon: Box, path: "/create/package", color: "text-neon-purple" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center pb-[calc(1.5rem+env(safe-area-inset-bottom))] pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center gap-4">
      {/* Expanded Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex flex-col gap-2 mb-2"
          >
            {menuItems.map((item, i) => (
              <MotionDiv
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-5 py-3 bg-[#000411]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:bg-white/10 hover:border-white/20 transition-all group w-48"
                >
                  <div className={`p-2 rounded-lg bg-white/5 ${item.color} group-hover:bg-white/10 transition-colors`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white/90 font-sans tracking-wide">
                    {item.label}
                  </span>
                </button>
              </MotionDiv>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-[#000411]/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]" />

        <div className="relative flex items-center gap-1 p-1.5 px-3">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive =
              activePathname === tab.path ||
              (tab.path !== "/" && activePathname.startsWith(tab.path));

            if (idx === 1) {
              return (
                <React.Fragment key="fab-container">
                  <MotionButton
                    key="fab"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMenu}
                    className={`mx-2 w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] text-black border-2 border-[#000411] relative group transition-all duration-300 ${isMenuOpen ? "bg-white rotate-45" : "bg-gradient-to-tr from-neon-lime to-emerald-500"}`}
                  >
                    <Plus className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? "text-black" : "group-hover:rotate-90"}`} />
                  </MotionButton>
                  <button
                    key={tab.name}
                    onClick={() => navigate(tab.path)}
                    className={`relative w-12 h-12 flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-300 group ${
                      isActive
                        ? "text-white"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-white/5 rounded-full scale-0 transition-transform duration-300 ${isActive ? "scale-0" : "group-hover:scale-100"}`}
                    />
                    <Icon
                      className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] text-neon-blue" : ""}`}
                    />
                    {isActive && (
                      <div className="w-1 h-1 bg-neon-blue rounded-full absolute bottom-2" />
                    )}
                  </button>
                </React.Fragment>
              );
            }
            return (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className={`relative w-12 h-12 flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-300 group ${
                  isActive ? "text-white" : "text-white/30 hover:text-white/60"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-white/5 rounded-full scale-0 transition-transform duration-300 ${isActive ? "scale-0" : "group-hover:scale-100"}`}
                />
                <Icon
                  className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] text-neon-blue" : ""}`}
                />
                {isActive && (
                  <div className="w-1 h-1 bg-neon-blue rounded-full absolute bottom-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
);
}
