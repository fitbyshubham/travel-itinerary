"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store";
import { useFeed } from "@/hooks/useFeed";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Heart,
  Share2,
  MapPin,
  Bell,
  MoreVertical,
  Loader2,
  AlertTriangle,
  MessageCircle,
  Radio,
  Maximize2,
} from "lucide-react";
import CommentModal from "@/components/feed/CommentModal";
import { FeedMediaCarousel } from "@/components/feed/FeedMediaCarousel";

export default function HomePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div;

  const {
    items,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    toggleLike,
    likingIds,
  } = useFeed();

  const [playingId, setPlayingId] = useState<string | null>(null);
  const playObserver = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Custom navigation function compatible with App.tsx router
  const navigate = (path: string) => {
    router.push(path);
  };

  // Comment Modal State
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  // Intersection Observer for Auto-Play
  useEffect(() => {
    playObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlayingId(entry.target.getAttribute("data-id"));
          }
        });
      },
      { threshold: 0.6, rootMargin: "-10% 0px" },
    );

    return () => {
      if (playObserver.current) playObserver.current.disconnect();
    };
  }, []);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (!hasMore || isLoading || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentSentinel = loadMoreRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, isLoading, isFetchingMore, loadMore]);

  // Attach observer to feed cards when items change
  useEffect(() => {
    if (!playObserver.current) return;

    // Disconnect old observations
    playObserver.current.disconnect();

    const elements = document.querySelectorAll(".feed-card");
    elements.forEach((el) => playObserver.current?.observe(el));
  }, [items]);

  const handleViewItem = (id: string) => {
    navigate(`/post/${id}`);
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    toggleLike(postId);
  };

  const openCommentModal = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setActiveCommentId(postId);
  };

  const closeCommentModal = () => {
    setActiveCommentId(null);
  };

  const handleCommentAdded = () => {
    // Optional local update logic if needed
  };

  // Safe Avatar Logic
  const userAvatar =
    user?.user_metadata?.avatar_url && user.user_metadata.avatar_url !== ""
      ? user.user_metadata.avatar_url
      : "/avatars/default.jpg";

  return (
    <div className="min-h-screen bg-[#000411] text-white relative selection:bg-neon-lime/30 selection:text-neon-lime pb-24">
      {/* Ambient Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[100px] mix-blend-screen opacity-40" />
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-neon-lime/5 rounded-full blur-[80px] mix-blend-overlay opacity-30" />
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </div>

      {/* FIXED HEADER - COMMAND DECK STYLE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#000411]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-2xl mx-auto w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar/Profile Link */}
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 group-hover:border-neon-lime/50 transition-colors bg-white/5 relative">
                <Image
                  src={userAvatar}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#000411] rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-sans font-semibold text-sm tracking-tight text-white">
                Narfe
              </span>

            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
              <Radio className="w-4 h-4 text-neon-blue" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors relative">
              <Bell className="w-4 h-4 text-white/70" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-pink rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* FEED CONTAINER */}
      <main className="relative z-10 pt-[80px] max-w-lg mx-auto w-full px-4">
        {/* Create Post Prompt */}
        <div
          onClick={() => navigate("/create")}
          className="mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white/70 group-hover:text-neon-lime transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                Start a new transmission...
              </span>
              <span className="text-[10px] font-tech text-white/30 tracking-wider">
                SHARE_EXPERIENCE
              </span>
            </div>
          </div>
        </div>

        {/* FEED LIST */}
        <div className="space-y-8">
          {isLoading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
              <span className="font-tech text-xs tracking-widest text-white/40 animate-pulse">
                ESTABLISHING_UPLINK...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-neon-pink">
              <AlertTriangle className="w-10 h-10 opacity-80" />
              <div className="text-center">
                <p className="font-tech text-xs tracking-widest mb-1">
                  SIGNAL_LOST
                </p>
                <p className="text-sm text-white/50">{error}</p>
              </div>
              <button
                onClick={refresh}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono transition-colors"
              >
                RETRY_CONNECTION
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-sm">No transmissions found in this sector.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <MotionDiv
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="feed-card bg-[#050A15] border border-white/10 rounded-2xl overflow-hidden mb-8"
                data-id={item.id}
              >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                      <Image
                        src={item.user.avatar_url || "/avatars/default.jpg"}
                        alt={item.user.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-white">
                        {item.user.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                        {item.user.country && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>{item.user.country}</span>
                            <span className="text-white/10">|</span>
                          </>
                        )}
                        <span>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Media */}
                <div className="relative aspect-[4/5] bg-black">
                  <FeedMediaCarousel
                    uploads={item.uploads}
                    onClick={() => handleViewItem(item.id)}
                    shouldPlay={playingId === item.id}
                  />
                </div>

                {/* Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleLike(e, item.id)}
                        className="flex items-center gap-1.5 group"
                        disabled={likingIds.has(item.id)}
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${item.liked ? "fill-neon-pink text-neon-pink" : "text-white/60 group-hover:text-white"}`}
                        />
                        <span
                          className={`text-sm font-mono ${item.liked ? "text-neon-pink" : "text-white/40"}`}
                        >
                          {item.like_count}
                        </span>
                      </button>

                      <button
                        onClick={(e) => openCommentModal(e, item.id)}
                        className="flex items-center gap-1.5 group"
                      >
                        <MessageCircle className="w-6 h-6 text-white/60 group-hover:text-neon-blue transition-colors" />
                        <span className="text-sm font-mono text-white/40">
                          {item.comment_count}
                        </span>
                      </button>

                      <button className="text-white/60 hover:text-white transition-colors">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleViewItem(item.id)}
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Caption */}
                  <div className="space-y-1">
                    <h3 className="font-medium text-white text-base">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-white/70 line-clamp-2 font-light leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </MotionDiv>
            ))
          )}

          {/* Sentinel for Infinite Scroll */}
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
            {isFetchingMore && (
              <div className="flex flex-col items-center gap-2 opacity-40">
                <Loader2 className="w-5 h-5 animate-spin text-neon-lime" />
                <span className="font-tech text-[10px] tracking-widest uppercase">
                  Fetching_Next_Packet
                </span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <span className="font-mono text-[10px] text-white/10 uppercase tracking-[0.2em] py-8">
                End_of_Transmission
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Comment Modal */}
      <AnimatePresence>
        {activeCommentId && (
          <CommentModal
            postId={activeCommentId}
            onClose={closeCommentModal}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
