"use client";

import type { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface VmDistributionItem {
  name: string;
  cpu: number;
  isIdle: boolean;
}

interface VmDistributionChartProps {
  data: VmDistributionItem[];
  height?: number;
}

export const VmDistributionChart: FC<VmDistributionChartProps> = ({ data, height = 280 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis
        dataKey="name"
        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
        angle={-30}
        textAnchor="end"
        height={60}
        axisLine={{ stroke: "hsl(var(--border))" }}
        tickLine={{ stroke: "hsl(var(--border))" }}
      />
      <YAxis
        domain={[0, 100]}
        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        unit="%"
        axisLine={{ stroke: "hsl(var(--border))" }}
        tickLine={{ stroke: "hsl(var(--border))" }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "hsl(var(--popover))",
          color: "hsl(var(--popover-foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
        }}
      />
      <Bar dataKey="cpu" name="CPU %" radius={[4, 4, 0, 0]}>
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.isIdle ? "hsl(var(--chart-idle))" : "hsl(var(--chart-cpu))"}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);
