"use client";

import { useAppearance } from "@/hooks/useAppearance";
import { Monitor, Moon, Sun } from "lucide-react";

type Appearance = "light" | "dark" | "system";

const THEMES: { value: Appearance; icon: React.ReactNode; label: string }[] = [
  { value: "light", icon: <Sun size={14} />, label: "Light" },
  { value: "dark", icon: <Moon size={14} />, label: "Dark" },
  { value: "system", icon: <Monitor size={14} />, label: "System" },
];

const SwitchThemeButton = () => {
  const { updateAppearance, appearance } = useAppearance();

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="sm:flex-row flex flex-col items-center gap-0.5  border border-gold-low bg-gold-high-end p-0.5"
    >
      {THEMES.map(({ value, icon, label }) => {
        const isActive = appearance === value;
        return (
          <button
            suppressHydrationWarning
            key={value}
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            onClick={() => updateAppearance(value)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium transition-all duration-200",
              isActive
                ? "bg-gold-mid text-gold-high shadow-sm"
                : "text-gold-low-mid hover:text-gold-abyss",
            ].join(" ")}
          >
            {icon}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SwitchThemeButton;
