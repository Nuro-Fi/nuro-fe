import { Button } from "@/components/ui/button";

import { TABS, type Tab } from "../types";

interface ActionTabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export const ActionTabs = ({ activeTab, onChange }: ActionTabsProps) => {
  return (
    <div className="mb-3 flex gap-1.5 rounded-xl bg-white/3 border border-white/10 p-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Button
            key={tab}
            type="button"
            variant="ghost"
            onClick={() => onChange(tab)}
            className={[
              "btn-tab",
              isActive ? "btn-tab--active" : "btn-tab--inactive",
            ].join(" ")}
          >
            {tab}
          </Button>
        );
      })}
    </div>
  );
};
