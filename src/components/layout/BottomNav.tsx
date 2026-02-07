// src/components/layout/BottomNav.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Compass, Search, User, Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const tabs = [
    { name: "Home", path: "/", icon: Home },
    { name: "Discover", path: "/explore", icon: Compass },
    { name: "Search", path: "/search", icon: Search },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const activeIndex = tabs.findIndex((t) =>
    pathname === "/" ? t.path === "/" : pathname.startsWith(t.path)
  );

  return (
    <>
      {/* Safe area spacer */}
      <div className="h-20" />

      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        {/* Main pill container */}
        <div className="relative flex items-center justify-around mx-auto max-w-[400px] bg-white/95 backdrop-blur-xl rounded-full border border-gray-200 shadow-xl">
          {/* Left side: Home & Discover */}
          <div className="flex items-center gap-2 w-full px-2">
            {tabs.slice(0, 2).map((tab, i) => {
              const Icon = tab.icon;
              const isActive = i === activeIndex;

              return (
                <button
                  key={tab.name}
                  onClick={() => router.push(tab.path)}
                  className={clsx(
                    "relative flex flex-col items-center justify-center gap-1 w-full h-14 rounded-full transition-all duration-200",
                    isActive
                      ? "text-black"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                  aria-label={tab.name}
                >
                  {/* Active glow effect */}
                  {isActive && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      animate={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-black" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs font-medium">{tab.name}</span>

                  {/* Profile avatar overlay */}
                  {tab.name === "Profile" && user?.user_metadata?.avatar_url && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border border-gray-300 overflow-hidden">
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Floating central + button */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/create")}
              className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Add new"
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Right side: Search & Profile */}
          <div className="flex items-center gap-2 w-full px-2">
            {tabs.slice(2).map((tab, i) => {
              const Icon = tab.icon;
              const isActive = i + 2 === activeIndex;

              return (
                <button
                  key={tab.name}
                  onClick={() => router.push(tab.path)}
                  className={clsx(
                    "relative flex flex-col items-center justify-center gap-1 w-full h-14 rounded-full transition-all duration-200",
                    isActive
                      ? "text-black"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                  aria-label={tab.name}
                >
                  {/* Active glow effect */}
                  {isActive && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      animate={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-black" : "text-gray-500"
                    }`}
                  />
                  <span className="text-xs font-medium">{tab.name}</span>

                  {/* Profile avatar overlay */}
                  {tab.name === "Profile" && user?.user_metadata?.avatar_url && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border border-gray-300 overflow-hidden">
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
