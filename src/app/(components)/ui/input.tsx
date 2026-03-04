"use client";

import * as React from "react";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: "sm" | "md" | "lg";
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  endButton?:
    | React.ReactNode
    | {
        title: string;
        icon?: React.ReactNode;
        variant?:
          | "default"
          | "outline"
          | "destructive"
          | "ghost"
          | "link"
          | "secondary";
        onClick?: () => void;
      };
  startButton?:
    | React.ReactNode
    | {
        title: string;
        icon?: React.ReactNode;
        variant?:
          | "default"
          | "outline"
          | "destructive"
          | "ghost"
          | "link"
          | "secondary";
        onClick?: () => void;
      };
  wrapperClassName?: string;
}

function Input({
  className,
  type,
  size = "md",
  label,
  startIcon,
  endIcon,
  endButton,
  startButton,
  wrapperClassName,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";
  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon || isPassword;
  const hasEndButton = !!endButton;
  const hasStartButton = !!startButton;

  const inputPadding = React.useMemo(() => {
    let padding = "";

    // Start padding (left in LTR, right in RTL)
    if (
      hasStartButton &&
      typeof startButton === "object" &&
      "title" in startButton
    ) {
      padding += "pl-20 rtl:pr-20 rtl:pl-2 ";
    } else if (hasStartIcon || hasStartButton) {
      padding += "pl-8 rtl:pr-8 rtl:pl-2 ";
    }

    // End padding (right in LTR, left in RTL)
    if (hasEndButton && typeof endButton === "object" && "title" in endButton) {
      padding += "pr-20 rtl:pl-20 rtl:pr-2 ";
    } else if (hasEndIcon || hasEndButton || isPassword) {
      padding += "pr-8 rtl:pl-8 rtl:pr-2 ";
    }

    return padding;
  }, [
    hasStartIcon,
    hasEndIcon,
    hasEndButton,
    hasStartButton,
    endButton,
    startButton,
    isPassword,
  ]);

  const renderButton = (
    button:
      | React.ReactNode
      | {
          title: string;
          icon?: React.ReactNode;
          variant?:
            | "default"
            | "outline"
            | "destructive"
            | "ghost"
            | "link"
            | "secondary";
          onClick?: () => void;
        },
    position: "start" | "end",
  ) => {
    if (!button) return null;

    if (React.isValidElement(button)) {
      return button;
    }

    if (typeof button === "object" && "title" in button) {
      return (
        <Button
          title={button.title}
          icon={button.icon}
          variant={button.variant || "default"}
          onClick={button.onClick}
          size="sm"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-6 px-2 z-10",
            position === "end"
              ? "right-1 rtl:left-1 rtl:right-auto"
              : "left-1 rtl:right-1 rtl:left-auto",
          )}
        />
      );
    }

    return null;
  };

  const inputElement = (
    <input
      type={isPassword ? (showPassword ? "text" : "password") : type}
      data-slot="input"
      className={cn(
        "bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-[8px] border px-2 py-0.5 text-sm transition-colors file:h-6 file:text-xs/relaxed file:font-medium focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-7",
        size === "md" && "h-10",
        size === "lg" && "h-11",
        inputPadding,
        className,
      )}
      {...props}
    />
  );

  // Simple input without icons/buttons/label
  const needsWrapper =
    hasStartIcon || hasEndIcon || hasEndButton || hasStartButton || isPassword;

  const inputWithWrapper = needsWrapper ? (
    <div className={cn("relative w-full", wrapperClassName)}>
      {/* Start Icon */}
      {hasStartIcon && (
        <span className="absolute left-2 rtl:right-2 rtl:left-auto top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none z-10 [&>svg]:size-4 [&>svg]:shrink-0">
          {startIcon}
        </span>
      )}

      {/* Start Button */}
      {hasStartButton && renderButton(startButton, "start")}

      {inputElement}

      {/* Password Toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          {showPassword ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </button>
      )}

      {/* End Icon (only if not password) */}
      {hasEndIcon && !hasEndButton && !isPassword && (
        <span className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground pointer-events-none z-10 [&>svg]:size-4 [&>svg]:shrink-0">
          {endIcon}
        </span>
      )}

      {/* End Button */}
      {hasEndButton && renderButton(endButton, "end")}
    </div>
  ) : (
    inputElement
  );

  // If no label, return input (with or without wrapper)
  if (!label) {
    return inputWithWrapper;
  }

  // With label
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2">{inputWithWrapper}</div>
    </div>
  );
}

export { Input };
export type { InputProps };
