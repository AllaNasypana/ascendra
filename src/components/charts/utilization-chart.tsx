'use client';

import type { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import type { ChartDataPoint } from '@/types/charts';

interface UtilizationChartProps {
  data: ChartDataPoint[];
  showRunningVms?: boolean;
  height?: number;
}

export const UtilizationChart: FC<UtilizationChartProps> = ({
  data,
  showRunningVms = false,
  height = 300,
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis
        dataKey="label"
        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
        axisLine={{ stroke: 'hsl(var(--border))' }}
        tickLine={{ stroke: 'hsl(var(--border))' }}
      />
      <YAxis
        domain={[0, 100]}
        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
        unit="%"
        axisLine={{ stroke: 'hsl(var(--border))' }}
        tickLine={{ stroke: 'hsl(var(--border))' }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: 'hsl(var(--popover))',
          color: 'hsl(var(--popover-foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
        }}
      />
      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
      <Line
        type="monotone"
        dataKey="cpu"
        name="CPU %"
        stroke="hsl(var(--chart-cpu))"
        strokeWidth={2}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="memory"
        name="Memory %"
        stroke="hsl(var(--chart-memory))"
        strokeWidth={2}
        dot={false}
      />
      {showRunningVms && (
        <Line
          type="monotone"
          dataKey="runningVms"
          name="Running VMs"
          stroke="hsl(var(--chart-warning))"
          strokeWidth={2}
          dot={false}
        />
      )}
    </LineChart>
  </ResponsiveContainer>
);
