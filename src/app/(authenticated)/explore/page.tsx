"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useExploreFeed } from "@/hooks/useExploreFeed";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Loader2,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const { items, isLoading, hasMore, loadMore, error } = useExploreFeed();
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Navigate helper
  const navigate = (path: string) => {
    router.push(path);
  };

  // Setup Intersection Observer to detect which video is in view
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // Video must be 60% visible to be considered active
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          if (id) setActiveId(id);

          // Check if we need to load more
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
          );
          if (items.length > 0 && index >= items.length - 2 && hasMore) {
            loadMore();
          }
        }
      });
    }, options);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [items, hasMore, loadMore]);

  // Attach observer to elements
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll(".video-section");
    sections.forEach((section) => observer.current?.observe(section));

    return () => {
      sections.forEach((section) => observer.current?.unobserve(section));
    };
  }, [items]);

  return (
    <div className="bg-[#000411] text-white h-screen w-full relative overflow-hidden">
      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="font-sans text-xl font-medium tracking-tight">
              Discover
            </h1>
            <span className="font-tech text-[10px] text-white/50 tracking-widest">
              GLOBAL_FEED // LIVE
            </span>
          </div>

          {/* Mute Toggle (pointer-events-auto to allow click) */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Vertical Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {items.length === 0 && isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
            <span className="font-tech text-xs tracking-widest animate-pulse">
              ESTABLISHING_UPLINK...
            </span>
          </div>
        ) : items.length === 0 && error ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-neon-pink">
            <span className="font-tech text-xs tracking-widest">
              SIGNAL_LOST
            </span>
            <p className="text-sm opacity-50">{error}</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              data-id={item.id}
              data-index={index}
              className="video-section relative h-screen w-full snap-start snap-always bg-black flex items-center justify-center overflow-hidden"
            >
              <VideoPlayer
                src={item.uploads[0]?.signed_url || item.uploads[0]?.url}
                isActive={activeId === item.id}
                isMuted={isMuted}
                poster={
                  item.uploads[0]?.type === "image"
                    ? item.uploads[0]?.signed_url || item.uploads[0]?.url
                    : undefined
                }
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Right Side Actions */}
              <div className="absolute bottom-24 right-4 z-30 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-1 group">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all group-active:scale-95 hover:bg-white/20">
                    <Heart
                      className={`w-6 h-6 ${item.liked ? "text-neon-pink fill-neon-pink" : "text-white"}`}
                    />
                  </button>
                  <span className="text-xs font-mono font-medium">
                    {item.like_count}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all group-active:scale-95 hover:bg-white/20">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-xs font-mono font-medium">
                    {item.comment_count}
                  </span>
                </div>

                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all group-active:scale-95 hover:bg-white/20">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Bottom Info Area */}
              <div className="absolute bottom-0 left-0 right-16 z-30 p-4 pb-24 flex flex-col gap-3">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-white/5">
                    <img
                      src={item.user.avatar_url || "/avatars/default.jpg"}
                      alt={item.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm drop-shadow-md">
                        {item.user.name}
                      </span>
                      <button className="px-2 py-0.5 rounded border border-white/20 bg-white/5 text-[10px] font-medium hover:bg-white/10 transition-colors">
                        Follow
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <MapPin className="w-3 h-3 text-neon-lime" />
                      <span className="uppercase font-mono text-[10px]">
                        {item.user.country || "Unknown Location"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h3 className="text-lg font-light leading-tight drop-shadow-md max-w-[90%]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 font-light max-w-[90%]">
                    {item.description}
                  </p>
                </div>

                {/* VIEW DETAIL BUTTON */}
                <button
                  onClick={() => navigate(`/post/${item.id}`)}
                  className="mt-2 w-fit flex items-center gap-2 pl-3 pr-4 py-2 bg-neon-blue/90 hover:bg-neon-blue backdrop-blur-md rounded-lg transition-all shadow-[0_0_15px_rgba(0,69,255,0.3)] group"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                  <span className="font-tech text-xs font-bold tracking-wide">
                    VIEW_DETAILS
                  </span>
                  <ChevronRight className="w-3 h-3 opacity-50 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper Video Component to handle Play/Pause logic
function VideoPlayer({
  src,
  isActive,
  isMuted,
  poster,
}: {
  src: string;
  isActive: boolean;
  isMuted: boolean;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      }
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  );
}
