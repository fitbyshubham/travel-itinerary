"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Euro, X, Check, Utensils } from "lucide-react";
import type { Food } from "@/types/builder";

interface FoodFormProps {
  onSave: (food: Omit<Food, "id">) => void;
  onCancel: () => void;
}

export const FoodForm: React.FC<FoodFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Food>>({
    restaurant_name: "",
    location: "",
    meal_type: "dinner",
    price: 0,
    currency: "EUR",
  });

  // Cast motion.form to any to bypass environment-specific typing issues
  const MotionForm = motion.form as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.restaurant_name) {
      onSave(formData as Omit<Food, "id">);
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
        <h4 className="text-xs font-tech text-neon-pink uppercase tracking-wider">
          Add Dining
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
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              placeholder="Restaurant / Place"
              value={formData.restaurant_name}
              onChange={(e) =>
                setFormData({ ...formData, restaurant_name: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-pink/50 placeholder-white/20"
              autoFocus
              required
            />
          </div>
          <div className="w-1/3">
            <select
              value={formData.meal_type}
              onChange={(e) =>
                setFormData({ ...formData, meal_type: e.target.value as any })
              }
              className="w-full h-full bg-black/40 border border-white/10 rounded-lg px-2 text-sm text-white focus:outline-none focus:border-neon-pink/50"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-pink/50 placeholder-white/20"
            />
          </div>
          <div className="relative flex-1">
            <Utensils className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              placeholder="Cuisine"
              value={formData.cuisine_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, cuisine_type: e.target.value })
              }
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-pink/50 placeholder-white/20"
            />
          </div>
        </div>

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
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-pink/50 placeholder-white/20"
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
          className="flex items-center gap-2 px-4 py-2 bg-neon-pink/20 hover:bg-neon-pink/30 text-neon-pink border border-neon-pink/50 rounded-lg text-xs font-tech transition-all"
        >
          <Check className="w-4 h-4" />
          Save Meal
        </button>
      </div>
    </MotionForm>
  );
};
