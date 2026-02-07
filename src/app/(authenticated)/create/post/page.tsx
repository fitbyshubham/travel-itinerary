"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  X,
  Upload,
  Map,
  Globe,
  Lock,
  Loader2,
  AlertCircle,
  Plus,
  Film,
  CheckCircle2,
} from "lucide-react";
import { uploadMediaFile } from "@/lib/media-upload";
import { itineraryApi, postApi } from "@/lib/api";
import type { Itinerary } from "@/types/itinerary";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function CreatePostPage() {
  const router = useRouter();
  // State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itineraryId, setItineraryId] = useState("");
  const [visibility, setVisibility] = useState<"public" | "draft">("public");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [userItineraries, setUserItineraries] = useState<Itinerary[]>([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = (path: string) => {
    router.push(path);
  };

  // Fetch Itineraries on mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await itineraryApi.list();
        // Handle both array response and object response formats
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

  // Handle Itinerary Dropdown Selection
  const handleItineraryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "create_new") {
      navigate("/create/itinerary");
      return;
    }
    setItineraryId(value);
  };

  // File Handling
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newMedia: MediaFile[] = [];
    Array.from(files).forEach((file) => {
      // Validate Type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        return;
      }
      // Validate Size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        return;
      }

      const type = file.type.startsWith("video/") ? "video" : "image";
      newMedia.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type,
      });
    });

    setMediaFiles((prev) => [...prev, ...newMedia]);
    setError(null);
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((m) => m.id !== id);
    });
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("TITLE_REQUIRED");
      return;
    }
    if (mediaFiles.length === 0) {
      setError("MEDIA_REQUIRED");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload all files
      const uploadPromises = mediaFiles.map((media) =>
        uploadMediaFile(media.file)
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Check for failures
      const failedUploads = uploadResults.filter((r) => !r.success);
      if (failedUploads.length > 0) {
        throw new Error(`Failed to upload ${failedUploads.length} files`);
      }

      const uploadedUrls = uploadResults.map((r, index) => ({
        type: mediaFiles[index].type,
        url: r.url!,
      }));

      // 2. Create Post
      await postApi.create({
        title,
        description,
        itinerary_id: itineraryId || undefined,
        visibility,
        uploads: uploadedUrls,
      });

      // 3. Success
      navigate("/profile?tab=posts");
    } catch (err: any) {
      console.error("Post creation failed:", err);
      setError(err.message || "UPLOAD_FAILED // TRY_AGAIN");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000411] text-white pb-40 md:pb-32 relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-neon-pink/10 rounded-full blur-[100px] mix-blend-screen opacity-30" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px] mix-blend-screen opacity-20" />
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
                Create Post
              </h1>
              <span className="font-tech text-[10px] text-white/30 tracking-widest">
                SHARE_EXPERIENCE
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-neon-pink" />
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 md:p-8 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* 1. Media Upload Module */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-tech text-white/40 uppercase">
                Media Assets
              </label>
              <span className="text-[10px] font-mono text-white/20">
                {mediaFiles.length} Selected
              </span>
            </div>

            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[160px] md:min-h-[200px] flex flex-col justify-center items-center gap-4 group ${
                dragActive
                  ? "border-neon-lime/50 bg-neon-lime/5"
                  : mediaFiles.length > 0
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              {mediaFiles.length === 0 ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-[#050A15] border border-white/10 flex items-center justify-center shadow-lg mb-3">
                    <Upload className="w-6 h-6 text-white/30" />
                  </div>
                  <span className="font-tech text-sm text-white/60 mb-1">
                    Drag Media Here
                  </span>
                  <span className="text-xs text-white/30">
                    or tap to browse
                  </span>
                </div>
              ) : (
                <div className="w-full p-4 grid grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {mediaFiles.map((media) => (
                      <motion.div
                        key={media.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square rounded-xl overflow-hidden bg-[#050A15] border border-white/10 group/preview"
                      >
                        {media.type === "video" ? (
                          <video
                            src={media.preview}
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <img
                            src={media.preview}
                            alt="preview"
                            className="w-full h-full object-cover opacity-80"
                          />
                        )}

                        {media.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Film className="w-6 h-6 text-white/50" />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeMedia(media.id)}
                          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    {/* Add More Button in Grid */}
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white/30 hover:text-white/60"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-[10px] font-tech">Add</span>
                    </motion.button>
                  </AnimatePresence>
                </div>
              )}

              {/* Click trigger for empty state */}
              {mediaFiles.length === 0 && (
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                />
              )}
            </div>
          </div>

          {/* 2. Details Form */}
          <div className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-8 space-y-6 relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-2xl" />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Post Title
                </label>
                <input
                  placeholder="Write a caption..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-lg md:text-xl font-sans text-white placeholder-white/20 focus:outline-none focus:border-neon-pink/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Description
                </label>
                <textarea
                  placeholder="Share the details of your experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[100px] bg-white/[0.03] border border-white/10 rounded-lg p-3 text-base md:text-sm text-white/80 focus:outline-none focus:border-neon-pink/50 resize-none transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 3. Connections & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Itinerary Link */}
            <div className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-4 h-4 text-neon-blue" />
                <h3 className="font-tech text-xs text-white/60 tracking-widest">
                  Link Itinerary
                </h3>
              </div>

              <div className="relative">
                <select
                  value={itineraryId}
                  onChange={handleItineraryChange}
                  disabled={isLoadingItineraries}
                  className="w-full h-12 bg-[#050A15] border border-white/10 rounded-xl pl-4 pr-10 text-base md:text-sm text-white focus:outline-none focus:border-neon-blue/50 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" className="bg-[#050A15] text-white">
                    Select an Itinerary (Optional)
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
                  {/* Always show option to create new, which redirects */}
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

            {/* Visibility */}
            <div className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-neon-lime" />
                <h3 className="font-tech text-xs text-white/60 tracking-widest">
                  Visibility
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    visibility === "public"
                      ? "bg-neon-lime/10 border-neon-lime/50 text-white"
                      : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <Globe
                    className={`w-4 h-4 ${
                      visibility === "public" ? "text-neon-lime" : "opacity-50"
                    }`}
                  />
                  <span className="font-tech text-[10px]">Public</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("draft")}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    visibility === "draft"
                      ? "bg-white/10 border-white/50 text-white"
                      : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <Lock
                    className={`w-4 h-4 ${
                      visibility === "draft" ? "text-white" : "opacity-50"
                    }`}
                  />
                  <span className="font-tech text-[10px]">Draft</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 md:pb-4 bg-[#000411]/90 backdrop-blur-xl border-t border-white/10 z-50">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              {error ? (
                <div className="flex items-center gap-2 text-neon-pink animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-tech text-xs">{error}</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="font-tech text-[10px] text-white/30">
                    READY_TO_PUBLISH
                  </span>
                  <span className="font-mono text-xs text-white/60">
                    Syncing to Grid...
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-white text-black rounded-xl font-tech text-sm font-bold tracking-wide hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    UPLOADING...
                  </>
                ) : (
                  <>PUBLISH POST</>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
