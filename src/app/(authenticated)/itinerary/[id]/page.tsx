"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  Footprints,
  MoreVertical,
  Utensils,
  Camera,
  Bed,
  Loader2,
  Share2,
  AlertTriangle,
  Navigation,
  Globe,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";
import { itineraryApi } from "@/lib/api";
import type {
  Itinerary,
  ItineraryStep,
  TransportMode,
} from "@/types/itinerary";

const transportIcons: Record<TransportMode, React.ReactNode> = {
  flight: <Plane className="w-4 h-4" />,
  train: <Train className="w-4 h-4" />,
  bus: <Bus className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  taxi: <Car className="w-4 h-4" />,
  boat: <Ship className="w-4 h-4" />,
  walk: <Footprints className="w-4 h-4" />,
  other: <MoreVertical className="w-4 h-4" />,
};

export default function ItineraryDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setIsLoading(true);
        const data = await itineraryApi.getById(id);
        setItinerary(data);
      } catch (err: unknown) {
        console.error("Failed to fetch itinerary:", err);
        const errorMessage = err instanceof Error ? err.message : "Unable to retrieve flight plan.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchItinerary();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000411] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-neon-blue">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="font-tech text-xs tracking-widest animate-pulse">
            DECRYPTING_ITINERARY...
          </span>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-[#000411] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-neon-pink/10 flex items-center justify-center mb-6 border border-neon-pink/20">
          <AlertTriangle className="w-10 h-10 text-neon-pink opacity-80" />
        </div>
        <h2 className="text-white text-lg font-medium mb-2 font-sans">
          Data Corruption Detected
        </h2>
        <p className="text-white/40 text-sm mb-8 font-light max-w-xs">
          {error || "Itinerary data could not be retrieved from the grid."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-tech tracking-widest transition-all border border-white/10 hover:border-white/20"
        >
          ABORT_AND_RETURN
        </button>
      </div>
    );
  }

  const steps = itinerary.itinerary_steps || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate duration in days
  const startD = new Date(itinerary.start_date);
  const endD = new Date(itinerary.end_date);
  const days =
    Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="min-h-screen bg-[#000411] text-white pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[-20%] w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#000411]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 group"
          >
            <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] text-white/30 tracking-widest">
              {itinerary.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 text-white/50 hover:text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-24 max-w-3xl mx-auto px-4 space-y-10">
        {/* Hero / Overview */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-tech uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 w-fit ${
                  itinerary.visibility === "public"
                    ? "bg-neon-lime/10 border-neon-lime/20 text-neon-lime"
                    : "bg-white/5 border-white/10 text-white/40"
                }`}
              >
                {itinerary.visibility === "public" ? (
                  <Globe className="w-2.5 h-2.5" />
                ) : (
                  <Clock className="w-2.5 h-2.5" />
                )}
                {itinerary.visibility} MODE
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-tech uppercase tracking-wider border border-white/10 bg-white/5 text-white/40 flex items-center gap-1.5">
                <Calendar className="w-2.5 h-2.5" />
                {days} DAYS
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-sans font-medium text-white tracking-tight leading-[1.1]">
              {itinerary.title}
            </h1>
          </div>

          <div className="p-6 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-neon-blue/20 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="flex-1 space-y-4">
                <p className="text-sm md:text-base text-white/70 font-light leading-relaxed whitespace-pre-wrap">
                  {itinerary.description}
                </p>
              </div>

              <div className="flex flex-row md:flex-col gap-6 md:gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                <div className="flex flex-col">
                  <span className="font-tech text-[9px] text-white/30 uppercase tracking-widest mb-1">
                    Start Date
                  </span>
                  <span className="font-mono text-sm text-white">
                    {formatDate(itinerary.start_date)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-tech text-[9px] text-white/30 uppercase tracking-widest mb-1">
                    End Date
                  </span>
                  <span className="font-mono text-sm text-white">
                    {formatDate(itinerary.end_date)}
                  </span>
                </div>
                {itinerary.total_cost > 0 && (
                  <div className="flex flex-col">
                    <span className="font-tech text-[9px] text-neon-lime/70 uppercase tracking-widest mb-1">
                      Budget
                    </span>
                    <span className="font-mono text-lg text-neon-lime font-medium">
                      {itinerary.total_cost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <h3 className="font-tech text-xs text-white/40 tracking-widest mb-8 flex items-center gap-2">
            <Navigation className="w-3 h-3 text-neon-blue" />
            TRAJECTORY_DETAILS
          </h3>

          <div className="relative pl-4 md:pl-8 space-y-8">
            {/* Glowing Line */}
            <div className="absolute left-[23px] md:left-[39px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-neon-blue via-neon-purple to-transparent opacity-30" />

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Node */}
                <div className="absolute left-[14px] md:left-[30px] top-0 w-5 h-5 rounded-full bg-[#000411] border-2 border-neon-blue flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,69,255,0.6)] group">
                  <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:scale-150 transition-transform" />
                </div>

                {/* Card Container */}
                <div className="bg-[#0A1020]/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 group">
                  {/* Header: Transit Info */}
                  <div className="p-4 md:p-5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="px-2 py-1 rounded bg-neon-blue/10 border border-neon-blue/20 text-[10px] font-mono text-neon-blue uppercase flex items-center gap-1.5">
                            {transportIcons[step.mode_of_transport]}
                            {step.mode_of_transport}
                          </div>
                          <span className="text-[10px] font-mono text-white/30">
                            {formatTime(step.start_time)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <span className="font-sans font-medium text-base md:text-lg">
                            {step.start_location}
                          </span>
                          <ArrowLeft className="w-4 h-4 text-white/20 rotate-180" />
                          <span className="font-sans font-medium text-base md:text-lg">
                            {step.end_location}
                          </span>
                        </div>
                      </div>
                      {step.duration_mins > 0 && (
                        <div className="text-right hidden sm:block">
                          <span className="block text-[10px] font-tech text-white/30 uppercase tracking-wider">
                            Duration
                          </span>
                          <span className="font-mono text-xs text-white/60">
                            {Math.floor(step.duration_mins / 60)}h{" "}
                            {step.duration_mins % 60}m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body: Activities/Stays/Food */}
                  <div className="p-1">
                    {step.stays.length > 0 ||
                    step.food.length > 0 ||
                    step.activities.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1">
                        {/* Stays */}
                        {step.stays.map((stay, i) => (
                          <div
                            key={stay.id || `stay-${i}`}
                            className="flex gap-4 p-4 hover:bg-white/[0.03] rounded-xl transition-colors group/item"
                          >
                            <div className="mt-1 w-8 h-8 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20 shrink-0">
                              <Bed className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-white group-hover/item:text-neon-purple transition-colors truncate">
                                  {stay.name}
                                </h4>
                                {stay.cost > 0 && (
                                  <span className="text-xs font-mono text-neon-purple">
                                    {stay.cost} {stay.currency}
                                  </span>
                                )}
                              </div>
                              {stay.location && (
                                <p className="text-xs text-white/40 mt-0.5 truncate">
                                  {stay.location}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Activities */}
                        {step.activities.map((act, i) => (
                          <div
                            key={act.id || `act-${i}`}
                            className="flex gap-4 p-4 hover:bg-white/[0.03] rounded-xl transition-colors group/item"
                          >
                            <div className="mt-1 w-8 h-8 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan border border-neon-cyan/20 shrink-0">
                              <Camera className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-white group-hover/item:text-neon-cyan transition-colors truncate">
                                  {act.name}
                                </h4>
                                {act.cost > 0 && (
                                  <span className="text-xs font-mono text-neon-cyan">
                                    {act.cost} {act.currency}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-3 mt-1">
                                {act.description && (
                                  <p className="text-xs text-white/40 line-clamp-1">
                                    {act.description}
                                  </p>
                                )}
                                {act.duration_mins && (
                                  <span className="text-[10px] font-mono text-white/30 flex items-center gap-1 bg-white/5 px-1.5 rounded">
                                    <Clock className="w-2.5 h-2.5" />{" "}
                                    {act.duration_mins}m
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Food */}
                        {step.food.map((food, i) => (
                          <div
                            key={food.id || `food-${i}`}
                            className="flex gap-4 p-4 hover:bg-white/[0.03] rounded-xl transition-colors group/item"
                          >
                            <div className="mt-1 w-8 h-8 rounded-full bg-neon-pink/10 flex items-center justify-center text-neon-pink border border-neon-pink/20 shrink-0">
                              <Utensils className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-white group-hover/item:text-neon-pink transition-colors truncate">
                                  {food.name}
                                </h4>
                                {food.cost > 0 && (
                                  <span className="text-xs font-mono text-neon-pink">
                                    {food.cost} {food.currency}
                                  </span>
                                )}
                              </div>
                              {food.notes && (
                                <p className="text-xs text-white/40 mt-0.5 italic truncate">
                                  &quot;{food.notes}&quot;
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center justify-center text-white/20 gap-2">
                        <Circle className="w-4 h-4 opacity-50" />
                        <span className="text-[10px] font-tech uppercase tracking-wider">
                          Transit Only
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
