"use client"

import * as React from "react"
import NextImage, { ImageProps as NextImageProps } from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const imageVariants = cva(
  "object-cover transition-all duration-300",
  {
    variants: {
      variant: {
        default: "",
        rounded: "rounded-lg",
        circle: "rounded-full",
        square: "rounded-none",
      },
      size: {
        xs: "w-8 h-8",
        sm: "w-12 h-12",
        md: "w-16 h-16",
        lg: "w-24 h-24",
        xl: "w-32 h-32",
        "2xl": "w-40 h-40",
        full: "w-full h-full",
        auto: "w-auto h-auto",
      },
      aspectRatio: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        wide: "aspect-[16/9]",
      },
      hover: {
        none: "",
        zoom: "hover:scale-105",
        brightness: "hover:brightness-110",
        grayscale: "grayscale hover:grayscale-0",
        opacity: "opacity-80 hover:opacity-100",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "auto",
      aspectRatio: "auto",
      hover: "none",
    },
  }
)

interface ImageComponentProps
  extends Omit<NextImageProps, "alt">,
    VariantProps<typeof imageVariants> {
  alt: string
  fallback?: string
  wrapperClassName?: string
  showSkeleton?: boolean
}

function Image({
  className,
  wrapperClassName,
  variant,
  size,
  aspectRatio,
  hover,
  fallback = "/placeholder.svg",
  showSkeleton = true,
  src,
  alt,
  onError,
  ...props
}: ImageComponentProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true)
    setIsLoading(false)
    onError?.(e)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const imageSrc = error ? fallback : src

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        size !== "auto" && size !== "full" && imageVariants({ size }),
        aspectRatio !== "auto" && imageVariants({ aspectRatio }),
        variant && imageVariants({ variant }),
        wrapperClassName
      )}
    >
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <NextImage
        src={imageSrc}
        alt={alt}
        className={cn(
          imageVariants({ variant, hover }),
          isLoading && "opacity-0",
          !isLoading && "opacity-100",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  )
}

// Avatar component - specialized image for user avatars
interface AvatarProps extends Omit<ImageComponentProps, "variant" | "aspectRatio" | "src"> {
  name?: string
  showFallbackInitials?: boolean
  src?: string
}

function Avatar({
  className,
  wrapperClassName,
  size = "md",
  name,
  showFallbackInitials = true,
  src,
  alt,
  ...props
}: AvatarProps) {
  const [error, setError] = React.useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Show fallback initials if no src, src is empty, or error occurred
  if ((!src || error) && showFallbackInitials && name) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground font-medium rounded-full",
          imageVariants({ size }),
          wrapperClassName
        )}
      >
        <span className={cn(
          size === "xs" && "text-[10px]",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
          size === "xl" && "text-lg",
          size === "2xl" && "text-xl",
        )}>
          {getInitials(name)}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src || ""}
      alt={alt || name || "Avatar"}
      variant="circle"
      size={size}
      aspectRatio="square"
      className={className}
      wrapperClassName={wrapperClassName}
      onError={() => setError(true)}
      {...props}
    />
  )
}

// Thumbnail component - for small preview images
interface ThumbnailProps extends Omit<ImageComponentProps, "size"> {
  size?: "sm" | "md" | "lg"
}

function Thumbnail({
  className,
  size = "md",
  variant = "rounded",
  ...props
}: ThumbnailProps) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  return (
    <Image
      variant={variant}
      aspectRatio="square"
      className={className}
      wrapperClassName={sizeMap[size]}
      {...props}
    />
  )
}

// Cover Image - for hero/banner images
interface CoverImageProps extends Omit<ImageComponentProps, "size" | "aspectRatio"> {
  aspectRatio?: "video" | "wide" | "portrait"
}

function CoverImage({
  className,
  aspectRatio = "video",
  variant = "rounded",
  ...props
}: CoverImageProps) {
  return (
    <Image
      variant={variant}
      size="full"
      aspectRatio={aspectRatio}
      fill
      className={cn("object-cover", className)}
      {...props}
    />
  )
}

export { Image, Avatar, Thumbnail, CoverImage }
export type { ImageComponentProps, AvatarProps, ThumbnailProps, CoverImageProps }

