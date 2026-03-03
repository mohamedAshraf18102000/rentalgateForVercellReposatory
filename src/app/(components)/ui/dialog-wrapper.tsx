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
  DialogClose,
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
    mainTitle?: string | React.ReactNode; // العنوان الرئيسي في الأعلى
    icon?: React.ReactNode; // الأيقونة الدائرية
    iconBgColor?: string; // لون خلفية الأيقونة (افتراضي: bg-green-500)
    subTitle?: string | React.ReactNode; // العنوان الثانوي
    description?: string | React.ReactNode; // الوصف
  };
  extraHeader?: React.ReactNode; // Content that appears after header but before main content
  content?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  closeOnOutsideClick?: boolean; // التحكم في إغلاق الـ dialog عند الضغط خارجها
  scrollableContent?: boolean; // تفعيل الـ scroll wrapper
  maxScrollHeight?: string; // الحد الأقصى لارتفاع الـ scroll container
  forceDialog?: boolean; // إجبار استخدام Dialog حتى على الموبايل (بدلاً من Drawer)
}

// Hook للكشف عن الموبايل
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint في Tailwind
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
  contentClassName,
  closeOnOutsideClick = true,
  scrollableContent = false,
  maxScrollHeight = "350px",
  forceDialog = false,
}: DialogWrapperProps) {
  const isMobile = useIsMobile();
  const shouldUseDialog = forceDialog || !isMobile;
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  // Check scroll position
  React.useEffect(() => {
    if (!scrollableContent) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // More accurate bottom detection with 1px threshold
      const atBottom = Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1;
      setIsAtBottom(atBottom);
    };

    // Initial check
    checkScroll();

    // Check on scroll
    container.addEventListener("scroll", checkScroll, { passive: true });

    // Check on resize
    window.addEventListener("resize", checkScroll);

    // Use ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(() => {
      // Small delay to ensure DOM is updated
      setTimeout(checkScroll, 0);
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, [scrollableContent, content]);
  const sizeClasses = {
    sm: "w-[320px] max-w-[320px]",
    md: "w-[416px] max-w-[416px]",
    lg: "w-[650px] max-w-[650px]",
    xl: "w-[800px] max-w-[800px]",
  };

  // محتوى مشترك للـ header
  const renderHeader = () => {
    if (!header && !extraHeader) return null;

    return (
      <>
        {header?.mainTitle && (
          <div className="flex items-center justify-between py-3 px-[16px] border-b border-b-[0.5px] border-solid border-[#CDCDCD]">
            {isMobile ? (
              <DrawerTitle className="font-normal text-[18px] text-[#000] text-center  w-full">
                {header.mainTitle}
              </DrawerTitle>
            ) : (
              <DialogTitle className="font-normal text-[18px] text-[#000]">
                {header.mainTitle}
              </DialogTitle>
            )}
            {!isMobile && (
              <DrawerClose className="border border-solid border-[#000] cursor-pointer rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            )}
          </div>
        )}
        {header?.icon && (
          <div className="flex justify-center">
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                header.iconBgColor || "bg-green-500",
                header.iconBgColor ? "" : "w-16 h-16",
              )}
            >
              {header.icon}
            </div>
          </div>
        )}
        {header?.subTitle &&
          (isMobile ? (
            <DrawerTitle className="text-lg font-medium">
              {header.subTitle}
            </DrawerTitle>
          ) : (
            <DialogTitle className="text-lg font-medium">
              {header.subTitle}
            </DialogTitle>
          ))}
        {header?.description &&
          (isMobile ? (
            <DrawerDescription className="text-sm text-center text-muted-foreground">
              {header.description}
            </DrawerDescription>
          ) : (
            <DialogDescription className="text-sm text-center text-muted-foreground">
              {header.description}
            </DialogDescription>
          ))}
        {extraHeader && <div className="w-full">{extraHeader}</div>}
      </>
    );
  };

  // Render Drawer على الموبايل (ما لم يتم إجبار استخدام Dialog)
  if (isMobile && !forceDialog) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className={cn("max-h-[96vh]", className)}>
          {(header || extraHeader) && (
            <DrawerHeader className="text-center space-y-4 p-0 mb-3">
              {renderHeader()}
            </DrawerHeader>
          )}
          <div className="pt-2">
            {content &&
              (scrollableContent ? (
                <div className="relative rounded-xl overflow-hidden px-2 pb-2">
                  <div
                    ref={scrollContainerRef}
                    className={cn("overflow-y-auto relative scrollbar-hide")}
                    style={{ maxHeight: maxScrollHeight }}
                  >
                    <div className={cn("", contentClassName)}>{content}</div>
                  </div>
                  {/* Shadow Bottom */}
                  {!isAtBottom && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-7 z-10 bg-gradient-to-t from-black/10 via-black/7 to-transparent" />
                  )}
                </div>
              ) : (
                <div className={cn("", contentClassName)}>{content}</div>
              ))}
          </div>
          {footer && <DrawerFooter className="gap-2">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  // Render Dialog على Desktop أو عند forceDialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(shouldUseDialog ? sizeClasses[size] : "", className)}
        hideCloseButton={!!header?.mainTitle}
        onInteractOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
      >
        {(header || extraHeader) && (
          <DialogHeader className="text-center space-y-4">
            {renderHeader()}
          </DialogHeader>
        )}
        <div className="p-[20px] pt-2">
          {content &&
            (scrollableContent ? (
              <div className="relative rounded-xl overflow-hidden px-2 pb-2">
                <div
                  ref={scrollContainerRef}
                  className={cn("overflow-y-auto relative scrollbar-hide")}
                  style={{ maxHeight: maxScrollHeight }}
                >
                  <div className={cn("", contentClassName)}>{content}</div>
                </div>
                {/* Shadow Bottom */}
                {!isAtBottom && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-7 z-10 bg-gradient-to-t from-black/10 via-black/7 to-transparent" />
                )}
              </div>
            ) : (
              <div>
                <div className={cn("", contentClassName)}>{content}</div>
              </div>
            ))}
          {footer && (
            <DialogFooter className="sm:justify-center">{footer}</DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
