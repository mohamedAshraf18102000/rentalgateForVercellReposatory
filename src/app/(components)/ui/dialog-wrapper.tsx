"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "./drawer";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogWrapperProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl";
  header?: {
    mainTitle?: string | React.ReactNode;
    icon?: React.ReactNode;
    iconBgColor?: string;
    subTitle?: string | React.ReactNode;
    description?: string | React.ReactNode;
  };
  extraHeader?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOutsideClick?: boolean;
  scrollableContent?: boolean;
  maxScrollHeight?: string;
  showScrollbar?: boolean;
  forceDialog?: boolean;
}

// Detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function DialogWrapper({
  trigger,
  open,
  onOpenChange,
  size = "md",
  header,
  extraHeader,
  content,
  footer,
  className,
  overlayClassName,
  contentClassName,
  closeOnOutsideClick = true,
  scrollableContent = false,
  maxScrollHeight = "60vh",
  showScrollbar = false,
  forceDialog = false,
}: DialogWrapperProps) {
  const isMobile = useIsMobile();
  const shouldUseDialog = forceDialog || !isMobile;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const resolvedOpen = isControlled ? open : internalOpen;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(false);
  const pushedHistoryRef = React.useRef(false);
  const ignoreNextPopRef = React.useRef(false);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);

      // Keep browser history clean when sheet is closed explicitly.
      if (isMobile && !forceDialog && !nextOpen && pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        ignoreNextPopRef.current = true;
        window.history.back();
      }
    },
    [forceDialog, isControlled, isMobile, onOpenChange],
  );

  // Mobile drawer should close first on browser back.
  React.useEffect(() => {
    if (shouldUseDialog) return;
    if (!resolvedOpen) return;
    if (pushedHistoryRef.current) return;

    window.history.pushState({ dialogWrapperOpen: true }, "");
    pushedHistoryRef.current = true;

    const onPopState = () => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }

      pushedHistoryRef.current = false;
      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [isControlled, onOpenChange, resolvedOpen, shouldUseDialog]);

  // Scroll detection
  React.useEffect(() => {
    if (!scrollableContent) return;

    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const atBottom =
        Math.abs(el.scrollHeight - (el.scrollTop + el.clientHeight)) <= 1;
      setIsAtBottom(atBottom);
    };

    check();

    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    const observer = new ResizeObserver(() => setTimeout(check, 0));
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      observer.disconnect();
    };
  }, [scrollableContent, content]);

  const scrollAreaClassName = cn(
    "overflow-y-auto",
    showScrollbar ? "custom-scrollbar" : "scrollbar-hide",
  );

  // Responsive sizes
  const sizeClasses = {
    sm: "w-full max-w-[90vw] sm:max-w-[320px]",
    md: "w-full max-w-[95vw] sm:max-w-[416px]",
    lg: "w-full max-w-[95vw] md:max-w-[650px]",
    xl: "w-full max-w-[95vw] lg:max-w-[800px]",
  };

  // Header renderer
  const renderHeader = () => {
    if (!header && !extraHeader) return null;

    return (
      <>
        {header?.mainTitle && (
          <div className="flex items-center justify-between py-3 px-4 sm:px-5 border-b border-[#CDCDCD]">
            {isMobile ? (
              <DrawerTitle className="text-base sm:text-lg text-center w-full">
                {header.mainTitle}
              </DrawerTitle>
            ) : (
              <DialogTitle className="text-base sm:text-lg">
                {header.mainTitle}
              </DialogTitle>
            )}

            {!isMobile && (
              <DrawerClose className="border rounded-full p-1 opacity-70 hover:opacity-100 transition">
                <X className="h-4 w-4" />
              </DrawerClose>
            )}
          </div>
        )}

        {header?.icon && (
          <div className="flex justify-center mt-2">
            <div
              className={cn(
                "flex items-center justify-center rounded-full w-14 h-14 sm:w-16 sm:h-16",
                header.iconBgColor || "bg-green-500",
              )}
            >
              {header.icon}
            </div>
          </div>
        )}

        {header?.subTitle &&
          (isMobile ? (
            <DrawerTitle className="text-base sm:text-lg font-medium">
              {header.subTitle}
            </DrawerTitle>
          ) : (
            <DialogTitle className="text-base sm:text-lg font-medium">
              {header.subTitle}
            </DialogTitle>
          ))}

        {header?.description &&
          (isMobile ? (
            <DrawerDescription className="text-sm text-center text-muted-foreground px-3">
              {header.description}
            </DrawerDescription>
          ) : (
            <DialogDescription className="text-sm text-center text-muted-foreground px-3">
              {header.description}
            </DialogDescription>
          ))}

        {extraHeader && <div className="w-full">{extraHeader}</div>}
      </>
    );
  };

  // Mobile → Drawer
  if (isMobile && !forceDialog) {
    return (
      <Drawer open={resolvedOpen} onOpenChange={handleOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

        <DrawerContent
          className={cn("max-h-[100dvh] rounded-t-2xl", className)}
        >
          {!header?.mainTitle && !header?.subTitle && (
            <DrawerTitle className="sr-only">Dialog</DrawerTitle>
          )}
          {(header || extraHeader) && (
            <DrawerHeader className="text-center space-y-4 p-0 mb-3">
              {renderHeader()}
            </DrawerHeader>
          )}

          <div className="px-3 pb-2">
            {content &&
              (scrollableContent ? (
                <div className="relative overflow-hidden rounded-xl">
                  <div
                    ref={scrollRef}
                    className={scrollAreaClassName}
                    style={{ maxHeight: maxScrollHeight }}
                  >
                    <div className={cn(contentClassName)}>{content}</div>
                  </div>

                  {!isAtBottom && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />
                  )}
                </div>
              ) : (
                <div className={cn(contentClassName)}>{content}</div>
              ))}
          </div>

          {footer && <DrawerFooter className="gap-2">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop → Dialog
  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={cn(sizeClasses[size], "mt-7", className)}
        overlayClassName={overlayClassName}
        hideCloseButton={!!header?.mainTitle}
        onInteractOutside={(e) => {
          if (!closeOnOutsideClick) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnOutsideClick) e.preventDefault();
        }}
      >
        {!header?.mainTitle && !header?.subTitle && (
          <DialogTitle className="sr-only">Dialog</DialogTitle>
        )}
        {(header || extraHeader) && (
          <DialogHeader className="text-center space-y-4">
            {renderHeader()}
          </DialogHeader>
        )}

        <div className="p-4 sm:p-5 pt-2">
          {content &&
            (scrollableContent ? (
              <div className="relative overflow-hidden rounded-xl">
                <div
                  ref={scrollRef}
                  className={scrollAreaClassName}
                  style={{ maxHeight: maxScrollHeight }}
                >
                  <div className={cn(contentClassName)}>{content}</div>
                </div>

                {!isAtBottom && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />
                )}
              </div>
            ) : (
              <div className={cn(contentClassName)}>{content}</div>
            ))}

          {footer && (
            <DialogFooter className="sm:justify-center">{footer}</DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
