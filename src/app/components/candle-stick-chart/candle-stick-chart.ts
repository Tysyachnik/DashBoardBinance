import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart, ChartConfiguration, FinancialDataPoint, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Candle } from '../../shared/interfaces/candle';
import { CandleStickDataset } from '../../shared/types/candleStickDataset.type';
import { createCandlestickChartConfig } from '../../shared/constants/chart-config';

Chart.register(...registerables, CandlestickController, CandlestickElement, zoomPlugin);

@Component({
  selector: 'app-candle-stick-chart',
  imports: [],
  standalone: true,
  templateUrl: './candle-stick-chart.html',
  styleUrl: './candle-stick-chart.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandleStickChart implements OnDestroy, OnInit {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  series = input<Candle[]>([]);
  sma = input<(number | null)[]>([]);
  ema = input<(number | null)[]>([]);

  private chart!: Chart;

  constructor() {
    effect(() => {
      if (!this.canvas()) return;

      if (this.chart) {
        this.chart.destroy();
      }
      this.buildChart();
    });
  }

  ngOnInit(): void {
    window.addEventListener('theme-change', () => {
      this.updateChartColors();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('theme-change', this.updateChartColors.bind(this));
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

    const candleDataset = this.chart.data.datasets[0] as CandleStickDataset;
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
    const ctx = this.canvas().nativeElement.getContext('2d')!;

    const candleData = this.series().map((s) => ({
      x: typeof s.time === 'object' ? s.time.getTime() : s.time,
      o: s.open,
      h: s.high,
      l: s.low,
      c: s.close,
    }));

    const smaPoints = this.sma()
      .map((v, i) => {
        if (v === null) return null;
        const x = this.series()[i].time;
        return { x: typeof x === 'object' ? x.getTime() : x, y: v };
      })
      .filter(Boolean) as unknown[];

    const emaPoints = this.ema()
      .map((v, i) => {
        if (v === null) return null;
        const x = this.series()[i].time;
        return { x: typeof x === 'object' ? x.getTime() : x, y: v };
      })
      .filter(Boolean) as unknown[];

    this.chart = new Chart(
      ctx,
      createCandlestickChartConfig(candleData, smaPoints, emaPoints, this.getVar.bind(this))
    );
  }

  getVar(name: string) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }
}
