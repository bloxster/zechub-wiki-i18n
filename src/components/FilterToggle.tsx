// components/FilterToggle.tsx
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface FilterToggleProps {
  filters: {
    Devices: Set<string>;
    "Operating System": Set<string>;
    Pools: Set<string>;
    "Wallet Support": Set<string>;
    Features: Set<string>;
  };
  activeFilters: string[];
  toggleFilter: (filterCategory: string, filterValue: string) => void;
  handleToggleFilter: () => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
  filters,
  activeFilters,
  toggleFilter,
  handleToggleFilter,
}) => {
  const { locale } = useLanguage();
  const labels: Record<string, string> = locale === "it" ? {
    Devices: "Dispositivi",
    "Operating System": "Sistema operativo",
    Pools: "Pool",
    "Wallet Support": "Supporto wallet",
    Features: "Funzionalita",
  } : {};
  return (
    <div className="pb-6 imd:block flex flex-wrap justify-between">
      {Object.entries(filters).map(([category, values]) => (
        <div key={category}>
          <h4 className="text-xl font-bold mt-6 mb-3">{labels[category] ?? category}</h4>
          <div className="imd:block flex flex-wrap gap-2">
            {[...values].map((value) => (
              <label
                key={value}
                className="flex items-center cursor-pointer mb-1"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={activeFilters.includes(`${category}:${value}`)}
                    onChange={() => {
                      toggleFilter(category, value);
                    }}
                  />

                  <div className="w-8 h-4 bg-gray-200 dark:bg-gray-400 rounded-full peer-checked:bg-blue-500 transition-colors"></div>

                  <div className="dot absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="ml-2 text-sm">{value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterToggle;
