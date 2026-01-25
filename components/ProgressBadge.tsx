"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProgressBadgeProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBadge({ current, total, className }: ProgressBadgeProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const isComplete = current === total && total > 0;

  return (
    <Badge
      variant={isComplete ? "default" : "secondary"}
      className={cn("text-xs", className)}
    >
      {current}/{total} 完了 ({percentage}%)
    </Badge>
  );
}
