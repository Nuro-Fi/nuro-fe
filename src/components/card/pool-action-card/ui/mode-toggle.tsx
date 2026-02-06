import { Button } from "@/components/ui/button";
import type { Mode, RepayMode, Tab } from "../types";

const MODE_CONFIG = {
  Supply: {
    liquidity: { label: "Earn" },
    collateral: { label: "Supply Collateral" },
  },
  Withdraw: {
    liquidity: { label: "Withdraw Liquidity" },
    collateral: { label: "Withdraw Collateral" },
  },
} as const;

const REPAY_MODE_CONFIG = {
  position: { label: "Select Token" },
  token: { label: "By Collateral" },
} as const;

interface ToggleButtonProps<T extends string> {
  value: T;
  currentValue: T;
  label: string;
  onClick: (value: T) => void;
}

const ToggleButton = <T extends string>({
  value,
  currentValue,
  label,
  onClick,
}: ToggleButtonProps<T>) => {
  const isActive = currentValue === value;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onClick(value)}
      className={`btn-toggle ${
        isActive ? "btn-toggle--active" : "btn-toggle--inactive"
      }`}
    >
      {label}
    </Button>
  );
};

interface ModeToggleProps {
  activeTab: Tab;
  mode: Mode;
  onChange: (mode: Mode) => void;
  repayMode?: RepayMode;
  onRepayModeChange?: (repayMode: RepayMode) => void;
}

export const ModeToggle = ({
  activeTab,
  mode,
  onChange,
  repayMode = "position",
  onRepayModeChange,
}: ModeToggleProps) => {
  if (activeTab === "Repay") {
    return (
      <div className="flex gap-2">
        {(Object.keys(REPAY_MODE_CONFIG) as RepayMode[]).map((key) => (
          <ToggleButton
            key={key}
            value={key}
            currentValue={repayMode}
            label={REPAY_MODE_CONFIG[key].label}
            onClick={(value) => onRepayModeChange?.(value)}
          />
        ))}
      </div>
    );
  }

  if (activeTab !== "Supply" && activeTab !== "Withdraw") {
    return null;
  }

  const config = MODE_CONFIG[activeTab];

  return (
    <div className="flex gap-2">
      {(Object.keys(config) as Mode[]).map((key) => (
        <ToggleButton
          key={key}
          value={key}
          currentValue={mode}
          label={config[key].label}
          onClick={onChange}
        />
      ))}
    </div>
  );
};
