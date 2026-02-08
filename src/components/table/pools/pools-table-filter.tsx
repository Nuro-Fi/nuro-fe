"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { POOL_FILTER_OPTIONS, type PoolSortOption } from "./pools-table-types";

interface PoolsTableFilterProps {
  selected: PoolSortOption;
  onFilterChange: (filter: PoolSortOption) => void;
}

export const PoolsTableFilter = ({
  selected,
  onFilterChange,
}: PoolsTableFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = POOL_FILTER_OPTIONS.find(
    (option) => option.value === selected,
  );

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
        aria-label="Filter pools"
        aria-expanded={isOpen}
      >
        <span>Sort: {selectedOption?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-xl border border-border-primary bg-surface-secondary shadow-lg">
          {POOL_FILTER_OPTIONS.filter((o) => o.value !== "custom").map(
            (option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onFilterChange(option.value);
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
            ),
          )}
        </div>
      )}
    </div>
  );
};
