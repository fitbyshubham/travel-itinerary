import React from "react";
import {
  Calendar,
  MapPin,
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  Footprints,
  MoreVertical,
  Clock,
  Lock,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  Itinerary,
  TransportMode,
  ItineraryStep,
} from "@/types/itinerary";

interface ItineraryCardProps {
  itinerary: Itinerary;
  onClick: (id: string) => void;
}

const transportIcons: Record<TransportMode, React.ReactNode> = {
  flight: <Plane className="w-3 h-3" />,
  train: <Train className="w-3 h-3" />,
  bus: <Bus className="w-3 h-3" />,
  car: <Car className="w-3 h-3" />,
  taxi: <Car className="w-3 h-3" />,
  boat: <Ship className="w-3 h-3" />,
  walk: <Footprints className="w-3 h-3" />,
  other: <MoreVertical className="w-3 h-3" />,
};

// Fix: Completed the component implementation and added the return statement to fix the 'void' return error.
export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
  onClick,
}) => {
  const steps: ItineraryStep[] = itinerary.itinerary_steps || [];

  // Cast motion.div to any to bypass environment-specific typing issues
  const MotionDiv = motion.div;

  // 1. Calculate Duration
  const start = new Date(itinerary.start_date);
  const end = new Date(itinerary.end_date);
  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;

  // 2. Formatting
  const dateRange = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <MotionDiv
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(itinerary.id)}
      className="group relative bg-[#050A15] border border-white/10 hover:border-neon-blue/30 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 p-4 md:p-5 flex flex-col gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    >
      {/* HUD Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10 group-hover:border-neon-blue/40 transition-colors" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10 group-hover:border-neon-blue/40 transition-colors" />

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`px-1.5 py-0.5 rounded text-[8px] font-tech uppercase tracking-widest border ${itinerary.visibility === "public" ? "bg-neon-blue/10 border-neon-blue/30 text-neon-blue" : "bg-white/5 border-white/10 text-white/40"}`}
            >
              {itinerary.visibility === "public" ? (
                <Globe className="w-2 h-2 inline mr-1" />
              ) : (
                <Lock className="w-2 h-2 inline mr-1" />
              )}
              {itinerary.visibility}
            </div>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
              ID // {itinerary.id.slice(0, 8)}
            </span>
          </div>
          <h3 className="text-lg font-sans font-medium text-white group-hover:text-neon-blue transition-colors">
            {itinerary.title}
          </h3>
          <p className="text-xs text-white/50 font-light line-clamp-1">
            {itinerary.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-neon-lime font-mono text-sm font-bold">
            {itinerary.total_cost.toLocaleString()} EUR
          </div>
          <div className="text-[10px] text-white/30 font-tech uppercase">
            Est. Budget
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-white/30" />
          <div className="flex flex-col">
            <span className="text-[9px] font-tech text-white/20 uppercase">
              Duration
            </span>
            <span className="text-[11px] text-white/70 font-mono">
              {durationDays} Days
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-white/30" />
          <div className="flex flex-col">
            <span className="text-[9px] font-tech text-white/20 uppercase">
              Stops
            </span>
            <span className="text-[11px] text-white/70 font-mono">
              {steps.length} Nodes
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-white/30" />
          <div className="flex flex-col">
            <span className="text-[9px] font-tech text-white/20 uppercase">
              Timeline
            </span>
            <span className="text-[11px] text-white/70 font-mono">
              {dateRange}
            </span>
          </div>
        </div>
      </div>

      {/* Transit Visualizer */}
      {steps.length > 0 && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
          {steps.slice(0, 6).map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10 group-hover:border-neon-blue/20 transition-colors">
                {transportIcons[step.mode_of_transport]}
              </div>
              {idx < steps.length - 1 && idx < 5 && (
                <div className="w-2 h-px bg-white/10" />
              )}
            </React.Fragment>
          ))}
          {steps.length > 6 && (
            <span className="text-[9px] font-mono text-white/20">
              +{steps.length - 6}
            </span>
          )}
        </div>
      )}
    </MotionDiv>
  );
};
