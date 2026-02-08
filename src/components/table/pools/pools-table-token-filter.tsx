"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TokenFilterOption {
  value: string;
  label: string;
}

interface PoolsTableTokenFilterProps {
  selected: string;
  options: TokenFilterOption[];
  onTokenChange: (token: string) => void;
}

export const PoolsTableTokenFilter = ({
  selected,
  options,
  onTokenChange,
}: PoolsTableTokenFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === selected) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border-secondary bg-surface-primary px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:border-border-hover"
        aria-label="Filter by token"
        aria-expanded={isOpen}
      >
        <span>Token: {selectedOption?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 max-h-64 min-w-40 overflow-y-auto rounded-xl border border-border-primary bg-surface-secondary shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onTokenChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                selected === option.value
                  ? "bg-surface-hover text-white-custom font-medium"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
