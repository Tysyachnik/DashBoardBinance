<<<<<<< HEAD
import { Component, input } from '@angular/core';
=======
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
>>>>>>> pr-branch-2
import { DayStat } from '../../shared/interfaces/day-stat';

@Component({
  selector: 'app-day-statistic',
  standalone: true,
  imports: [],
  templateUrl: './day-statistic.html',
  styleUrl: './day-statistic.less',
<<<<<<< HEAD
=======
  changeDetection: ChangeDetectionStrategy.OnPush,
>>>>>>> pr-branch-2
})
export class DayStatistic {
  stat = input<DayStat | null>(null);
}
