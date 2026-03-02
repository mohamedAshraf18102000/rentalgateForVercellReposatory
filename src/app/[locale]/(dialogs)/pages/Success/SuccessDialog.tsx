"use client";

import * as React from "react";
import { Button , DialogWrapper } from "@/ui";
import { CheckCircle2 } from "lucide-react";
import type { SuccessProps } from "./Success.types";

export function SuccessDialog({ title, message, onClose }: SuccessProps) {
  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      header={{
        icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
        mainTitle: title,
        description: message,
      }}
      footer={
        <Button onClick={onClose}>OK</Button>
      }
    />
  );
}

