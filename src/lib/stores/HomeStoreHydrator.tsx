"use client";

import { useEffect, useRef } from "react";
import { useHomeStore } from "./useHomeStore";
import { HomeResponse } from "@/types/home/home";

interface HomeStoreHydratorProps {
  data: HomeResponse;
}

export const HomeStoreHydrator = ({ data }: HomeStoreHydratorProps) => {
  const initialized = useRef(false);

  // Initialize the store once on the client side
  if (!initialized.current) {
    useHomeStore.getState().setData(data);
    initialized.current = true;
  }

  // Update data if it changes on the server
  useEffect(() => {
    useHomeStore.getState().setData(data);
  }, [data]);

  return null;
};
