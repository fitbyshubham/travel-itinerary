import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Map, Plus, ShoppingBag } from "lucide-react";
import { itineraryApi } from "@/lib/api";
import type { Itinerary } from "@/types/itinerary";
import { ItineraryCard } from "./ItineraryCard";

interface ItineraryListProps {
  onNavigate: (path: string) => void;
}

type FilterType = "all" | "public" | "private" | "purchased";

export const ItineraryList: React.FC<ItineraryListProps> = ({ onNavigate }) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setItineraries([]); // Clear to avoid flicker between tabs

        let data: Itinerary[] = [];

        if (filter === "purchased") {
          const response = await itineraryApi.listPurchased();
          // Handle Purchased Response
          // Structure: { itineraries: [ { itinerary: {...}, purchased_at: ... } ] }
          if (response && typeof response === "object" && "itineraries" in response) {
            const purchasedList = response.itineraries || [];
            data = purchasedList.map((item) => {
              const itin = "itinerary" in item ? item.itinerary : item;
              return itin as Itinerary;
            });
          } else if (Array.isArray(response)) {
            data = response.map((item) => ("itinerary" in item ? item.itinerary : item) as Itinerary);
          }
        } else {
          // Fetch Created (All)
          const response = await itineraryApi.list();
          if (Array.isArray(response)) {
            data = response;
          } else if (response && typeof response === "object" && "itineraries" in response) {
            data = response.itineraries;
          }

          // Filter out soft_deleted items
          data = data.filter((item) => !item.soft_deleted);

          // Apply memory filters for Created items
          if (filter === "public") {
            data = data.filter((item) => item.visibility === "public");
          } else if (filter === "private") {
            data = data.filter((item) => item.visibility !== "public");
          }
        }

        setItineraries(data || []);
      } catch (err: unknown) {
        console.error("Failed to fetch itineraries:", err);
        setError("Failed to load itineraries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, [filter]);

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "public", label: "Public" },
    { id: "private", label: "Private" },
    { id: "purchased", label: "Purchased" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-neon-blue" />
        <span className="font-tech text-xs tracking-widest">
          Loading Grid...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Filter Pills */}
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10 overflow-x-auto max-w-full scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                filter === f.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Create Button (Visible only on Created tabs) */}
        {filter !== "purchased" && (
          <button
            onClick={() => onNavigate("/create/itinerary")}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-tech transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            NEW
          </button>
        )}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {itineraries.length > 0 ? (
            itineraries.map((itinerary, index) => (
              <motion.div
                key={itinerary.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ItineraryCard
                  itinerary={itinerary}
                  onClick={(id) => onNavigate(`/itinerary/${id}`)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.01]"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                {filter === "purchased" ? (
                  <ShoppingBag className="w-8 h-8 text-white/20" />
                ) : (
                  <Map className="w-8 h-8 text-white/20" />
                )}
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-1">
                {filter === "purchased"
                  ? "No Purchased Trips"
                  : "No Itineraries Found"}
              </h3>
              <p className="text-sm text-white/40 mb-6 text-center">
                {filter === "purchased"
                  ? "You haven't purchased any itineraries yet."
                  : `You don't have any ${filter === "all" ? "" : filter} itineraries.`}
              </p>

              {filter !== "purchased" && (
                <button
                  onClick={() => onNavigate("/create/itinerary")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-tech transition-all"
                >
                  <Plus className="w-4 h-4" />
                  CREATE NEW TRIP
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* End Marker */}
      {itineraries.length > 0 && (
        <div className="flex justify-center pt-4 pb-8">
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            End of List
          </span>
        </div>
      )}
    </div>
  );
};
