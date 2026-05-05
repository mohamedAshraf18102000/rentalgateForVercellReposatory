"use client";

import { useEffect } from "react";

// import { useEffect } from "react";

// export default function Teest() {
//   useEffect(() => {
//     const navigationEntry = performance.getEntriesByType("navigation").at(0) as
//       | PerformanceNavigationTiming
//       | undefined;

//     const isReload = navigationEntry?.type === "reload";

//     console.log("navigationEntry", navigationEntry);

//     if (isReload) {
//       // resetAllStores();
//       console.log("User refreshed the page, all stores were reset.");
//     }
//   }, []);

//   return null;
// }

const Teest = () => {
  useEffect(() => {
    const REFRESH_FLAG_KEY = "general-settings-page-refreshed";
    if (sessionStorage.getItem(REFRESH_FLAG_KEY) === "1") {
      console.log("test");
      sessionStorage.removeItem(REFRESH_FLAG_KEY);
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(REFRESH_FLAG_KEY, "1");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  return <div>Teest</div>;
};

export default Teest;
