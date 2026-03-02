"use client";

import * as React from "react";
import { Button , Input , Label , DialogWrapper } from "@/ui";
import type { SelectLocationProps } from "./SelectLocation.types";

export function SelectLocationDialog({
  currentLocation,
  onSelect,
  onClose,
}: SelectLocationProps) {
  const [location, setLocation] = React.useState(currentLocation || "");

  const handleSelect = () => {
    if (location.trim()) {
      onSelect(location);
      onClose();
    }
  };

  return (
    <DialogWrapper
      open={true}
      onOpenChange={(open) => !open && onClose()}
      header={{
        mainTitle: "Select Location",
        description: "Choose or enter a location for your selection.",
      }}
      content={
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!location.trim()}>
            Select
          </Button>
        </>
      }
    />
  );
}

