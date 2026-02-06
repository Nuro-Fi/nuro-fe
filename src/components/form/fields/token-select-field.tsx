"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { TokenSelect } from "@/components/pool/token-select";
import type { TokenConfig } from "@/lib/addresses/types";

interface TokenSelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  excludeAddress?: string;
  error?: string;
}

export const TokenSelectField = <T extends FieldValues>({
  name,
  control,
  label,
  excludeAddress,
  error,
}: TokenSelectFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="space-y-1">
          <TokenSelect
            label={label}
            selected={(field.value as TokenConfig | null) ?? null}
            onSelect={field.onChange}
            excludeAddress={excludeAddress}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    />
  );
};
