import {
  Component,
  ElementRef,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart, ChartConfiguration, FinancialDataPoint, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, CandlestickController, CandlestickElement, zoomPlugin);

@Component({
  selector: 'app-candle-stick-chart',
  imports: [],
  standalone: true,
  templateUrl: './candle-stick-chart.html',
  styleUrl: './candle-stick-chart.less',
})
export class CandleStickChart implements OnChanges, OnDestroy, OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  series = input<any[]>([]);
  sma = input<(number | null)[]>([]);
  ema = input<(number | null)[]>([]);

  private chart!: Chart;

  ngOnInit(): void {
    window.addEventListener('theme-change', () => {
      this.updateChartColors();
    });
  }

  ngOnChanges(): void {
    if (!this.canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }
    this.buildChart();
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  updateChartColors() {
    const getVar = (v: string) => getComputedStyle(document.body).getPropertyValue(v).trim();

    const grid = getVar('--chart-grid');
    const axis = getVar('--chart-axis');

    this.chart.options.scales!['x']!.grid!.color = grid;
    this.chart.options.scales!['x']!.ticks!.color = axis;

    this.chart.options.scales!['y']!.grid!.color = grid;
    this.chart.options.scales!['y']!.ticks!.color = axis;

    const candleDataset = this.chart.data.datasets[0] as any;
    candleDataset.color.up = getVar('--candle-up');
    candleDataset.color.down = getVar('--candle-down');
    candleDataset.color.unchanged = getVar('--candle-unchanged');
    candleDataset.borderColor = getVar('--border');

    this.chart.data.datasets[1].borderColor = getVar('--sma');
    this.chart.data.datasets[2].borderColor = getVar('--ema');

    this.chart.options.plugins!.tooltip!.backgroundColor = getVar('--tooltip-bg');
    this.chart.options.plugins!.tooltip!.titleColor = getVar('--tooltip-text');
    this.chart.options.plugins!.tooltip!.borderColor = getVar('--tooltip-border');
    this.chart.options.plugins!.legend!.labels!.color = getVar('--legend-text');

    this.chart.update();
  }

  private buildChart() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;

    const candleData = this.series().map((s) => ({
      x: typeof s.x === 'object' ? s.x.getTime() : s.x,
      o: s.y[0],
      h: s.y[1],
      l: s.y[2],
      c: s.y[3],
    }));

    const smaPoints = this.sma()
      .map((v, i) => {
        if (v == null) return null;
        const x = this.series()[i].x;
        return { x: typeof x === 'object' ? x.getTime() : x, y: v };
      })
      .filter(Boolean) as any[];

    const emaPoints = this.ema()
      .map((v, i) => {
        if (v == null) return null;
        const x = this.series()[i].x;
        return { x: typeof x === 'object' ? x.getTime() : x, y: v };
      })
      .filter(Boolean) as any[];

    const config: ChartConfiguration<'candlestick', FinancialDataPoint[], unknown> = {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: 'Candles',
            data: candleData,
            borderColor: this.getVar('--border'),
            borderWidth: 0.9,
            color: {
              up: this.getVar('--candle-up'),
              down: this.getVar('--candle-down'),
              unchanged: this.getVar('--candle-unchanged'),
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
            borderColor: this.getVar('--sma'),
            borderDash: [5, 5],
          },
          {
            type: 'line',
            label: 'EMA',
            data: emaPoints,
            borderWidth: 2,
            pointRadius: 0,
            borderColor: this.getVar('--ema'),
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
            backgroundColor: this.getVar('--tooltip-bg'),
            titleColor: this.getVar('--tooltip-text'),
            borderColor: this.getVar('--tooltip-border'),
          },
          legend: {
            labels: {
              color: this.getVar('--legend-text'),
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
            grid: { color: this.getVar('--chart-grid') },
            ticks: { color: this.getVar('--chart-axis') },
          },
          y: {
            position: 'right',
            grid: { color: this.getVar('--chart-grid') },
            ticks: { color: this.getVar('--chart-axis') },
          },
        },
      },
    };
    this.chart = new Chart(ctx, config);
  }

  getVar(name: string) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }
}
