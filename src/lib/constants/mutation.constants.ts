export const SUPPLY_CONFIG = {
  liquidity: {
    functionName: "supplyLiquidity" as const,
    toastId: "supply-liquidity",
    successMessage: "Supply Liquidity Success!",
    successDescription: "Your liquidity has been supplied successfully",
  },
  collateral: {
    functionName: "supplyCollateral" as const,
    toastId: "supply-collateral",
    successMessage: "Supply Collateral Success!",
    successDescription: "Your collateral has been supplied successfully",
  },
} as const;

export const BORROW_CONFIG = {
  toastId: "borrow",
  successMessage: "Borrow Success!",
  successDescription: "Your borrow transaction was successful",
} as const;

export const REPAY_CONFIG = {
  toastId: "repay",
  successMessage: "Repay Success!",
  successDescription: "Your repayment transaction was successful",
} as const;

export const WITHDRAW_LIQUIDITY_CONFIG = {
  toastId: "withdraw-liquidity",
  successMessage: "Withdraw Liquidity Success!",
  successDescription: "Your liquidity has been withdrawn successfully",
} as const;

export const WITHDRAW_COLLATERAL_CONFIG = {
  toastId: "withdraw-collateral",
  successMessage: "Withdraw Collateral Success!",
  successDescription: "Your collateral has been withdrawn successfully",
} as const;

export const SWAP_CONFIG = {
  toastId: "swap-token",
  successMessage: "Swap Success!",
  successDescription: "Your tokens have been swapped successfully",
} as const;

export const APPROVE_CONFIG = {
  default: {
    toastId: "approve-token",
    successMessage: "Token Approved!",
    successDescription: "Your token approval was successful",
  },
  liquidity: {
    toastId: "approve-liquidity",
    successMessage: "Liquidity Token Approved!",
    successDescription: "Your liquidity token approval was successful",
  },
  collateral: {
    toastId: "approve-collateral",
    successMessage: "Collateral Token Approved!",
    successDescription: "Your collateral token approval was successful",
  },
} as const;
