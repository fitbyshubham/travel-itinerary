"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Share2,
  Heart,
  MessageCircle,
  Loader2,
  Map as MapIcon,
  Package as PackageIcon,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { postApi, packageApi, itineraryApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { FeedMediaCarousel } from "@/components/feed/FeedMediaCarousel";
import { ItineraryCard } from "@/components/profile/ItineraryCard";
import { PackageCard } from "@/components/profile/PackageCard";
import { PackageBottomSheet } from "@/components/packages/PackageBottomSheet";
import type { Post } from "@/types/post";
import type { Package } from "@/types/package";
import type { Itinerary } from "@/types/itinerary";
import { AnimatePresence } from "framer-motion";

export default function PostDetailPage({ id }: { id: string }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch Post Details with user ID for context
        const postData = await postApi.getById(id, user?.id);
        const fetchedPost = "post" in postData ? postData.post : postData;
        setPost(fetchedPost as Post);

        if (fetchedPost.itinerary_id) {
          try {
            // 2. Fetch Itinerary Preview
            const itinData = await itineraryApi.getById(
              fetchedPost.itinerary_id,
            );
            setItinerary(itinData as Itinerary);

            // 3. Fetch Linked Packages
            // Pass the post author's ID (fetchedPost.user_id) to get packages created by them
            const pkgData = await packageApi.listByItinerary(
              fetchedPost.itinerary_id,
              fetchedPost.user_id,
            );
            const pkgList = Array.isArray(pkgData)
              ? pkgData
              : "packages" in pkgData
                ? pkgData.packages
                : [];

            // Filter deleted if necessary
            setPackages(pkgList.filter((p) => !p.soft_deleted));
          } catch (linkedErr) {
            console.warn("Failed to load linked data:", linkedErr);
          }
        }
      } catch (err: any) {
        console.error("Failed to load post:", err);
        setError(err.message || "Unable to load content");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, user?.id]);

  const navigate = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000411] flex items-center justify-center text-white/30">
        <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#000411] flex flex-col items-center justify-center text-white p-6">
        <AlertTriangle className="w-12 h-12 text-neon-pink mb-4 opacity-80" />
        <h2 className="text-lg font-medium mb-2">Content Unavailable</h2>
        <p className="text-white/40 text-sm text-center mb-6">
          {error || "This post could not be found."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000411] text-white pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#000411]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <span className="font-tech text-xs tracking-widest text-white/40">
            POST_DETAIL // {post.id.slice(0, 8)}
          </span>
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <Share2 className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </header>

      <main className="pt-20 max-w-2xl mx-auto px-4 space-y-8">
        {/* Media Section */}
        <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 bg-black relative">
          <FeedMediaCarousel uploads={post.uploads} />
        </div>

        {/* Post Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-sans font-medium leading-tight">
              {post.title}
            </h1>
            <div className="flex gap-4 items-center">
              <button className="flex flex-col items-center gap-0.5 text-white/40 hover:text-neon-pink transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-[9px] font-mono">Like</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 text-white/40 hover:text-neon-blue transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-[9px] font-mono">Comment</span>
              </button>
            </div>
          </div>

          <p className="text-white/70 font-light leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/30 font-mono pt-2">
            <span>Posted {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        {/* Linked Itinerary Section */}
        {itinerary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-neon-lime" />
                <h3 className="font-tech text-sm text-white/80 tracking-widest">
                  LINKED ITINERARY
                </h3>
              </div>
              <button
                onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                className="text-[10px] text-neon-blue hover:text-white transition-colors font-mono flex items-center gap-1"
              >
                FULL DETAILS <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Reusing existing profile card */}
            <ItineraryCard
              itinerary={itinerary}
              onClick={(id) => navigate(`/itinerary/${id}`)}
            />
          </div>
        )}

        {/* Linked Packages Section */}
        {packages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PackageIcon className="w-4 h-4 text-neon-pink" />
              <h3 className="font-tech text-sm text-white/80 tracking-widest">
                AVAILABLE PACKAGES
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onClick={() => setSelectedPackage(pkg)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Package Bottom Sheet */}
      <AnimatePresence>
        {selectedPackage && (
          <PackageBottomSheet
            pkg={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
