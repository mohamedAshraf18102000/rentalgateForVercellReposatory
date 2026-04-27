"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center text-muted-foreground border-b border-Grey200",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <>
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex flex-1 items-center justify-center whitespace-nowrap px-3 py-2 text-base font-medium ring-offset-background transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed! disabled:opacity-50 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=active]:bg-Grey100 data-[state=active]:rounded-t-[12px]",
        className,
      )}
      {...props}
    >
      <div className="inline-grid items-center justify-center">
        <span
          className="[grid-area:1/1] invisible font-bold"
          aria-hidden="true"
        >
          {children}
        </span>
        <span className="[grid-area:1/1]">{children}</span>
      </div>
    </TabsPrimitive.Trigger>
    <div className="h-[30px] w-[14px] flex justify-center items-center shrink-0 last:hidden">
      <div className="h-full w-0.5 bg-Grey100 rounded-full" />
    </div>
  </>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
