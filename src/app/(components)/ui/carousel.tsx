"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import type { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/app/(components)/ui/button";

type CarouselApi = UseEmblaCarouselType[1];

type CarouselProps = {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  lang?: string;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
  isRtl: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      lang,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      } as EmblaOptionsType,
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const scrollTo = React.useCallback(
      (index: number) => {
        api?.scrollTo(index);
      },
      [api],
    );

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    const isRtl = lang === "ar";

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation ||
            ((opts as EmblaOptionsType)?.axis === "y"
              ? "vertical"
              : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
          scrollTo,
          lang,
          isRtl,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev, isRtl } = useCarousel();

  return (
    <button
      ref={ref}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "flex items-center justify-center rounded-xl transition-all duration-200",
        "h-10 w-10 shadow-md active:scale-95",
        canScrollPrev
          ? "bg-primary text-white hover:opacity-90"
          : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        orientation === "vertical" && "rotate-90",
        className,
      )}
      {...props}
    >
      <ArrowLeft className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
      <span className="sr-only">Previous slide</span>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext, isRtl } = useCarousel();

  return (
    <button
      ref={ref}
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        "flex items-center justify-center rounded-xl transition-all duration-200",
        "h-10 w-10 shadow-md active:scale-95",
        canScrollNext
          ? "bg-primary text-white hover:opacity-90"
          : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        orientation === "vertical" && "rotate-90",
        className,
      )}
      {...props}
    >
      <ArrowRight className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
      <span className="sr-only">Next slide</span>
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarousel();

  const getScale = (index: number) => {
    const distance = Math.abs(index - selectedIndex);
    if (distance === 0) return "scale-100"; // active
    if (distance === 1) return "scale-75"; // neighbors
    if (distance === 2) return "scale-50"; // far neighbors
    return "scale-[0.3]"; // very far
  };

  const getOpacity = (index: number) => {
    const distance = Math.abs(index - selectedIndex);
    if (distance === 0) return "opacity-100";
    if (distance === 1) return "opacity-60";
    if (distance === 2) return "opacity-40";
    return "opacity-20";
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-1.5", className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300 ease-in-out",
            "bg-gray-800 dark:bg-white",
            getScale(index),
            getOpacity(index),
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
});
CarouselDots.displayName = "CarouselDots";

const CustomCarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarousel();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center justify-center gap-1.5 sm:gap-2",
        className,
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            "rounded-full p-0.5 transition-all duration-300 ease-in-out",
            index === selectedIndex
              ? "h-2.5 w-7 bg-white sm:h-3 sm:w-10"
              : "h-2.5 w-2.5 bg-gray-400 hover:bg-white sm:h-3 sm:w-3",
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
});
CustomCarouselDots.displayName = "CustomCarouselDots";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CustomCarouselDots,
};
