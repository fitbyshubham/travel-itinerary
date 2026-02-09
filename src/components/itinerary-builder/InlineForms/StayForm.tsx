"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Euro, X, Check } from "lucide-react";
import type { Stay } from "@/types/builder";

interface StayFormProps {
  onSave: (stay: Omit<Stay, "id">) => void;
  onCancel: () => void;
}

export const StayForm: React.FC<StayFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Stay>>({
    name: "",
    location: "",
    price: 0,
    currency: "EUR",
  });

  // Cast motion.form to any to bypass environment-specific typing issues
  const MotionForm = motion.form as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location) {
      onSave(formData as Omit<Stay, "id">);
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
        <h4 className="text-xs font-tech text-neon-purple uppercase tracking-wider">
          Add Accommodation
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
          placeholder="Hotel / Place Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 placeholder-white/20"
          autoFocus
          required
        />

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input
            placeholder="Address"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 placeholder-white/20"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative w-full">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="date"
              placeholder="Check-in"
              value={formData.check_in_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, check_in_date: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 [color-scheme:dark]"
            />
          </div>
          <div className="relative w-full">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="date"
              placeholder="Check-out"
              value={formData.check_out_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, check_out_date: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Price & Currency */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Euro className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="number"
              placeholder="Cost"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 placeholder-white/20"
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
          className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/50 rounded-lg text-xs font-tech transition-all"
        >
          <Check className="w-4 h-4" />
          Save Stay
        </button>
      </div>
    </MotionForm>
  );
};
