import type { ChartConfiguration, FinancialDataPoint } from 'chart.js';

export const createCandlestickChartConfig = (
  candleData: FinancialDataPoint[],
  smaPoints: unknown[],
  emaPoints: unknown[],
  getVar: (name: string) => string
): ChartConfiguration<'candlestick' | 'line', FinancialDataPoint[], unknown> => ({
  type: 'candlestick',
  data: {
    datasets: [
      {
        label: 'Candles',
        data: candleData,
        borderColor: getVar('--border'),
        borderWidth: 0.9,
        color: {
          up: getVar('--candle-up'),
          down: getVar('--candle-down'),
          unchanged: getVar('--candle-unchanged'),
        },
        barThickness: 'flex',
        barPercentage: 0.9,
        categoryPercentage: 0.8,
      },
      {
        type: 'line',
        label: 'SMA',
        data: smaPoints,
        borderWidth: 2,
        pointRadius: 0,
        borderColor: getVar('--sma'),
        borderDash: [5, 5],
      } as any,
      {
        type: 'line',
        label: 'EMA',
        data: emaPoints,
        borderWidth: 2,
        pointRadius: 0,
        borderColor: getVar('--ema'),
      } as any,
    ],
  },
  options: {
    responsive: true,
    animation: false,
    parsing: false,
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: getVar('--tooltip-bg'),
        titleColor: getVar('--tooltip-text'),
        bodyColor: getVar('--tooltip-text'),
        borderColor: getVar('--tooltip-border'),
      },
      legend: {
        labels: {
          color: getVar('--legend-text'),
        },
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: { unit: 'minute' },
        grid: { color: getVar('--chart-grid') },
        ticks: { color: getVar('--chart-axis') },
      },
      y: {
        position: 'right',
        grid: { color: getVar('--chart-grid') },
        ticks: { color: getVar('--chart-axis') },
      },
    },
  },
});
