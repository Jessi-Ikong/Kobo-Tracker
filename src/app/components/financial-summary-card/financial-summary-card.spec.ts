import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialSummaryCard } from './financial-summary-card';

describe('FinancialSummaryCard', () => {
  let component: FinancialSummaryCard;
  let fixture: ComponentFixture<FinancialSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialSummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialSummaryCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Total Balance');
    fixture.componentRef.setInput('amount', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
