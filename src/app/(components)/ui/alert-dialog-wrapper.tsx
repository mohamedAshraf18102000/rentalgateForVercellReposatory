"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle } from "lucide-react";

type AlertVariant = "success" | "error" | "info";

interface AlertDialogWrapperProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: AlertVariant;
  header?: {
    mainTitle?: string | React.ReactNode;
    subTitle?: string | React.ReactNode;
    description?: string | React.ReactNode;
  };
  content?: React.ReactNode;
  footer?: {
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
  };
  className?: string;
  contentClassName?: string;
}

const variantConfig: Record<
  AlertVariant,
  {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
  }
> = {
  success: {
    icon: <Check className="h-8 w-8 text-white" />,
    iconBg: "bg-green-500",
    iconColor: "text-green-500",
  },
  error: {
    icon: <X className="h-8 w-8 text-white" />,
    iconBg: "bg-red-500",
    iconColor: "text-red-500",
  },
  info: {
    icon: <AlertCircle className="h-8 w-8 text-white" />,
    iconBg: "bg-blue-500",
    iconColor: "text-blue-500",
  },
};

export function AlertDialogWrapper({
  trigger,
  open,
  onOpenChange,
  variant = "info",
  header,
  content,
  footer,
  className,
  contentClassName,
}: AlertDialogWrapperProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={cn("max-w-md", className)}>
        {header && (
          <AlertDialogHeader className="text-center space-y-4">
            {header.mainTitle && (
              <AlertDialogTitle className="text-xl font-semibold">
                {header.mainTitle}
              </AlertDialogTitle>
            )}

            {header.subTitle && (
              <AlertDialogTitle className="text-lg font-medium">
                {header.subTitle}
              </AlertDialogTitle>
            )}
            {header.description && (
              <AlertDialogDescription className="text-sm text-muted-foreground text-start!">
                {header.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        {content && (
          <div className={cn("py-4", contentClassName)}>{content}</div>
        )}
        {footer && (
          <AlertDialogFooter className="sm:justify-center gap-2">
            {footer.showCancel && (
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="outline" onClick={footer.onCancel}>
                  {footer.cancelText || "إلغاء"}
                </Button>
              </AlertDialogPrimitive.Cancel>
            )}
            <AlertDialogPrimitive.Action asChild>
              <Button onClick={footer.onConfirm}>
                {footer.confirmText || "حفظ التغييرات"}
              </Button>
            </AlertDialogPrimitive.Action>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
