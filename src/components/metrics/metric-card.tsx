import type { FC } from "react";
import { cn } from "@/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  className?: string;
}

export const MetricCard: FC<MetricCardProps> = ({ title, value, subtitle, trend, className }) => (
  <div className={cn("metric-panel", className)}>
    <p className="metric-panel-title">{title}</p>
    <p className="metric-panel-value">{value}</p>
    {(subtitle ?? trend) && (
      <p className="metric-panel-subtitle">
        {subtitle}
        {trend && (
          <span className="ml-1 text-success" style={{ color: "hsl(var(--success))" }}>
            {trend}
          </span>
        )}
      </p>
    )}
  </div>
);
