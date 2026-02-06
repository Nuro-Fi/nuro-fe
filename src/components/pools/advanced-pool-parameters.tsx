"use client";

import { Control, Controller } from "react-hook-form";
import { LabeledSlider } from "@/components/ui/labeled-slider";
import type { CreatePoolFormData } from "@/lib/validation/pool-schema";

interface AdvancedPoolParametersProps {
  control: Control<CreatePoolFormData>;
}

export const AdvancedPoolParameters = ({
  control,
}: AdvancedPoolParametersProps) => {
  return (
    <div className="space-y-4 rounded-none p-4">
      <Controller
        name="baseRate"
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            <LabeledSlider
              label="Base Rate (BPS)"
              value={field.value ?? 50}
              displayValue={(field.value ?? 50) / 100}
              min={1}
              max={100}
              displayMin={0.01}
              displayMax={1}
              step={1}
              onChange={field.onChange}
            />
            <p className="text-[10px] text-text-muted">
              Minimum interest rate (1-100 BPS = 0.01%-1%)
            </p>
          </div>
        )}
      />

      <Controller
        name="rateAtOptimal"
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            <LabeledSlider
              label="Rate at Optimal Utilization (%)"
              value={field.value ?? 5}
              min={1}
              max={10}
              step={0.5}
              onChange={field.onChange}
            />
            <p className="text-[10px] text-text-muted">
              Interest rate when utilization reaches optimal level (max: 10%)
            </p>
          </div>
        )}
      />

      <Controller
        name="optimalUtilization"
        control={control}
        render={({ field }) => (
          <LabeledSlider
            label="Optimal Utilization (%)"
            value={field.value ?? 80}
            min={50}
            max={95}
            step={1}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="maxUtilization"
        control={control}
        render={({ field }) => (
          <LabeledSlider
            label="Max Utilization (%)"
            value={field.value ?? 90}
            min={50}
            max={100}
            step={1}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="liquidationThreshold"
        control={control}
        render={({ field }) => (
          <LabeledSlider
            label="Liquidation Threshold (%)"
            value={field.value ?? 75}
            min={50}
            max={90}
            step={1}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="liquidationBonus"
        control={control}
        render={({ field }) => (
          <LabeledSlider
            label="Liquidation Bonus (%)"
            value={field.value ?? 5}
            min={1}
            max={15}
            step={0.5}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="maxRate"
        control={control}
        render={({ field }) => (
          <LabeledSlider
            label="Max Rate (%)"
            value={field.value ?? 50}
            min={15}
            max={100}
            step={1}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="reserveFactor"
        control={control}
        render={({ field }) => (
          <LabeledSlider
            label="Reserve Factor (%)"
            value={field.value ?? 10}
            min={0}
            max={50}
            step={1}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
};
