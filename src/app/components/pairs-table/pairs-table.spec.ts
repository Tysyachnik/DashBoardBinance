import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairsTable } from './pairs-table';

describe('PairsTable', () => {
  let component: PairsTable;
  let fixture: ComponentFixture<PairsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PairsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PairsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
