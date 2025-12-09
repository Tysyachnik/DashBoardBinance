import { Component, input } from '@angular/core';
import { DayStat } from '../../shared/interfaces/day-stat';

@Component({
  selector: 'app-day-statistic',
  standalone: true,
  imports: [],
  templateUrl: './day-statistic.html',
  styleUrl: './day-statistic.less',
})
export class DayStatistic {
  stat = input<DayStat | null>(null);
}
