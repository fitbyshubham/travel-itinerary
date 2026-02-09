"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Camera, Save, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { authApi } from "@/lib/api";
import { uploadAvatar } from "@/lib/media-upload";
import { User } from "@/types/auth";

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
}

export default function EditProfileModal({
  user,
  onClose,
}: EditProfileModalProps) {
  const { token, login } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div as any;

  const [formData, setFormData] = useState({
    name: user.name || user.user_metadata?.name || "",
    bio: user.bio || user.user_metadata?.bio || "",
    avatar_url: user.avatar_url || user.user_metadata?.avatar_url || "",
    gender: user.gender || user.user_metadata?.gender || "",
    country: user.country || user.user_metadata?.country || "",
    preferred_currency: user.preferred_currency || user.user_metadata?.preferred_currency || "EUR",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAvatar(file);
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, avatar_url: result.url! }));
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

      try {
        const profile = await authApi.updateProfile(formData);
        
        // Convert UserProfile to User type
        const updatedUser: User = {
          id: profile.id,
          email: user.email, // Keep existing email
          name: profile.name,
          avatar_url: profile.avatar_url,
          gender: profile.gender,
          country: profile.country,
          preferred_currency: profile.preferred_currency,
          is_creator: profile.is_creator,
          bio: profile.bio || "",
          user_metadata: {
            name: profile.name,
            avatar_url: profile.avatar_url,
            gender: profile.gender,
            country: profile.country,
            preferred_currency: profile.preferred_currency,
            is_creator: profile.is_creator,
            bio: profile.bio || "",
          },
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };

        // Update local store
        if (token) {
          login(token, updatedUser);
        }
        onClose();
      } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-md bg-[#050A15] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-medium text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 pb-24 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-neon-lime/50 transition-colors bg-space-void">
                <img
                  src={formData.avatar_url || "/avatars/default.jpg"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
                  </div>
                )}
                {!isUploading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <span
              className="text-xs text-neon-lime font-mono cursor-pointer hover:underline"
              onClick={() => fileInputRef.current?.click()}
            >
              CHANGE_AVATAR
            </span>
          </div>

          {/* Form Fields */}
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-tech text-white/40 uppercase">
                Full Name
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-lime/50 placeholder-white/20"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-tech text-white/40 uppercase">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-lime/50 min-h-[80px] resize-none placeholder-white/20"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-lime/50 appearance-none"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="undisclosed">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Country (Code)
                </label>
                <input
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-lime/50 uppercase placeholder-white/20"
                  placeholder="e.g. IN, US"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-tech text-white/40 uppercase">
                Preferred Currency
              </label>
              <div className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/50 font-mono cursor-not-allowed">
                EUR
              </div>
            </div>
          </form>

          {error && (
            <div className="flex items-center gap-2 text-neon-pink bg-neon-pink/5 p-3 rounded-lg border border-neon-pink/10">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-mono">{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs font-tech transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="profile-form"
            disabled={isSaving || isUploading}
            className="px-6 py-2 rounded-lg bg-white text-black font-bold text-xs font-tech hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            SAVE_CHANGES
          </button>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}
