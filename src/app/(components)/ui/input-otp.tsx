"use client"

import * as React from "react"
import { OTPInput } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ============================================
// Simple API InputOtp (HeroUI style)
// ============================================

interface InputOtpProps {
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  className?: string
  slotClassName?: string
  separator?: boolean
  separatorAfter?: number
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
}: InputOtpProps) {
  const slots = Array.from({ length }, (_, i) => i)
  
  // Split slots for separator
  const firstGroup = separator ? slots.slice(0, separatorAfter) : slots
  const secondGroup = separator ? slots.slice(separatorAfter) : []

  return (
    <OTPInput
      data-slot="input-otp"
      maxLength={length}
      value={value}
      onChange={onValueChange}
      onComplete={onComplete}
      disabled={disabled}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        className
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
  )
}

// Internal slot component
function InputOTPSlot({
  index,
  slots,
  className,
}: {
  index: number
  slots: { char: string | null; hasFakeCaret: boolean; isActive: boolean }[]
  className?: string
}) {
  const { char, hasFakeCaret, isActive } = slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(
        // Base styles - HeroUI exact style
        " relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-[#ECEEF2] text-base font-medium cursor-text",
        // Transitions
        "transition-all duration-150 ease-out",
        // Group hover
        "group-hover/otp:border-gray-300",
        // Individual hover
        "hover:border-gray-300 hover:bg-gray-50",
        // Active state (focused) - dark border like HeroUI
        "data-[active=true]:border-primary data-[active=true]:border-1 data-[active=true]:bg-white",
        // Filled state
        "data-[filled=true]:border-gray-200 data-[filled=true]:bg-white",
        className
      )}
    >
      <span>
        {char}
      </span>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-[blink_1s_step-end_infinite] bg-foreground" />
        </div>
      )}
    </div>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("group/otp flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      data-slot="input-otp-separator" 
      role="separator" 
      className={cn("flex items-center justify-center w-4 text-muted-foreground", className)}
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  )
}

export { InputOtp }
