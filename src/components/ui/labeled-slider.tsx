"use client";

import { cn } from "@/lib/utils";

interface LabeledSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  decimals?: number;
  displayValue?: number;
  displayMin?: number;
  displayMax?: number;
  className?: string;
}
export const LabeledSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "%",
  decimals = 2,
  displayValue,
  displayMin,
  displayMax,
  className,
}: LabeledSliderProps) => {
  const valueToDisplay = displayValue !== undefined ? displayValue : value;
  const minToDisplay = displayMin !== undefined ? displayMin : min;
  const maxToDisplay = displayMax !== undefined ? displayMax : max;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-tertiary">
          {label}
        </label>
        <span className="text-xs font-mono text-text-secondary">
          {valueToDisplay.toFixed(decimals)}
          {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#FF6C0C] cursor-pointer"
      />

      <div className="flex justify-between text-[10px] text-text-disabled">
        <span>
          {minToDisplay}
          {unit}
        </span>
        <span>
          {maxToDisplay}
          {unit}
        </span>
      </div>
    </div>
  );
};
