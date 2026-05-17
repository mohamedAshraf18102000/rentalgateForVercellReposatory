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
      aria-label={
        currentLocale === "ar"
          ? "Switch language to English"
          : "التبديل إلى العربية"
      }
      className={cn(
        "flex items-center justify-center gap-0! w-8 h-8 border-none",
        className,
      )}
    >
      <Globe className="w-4 h-4 text-inherit" />
    </Button>
  );
};
