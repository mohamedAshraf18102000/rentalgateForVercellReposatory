"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
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
  labelClassName?: string;
  labelIcon?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size = "md",
      label,
      startIcon,
      endIcon,
      endButton,
      startButton,
      wrapperClassName,
      labelClassName,
      labelIcon,
      ...props
    },
    ref,
  ) => {
    const hasStartIcon = !!startIcon;
    const hasEndIcon = !!endIcon;
    const hasEndButton = !!endButton;
    const hasStartButton = !!startButton;

    const textareaPadding = React.useMemo(() => {
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
      if (
        hasEndButton &&
        typeof endButton === "object" &&
        "title" in endButton
      ) {
        padding += "pr-20 rtl:pl-20 rtl:pr-2 ";
      } else if (hasEndIcon || hasEndButton) {
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
              "absolute z-10 h-6 px-2 top-2",
              position === "end"
                ? "right-1 rtl:left-1 rtl:right-auto"
                : "left-1 rtl:right-1 rtl:left-auto",
            )}
          />
        );
      }

      return null;
    };

    const textareaElement = (
      <textarea
        className={cn(
          "bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-[8px] border px-2 py-2 text-sm transition-colors focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed placeholder:text-muted-foreground w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]",
          textareaPadding,
          className,
        )}
        ref={ref}
        {...props}
      />
    );

    const needsWrapper =
      hasStartIcon || hasEndIcon || hasEndButton || hasStartButton;

    const textareaWithWrapper = needsWrapper ? (
      <div className={cn("relative w-full", wrapperClassName)}>
        {/* Start Icon */}
        {hasStartIcon && (
          <span className="absolute left-2 rtl:right-2 rtl:left-auto top-2.5 flex items-center justify-center text-muted-foreground pointer-events-none z-10 [&>svg]:size-4 [&>svg]:shrink-0">
            {startIcon}
          </span>
        )}

        {/* Start Button */}
        {hasStartButton && renderButton(startButton, "start")}

        {textareaElement}

        {/* End Icon */}
        {hasEndIcon && !hasEndButton && (
          <span className="absolute right-2 rtl:left-2 rtl:right-auto top-2.5 flex items-center justify-center text-muted-foreground pointer-events-none z-10 [&>svg]:size-4 [&>svg]:shrink-0">
            {endIcon}
          </span>
        )}

        {/* End Button */}
        {hasEndButton && renderButton(endButton, "end")}
      </div>
    ) : (
      textareaElement
    );

    if (!label) {
      return textareaWithWrapper;
    }

    return (
      <div className="space-y-1.5 w-full">
        <label
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium text-foreground",
            labelClassName,
          )}
        >
          {labelIcon && labelIcon}
          {label}
        </label>
        <div className="mt-2">{textareaWithWrapper}</div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };

