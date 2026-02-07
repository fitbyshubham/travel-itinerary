import React from "react";
import { Bed, Trash2, Calendar, MapPin } from "lucide-react";
import type { Stay } from "@/types/builder";

interface StayCardProps {
  data: Stay;
  onDelete: () => void;
}

export const StayCard: React.FC<StayCardProps> = ({ data, onDelete }) => {
  return (
    <div className="group relative flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-neon-purple/30 rounded-lg transition-all">
      <div className="w-8 h-8 rounded bg-neon-purple/10 flex items-center justify-center shrink-0">
        <Bed className="w-4 h-4 text-neon-purple" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h5 className="text-sm font-medium text-white truncate pr-2">
            {data.name}
          </h5>
          {data.price > 0 && (
            <span className="text-[10px] font-mono text-neon-purple shrink-0">
              {data.currency} {data.price}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {data.location && (
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{data.location}</span>
            </div>
          )}
          {(data.check_in_date || data.check_out_date) && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
              <Calendar className="w-3 h-3" />
              <span>
                {data.check_in_date} → {data.check_out_date}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1.5 rounded-md text-white/10 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
