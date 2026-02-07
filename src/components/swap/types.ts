import type { PoolWithTokens } from "@/hooks/graphql/use-pools";


export interface SwapCardProps {
  className?: string;
}


export interface PoolSelectButtonProps {
  pool: PoolWithTokens | null;
  onSelect: (pool: PoolWithTokens) => void;
  pools: PoolWithTokens[];
  isLoading?: boolean;
  disabled?: boolean;
}

export interface PoolSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pools: PoolWithTokens[];
  onSelect: (pool: PoolWithTokens) => void;
  selectedPool?: PoolWithTokens | null;
  title?: string;
}
