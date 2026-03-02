/**
 * useStickyHeader Hook
 * Custom hook to manage sticky header behavior with scroll detection
 * and position switching between fixed and sticky
 */

import { useEffect, useState, useRef, type RefObject } from 'react';

interface UseStickyHeaderOptions {
  scrollThreshold?: number; // Scroll threshold to show header (default: 100)
  triggerOffset?: number; // Offset for intersection observer (default: 80)
}

interface UseStickyHeaderReturn {
  showStickyHeader: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  stickyTriggerRef: RefObject<HTMLDivElement | null>;
  headerStyle: React.CSSProperties;
}

export function useStickyHeader(
  options: UseStickyHeaderOptions = {}
): UseStickyHeaderReturn {
  const { scrollThreshold = 100, triggerOffset = 80 } = options;

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);
  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({});
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Scroll handler to show/hide sticky header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show sticky header when scrolled down more than threshold
      if (currentScrollY > scrollThreshold) {
        setShowStickyHeader(true);
      } else {
        setShowStickyHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  // Intersection Observer to detect when we reach the sticky trigger point
  useEffect(() => {
    if (!showStickyHeader || !stickyTriggerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When the trigger div is visible, switch to sticky
          setIsNearBottom(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${triggerOffset}px 0px`, // Trigger slightly before reaching bottom
      }
    );

    observer.observe(stickyTriggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [showStickyHeader, triggerOffset]);

  // Update header position based on scroll
  useEffect(() => {
    if (!showStickyHeader || !containerRef.current) {
      setHeaderStyle({});
      return;
    }

    const updateHeaderPosition = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768; // md breakpoint

      if (isMobile) {
        // Mobile: fixed at top
        setHeaderStyle({
          position: 'fixed',
          top: '0',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
        });
      } else {
        // Desktop: fixed/sticky at bottom
        if (isNearBottom) {
          // Near bottom - use sticky position
          setHeaderStyle({
            position: 'sticky',
            bottom: 0,
            width: '100%',
          });
        } else {
          // Still scrolling - use fixed position aligned with container
          setHeaderStyle({
            position: 'fixed',
            bottom: 0,
            left: rect.left,
            width: rect.width,
            maxWidth: rect.width,
          });
        }
      }
    };

    updateHeaderPosition();
    window.addEventListener('scroll', updateHeaderPosition, { passive: true });
    window.addEventListener('resize', updateHeaderPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderPosition);
      window.removeEventListener('resize', updateHeaderPosition);
    };
  }, [showStickyHeader, isNearBottom]);

  return {
    showStickyHeader,
    containerRef,
    stickyTriggerRef,
    headerStyle,
  };
}

