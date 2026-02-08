"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePoolForm } from "@/components/form/create-pool-form";
import { useCreatePool } from "@/hooks/mutation/pool/use-create-pool";
import { type CreatePoolFormData } from "@/lib/validation/pool-schema";
import { ConnectionGuard } from "@/components/wallet/connection-guard";

export const CreatePoolButton = () => {
  const [open, setOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const { mutation, isLoading, isSuccess } = useCreatePool();

  const onSubmit = (data: CreatePoolFormData) => {
    if (!data.collateral || !data.borrow) return;

    mutation.mutate({
      collateralTokenAddress: data.collateral.address,
      borrowTokenAddress: data.borrow.address,
      borrowTokenDecimals: data.borrow.decimals,
      ltvValue: (data.ltv ?? 0).toString(),
      supplyBalance: (data.supplyBalance ?? 0).toString(),
      isAdvancedMode: data.isAdvancedMode ?? false,
      baseRate: data.baseRate ?? 50,
      rateAtOptimal: data.rateAtOptimal ?? 5,
      optimalUtilization: data.optimalUtilization ?? 80,
      maxUtilization: data.maxUtilization ?? 90,
      liquidationThreshold: data.liquidationThreshold ?? 75,
      liquidationBonus: data.liquidationBonus ?? 5,
      maxRate: data.maxRate ?? 50,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="rounded-lg border border-btn-create bg-btn-create px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white-custom transition-all hover:bg-btn-create-hover"
        >
          Create Pool
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`max-w-[calc(100vw-2rem)] border border-border-primary bg-surface-primary text-text-heading transition-all duration-300 ${
          isAdvancedMode ? "sm:max-w-230" : "sm:max-w-130"
        }`}
      >
        <DialogHeader className="border-b border-border-primary pb-4">
          <DialogTitle className="text-xl font-bold text-text-heading">
            Create New Pool
          </DialogTitle>
          <p className="text-sm text-text-secondary">
            Set up a new lending pool with your preferred tokens
          </p>
        </DialogHeader>

        <ConnectionGuard
          promptTitle="Connect Wallet"
          promptDescription="Connect your wallet to create a new lending pool."
        >
          <CreatePoolForm
            onSubmit={onSubmit}
            isPending={isLoading}
            isSuccess={isSuccess}
            onAdvancedModeChange={setIsAdvancedMode}
          />
        </ConnectionGuard>
      </DialogContent>
    </Dialog>
  );
};
