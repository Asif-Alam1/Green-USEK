"use client"

import * as React from "react"
import { X, AlertCircle, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends Omit<React.ComponentPropsWithoutRef<"textarea">, "onChange"> {
  /**
   * Optional error message to display
   */
  error?: string;

  /**
   * Optional success message to display
   */
  success?: string;

  /**
   * Enable auto-resize functionality that adjusts height based on content
   */
  autoResize?: boolean;

  /**
   * Show a character count indicator
   */
  showCount?: boolean;

  /**
   * Maximum character limit
   */
  maxLength?: number;

  /**
   * Show clear button to empty textarea
   */
  clearable?: boolean;

  /**
   * Maximum height for auto-resize (in pixels)
   */
  maxHeight?: number;

  /**
   * Callback when textarea content changes
   */
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  error,
  success,
  autoResize = false,
  showCount = false,
  maxLength,
  clearable = false,
  maxHeight,
  onChange,
  required,
  disabled,
  value,
  defaultValue,
  ...props
}, ref) => {
  // Use internal state to track value for character count and auto-resize
  const [internalValue, setInternalValue] = React.useState<string>(
    (value as string) || defaultValue as string || ""
  );

  // Create ref for the textarea element if none is provided
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const resolvedRef = ref || textareaRef;

  // Forward ref handling
  const assignRef = React.useCallback((element: HTMLTextAreaElement) => {
    // Handle the case where ref is a function
    if (typeof resolvedRef === 'function') {
      resolvedRef(element);
    }
    // Handle the case where ref is a ref object
    else if (resolvedRef) {
      (resolvedRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
    }

    // Store locally for internal use
    textareaRef.current = element;
  }, [resolvedRef]);

  // Auto-resize logic
  const adjustHeight = React.useCallback(() => {
    const element = textareaRef.current;
    if (!element || !autoResize) return;

    // Temporarily collapse the textarea to get the proper scrollHeight
    element.style.height = "auto";

    // Calculate new height with a small buffer to prevent scrollbar flashing
    const newHeight = element.scrollHeight + 2;

    // Apply max height constraint if specified
    if (maxHeight && newHeight > maxHeight) {
      element.style.height = `${maxHeight}px`;
      element.style.overflowY = "auto";
    } else {
      element.style.height = `${newHeight}px`;
      element.style.overflowY = "hidden";
    }
  }, [autoResize, maxHeight]);

  // Handle value change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Update internal state
    setInternalValue(newValue);

    // Call user's onChange handler with new value and event
    if (onChange) {
      onChange(newValue, e);
    }

    // Adjust height if auto-resize is enabled
    if (autoResize) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(adjustHeight, 0);
    }
  };

  // Handle clearing the textarea
  const handleClear = () => {
    // Update internal state
    setInternalValue("");

    // Update the actual textarea value
    if (textareaRef.current) {
      textareaRef.current.value = "";

      // Trigger synthetic event to ensure forms pick up the change
      const event = new Event("input", { bubbles: true });
      textareaRef.current.dispatchEvent(event);

      // Focus the textarea after clearing
      textareaRef.current.focus();

      // Adjust height if auto-resize is enabled
      if (autoResize) {
        adjustHeight();
      }
    }

    // Call user's onChange handler with empty value
    if (onChange) {
      // Create synthetic event
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      onChange("", syntheticEvent);
    }
  };

  // Apply auto-resize on initial render and value changes
  React.useEffect(() => {
    if (autoResize) {
      adjustHeight();
    }
  }, [internalValue, autoResize, adjustHeight]);

  // Sync internal value with external controlled value
  React.useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value as string);
    }
  }, [value, internalValue]);

  // Calculate character count and limit states
  const charactersUsed = internalValue?.length || 0;
  const isApproachingLimit = maxLength ? charactersUsed >= maxLength * 0.8 : false;
  const isAtLimit = maxLength ? charactersUsed >= maxLength : false;

  // Generate status classes
  const getStatusClasses = () => {
    if (error) return "border-destructive focus-visible:ring-destructive/30";
    if (success) return "border-success focus-visible:ring-success/30";
    return "";
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <textarea
          ref={assignRef}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            autoResize && "overflow-y-hidden resize-none",
            getStatusClasses(),
            clearable && internalValue?.length > 0 && "pr-8",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${props.id || props.name}-error` :
            success ? `${props.id || props.name}-success` : undefined
          }
          style={{
            // Only set maxHeight if autoResize is disabled (otherwise handled in adjustHeight)
            maxHeight: !autoResize && maxHeight ? `${maxHeight}px` : undefined,
          }}
          {...props}
        />

        {clearable && internalValue?.length > 0 && (
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted"
            onClick={handleClear}
            aria-label="Clear text"
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Error, success, and character count row */}
      {(error || success || (showCount && maxLength)) && (
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center">
            {error && (
              <div id={`${props.id || props.name}-error`} className="flex items-center text-destructive">
                <AlertCircle className="mr-1 h-3.5 w-3.5" />
                <span>{error}</span>
              </div>
            )}
            {!error && success && (
              <div id={`${props.id || props.name}-success`} className="flex items-center text-success">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                <span>{success}</span>
              </div>
            )}
          </div>

          {showCount && maxLength && (
            <div className={cn(
              "text-muted-foreground",
              isApproachingLimit && !isAtLimit && "text-warning",
              isAtLimit && "text-destructive font-medium"
            )}>
              {charactersUsed}/{maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }