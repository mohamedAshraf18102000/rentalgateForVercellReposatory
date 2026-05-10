"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/ui";
import { Globe } from "lucide-react";
import React from "react";
import { useHeaderLogic } from "../hooks/useHeaderLogic";

interface LanguageSwitcherProps {
  currentLocale?: string;
  onToggle?: () => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onToggle,
  className,
}) => {
  const { handleLanguageChange } = useHeaderLogic();

  return (
    <Button
      type="button"
      onClick={onToggle ?? handleLanguageChange}
      variant="outline"
      size="lg"
      icon={<Globe className="w-4 h-4 text-inherit" />}
      aria-label={
        currentLocale === "ar"
          ? "Switch language to English"
          : "التبديل إلى العربية"
      }
      className={cn(
        "border-none    *[color:var(--primary)] rounded-[12px] hover:opacity-90 transition-opacity",
        "font-normal text-base leading-[130%] tracking-normal",
        "[font-family:var(--font-almarai),Almarai,sans-serif]",
        className,
      )}
    />
  );
};
