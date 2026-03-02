"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { useLocale } from "next-intl"

const Toaster = ({ position, ...props }: ToasterProps) => {
  const locale = useLocale();
  
  // Set position based on locale: bottom-right for Arabic, bottom-left for English
  const toastPosition = position || (locale === 'ar' ? 'bottom-right' : 'bottom-left');
  
  return (
    <Sonner
      theme="dark"
      position={toastPosition}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          fontFamily: "var(--font-zain, Zain, sans-serif)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

