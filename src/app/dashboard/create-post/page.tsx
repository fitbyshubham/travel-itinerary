// src/app/dashboard/create-post/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import {
  Plus,
  X,
  Image as ImageIcon,
  Video,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePostPage() {
  const router = useRouter();
  const { token, isHydrated, user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState<
    { id: string; type: "image" | "video"; file: File; preview: string }[]
  >([]);
  const [itinerary_id, setItineraryId] = useState<string>("");
  const [visibility, setVisibility] = useState<"public" | "draft">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itineraries, setItineraries] = useState<
    { id: string; title: string }[]
  >([]);

  // Mock fetch itineraries on mount
  useEffect(() => {
    if (!isHydrated || !user) return;

    // TODO: Replace with real API call
    setItineraries([
      { id: "f37a1bfb-be91-4c44-917b-120bec7ccea4", title: "Paris Trip" },
      { id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", title: "Bali Adventure" },
    ]);
  }, [isHydrated, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (isHydrated && !token) {
      router.push("/login");
    }
  }, [isHydrated, token, router]);

  if (!isHydrated || !user) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newUploads = Array.from(files)
      .filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/")
      )
      .map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        type: (file.type.startsWith("image/") ? "image" : "video") as "image" | "video",
        file,
        preview: URL.createObjectURL(file),
      }));

    setUploads((prev) => [...prev, ...newUploads]);
  };

  const removeMedia = (id: string) => {
    setUploads((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploads.length === 0) {
      alert("Please upload at least one image or video");
      return;
    }
    if (!itinerary_id) {
      alert("Please select an itinerary");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 1. Upload files to Supabase Storage
      // TODO: 2. Get public URLs
      // For now, mock the upload result
      const uploadedUrls = uploads.map((item) => ({
        type: item.type,
        url: item.preview, // Replace with real URL after upload
      }));

      const payload = {
        title,
        description,
        uploads: uploadedUrls,
        itinerary_id,
        visibility,
      };

      console.log("Post payload:", payload);

      // TODO: Call your backend API
      // await postApi.create(payload);

      alert("Post created successfully!");
      router.push("/profile"); // Go back to profile
    } catch (err) {
      console.error("Post creation failed:", err);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="p-2 bg-white/80 backdrop-blur-xl rounded-full shadow-sm border border-gray-200 mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </motion.button>
        <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Paris Travel Diary"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A collection of highlights from my trip to Paris!"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-gray-900"
                required
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Media (Images & Videos) *
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {uploads.map((item) => (
                  <div key={item.id} className="relative group">
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-24 bg-black/20 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeMedia(item.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove media"
                    >
                      <X size={14} />
                    </motion.button>
                  </div>
                ))}

                {/* Add Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                >
                  <Plus size={24} className="text-gray-900" />
                </motion.button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              <p className="text-xs text-gray-900 mt-2">
                Upload up to 10 images or videos (max 100MB each)
              </p>
            </div>

            {/* Itinerary Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Attach to Itinerary *
              </label>
              <select
                value={itinerary_id}
                onChange={(e) => setItineraryId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center]"
                required
              >
                <option value="">Select an itinerary</option>
                {itineraries.length > 0 ? (
                  itineraries.map((itinerary) => (
                    <option key={itinerary.id} value={itinerary.id}>
                      {itinerary.title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No itineraries yet — create one first!
                  </option>
                )}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Visibility *
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center]"
                required
              >
                <option value="public">Public</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Publish Post"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
