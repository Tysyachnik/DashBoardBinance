import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandleStickChart } from './candle-stick-chart';

describe('CandleStickChart', () => {
  let component: CandleStickChart;
  let fixture: ComponentFixture<CandleStickChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandleStickChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandleStickChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
