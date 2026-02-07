"use client"
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Grid,
  LogOut,
  Map,
  Box,
  Share2,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  User,
  MapPin,
} from "lucide-react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { ItineraryList } from "@/components/profile/ItineraryList";
import { PackageList } from "@/components/profile/PackageList";
import { PostList } from "@/components/profile/PostList";

type TabType = "posts" | "itineraries" | "packages";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuthStore();
  const tabParam = searchParams.get("tab") as TabType;
  const activeTab = (tabParam && ["posts", "itineraries", "packages"].includes(tabParam)) 
      ? tabParam 
      : "posts";
  
  const setActiveTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/profile?${params.toString()}`);
  };
  const [scrolled, setScrolled] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const MotionDiv = motion.div;

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const navigate = (path: string) => {
    router.push(path);
  };

  const goBack = () => {
    router.back();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- Data Mapping (Exact API Data) ---
  const avatarUrl = user?.avatar_url || user?.user_metadata?.avatar_url || "/avatars/default.jpg";
  const rawName = user?.name || user?.user_metadata?.name;
  const userName = rawName || "Anonymous";
  const userHandle = rawName
    ? `@${rawName.replace(/\s+/g, "").toLowerCase()}`
    : "";
  const userBio = user?.bio || user?.user_metadata?.bio || "";
  const userLocation = user?.country || user?.user_metadata?.country || "";

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  // Mock Stats (to be replaced with real counts API later)
  const stats = {
    followers: 0,
    following: 0,
    posts: 0,
    itineraries: 0,
    packages: 0,
  };

  const tabs = [
    { id: "posts", label: "Posts", count: stats.posts, icon: Grid },
    {
      id: "itineraries",
      label: "Itineraries",
      count: stats.itineraries,
      icon: Map,
    },
    { id: "packages", label: "Packages", count: stats.packages, icon: Box },
  ];

  return (
    <div className="min-h-screen bg-[#000411] text-white font-sans selection:bg-neon-lime/30 selection:text-neon-lime">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#0A1020] to-transparent opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]" />
      </div>

      {/* Sticky Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#000411]/90 backdrop-blur-xl border-white/10 py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
            </button>

            {/* Show name in header only when scrolled */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : 10 }}
              className="flex flex-col"
            >
              <span className="font-medium text-sm text-white">{userName}</span>
            </MotionDiv>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group">
              <Share2 className="w-4 h-4 text-white/70 group-hover:text-white" />
            </button>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/10 flex items-center justify-center transition-colors group"
            >
              <LogOut className="w-4 h-4 text-white/70 group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20 max-w-3xl mx-auto w-full px-4 md:px-6">
        {/* Profile Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-start">
            {/* Avatar */}
            <div
              className="relative group cursor-pointer"
              onClick={() => setShowEditProfile(true)}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-neon-blue via-neon-lime to-neon-purple">
                <div className="w-full h-full rounded-full bg-[#000411] p-1 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white/50" />
                  )}
                </div>
              </div>
              {/* Verified Badge */}
              {(user?.is_creator || user?.user_metadata?.is_creator) && (
                <div className="absolute bottom-1 right-1 bg-[#000411] rounded-full p-1">
                  <div className="bg-neon-blue rounded-full p-1">
                    <CheckCircle2 className="w-3 h-3 text-black" />
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 mt-4">
              <button
                onClick={() => setShowEditProfile(true)}
                className="px-6 py-2 bg-white text-black font-medium text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                Edit Profile
              </button>
              <button className="px-6 py-2 bg-white/5 border border-white/10 text-white font-medium text-sm rounded-full hover:bg-white/10 transition-colors">
                Settings
              </button>
            </div>

            {/* Mobile Actions */}
            <button className="md:hidden mt-4 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                {userName}
              </h1>
              {userHandle && (
                <span className="font-mono text-sm text-white/40">
                  {userHandle}
                </span>
              )}
            </div>

            {/* Bio (Only if present) */}
            {userBio ? (
              <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                {userBio}
              </p>
            ) : (
              <p className="text-white/20 text-sm italic">No bio available</p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/40">
              {userLocation && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{userLocation}</span>
                </div>
              )}

              {(user?.preferred_currency || user?.user_metadata?.preferred_currency) && (
                <div className="flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" />
                  <span>{user?.preferred_currency || user?.user_metadata?.preferred_currency || "EUR"}</span>
                </div>
              )}

              {joinDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {joinDate}</span>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6 pt-2">
              <button className="flex items-center gap-1.5 group">
                <span className="font-bold text-white group-hover:underline decoration-white/30 underline-offset-4">
                  {stats.following}
                </span>
                <span className="text-sm text-white/40">Following</span>
              </button>
              <button className="flex items-center gap-1.5 group">
                <span className="font-bold text-white group-hover:underline decoration-white/30 underline-offset-4">
                  {stats.followers}
                </span>
                <span className="text-sm text-white/40">Followers</span>
              </button>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex md:hidden gap-3 mt-2">
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex-1 py-2 bg-white text-black font-medium text-sm rounded-lg"
            >
              Edit Profile
            </button>
            <button className="flex-1 py-2 bg-white/5 border border-white/10 text-white font-medium text-sm rounded-lg">
              Share Profile
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-[73px] z-30 bg-[#000411]/95 backdrop-blur-xl border-b border-white/10 -mx-4 px-4 md:-mx-0 md:px-0">
          <div className="flex items-center w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="flex-1 relative py-4 flex items-center justify-center gap-2 group hover:bg-white/[0.02] transition-colors"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/40 group-hover:text-white/60"}`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <MotionDiv
                      layoutId="activeTabProfile"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-lime"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] pt-6">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* ITINERARIES TAB */}
              {activeTab === "itineraries" ? (
                <ItineraryList onNavigate={navigate} />
              ) : activeTab === "packages" ? (
                // PACKAGES TAB
                <PackageList onNavigate={navigate} />
              ) : (
                // POSTS TAB
                <PostList onNavigate={navigate} />
              )}
            </MotionDiv>
          </AnimatePresence>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && user && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#000411]" />}>
      <ProfileContent />
    </Suspense>
  );
}
