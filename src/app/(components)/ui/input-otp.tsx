"use client";

import * as React from "react";
import { OTPInput } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================
// Simple API InputOtp (HeroUI style)
// ============================================

interface InputOtpProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  slotClassName?: string;
  separator?: boolean;
  separatorAfter?: number;
  dir?: "ltr" | "rtl";
}

function InputOtp({
  length = 4,
  value,
  defaultValue,
  onValueChange,
  onComplete,
  disabled,
  className,
  slotClassName,
  separator = false,
  separatorAfter = 3,
  dir = "ltr",
}: InputOtpProps) {
  const slots = Array.from({ length }, (_, i) => i);

  // Split slots for separator
  const firstGroup = separator ? slots.slice(0, separatorAfter) : slots;
  const secondGroup = separator ? slots.slice(separatorAfter) : [];

  return (
    <OTPInput
      dir={dir}
      data-slot="input-otp"
      maxLength={length}
      value={value}
      onChange={onValueChange}
      onComplete={onComplete}
      disabled={disabled}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        className,
      )}
      render={({ slots: inputSlots }) => (
        <>
          <InputOTPGroup>
            {firstGroup.map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                slots={inputSlots}
                className={slotClassName}
              />
            ))}
          </InputOTPGroup>
          {separator && secondGroup.length > 0 && (
            <>
              <InputOTPSeparator />
              <InputOTPGroup>
                {secondGroup.map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    slots={inputSlots}
                    className={slotClassName}
                  />
                ))}
              </InputOTPGroup>
            </>
          )}
        </>
      )}
    />
  );
}

// Blinking insertion caret — visible on both empty and filled active slots
// (library often only sets hasFakeCaret when empty; users still need a caret when editing digits).
function OtpCaret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-5 w-px shrink-0 rounded-full bg-primary motion-safe:animate-[blink_1s_step-end_infinite]",
        className,
      )}
    />
  );
}

// Internal slot component
function InputOTPSlot({
  index,
  slots,
  className,
}: {
  index: number;
  slots: { char: string | null; hasFakeCaret: boolean; isActive: boolean }[];
  className?: string;
}) {
  const { char, hasFakeCaret, isActive } = slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(
        // Fixed border-2 everywhere so focus/active never changes box size (no digit jump)
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-[#ECEEF2] text-base font-medium text-foreground cursor-text",
        "transition-[border-color,background-color,box-shadow] duration-150 ease-out",
        "group-hover/otp:border-gray-300",
        "hover:border-gray-300 hover:bg-gray-50",
        "data-[filled=true]:border-gray-200 data-[filled=true]:bg-white",
        "data-[active=true]:z-1 data-[active=true]:border-primary data-[active=true]:bg-white",
        "data-[active=true]:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      {char ? (
        <>
          {/* Digit stays centered; caret is overlaid so layout does not shift when focusing */}
          <span className="tabular-nums leading-none">{char}</span>
          {isActive && (
            <span className="pointer-events-none absolute end-3 top-[20px] -translate-y-1/2">
              <OtpCaret />
            </span>
          )}
        </>
      ) : (
        <>
          {(isActive || hasFakeCaret) && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <OtpCaret />
            </span>
          )}
        </>
      )}
    </div>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("group/otp flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(
        "flex items-center justify-center w-4 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  );
}

export { InputOtp };
