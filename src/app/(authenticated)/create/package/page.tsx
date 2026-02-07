"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Box,
  Upload,
  X,
  DollarSign,
  Globe,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Map,
} from "lucide-react";
import { uploadMediaFile } from "@/lib/media-upload";
import { packageApi, itineraryApi } from "@/lib/api";
import type { Itinerary } from "@/types/itinerary";

type Visibility = "public" | "private";

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  visibility: Visibility;
}

export default function CreatePackagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    currency: "EUR",
    visibility: "public",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div;

  // Itinerary Selection State
  const [userItineraries, setUserItineraries] = useState<Itinerary[]>([]);
  const [itineraryId, setItineraryId] = useState("");
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(true);

  const navigate = (path: string) => {
    router.push(path);
  };

  // Fetch Itineraries on mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await itineraryApi.list();
        const data = Array.isArray(response)
          ? response
          : "itineraries" in response
            ? response.itineraries
            : [];
        setUserItineraries(data || []);
      } catch (err) {
        console.error("Failed to load itineraries", err);
      } finally {
        setIsLoadingItineraries(false);
      }
    };
    fetchItineraries();
  }, []);

  const handleItineraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "create_new") {
      navigate("/create/itinerary");
      return;
    }
    setItineraryId(value);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic Validation
      if (!file.type.startsWith("image/")) {
        setError("INVALID_FORMAT // IMAGE_ONLY");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        setError("FILE_SIZE_LIMIT_EXCEEDED // MAX_10MB");
        return;
      }

      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("TITLE_REQUIRED");
      return;
    }
    if (!formData.description.trim()) {
      setError("DESCRIPTION_REQUIRED");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("INVALID_PRICE_VALUE");
      return;
    }
    if (!coverFile) {
      setError("COVER_IMAGE_MISSING");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Image
      const uploadResult = await uploadMediaFile(coverFile);
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "IMAGE_UPLOAD_FAILED");
      }

      // 2. Submit Package Data (without itinerary_id)
      const packageResponse = await packageApi.create({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: "EUR",
        visibility: formData.visibility,
        cover_image_url: uploadResult.url,
      });

      // 3. Link Itinerary if selected (Separate API call)
      if (itineraryId && packageResponse.package?.id) {
        await packageApi.addItineraries(packageResponse.package.id, [
          itineraryId,
        ]);
      }

      // 4. Success & Redirect
      navigate("/profile?tab=packages");
    } catch (err: unknown) {
      console.error("Package creation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "SYSTEM_ERROR // UPLOAD_ABORTED";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000411] text-white pb-12 relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-lime/5 rounded-full blur-[100px] mix-blend-screen opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#000411]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
            </button>
            <div className="flex flex-col">
              <h1 className="font-sans text-lg font-medium text-white">
                Create Package
              </h1>
            <div className="flex justify-center mt-4">
            </div>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-neon-lime/10 border border-neon-lime/30 flex items-center justify-center">
            <Box className="w-5 h-5 text-neon-lime" />
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 md:p-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Cover Image Upload Module */}
          <div className="relative group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {coverPreview ? (
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#050A15]"
                >
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000411] via-transparent to-transparent opacity-60" />

                  {/* Overlay Controls */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 bg-black/50 hover:bg-red-500/20 text-white/70 hover:text-red-400 backdrop-blur-md rounded-full border border-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-neon-lime/10 border border-neon-lime/30 rounded-full backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neon-lime" />
                      <span className="font-tech text-[10px] text-neon-lime">
                        IMAGE_VERIFIED
                      </span>
                    </div>
                  </div>
                </MotionDiv>
              ) : (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-[16/9] w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-neon-lime/30 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group/upload overflow-hidden"
                >
                  {/* Scanning Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-lime/5 to-transparent translate-y-[-100%] group-hover/upload:translate-y-[100%] transition-transform duration-1000 ease-linear" />

                  <div className="w-16 h-16 rounded-full bg-[#050A15] border border-white/10 flex items-center justify-center group-hover/upload:scale-110 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10">
                    <Upload className="w-6 h-6 text-white/30 group-hover/upload:text-neon-lime transition-colors" />
                  </div>
                  <div className="flex flex-col items-center z-10">
                    <span className="font-tech text-sm text-white/60 mb-1">
                      UPLOAD_COVER_IMAGE
                    </span>
                    <span className="text-xs text-white/30">
                      JPG, PNG // MAX 10MB
                    </span>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Details Module */}
          <div className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-2xl" />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Package Identifier
                </label>
                <input
                  placeholder="Enter Package Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-2 text-xl font-sans text-white placeholder-white/20 focus:outline-none focus:border-neon-lime/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Description Protocol
                </label>
                <textarea
                  placeholder="Describe the experience..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full min-h-[120px] bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white/80 focus:outline-none focus:border-neon-lime/50 resize-none transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 3. Settings Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Itinerary Link */}
            <div className="md:col-span-2 bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-4 h-4 text-neon-blue" />
                <h3 className="font-tech text-xs text-white/60 tracking-widest">
                  LINK_ITINERARY
                </h3>
              </div>

              <div className="relative">
                <select
                  value={itineraryId}
                  onChange={handleItineraryChange}
                  disabled={isLoadingItineraries}
                  className="w-full h-12 bg-[#050A15] border border-white/10 rounded-xl pl-4 pr-10 text-sm text-white focus:outline-none focus:border-neon-blue/50 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="bg-[#050A15] text-white">
                    Select Itinerary to Package
                  </option>
                  {userItineraries.map((itinerary) => (
                    <option
                      key={itinerary.id}
                      value={itinerary.id}
                      className="bg-[#050A15] text-white"
                    >
                      {itinerary.title}
                    </option>
                  ))}
                  <option
                    value="create_new"
                    className="bg-[#050A15] text-neon-lime font-bold"
                  >
                    + Create New Itinerary
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                  {isLoadingItineraries ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "▼"
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-neon-lime" />
                <h3 className="font-tech text-xs text-white/60 tracking-widest">
                  VALUATION
                </h3>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-tech text-white/40 uppercase">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-3 text-lg font-mono text-white focus:outline-none focus:border-neon-lime/50 placeholder-white/20"
                  />
                </div>
                <div className="w-24 space-y-2">
                  <label className="text-[10px] font-tech text-white/40 uppercase">
                    Unit
                  </label>
                  <div className="w-full h-[54px] bg-white/[0.03] border border-white/10 rounded-lg px-3 flex items-center justify-center text-sm font-mono text-white/60">
                    EUR
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Card */}
            <div className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-neon-blue" />
                <h3 className="font-tech text-xs text-white/60 tracking-widest">
                  ACCESS_CONTROL
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, visibility: "public" })
                  }
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    formData.visibility === "public"
                      ? "bg-neon-blue/10 border-neon-blue/50 text-white"
                      : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <Globe
                    className={`w-4 h-4 ${formData.visibility === "public" ? "text-neon-blue" : "opacity-50"}`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-tech text-[10px] tracking-wider">
                      PUBLIC_NETWORK
                    </span>
                    <span className="text-[10px] opacity-60">
                      Visible to all travelers
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, visibility: "private" })
                  }
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    formData.visibility === "private"
                      ? "bg-neon-purple/10 border-neon-purple/50 text-white"
                      : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <Lock
                    className={`w-4 h-4 ${formData.visibility === "private" ? "text-neon-purple" : "opacity-50"}`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-tech text-[10px] tracking-wider">
                      ENCRYPTED_PRIVATE
                    </span>
                    <span className="text-[10px] opacity-60">
                      Only accessible by you
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Action Area */}
          <div className="pt-6">
            {error && (
              <div className="flex items-center gap-2 text-neon-pink bg-neon-pink/5 border border-neon-pink/10 p-3 rounded-xl mb-4 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span className="font-tech text-xs">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black rounded-xl font-tech text-sm font-bold tracking-wide hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>Create Package</>
              )}
            </button>


          </div>
        </form>
      </main>
    </div>
  );
}
