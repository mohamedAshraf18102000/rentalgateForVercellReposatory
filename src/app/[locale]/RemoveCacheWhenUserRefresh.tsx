"use client";
import { useEffect } from "react";
import { resetAllStores } from "@/lib/stores/resetAllStores";

const RemoveCacheWhenUserRefresh = () => {
  useEffect(() => {
    const REFRESH_FLAG_KEY = "general-settings-page-refreshed";
    if (sessionStorage.getItem(REFRESH_FLAG_KEY) === "1") {
      resetAllStores();
      sessionStorage.removeItem(REFRESH_FLAG_KEY);
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(REFRESH_FLAG_KEY, "1");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  return <></>;
};

export default RemoveCacheWhenUserRefresh;
