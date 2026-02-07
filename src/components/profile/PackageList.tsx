"use client"
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Box, Plus, ShoppingBag } from "lucide-react";
import { packageApi } from "@/lib/api";
import type { Package } from "@/types/package";
import { PackageCard } from "./PackageCard";
import { PackageBottomSheet } from "@/components/packages/PackageBottomSheet";

interface PackageListProps {
  onNavigate: (path: string) => void;
}

type FilterType = "created" | "purchased";

export const PackageList: React.FC<PackageListProps> = ({ onNavigate }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("created");
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setPackages([]); // Clear previous data to avoid flicker

        let response;
        if (filter === "created") {
          response = await packageApi.list();
        } else {
          response = await packageApi.listPurchased();
        }

        // Handle response format
        let data: Package[] = [];

        if (filter === "created") {
          if (Array.isArray(response)) {
            data = response;
          } else if (response && typeof response === "object" && "packages" in response) {
            data = (response as { packages: Package[] }).packages;
          }
          data = data.filter((pkg) => !pkg.soft_deleted);
        } else {
          // Handle Purchased Response Structure
          if (response && typeof response === "object" && "packages" in response) {
            const purchasedList = (response as { packages: any[] }).packages || [];
            data = purchasedList.map((item) => {
              const pkg = item.packages;
              let itinerary = null;
              if (
                pkg.package_itineraries &&
                Array.isArray(pkg.package_itineraries) &&
                pkg.package_itineraries.length > 0
              ) {
                itinerary = pkg.package_itineraries[0].itineraries;
              }

              return {
                ...pkg,
                purchased_at: item.purchased_at,
                itineraries: itinerary,
              } as Package;
            });
          }
        }

        setPackages(data);
      } catch (err: unknown) {
        console.error("Failed to fetch packages:", err);
        setError("Failed to load packages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [filter]); // Re-fetch when filter changes

  const filters: { id: FilterType; label: string }[] = [
    { id: "created", label: "Created" },
    { id: "purchased", label: "Purchased" },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                filter === f.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-neon-lime" />
          <span className="font-tech text-xs tracking-widest">
            Loading Packages...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {packages.length > 0 ? (
              packages.map((pkg, index) => (
                <motion.div
                  key={`${pkg.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PackageCard
                    pkg={pkg}
                    onClick={() => setSelectedPackage(pkg)}
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
                  {filter === "created" ? (
                    <Box className="w-8 h-8 text-white/20" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-white/20" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-white/80 mb-1">
                  {filter === "created"
                    ? "No Created Packages"
                    : "No Purchased Packages"}
                </h3>
                <p className="text-sm text-white/40 mb-6">
                  {filter === "created"
                    ? "You haven't created any travel packages yet."
                    : "You haven't purchased any packages yet."}
                </p>

                {filter === "created" && (
                  <button
                    onClick={() => onNavigate("/create/package")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neon-lime/10 hover:bg-neon-lime/20 text-neon-lime border border-neon-lime/30 rounded-lg text-xs font-tech transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    CREATE NEW PACKAGE
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* End Marker */}
      {!isLoading && packages.length > 0 && (
        <div className="flex justify-center pt-4 pb-8">
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            End of List
          </span>
        </div>
      )}

      {/* Detail View */}
      <AnimatePresence>
        {selectedPackage && (
          <PackageBottomSheet
            pkg={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
