"use client";

import React from "react";
import { Bed, Utensils, Camera } from "lucide-react";

interface ChipButtonProps {
  icon: React.ElementType;
  label: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ChipButton: React.FC<ChipButtonProps> = ({
  icon: Icon,
  label,
  color,
  isActive,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 py-3 md:px-4 md:py-2 rounded-lg border transition-all w-full ${
      isActive
        ? `bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]`
        : disabled
        ? `bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed`
        : `bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white`
    }`}
  >
    <Icon
      className={`w-4 h-4 md:w-4 md:h-4 ${
        isActive ? "text-white" : disabled ? "text-white/20" : color
      }`}
    />
    <span className="text-[10px] md:text-xs font-medium font-tech tracking-wide text-center">
      {label.toUpperCase()}
    </span>
  </button>
);

interface BlockTypeChipsProps {
  onAdd: (type: "stay" | "food" | "activity") => void;
  disabled?: boolean;
  activeType?: "stay" | "food" | "activity" | null;
}

export const BlockTypeChips: React.FC<BlockTypeChipsProps> = ({
  onAdd,
  disabled,
  activeType,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <ChipButton
        icon={Bed}
        label="Stay"
        color="text-neon-purple"
        isActive={activeType === "stay"}
        onClick={() => onAdd("stay")}
        disabled={disabled && activeType !== "stay"}
      />
      <ChipButton
        icon={Utensils}
        label="Food"
        color="text-neon-pink"
        isActive={activeType === "food"}
        onClick={() => onAdd("food")}
        disabled={disabled && activeType !== "food"}
      />
      <ChipButton
        icon={Camera}
        label="Activity"
        color="text-neon-cyan"
        isActive={activeType === "activity"}
        onClick={() => onAdd("activity")}
        disabled={disabled && activeType !== "activity"}
      />
    </div>
  );
};
