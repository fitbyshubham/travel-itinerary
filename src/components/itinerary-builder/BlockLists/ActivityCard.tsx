import React from "react";
import { Camera, Trash2, Clock, MapPin } from "lucide-react";
import type { Activity } from "@/types/builder";

interface ActivityCardProps {
  data: Activity;
  onDelete: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  data,
  onDelete,
}) => {
  return (
    <div className="group relative flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 hover:border-neon-cyan/30 rounded-lg transition-all">
      <div className="w-8 h-8 rounded bg-neon-cyan/10 flex items-center justify-center shrink-0">
        <Camera className="w-4 h-4 text-neon-cyan" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h5 className="text-sm font-medium text-white truncate pr-2">
            {data.name}
          </h5>
          {data.price > 0 && (
            <span className="text-[10px] font-mono text-neon-cyan shrink-0">
              {data.currency} {data.price}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-3">
            {data.start_time && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-white/40">
                <Clock className="w-3 h-3" />
                <span>{data.start_time}</span>
              </div>
            )}
            {data.duration_mins && (
              <span className="text-[10px] text-white/30">
                {data.duration_mins}m
              </span>
            )}
          </div>

          {data.location && (
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{data.location}</span>
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
