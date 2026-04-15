"use client";

import { useEffect } from "react";

type HashAnchorScrollerProps = {
  offset?: number;
};

const HashAnchorScroller = ({ offset = 0 }: HashAnchorScrollerProps) => {
  useEffect(() => {
    const scrollToHashTarget = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(targetId);
      if (!target) return;

      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    };

    const timeout = window.setTimeout(scrollToHashTarget, 0);
    window.addEventListener("hashchange", scrollToHashTarget);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", scrollToHashTarget);
    };
  }, [offset]);

  return null;
};

export default HashAnchorScroller;
