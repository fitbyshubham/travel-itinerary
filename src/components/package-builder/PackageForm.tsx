// src/components/package-builder/PackageForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function PackageForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      alert("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 1. Upload cover image to Supabase Storage
      // TODO: 2. Get public URL
      // For now, use placeholder
      const coverImageUrl =
        "https://via.placeholder.com/600x400?text=Uploaded+Cover";

      const payload = {
        title,
        description,
        price: parseFloat(price) || 0,
        currency,
        visibility,
        cover_image_url: coverImageUrl,
      };

      console.log("Package payload:", payload);

      // TODO: Call your backend API
      // await packageApi.create(payload);

      alert("Package created! (Mock)");
      router.push("/profile");
    } catch (err) {
      console.error("Package creation failed:", err);
      alert("Failed to create package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image Upload */}
      <div>
        <label className="block mb-2 text-[14px] text-[#3C3C3C] font-medium">
          Cover Image *
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full h-64 bg-white/50 border-2 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/60 transition-colors"
        >
          {coverPreview ? (
            <>
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCoverImage();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md"
                aria-label="Remove cover image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 bg-[#4285F4]/10 rounded-full flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#4285F4]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <p className="text-[#6B6B6B] text-sm">
                Click to upload cover image
              </p>
              <p className="text-[#6B6B6B] text-xs mt-1">(JPG, PNG, max 5MB)</p>
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
        <label className="block mb-2 text-[14px] text-[#3C3C3C] font-medium">
          Package Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Europe Explorer"
          className="w-full h-11 px-4 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 text-[14px] text-[#3C3C3C] font-medium">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your package..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40 resize-none"
          required
        />
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-[14px] text-[#3C3C3C] font-medium">
            Price *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full h-11 px-4 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-[14px] text-[#3C3C3C] font-medium">
            Currency *
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full h-11 px-4 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
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
        <label className="block mb-2 text-[14px] text-[#3C3C3C] font-medium">
          Visibility
        </label>
        <select
          value={visibility}
          onChange={(e) =>
            setVisibility(e.target.value as "public" | "private")
          }
          className="w-full h-11 px-4 rounded-xl border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#4285F4] text-white rounded-xl font-medium active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {isSubmitting ? "Creating Package..." : "Create Package"}
      </button>
    </form>
  );
}
