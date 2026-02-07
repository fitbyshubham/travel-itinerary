import React from "react";
import { motion } from "framer-motion";
import { Box, Lock, Globe, Calendar, Map } from "lucide-react";
import type { Package } from "@/types/package";

interface PackageCardProps {
  pkg: Package;
  onClick: (id: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onClick }) => {
  const itineraryCount = pkg.package_itineraries?.length || 0;
  const createdDate = new Date(pkg.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(pkg.id)}
      className="group relative bg-[#050A15] border border-white/10 hover:border-neon-lime/30 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col md:flex-row h-full md:h-40"
    >
      {/* Cover Image Section */}
      <div className="relative w-full md:w-48 h-32 md:h-full bg-white/5 shrink-0 overflow-hidden">
        {pkg.cover_image_url ? (
          <img
            src={pkg.cover_image_url}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Box className="w-8 h-8 text-white/10" />
          </div>
        )}

        {/* Visibility Badge (Overlay on Image) */}
        <div className="absolute top-2 left-2">
          <div
            className={`px-2 py-1 rounded-md text-[9px] font-tech uppercase tracking-wider border backdrop-blur-md flex items-center gap-1 ${
              pkg.visibility === "public"
                ? "bg-black/40 border-neon-blue/30 text-neon-blue"
                : "bg-black/40 border-white/10 text-white/50"
            }`}
          >
            {pkg.visibility === "public" ? (
              <Globe className="w-2.5 h-2.5" />
            ) : (
              <Lock className="w-2.5 h-2.5" />
            )}
            {pkg.visibility}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-sans text-base font-medium text-white group-hover:text-neon-lime transition-colors line-clamp-1">
              {pkg.title}
            </h3>
            {pkg.price !== undefined && (
              <div className="shrink-0 flex items-center gap-1 text-neon-lime font-mono text-sm font-bold bg-neon-lime/5 px-2 py-1 rounded border border-neon-lime/10">
                <span>{pkg.price.toLocaleString()}</span>
                <span className="text-[10px] opacity-70">{pkg.currency || "EUR"}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-white/60 font-light line-clamp-2 leading-relaxed h-[2.5em]">
            {pkg.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            {itineraryCount > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                <Map className="w-3 h-3" />
                <span>{itineraryCount} Itineraries</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-mono">
            <Calendar className="w-3 h-3" />
            <span>Created: {createdDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
