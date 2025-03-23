"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /**
   * Defines the scrollbar visibility behavior
   * - "auto": Shows scrollbar only when hovering over the scroll area
   * - "always": Always shows the scrollbar
   * - "scroll": Shows scrollbar only during scrolling
   * - "hover": Shows scrollbar only when hovering over the scrollbar area
   */
  scrollbarVisibility?: "auto" | "always" | "scroll" | "hover";

  /**
   * Sets the scrollbar size variant
   * - "default": Standard size scrollbar
   * - "thin": Narrower, more subtle scrollbar
   */
  scrollbarSize?: "default" | "thin";

  /**
   * The delay in milliseconds before the scrollbar hides (when using auto/scroll/hover visibility)
   */
  hideDelay?: number;

  /**
   * Whether to enable both horizontal and vertical scrollbars
   */
  bothAxis?: boolean;
}

export const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({
  className,
  children,
  scrollbarVisibility = "auto",
  scrollbarSize = "default",
  hideDelay = 600,
  bothAxis = false,
  ...props
}, ref) => {
  // Generate classes based on scrollbar visibility setting
  const getScrollbarVisibilityClass = () => {
    switch (scrollbarVisibility) {
      case "always": return "scrollbar-always-visible";
      case "scroll": return "scrollbar-visible-on-scroll";
      case "hover": return "scrollbar-visible-on-hover";
      case "auto":
      default: return "scrollbar-auto-visible";
    }
  };

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        getScrollbarVisibilityClass(),
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar
        orientation="vertical"
        size={scrollbarSize}
        hideDelay={hideDelay}
      />

      {bothAxis && (
        <ScrollBar
          orientation="horizontal"
          size={scrollbarSize}
          hideDelay={hideDelay}
        />
      )}

      <ScrollAreaPrimitive.Corner className="bg-muted" />

      <style jsx global>{`
        /* Auto visibility - default behavior */
        .scrollbar-auto-visible [data-radix-scroll-area-scrollbar] {
          opacity: 0;
          transition: opacity ${hideDelay}ms ease-in-out;
        }
        .scrollbar-auto-visible:hover [data-radix-scroll-area-scrollbar] {
          opacity: 1;
        }

        /* Always visible */
        .scrollbar-always-visible [data-radix-scroll-area-scrollbar] {
          opacity: 1;
        }

        /* Visible only when scrolling */
        .scrollbar-visible-on-scroll [data-radix-scroll-area-scrollbar] {
          opacity: 0;
          transition: opacity ${hideDelay}ms ease-in-out;
        }
        .scrollbar-visible-on-scroll [data-radix-scroll-area-scrollbar][data-state="visible"] {
          opacity: 1;
        }

        /* Visible only when hovering over scrollbar area */
        .scrollbar-visible-on-hover [data-radix-scroll-area-scrollbar] {
          opacity: 0;
          transition: opacity ${hideDelay}ms ease-in-out;
        }
        .scrollbar-visible-on-hover [data-radix-scroll-area-scrollbar]:hover {
          opacity: 1;
        }
      `}</style>
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export interface ScrollBarProps extends
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  /**
   * Size variant for the scrollbar
   */
  size?: "default" | "thin";

  /**
   * The delay in milliseconds before the scrollbar hides
   */
  hideDelay?: number;
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({
  className,
  orientation = "vertical",
  size = "default",
  hideDelay = 600,
  ...props
}, ref) => {
  // Determine width/height based on size and orientation
  const sizeClass = size === "thin"
    ? orientation === "vertical" ? "w-1.5" : "h-1.5"
    : orientation === "vertical" ? "w-2.5" : "h-2.5";

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-all duration-150 ease-in-out",
        orientation === "vertical" &&
          `h-full ${sizeClass} border-l border-l-transparent p-[1px]`,
        orientation === "horizontal" &&
          `w-full ${sizeClass} flex-col border-t border-t-transparent p-[1px]`,
        className
      )}
      style={{
        // Set transition-duration using the hideDelay prop
        transitionDuration: `${hideDelay}ms`,
      }}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn(
          "relative flex-1 rounded-full bg-border hover:bg-border/80 cursor-pointer",
          "data-[state=visible]:animate-in data-[state=visible]:fade-in-0",
          "data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollBar }