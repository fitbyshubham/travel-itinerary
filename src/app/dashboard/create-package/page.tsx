// src/app/dashboard/create-package/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { ArrowLeft, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePackagePage() {
  const router = useRouter();
  const { token, isHydrated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (isHydrated && !token) {
      router.push("/login");
    }
  }, [isHydrated, token, router]);

  if (!isHydrated || !token) return null;

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      alert("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 1. Upload coverImage to your backend
      // TODO: 2. Get public URL
      const coverImageUrl = coverPreview; // Replace with real URL after upload

      const payload = {
        title,
        description,
        price: parseFloat(price) || 0,
        currency,
        visibility,
        cover_image_url: coverImageUrl,
      };

      console.log("Package payload:", payload);

      // TODO: Call your actual API endpoint
      // Example: await fetch('/api/packages', { method: 'POST', body: JSON.stringify(payload) });

      alert("Package created successfully!");
      router.push("/profile"); // Go back to profile
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create package");
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
        <h1 className="text-xl font-bold text-gray-900">Create Package</h1>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Upload */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Cover Image *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-56 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCoverImage();
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </>
                ) : (
                  <div className="text-center text-gray-900">
                    <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-gray-200 mb-3">
                      <Upload className="w-6 h-6 text-gray-900" />
                    </div>
                    <p className="text-sm">Click to upload cover image</p>
                    <p className="text-xs mt-1">JPG/PNG, max 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImage}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Europe Explorer"
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
                placeholder="A 3-country adventure..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-gray-900"
                required
              />
            </div>

            {/* Price & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
                  required
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
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
              {isSubmitting ? "Creating..." : "Create Package"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
