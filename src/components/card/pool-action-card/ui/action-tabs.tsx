import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

import { TABS, type Tab } from "../types";

interface ActionTabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export const ActionTabs = ({ activeTab, onChange }: ActionTabsProps) => {
  return (
    <CardHeader className="mb-3 flex flex-row gap-0 p-0">
      <div className="flex w-full border border-border-primary bg-surface-secondary">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab;
          return (
            <Button
              key={tab}
              type="button"
              variant="ghost"
              onClick={() => onChange(tab)}
              className={[
                "btn-tab",
                index !== 0 && "border-l border-border-primary",
                isActive ? "btn-tab--active" : "btn-tab--inactive",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {tab}
            </Button>
          );
        })}
      </div>
    </CardHeader>
  );
};
