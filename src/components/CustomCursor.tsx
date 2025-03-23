"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  // Use refs instead of state to avoid re-renders
  const cursorRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const isHoveringRef = useRef(false);
  const isMobileRef = useRef(false);

  // Refs for position tracking without state updates
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });

  // Animation frame reference for proper cleanup
  const animationFrameRef = useRef<number | null>(null);

  // Detect mobile devices once on mount
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.matchMedia("(max-width: 768px)").matches ||
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Apply or remove cursor styles based on device type
      if (isMobileRef.current) {
        document.documentElement.classList.remove('custom-cursor-enabled');
      } else {
        document.documentElement.classList.add('custom-cursor-enabled');
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, []);

  // Set up all mouse event handlers and animation loop
  useEffect(() => {
    if (isMobileRef.current || !cursorRef.current) return;

    // Configuration for cursor behavior
    const config = {
      smoothFactor: 0.20,      // Higher = more responsive but less smooth (0.05-0.15 range)
      scaleAmount: 1.5,        // How much the cursor scales on hover
      transitionSpeed: 100,    // Speed of cursor transitions in ms
    };

    // Track raw mouse position without triggering renders
    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isVisibleRef.current = true;
      updateCursorVisibility();
    };

    // Detect hoverable elements
    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const wasHovering = isHoveringRef.current;

      isHoveringRef.current =
        target.closest('a, button, [role="button"], input[type="button"], select, .cursor-pointer, [onclick]') !== null ||
        getComputedStyle(target).cursor === 'pointer';

      // Only update if hover state changed to avoid unnecessary DOM operations
      if (wasHovering !== isHoveringRef.current) {
        updateCursorAppearance();
      }
    };

    // Visibility handlers
    const onMouseEnter = () => {
      isVisibleRef.current = true;
      updateCursorVisibility();
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      updateCursorVisibility();
    };

    // Direct DOM updates for performance
    const updateCursorVisibility = () => {
      if (!cursorRef.current) return;

      cursorRef.current.style.opacity = isVisibleRef.current ? '1' : '0';
    };

    const updateCursorAppearance = () => {
      if (!cursorRef.current) return;

      // Update cursor appearance based on hover state
      if (isHoveringRef.current) {
        cursorRef.current.style.backgroundImage = "url('/leaf.png')";
        cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0) scale(${config.scaleAmount})`;
      } else {
        cursorRef.current.style.backgroundImage = "url('/globe.png')";
        cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0) scale(1)`;
      }
    };

    // Optimized animation function using precise timing
    const animateCursor = () => {
      // Calculate smooth movement - higher factor = faster but less smooth
      const dx = mousePosition.current.x - cursorPosition.current.x;
      const dy = mousePosition.current.y - cursorPosition.current.y;

      // Only update position if there's noticeable movement to reduce calculations
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        cursorPosition.current.x += dx * config.smoothFactor;
        cursorPosition.current.y += dy * config.smoothFactor;

        if (cursorRef.current) {
          // Direct style manipulation for performance - using hardware acceleration
          cursorRef.current.style.transform = isHoveringRef.current
            ? `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0) scale(${config.scaleAmount})`
            : `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0) scale(1)`;
        }
      }

      // Use requestAnimationFrame for optimal timing aligned with browser refresh rate
      animationFrameRef.current = requestAnimationFrame(animateCursor);
    };

    // Set initial position to avoid "jump" on first mouse move
    if (cursorRef.current) {
      // Position cursor at center of screen initially
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight / 2;
      mousePosition.current = { x: initialX, y: initialY };
      cursorPosition.current = { x: initialX, y: initialY };
      cursorRef.current.style.opacity = '0';

      // Set initial position
      cursorRef.current.style.transform = `translate3d(${initialX}px, ${initialY}px, 0)`;

      // Configure transition and positioning
      cursorRef.current.style.transition = `opacity ${config.transitionSpeed}ms ease, transform ${config.transitionSpeed}ms ease, background-image 0.2s ease`;
    }

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animateCursor);

    // Set up event listeners
    document.addEventListener("mousemove", updateMousePosition, { passive: true });
    document.addEventListener("mouseover", updateHoverState, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseover", updateHoverState);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Don't render cursor component on mobile devices
  if (typeof window !== 'undefined' && isMobileRef.current) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        aria-hidden="true"
      />

      {/* Optimized global styles with will-change for better performance */}
      <style jsx global>{`
        .custom-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          width: 24px;
          height: 24px;
          margin-left: -16px;
          margin-top: -16px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          will-change: transform, opacity;
          opacity: 0;
          left: 0;
          top: 0;
          // Use hardware acceleration for smoother rendering
          transform: translate3d(0, 0, 0);
        }

        /* Hide default cursor only when custom cursor is enabled (desktop) */
        .custom-cursor-enabled,
        .custom-cursor-enabled a,
        .custom-cursor-enabled button,
        .custom-cursor-enabled [role="button"],
        .custom-cursor-enabled .cursor-pointer,
        .custom-cursor-enabled *[onclick] {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}

export default CustomCursor;