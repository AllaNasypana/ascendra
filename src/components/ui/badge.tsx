import type { FC, HTMLAttributes } from "react";
import { cn } from "@/utils";
import type { VMStatus } from "@/types";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary";
  status?: VMStatus;
}

export const Badge: FC<BadgeProps> = ({ className, variant = "default", status, ...props }) => {
  if (status) {
    return (
      <span data-status={status} className={cn("status-badge", className)} {...props} />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground",
        variant === "outline" && "text-foreground",
        className
      )}
      {...props}
    />
  );
};
