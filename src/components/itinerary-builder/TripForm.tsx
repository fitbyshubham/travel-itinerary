"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Globe,
  Lock,
  Save,
  AlertCircle,
  Loader2,
  DollarSign,
  FileText,
} from "lucide-react";
import { useItineraryStore } from "@/lib/itinerary-store";
import { StepsSection } from "./StepsSection";
import { itineraryApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import type { ItineraryDraft } from "@/types/builder";

export const TripForm: React.FC = () => {
  const router = useRouter();
  const { draft, updateDraft, reset } = useItineraryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = (path: string) => {
    router.push(path);
  };

  /**
   * Transforms the UI Store state into the API Payload format.
   * Handles type conversion, auto-incrementing order indexes, and nested arrays.
   */
  const buildItineraryPayload = (formValues: ItineraryDraft) => {
    return {
      title: formValues.title || "Untitled Trip",
      description: formValues.description || "",
      start_date: formValues.start_date,
      end_date: formValues.end_date,
      total_cost: Number(formValues.estimatedCost) || 0,
      visibility: formValues.visibility || "public",
      steps: formValues.steps.map((step, index) => ({
        order_index: index + 1, // Automatically assigned based on array position
        start_location: step.start_location || "",
        end_location: step.end_location || "",
        mode_of_transport: step.mode_of_transport || "flight",
        // Ensure ISO Strings for dates if they exist, otherwise null/empty
        start_time: step.start_time
          ? new Date(step.start_time).toISOString()
          : null,
        end_time: step.end_time ? new Date(step.end_time).toISOString() : null,
        duration_mins: Number(step.duration_mins) || 0,
        notes: step.notes || "",

        // Map Stays
        stays: step.stays.map((stay) => ({
          name: stay.name,
          location: stay.location,
          check_in: stay.check_in_date
            ? new Date(stay.check_in_date).toISOString()
            : null,
          check_out: stay.check_out_date
            ? new Date(stay.check_out_date).toISOString()
            : null,
          cost: Number(stay.price) || 0,
          currency: stay.currency || "EUR",
        })),

        // Map Food
        food: step.food.map((f) => ({
          name: f.restaurant_name,
          location: f.location || "",
          cost: Number(f.price) || 0,
          currency: f.currency || "EUR",
          notes: f.notes || "",
        })),

        // Map Activities
        activities: step.activities.map((a) => ({
          name: a.name,
          description: a.description || "",
          cost: Number(a.price) || 0,
          currency: a.currency || "EUR",
          duration_mins: Number(a.duration_mins) || 0,
        })),

        // Map Generic Costs (Aggregating or custom) - Currently empty based on UI,
        // but structure is ready if we add generic costs to steps later.
        costs: [],
      })),
    };
  };

  const handleSubmit = async () => {
    if (!draft.title || !draft.start_date || !draft.end_date) {
      setError("Please fill in all mandatory fields (Title & Dates)");
      return;
    }

    if (draft.steps.length === 0) {
      setError("Please add at least one stop to your itinerary");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Transform Data
      const payload = buildItineraryPayload(draft);

      console.log("Submitting Payload:", payload);

      // 2. Send to API
      await itineraryApi.create(payload);

      // 3. Success Handling
      reset(); // Clear store
      navigate("/profile?tab=itineraries"); // Redirect to profile
    } catch (err: any) {
      console.error("Itinerary submission failed:", err);
      setError(err.message || "Failed to create itinerary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Trip Overview Module */}
      <section className="bg-[#050A15]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        {/* Decorative Markers */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-2xl" />

        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-neon-lime" />
          <h2 className="font-tech text-sm text-white/60 tracking-widest">
            Trip Overview
          </h2>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <input
            value={draft.title}
            onChange={(e) => updateDraft("title", e.target.value)}
            placeholder="Trip Title (e.g., European Summer)"
            className="w-full bg-transparent border-b border-white/10 py-4 text-2xl md:text-4xl font-sans font-light text-white placeholder-white/10 focus:outline-none focus:border-neon-lime/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dates & Privacy */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-tech text-white/40 uppercase">
                Trip Dates
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/30 group-focus-within:text-neon-lime" />
                  <input
                    type="date"
                    value={draft.start_date}
                    onChange={(e) => updateDraft("start_date", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-neon-lime/50 transition-colors [color-scheme:dark]"
                  />
                </div>
                <span className="hidden md:block self-center text-white/20">
                  -
                </span>
                <div className="flex-1 relative group">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/30 group-focus-within:text-neon-lime" />
                  <input
                    type="date"
                    value={draft.end_date}
                    onChange={(e) => updateDraft("end_date", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-neon-lime/50 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-tech text-white/40 uppercase">
                Privacy Settings
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateDraft("visibility", "public")}
                  className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    draft.visibility === "public"
                      ? "bg-neon-blue/10 border-neon-blue text-neon-blue"
                      : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span className="font-tech text-[10px]">Public</span>
                </button>
                <button
                  onClick={() => updateDraft("visibility", "private")}
                  className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    draft.visibility === "private"
                      ? "bg-neon-purple/10 border-neon-purple text-neon-purple"
                      : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span className="font-tech text-[10px]">Private</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-tech text-white/40 uppercase">
              Description
            </label>
            <textarea
              value={draft.description}
              onChange={(e) => updateDraft("description", e.target.value)}
              placeholder="What's this trip about?"
              className="w-full h-full min-h-[120px] bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white/80 focus:outline-none focus:border-neon-lime/50 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Budget Display */}
        <div className="absolute top-6 right-6 flex flex-col items-end">
          <span className="font-tech text-[9px] text-white/30 uppercase tracking-widest">
            Est. Cost
          </span>
          <div className="flex items-center gap-1 text-neon-lime">
            <DollarSign className="w-4 h-4" />
            <span className="text-xl font-mono font-medium">
              {draft.estimatedCost.toLocaleString()} EUR
            </span>
          </div>
        </div>
      </section>

      {/* 2. Steps Module */}
      <StepsSection />

      {/* 3. Action Module */}
      <div className="sticky bottom-6 z-40 bg-[#000411]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
        {error ? (
          <div className="flex items-center gap-2 text-neon-pink animate-pulse min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-tech text-xs truncate">{error}</span>
          </div>
        ) : (
          <div className="flex flex-col min-w-0">
            <span className="font-tech text-[10px] text-white/40 truncate">
              Status
            </span>
            <span className="font-mono text-xs text-neon-lime truncate">
              Ready to Publish
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 font-tech text-xs transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-neon-blue text-white rounded-xl font-tech text-xs font-bold hover:bg-neon-blue/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,69,255,0.4)] whitespace-nowrap"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Save className="w-4 h-4 shrink-0" />
            )}
            <span>Save Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
