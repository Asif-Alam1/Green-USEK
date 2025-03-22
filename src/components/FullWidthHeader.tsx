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
import React, { FunctionComponent, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  label: string;
  href: string;
}

export const FullWidthHeader: FunctionComponent<{
  title: string;
  description: string;
  breadcrumb?: BreadcrumbProps[];
  className?: string;
}> = ({ title, description, breadcrumb, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // First set it as loaded to trigger initial animations
    setIsLoaded(true);

    // Then make elements visible with a slight delay for sequential animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Split title into words for staggered animation
  const titleWords = title.split(" ");

  return (
    <div
      className={cn(
        "relative overflow-hidden py-16 lg:py-28 transition-all duration-700",
        "bg-black text-white shadow-xl",
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
          isLoaded ? "opacity-20 scale-100" : "opacity-0 scale-90"
        )}></div>



        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-1/2 h-64 w-full -translate-x-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Subtle dot pattern overlay */}
        <div className={cn(
          "absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] transition-opacity duration-1000 delay-700",
          isLoaded ? "opacity-30" : "opacity-0"
        )}></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Breadcrumb navigation with improved styling */}
        {breadcrumb && (
          <div className={cn(
            "transition-all duration-700 ease-in-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
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
        )}

        {/* Title section with staggered word animation */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 inline-block">
            {titleWords.map((word, index) => (
              <span
                key={index}
                className={cn(
                  "inline-block mx-1 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
                  "text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80",
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
          >
            <div className="relative h-1 w-32">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white to-white/0 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/80 to-white/0 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Description with fade-in animation */}
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
        </div>
      </div>

      {/* Subtle bottom decorative element */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "800ms" }}
      ></div>
    </div>
  );
};