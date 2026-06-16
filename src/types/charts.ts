export interface ChartDataPoint {
  label: string;
  cpu: number;
  memory: number;
  runningVms?: number;
}

export interface FleetChartDataPoint extends ChartDataPoint {
  runningVms: number;
}
