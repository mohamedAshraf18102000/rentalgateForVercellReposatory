"use client";

import * as React from "react";
import { PhoneInput as LibPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./phone.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.ComponentProps<typeof LibPhoneInput> {
  label?: string;
  labelIcon?: React.ReactNode;
  labelClassName?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  inputClassName?: string;
}

const PhoneInput = ({
  label,
  labelIcon,
  labelClassName,
  errorMessage,
  wrapperClassName,
  inputClassName,
  className,
  ...props
}: PhoneInputProps) => {
  const phoneInput = (
    <div className={cn("relative w-full", wrapperClassName)}>
      <LibPhoneInput
        {...props}
        className={cn("w-full", className)}
        inputClassName={cn(
          "w-full bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-[8px] border px-2 py-0.5 text-sm transition-colors focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed placeholder:text-muted-foreground outline-none",
          errorMessage &&
            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30",
          inputClassName,
        )}
      />
    </div>
  );

  if (!label) {
    return (
      <div className="w-full">
        {phoneInput}
        {errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    );
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
      <div className="mt-2">{phoneInput}</div>
      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export { PhoneInput };
export type { PhoneInputProps };
