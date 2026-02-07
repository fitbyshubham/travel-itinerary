"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Map } from "lucide-react";
import { useItineraryStore } from "@/lib/itinerary-store";
import { StepCard } from "./StepCard";

export const StepsSection: React.FC = () => {
  const {
    draft,
    addStep,
    removeStep,
    updateStep,
    addStay,
    removeStay,
    addFood,
    removeFood,
    addActivity,
    removeActivity,
  } = useItineraryStore();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-neon-blue" />
          <h3 className="font-tech text-sm text-white/80 tracking-widest">
            Itinerary Route
          </h3>
        </div>
        <span className="font-mono text-[10px] text-white/30">
          {draft.steps.length} Stops
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-4 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {draft.steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              onRemove={() => removeStep(step.id)}
              onUpdate={(updates) => updateStep(step.id, updates)}
              onAddStay={(stay) => addStay(step.id, stay)}
              onAddFood={(food) => addFood(step.id, food)}
              onAddActivity={(activity) => addActivity(step.id, activity)}
              onRemoveStay={(id) => removeStay(step.id, id)}
              onRemoveFood={(id) => removeFood(step.id, id)}
              onRemoveActivity={(id) => removeActivity(step.id, id)}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {draft.steps.length === 0 && (
          <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.01]">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Map className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-sm text-white/40 font-mono mb-1">
              No stops added yet.
            </p>
            <p className="text-xs text-white/20">
              Add a destination to start planning.
            </p>
          </div>
        )}
      </div>

      {/* Add Step Button */}
      <button
        onClick={addStep}
        className="w-full py-4 border border-dashed border-white/20 rounded-xl flex items-center justify-center gap-2 hover:bg-white/[0.03] hover:border-neon-lime/30 group transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-neon-lime group-hover:text-black transition-colors">
          <Plus className="w-4 h-4" />
        </div>
        <span className="font-tech text-xs text-white/50 group-hover:text-neon-lime transition-colors">
          Add Destination
        </span>
      </button>
    </div>
  );
};
