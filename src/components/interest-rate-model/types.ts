export interface InterestRateChartProps {
  baseRate: string;
  optimalUtilization: string;
  rateAtOptimal: string;
  maxRate: string;
  currentUtilization: string;
  currentBorrowRate: string;
  reserveFactor: string;
}

export interface ChartDataPoint {
  utilization: number;
  borrowRate: number;
  supplyRate: number;
}

export interface RateParams {
  baseRate: number;
  optimalUtilization: number;
  rateAtOptimal: number;
  maxRate: number;
  reserveFactor: number;
}
