"use client";

import { Control, FieldErrors } from "react-hook-form";
import { TokenSelectField } from "@/components/form/fields/token-select-field";
import { NumberInputField } from "@/components/form/fields/number-input-field";
import type { CreatePoolFormData } from "@/lib/validation/pool-schema";
import type { TokenConfig } from "@/lib/addresses/types";

interface BasicPoolFieldsProps {
  control: Control<CreatePoolFormData>;
  errors: FieldErrors<CreatePoolFormData>;
  collateral?: TokenConfig | null;
  borrow?: TokenConfig | null;
}

export const BasicPoolFields = ({
  control,
  errors,
  collateral,
  borrow,
}: BasicPoolFieldsProps) => {
  return (
    <div className="space-y-4">
      <TokenSelectField
        name="collateral"
        control={control}
        label="Collateral Token"
        excludeAddress={borrow?.address}
        error={errors.collateral?.message}
      />

      <TokenSelectField
        name="borrow"
        control={control}
        label="Borrow Token"
        excludeAddress={collateral?.address}
        error={errors.borrow?.message}
      />

      <NumberInputField
        name="ltv"
        control={control}
        label="Loan-to-Value (LTV) Ratio"
        placeholder="75"
        suffix="%"
        min={0}
        max={100}
        step={0.01}
        error={errors.ltv?.message}
      />

      <NumberInputField
        name="supplyBalance"
        control={control}
        label="Initial Supply Balance"
        placeholder="1"
        suffix={borrow?.symbol}
        min={0}
        step="any"
        error={errors.supplyBalance?.message}
      />
    </div>
  );
};
