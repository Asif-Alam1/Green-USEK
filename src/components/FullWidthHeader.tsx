"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { ChevronRight, Menu, X } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export const FullWidthHeader: FunctionComponent<{
  title: string;
  description: string;
  breadcrumb?: BreadcrumbItem[];
  className?: string;
  backgroundPattern?: "dots" | "grid" | "waves" | "none";
  accentColor?: "primary" | "white";
}> = ({
  title,
  description,
  breadcrumb,
  className,
  backgroundPattern = "dots",
  accentColor = "white"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Handle intersection observer for triggering animations only when in viewport
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // First set it as loaded to trigger initial animations
          setIsLoaded(true);

          // Then make elements visible with a slight delay for sequential animation
          const timer = setTimeout(() => {
            setIsVisible(true);
          }, 100);

          // Once animation is triggered, stop observing
          observer.unobserve(headerElement);

          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 } // Start animation when 10% of the header is visible
    );

    observer.observe(headerElement);

    return () => {
      // Clean up observer on component unmount
      if (headerElement) observer.unobserve(headerElement);
    };
  }, []);

  // Split title into words for staggered animation
  const titleWords = title.split(" ");

  // Determine pattern class based on prop
  const patternClass = {
    dots: "bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]",
    grid: "bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]",
    waves: "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDBoQzUwIDAgMCA1MCAwIDEwMHM1MCAxMDAgMTAwIDEwMCAxMDAtNTAgMTAwLTEwMFMxNTAgMCAxMDAgMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')]",
    none: "",
  }[backgroundPattern];

  // Determine accent color classes
  const accentColorClasses = {
    primary: "from-primary via-primary to-primary/80",
    white: "from-white via-white to-white/80"
  }[accentColor];

  return (
    <div
      ref={headerRef}
      className={cn(
        "relative overflow-hidden py-16 lg:py-28 transition-all duration-700",
        "bg-black text-white shadow-lg",
        className
      )}
    >
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated geometric shapes */}
        <div className={cn(
          "absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl transition-all duration-1000",
          isLoaded ? "opacity-20 scale-100" : "opacity-0 scale-90"
        )}></div>
        <div className={cn(
          "absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-all duration-1000 delay-300",
          isLoaded ? "opacity-15 scale-100" : "opacity-0 scale-90"
        )}></div>

        {/* Subtle floating particle effect */}
        <div aria-hidden="true" className={cn(
          "absolute inset-0 transition-opacity duration-1000 delay-500",
          isLoaded ? "opacity-30" : "opacity-0"
        )}>
          <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-white/20 animate-float-slow"></div>
          <div className="absolute top-1/3 left-2/3 h-1.5 w-1.5 rounded-full bg-white/15 animate-float-medium"></div>
          <div className="absolute top-2/3 left-1/3 h-1 w-1 rounded-full bg-white/10 animate-float-fast"></div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Pattern overlay */}
        {backgroundPattern !== "none" && (
          <div className={cn(
            "absolute inset-0 transition-opacity duration-1000 delay-700",
            patternClass,
            isLoaded ? "opacity-20" : "opacity-0"
          )}></div>
        )}
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Breadcrumb navigation with improved styling */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className={cn(
            "transition-all duration-700 ease-in-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            {/* Mobile breadcrumb toggle */}
            <div className="flex items-center justify-center mb-4 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-breadcrumb"
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="h-3.5 w-3.5" />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="h-3.5 w-3.5" />
                    <span>Navigation</span>
                  </>
                )}
              </button>
            </div>

            {/* Desktop breadcrumb */}
            <div className="hidden md:block">
              <Breadcrumb className="mb-12 text-inherit">
                <BreadcrumbList className="text-inherit flex-wrap justify-center md:justify-start">
                  {breadcrumb?.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem className="text-inherit">
                        {index === breadcrumb.length - 1 ? (
                          <BreadcrumbPage className="text-inherit font-medium line-clamp-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            className="text-inherit opacity-80 hover:opacity-100 transition-opacity line-clamp-1 px-2 py-1 hover:scale-105 transform transition-transform"
                            href={crumb.href}
                          >
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumb.length - 1 && (
                        <BreadcrumbSeparator className="text-white/60">
                          <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Mobile breadcrumb menu */}
            {mobileMenuOpen && (
              <div
                id="mobile-breadcrumb"
                className={cn(
                  "fixed inset-0 bg-black/90 z-50 flex items-center justify-center md:hidden transition-opacity duration-300",
                  mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <div className="w-full max-w-xs">
                  <div className="flex flex-col gap-4">
                    {breadcrumb?.map((crumb, index) => (
                      <a
                        key={index}
                        href={crumb.href}
                        className={cn(
                          "px-4 py-3 rounded-lg text-center text-base transition-all",
                          index === breadcrumb.length - 1
                            ? "bg-white/10 font-medium"
                            : "hover:bg-white/5"
                        )}
                        onClick={() => {
                          if (index !== breadcrumb.length - 1) {
                            setMobileMenuOpen(false);
                          }
                        }}
                      >
                        {crumb.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Title section with staggered word animation */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 inline-block" id="page-title">
            {titleWords.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "inline-block mx-1 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
                  `text-transparent bg-clip-text bg-gradient-to-r ${accentColorClasses}`,
                  "drop-shadow-md transition-all duration-700 transform",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                )}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Animated decorative accent element */}
          <div
            className={cn(
              "flex justify-center mb-8 transition-all duration-700",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
            style={{ transitionDelay: "450ms" }}
            aria-hidden="true"
          >
            <div className="relative h-1 w-32">
              <div className={`absolute inset-0 bg-gradient-to-r ${accentColorClasses.replace('from-', 'from-transparent from-10% ').replace('to-', 'to-transparent to-90% ')} rounded-full`}></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${accentColorClasses.replace('from-', 'from-transparent from-10% ').replace('to-', 'to-transparent to-90% ')} rounded-full animate-pulse`}></div>
            </div>
          </div>

          {/* Description with fade-in animation */}
          {description && (
            <div
              className={cn(
                "transition-all duration-700 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-white/90 font-light">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom decorative element */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "800ms" }}
        aria-hidden="true"
      ></div>
    </div>
  );
};