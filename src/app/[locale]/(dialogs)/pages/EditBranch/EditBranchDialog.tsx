"use client";

import * as React from "react"; 
import { Button , Input , Label , DialogWrapper } from "@/ui"; 
import type { EditBranchProps } from "./EditBranch.types";

export function EditBranchDialog({
  branchId,
  branchName,
  onSave,
  onClose,
}: EditBranchProps) {
  const [name, setName] = React.useState(branchName);

  const handleSave = () => {
    onSave({ id: branchId, name });
    onClose();
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      header={{
        mainTitle: "Edit Branch",
        description: "Update the branch information below.",
      }}
      content={
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="branch-name">Branch Name</Label>
            <Input
              id="branch-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter branch name"
            />
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </>
      }
    />
  );
}

