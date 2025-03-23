import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80",
        false: "",
      },
      dismissible: {
        true: "pr-1",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      interactive: false,
      dismissible: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  onClick?: () => void;
  onDismiss?: () => void;
}

export function Badge({
  className,
  variant,
  size,
  interactive,
  dismissible,
  onClick,
  onDismiss,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      role="status"
      className={cn(
        badgeVariants({ variant, size, interactive, dismissible }),
        className
      )}
      onClick={interactive ? onClick : undefined}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          type="button"
          className="ml-1 rounded-full hover:bg-background/20 p-0.5"
          onClick={(e:any) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          aria-label="Dismiss"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}