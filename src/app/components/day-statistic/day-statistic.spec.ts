import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayStatistic } from './day-statistic';

describe('DayStatistic', () => {
  let component: DayStatistic;
  let fixture: ComponentFixture<DayStatistic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayStatistic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayStatistic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
