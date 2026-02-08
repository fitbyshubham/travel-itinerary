"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Scan } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  url?: string;
  signed_url?: string;
}

const CarouselItem = ({
  media,
  isActive,
}: {
  media: MediaItem;
  isActive: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media.type === "video" && videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, media.type]);

  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        src={media.signed_url || media.url}
        className="w-full h-full object-cover pointer-events-none"
        muted
        loop
        playsInline
      />
    );
  }
  return (
    <div className="relative w-full h-full">
      <Image
        src={media.signed_url || media.url || ""}
        alt="content"
        fill
        className="object-cover pointer-events-none select-none"
        unoptimized
      />
    </div>
  );
};

interface FeedMediaCarouselProps {
  uploads: MediaItem[];
  onClick?: () => void;
  shouldPlay?: boolean;
}

export const FeedMediaCarousel = ({
  uploads,
  onClick,
  shouldPlay = true,
}: FeedMediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      if (!isNaN(index)) {
        setCurrentIndex(index);
      }
    }
  };

  if (!uploads || uploads.length === 0) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2"
        onClick={onClick}
      >
        <Scan className="w-8 h-8 text-white/10" />
        <span className="font-tech text-xs text-white/20">
          No media available
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x touch-pan-y"
        onClick={onClick}
      >
        {uploads.map((media, idx) => (
          <div
            key={idx}
            className="w-full h-full shrink-0 snap-center relative bg-[#050A15] flex items-center justify-center"
          >
            <CarouselItem
              media={media}
              isActive={idx === currentIndex && shouldPlay}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      {uploads.length > 1 && (
        <>
          <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-md z-20 pointer-events-none">
            <span className="font-mono text-[9px] text-white/80">
              {currentIndex + 1}/{uploads.length}
            </span>
          </div>

          {/* Dots */}
          <div className="absolute top-4 left-4 flex gap-1 z-20 pointer-events-none">
            {uploads.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 shadow-sm ${
                  idx === currentIndex ? "w-4 bg-neon-lime" : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Single Item Badge (If only 1 item and it's video, show REC) */}
      {uploads.length === 1 && uploads[0].type === "video" && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
            <span className="font-tech text-[8px] text-white/70">REC</span>
          </div>
        </div>
      )}
    </div>
  );
};
