import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairDetails } from './pair-details';

describe('PairDetails', () => {
  let component: PairDetails;
  let fixture: ComponentFixture<PairDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PairDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PairDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
