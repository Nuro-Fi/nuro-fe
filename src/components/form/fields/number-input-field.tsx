"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";

interface NumberInputFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number | string;
  error?: string;
}

export const NumberInputField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "0",
  suffix,
  min = 0,
  max,
  step = "any",
  error,
}: NumberInputFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-tertiary">
            {label}
          </label>
          <div className="relative">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={field.value === 0 ? "" : field.value}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? 0 : parseFloat(value) || 0);
              }}
              placeholder={placeholder}
              className="h-12 w-full rounded-none border border-border-primary bg-surface-secondary/50 px-4 pr-20 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-border-secondary focus:bg-surface-secondary"
            />
            {suffix && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                {suffix}
              </span>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    />
  );
};
