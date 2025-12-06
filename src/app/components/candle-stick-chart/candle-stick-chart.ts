import {
  Component,
  ElementRef,
  input,
  Input,
  OnChanges,
  OnDestroy,
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
export class CandleStickChart implements OnChanges, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  series = input<any[]>([]);
  sma = input<(number | null)[]>([]);
  ema = input<(number | null)[]>([]);

  private chart!: Chart;

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

  private buildChart() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;

    const candleData = this.series().map((s) => ({
      x: typeof s.x === 'object' ? s.x.getTime() : s.x,
      o: s.y[0],
      h: s.y[1],
      l: s.y[2],
      c: s.y[3],
    }));
    console.log('ONE SERIES ITEM:', this.series()[0]);
    console.log(typeof this.series()[0].x);
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
            borderColor: '#333',
            borderWidth: 0.9,
            color: {
              up: '#22c55e',
              down: '#ef4444',
              unchanged: '#e5e7eb',
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
            borderColor: 'blue',
            borderDash: [5, 5],
          },
          {
            type: 'line',
            label: 'EMA',
            data: emaPoints,
            borderWidth: 2,
            pointRadius: 0,
            borderColor: 'orange',
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
            backgroundColor: '#222',
            titleColor: '#fff',
            borderColor: '#fff',
          },
          legend: {
            labels: {
              color: '#fff',
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
            grid: { color: '#444' },
            ticks: { color: '#141414ff' },
          },
          y: {
            position: 'right',
            grid: { color: '#444' },
            ticks: { color: '#181818ff' },
          },
        },
      },
    };
    this.chart = new Chart(ctx, config);
  }
}
