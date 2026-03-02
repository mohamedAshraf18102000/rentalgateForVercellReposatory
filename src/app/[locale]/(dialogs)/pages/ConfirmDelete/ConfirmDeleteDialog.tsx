"use client";

import * as React from "react";
 import { Button , DialogWrapper } from "@/ui";
import type { ConfirmDeleteProps } from "./ConfirmDelete.types";

export function ConfirmDeleteDialog({
  title,
  description,
  itemName,
  onConfirm,
  onClose,
}: ConfirmDeleteProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      header={{
        mainTitle: title,
        description: description,
      }}
      content={
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{itemName}</strong>? This
          action cannot be undone.
        </p>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </>
      }
    />
  );
}

