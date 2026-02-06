"use client";

import { parseUnits, zeroAddress } from "viem";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const MAX_SAFE_AMOUNT = 1_000_000_000_000;

export const validateAmount = (amount: string): ValidationResult => {
  if (!amount || amount.trim() === "") {
    return { isValid: false, error: "Amount is required" };
  }

  const validNumberRegex = /^\d+(\.\d+)?$/;
  if (!validNumberRegex.test(amount)) {
    return { isValid: false, error: "Invalid number format" };
  }

  const amountFloat = parseFloat(amount);

  if (!Number.isFinite(amountFloat)) {
    return { isValid: false, error: "Invalid amount" };
  }

  if (amountFloat <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (amountFloat > MAX_SAFE_AMOUNT) {
    return { isValid: false, error: "Amount exceeds maximum limit" };
  }

  return { isValid: true };
};

export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim() === "") {
    return { isValid: false, error: "Address is required" };
  }

  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(address)) {
    return { isValid: false, error: "Invalid address format" };
  }

  if (address === zeroAddress) {
    return { isValid: false, error: "Cannot use zero address" };
  }

  return { isValid: true };
};

export const validateBigIntPositive = (
  value: bigint,
  fieldName = "value"
): ValidationResult => {
  if (value <= BigInt(0)) {
    return { isValid: false, error: `Invalid ${fieldName}` };
  }
  return { isValid: true };
};

export const parseAmountToBigInt = (amount: string, decimals: number): bigint => {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
};


export const combineValidations = (
  ...validations: ValidationResult[]
): ValidationResult => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
};
