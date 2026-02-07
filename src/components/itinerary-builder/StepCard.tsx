"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Footprints,
  MoreVertical,
  Trash2,
  ChevronDown,
  Clock,
} from "lucide-react";
import type {
  ItineraryStep,
  TransportMode,
  Stay,
  Food,
  Activity,
} from "@/types/builder";

// Import Modular Components
import { BlockTypeChips } from "./BlockTypeChips";
import { StayForm } from "./InlineForms/StayForm";
import { FoodForm } from "./InlineForms/FoodForm";
import { ActivityForm } from "./InlineForms/ActivityForm";
import { StayCard } from "./BlockLists/StayCard";
import { FoodCard } from "./BlockLists/FoodCard";
import { ActivityCard } from "./BlockLists/ActivityCard";

interface StepCardProps {
  step: ItineraryStep;
  index: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<ItineraryStep>) => void;
  onAddStay: (stay: Omit<Stay, "id">) => void;
  onAddFood: (food: Omit<Food, "id">) => void;
  onAddActivity: (activity: Omit<Activity, "id">) => void;
  onRemoveStay: (id: string) => void;
  onRemoveFood: (id: string) => void;
  onRemoveActivity: (id: string) => void;
}

const transportIcons: Record<TransportMode, React.ReactNode> = {
  flight: <Plane className="w-4 h-4" />,
  train: <Train className="w-4 h-4" />,
  bus: <Bus className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  boat: <Ship className="w-4 h-4" />,
  walk: <Footprints className="w-4 h-4" />,
  taxi: <Car className="w-4 h-4" />, // Fallback icon
  other: <MoreVertical className="w-4 h-4" />,
};

type FormType = "stay" | "food" | "activity" | null;

export const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  onRemove,
  onUpdate,
  onAddStay,
  onAddFood,
  onAddActivity,
  onRemoveStay,
  onRemoveFood,
  onRemoveActivity,
}) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [activeForm, setActiveForm] = useState<FormType>(null);

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div as any;

  const handleTransportChange = (mode: TransportMode) => {
    onUpdate({ mode_of_transport: mode });
  };

  const closeForm = () => setActiveForm(null);

  const handleAddStay = (stay: Omit<Stay, "id">) => {
    onAddStay(stay);
    setActiveForm(null);
  };

  const handleAddFood = (food: Omit<Food, "id">) => {
    onAddFood(food);
    setActiveForm(null);
  };

  const handleAddActivity = (activity: Omit<Activity, "id">) => {
    onAddActivity(activity);
    setActiveForm(null);
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-[#050A15] border border-white/10 rounded-xl overflow-hidden group"
    >
      {/* Connector Line */}
      <div className="absolute top-0 bottom-0 left-6 w-px bg-white/5 z-0" />

      {/* Step Header */}
      <div
        className="relative z-10 flex items-center gap-4 p-4 bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-8 h-8 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center text-neon-blue font-mono text-xs shadow-[0_0_10px_rgba(0,69,255,0.2)]">
          {index + 1}
        </div>

        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span>{step.start_location || "Start Point"}</span>
            <span className="text-white/30">→</span>
            <span>{step.end_location || "End Point"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            {step.mode_of_transport.toUpperCase()}
            {step.start_time &&
              ` // ${new Date(step.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-white/20 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronDown
            className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pl-14 space-y-6">
              {/* Step Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-tech text-white/40 uppercase">
                    From
                  </label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-white/30 group-focus-within/input:text-neon-blue" />
                    <input
                      placeholder="Origin (City/Place)"
                      value={step.start_location}
                      onChange={(e) =>
                        onUpdate({ start_location: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 placeholder-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-tech text-white/40 uppercase">
                    To
                  </label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-white/30 group-focus-within/input:text-neon-blue" />
                    <input
                      placeholder="Destination (City/Place)"
                      value={step.end_location}
                      onChange={(e) =>
                        onUpdate({ end_location: e.target.value })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 placeholder-white/20 transition-all"
                    />
                  </div>
                </div>

                {/* Times */}
                <div className="space-y-2">
                  <label className="text-[10px] font-tech text-white/40 uppercase">
                    Departure
                  </label>
                  <div className="relative group/input">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-white/30 group-focus-within/input:text-neon-blue" />
                    <input
                      type="datetime-local"
                      value={step.start_time}
                      onChange={(e) => onUpdate({ start_time: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-tech text-white/40 uppercase">
                    Arrival
                  </label>
                  <div className="relative group/input">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-white/30 group-focus-within/input:text-neon-blue" />
                    <input
                      type="datetime-local"
                      value={step.end_time}
                      onChange={(e) => onUpdate({ end_time: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Transport Mode */}
              <div className="space-y-2">
                <label className="text-[10px] font-tech text-white/40 uppercase">
                  Transport
                </label>
                <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-lg w-fit overflow-x-auto max-w-full">
                  {(Object.keys(transportIcons) as TransportMode[]).map(
                    (mode) => (
                      <button
                        key={mode}
                        onClick={() => handleTransportChange(mode)}
                        className={`p-2 rounded-md transition-all shrink-0 ${
                          step.mode_of_transport === mode
                            ? "bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_rgba(0,69,255,0.2)]"
                            : "text-white/30 hover:text-white hover:bg-white/5"
                        }`}
                        title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                      >
                        {transportIcons[mode]}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Sub-Items List */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                {/* Stays */}
                {step.stays.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-tech text-neon-purple uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-neon-purple rounded-full" />
                      Accommodations
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {step.stays.map((stay) => (
                        <StayCard
                          key={stay.id}
                          data={stay}
                          onDelete={() => onRemoveStay(stay.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Food */}
                {step.food.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-tech text-neon-pink uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-neon-pink rounded-full" />
                      Dining
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {step.food.map((item) => (
                        <FoodCard
                          key={item.id}
                          data={item}
                          onDelete={() => onRemoveFood(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {step.activities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-tech text-neon-cyan uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-neon-cyan rounded-full" />
                      Activities
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {step.activities.map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          data={activity}
                          onDelete={() => onRemoveActivity(activity.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inline Forms */}
              <AnimatePresence mode="wait">
                {activeForm === "stay" && (
                  <StayForm
                    key="stay-form"
                    onSave={handleAddStay}
                    onCancel={closeForm}
                  />
                )}
                {activeForm === "food" && (
                  <FoodForm
                    key="food-form"
                    onSave={handleAddFood}
                    onCancel={closeForm}
                  />
                )}
                {activeForm === "activity" && (
                  <ActivityForm
                    key="activity-form"
                    onSave={handleAddActivity}
                    onCancel={closeForm}
                  />
                )}
              </AnimatePresence>

              {/* Add Buttons Chips */}
              {!activeForm && (
                <div className="pt-2">
                  <BlockTypeChips onAdd={(type) => setActiveForm(type)} />
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
};
