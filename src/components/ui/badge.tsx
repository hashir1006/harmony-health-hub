import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        critical: "border-transparent bg-critical text-critical-foreground",
        // Priority badges for triage
        "priority-critical": "border-transparent bg-critical text-critical-foreground animate-pulse",
        "priority-medium": "border-transparent bg-warning text-warning-foreground",
        "priority-normal": "border-transparent bg-success text-success-foreground",
        // Status badges
        scheduled: "border-transparent bg-primary/20 text-primary",
        completed: "border-transparent bg-success/20 text-success",
        cancelled: "border-transparent bg-muted text-muted-foreground",
        pending: "border-transparent bg-warning/20 text-warning",
        paid: "border-transparent bg-success/20 text-success",
        overdue: "border-transparent bg-critical/20 text-critical",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
