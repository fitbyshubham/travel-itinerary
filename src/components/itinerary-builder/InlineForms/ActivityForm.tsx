"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, X, Check, Tag } from "lucide-react";
import type { Activity } from "@/types/builder";

interface ActivityFormProps {
  onSave: (activity: Omit<Activity, "id">) => void;
  onCancel: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: "",
    location: "",
    price: 0,
    currency: "EUR",
    duration_mins: 60,
  });

  // Cast motion.form to any to bypass environment-specific typing issues
  const MotionForm = motion.form as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      onSave(formData as Omit<Activity, "id">);
    }
  };

  return (
    <MotionForm
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-4 mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-tech text-neon-cyan uppercase tracking-wider">
          Add Activity
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/30 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Name */}
        <input
          placeholder="Activity Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder-white/20"
          autoFocus
          required
        />

        {/* Location & Category */}
        <div className="flex gap-3">
          <div className="relative flex-[2]">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder-white/20"
            />
          </div>
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              placeholder="Type (e.g., Sightseeing)"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder-white/20"
            />
          </div>
        </div>

        {/* Time & Duration */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="time"
              value={formData.start_time || ""}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 [color-scheme:dark]"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute right-3 top-2.5 text-xs text-white/30">
              min
            </span>
            <input
              type="number"
              placeholder="Duration"
              value={formData.duration_mins || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_mins: parseInt(e.target.value),
                })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder-white/20"
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="number"
              placeholder="Cost"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 placeholder-white/20"
            />
          </div>
          <div className="w-24">
            <div className="w-full h-full bg-black/40 border border-white/10 rounded-lg px-2 flex items-center justify-center text-sm text-white/60 font-mono">
              EUR
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50 rounded-lg text-xs font-tech transition-all"
        >
          <Check className="w-4 h-4" />
          Save Activity
        </button>
      </div>
    </MotionForm>
  );
};
