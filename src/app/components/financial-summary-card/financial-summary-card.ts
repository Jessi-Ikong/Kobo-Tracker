import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-financial-summary-card',
  imports: [CurrencyPipe],
  templateUrl: './financial-summary-card.html',
  styleUrl: './financial-summary-card.css',
})
export class FinancialSummaryCard {
  title = input.required<string>();
  amount = input.required<number>();

  type = input<'balance' | 'income' | 'expenses' | 'savings'>('balance');
}
