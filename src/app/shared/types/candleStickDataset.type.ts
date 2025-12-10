import type { FinancialDataPoint, ChartDataset } from 'chart.js';
import 'chartjs-chart-financial';

export type CandleStickDataset = ChartDataset<'candlestick', FinancialDataPoint[]> & {
  color: { up: string; down: string; unchanged: string };
};
