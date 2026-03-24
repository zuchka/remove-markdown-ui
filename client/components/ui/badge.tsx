import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm hover:bg-primary/20 hover:border-primary/30",
        secondary:
          "glass-surface backdrop-blur-sm border border-glass-border text-foreground hover:glass-surface-elevated hover:border-glass-border-strong",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 backdrop-blur-sm hover:bg-destructive/20 hover:border-destructive/30",
        outline:
          "text-foreground bg-transparent border border-border hover:glass-surface hover:backdrop-blur-sm",
        gradient:
          "bg-gradient-primary text-white border-0 shadow-glow hover:shadow-glow-strong",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
