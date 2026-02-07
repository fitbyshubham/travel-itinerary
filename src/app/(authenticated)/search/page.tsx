"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Search as SearchIcon,
  Loader2,
  AlertTriangle,
  Scan,
  MapPin,
  Heart,
  MessageCircle,
  Maximize2,
} from "lucide-react";
import { motion } from "framer-motion";
import { feedApi } from "@/lib/api";
import type { FeedItem } from "@/types/feed";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div as any;

  const navigate = (path: string) => {
    router.push(path);
  };

  const goBack = () => {
    router.back();
  };

  const performSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]); // Clear previous results while loading

    try {
      const response = await feedApi.searchFeed(query);
      // The API response structure matches the type FeedResponse
      // results is an array in response.results
      setResults(response.results || []);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError("Search failed // Please retry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewItem = (id: string) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#000411] text-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-lime/5 rounded-full blur-[120px] mix-blend-screen opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      {/* Search Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#000411]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto w-full px-4 py-3 flex items-center gap-4">
          <button
            onClick={goBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
          >
            <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </button>

          <form onSubmit={performSearch} className="flex-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-lg" />
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 group-focus-within:border-neon-lime/50 rounded-lg pl-4 pr-1 h-12 transition-all duration-300">
              <SearchIcon className="w-4 h-4 text-white/30 mr-3 group-focus-within:text-neon-lime" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for people, places, or trips..."
                className="flex-1 bg-transparent border-none text-sm font-mono text-white placeholder-white/20 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="h-9 px-4 ml-2 rounded bg-white/5 hover:bg-neon-lime/20 border border-white/10 hover:border-neon-lime/50 text-white/50 hover:text-neon-lime transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="font-tech text-[10px]">Search</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Area */}
      <main className="relative z-10 pt-[80px] pb-20 max-w-2xl mx-auto w-full px-4 min-h-screen">
        {/* Status Line */}
        <div className="flex items-center gap-3 mb-6 opacity-60 pl-2">
          <div
            className={`w-1.5 h-1.5 rounded-sm ${isLoading ? "bg-neon-lime animate-ping" : hasSearched ? "bg-neon-blue" : "bg-white/20"}`}
          />
          <span className="font-tech text-[10px] tracking-[0.2em]">
            {isLoading
              ? "SEARCHING..."
              : hasSearched
                ? `FOUND ${results.length} RESULTS`
                : "READY"}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-neon-pink opacity-80">
            <AlertTriangle className="w-10 h-10 mb-4" />
            <span className="font-tech text-xs tracking-widest">{error}</span>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center bg-white/[0.02] mb-6">
              <SearchIcon className="w-8 h-8 opacity-50" />
            </div>
            <span className="font-tech text-xs tracking-widest mb-2">
              Start your search
            </span>
            <span className="font-mono text-[10px] text-white/10">
              Find inspiration for your next journey
            </span>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <Scan className="w-12 h-12 mb-4 opacity-50" />
            <span className="font-tech text-xs tracking-widest">
              No results found
            </span>
            <span className="font-mono text-[10px] text-white/20 mt-2">
              Try different keywords
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((item, index) => (
              <MotionDiv
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col bg-[#050A15] border border-white/5 overflow-hidden"
              >
                {/* Feed Item Header */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] backdrop-blur-sm border-b border-white/5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-sm overflow-hidden ring-1 ring-white/10 relative">
                        <Image
                          src={item.user.avatar_url || "/avatars/default.jpg"}
                          alt={item.user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-sm text-white font-medium tracking-wide">
                        {item.user.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-2.5 h-2.5 text-neon-lime" />
                        <span className="font-mono text-[9px] text-white/40 uppercase">
                          {item.user.country || "UNKNOWN_SECTOR"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Viewport */}
                <div
                  className="relative aspect-[4/5] bg-black overflow-hidden cursor-pointer"
                  onClick={() => handleViewItem(item.id)}
                >
                  {item.uploads && item.uploads.length > 0 ? (
                    item.uploads[0].type === "video" ? (
                      <video
                        src={item.uploads[0].signed_url || item.uploads[0].url}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <Image
                        src={item.uploads[0].signed_url || item.uploads[0].url || ""}
                        alt={item.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                        unoptimized
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Scan className="w-8 h-8 text-white/10" />
                    </div>
                  )}

                  {/* HUD Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] via-transparent to-transparent opacity-80" />

                  {/* Content Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-sans text-xl font-light text-white mb-2 leading-tight drop-shadow-lg">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-white/70 font-light line-clamp-2 leading-relaxed max-w-[90%] drop-shadow-md">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Minimal Footer for Search */}
                <div className="p-3 bg-[#050A15] flex items-center justify-between opacity-60">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-white/50" />
                      <span className="font-mono text-[10px]">
                        {item.like_count}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-white/50" />
                      <span className="font-mono text-[10px]">
                        {item.comment_count}
                      </span>
                    </div>
                  </div>
                  <Maximize2 className="w-4 h-4 text-white/30" />
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
