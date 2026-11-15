import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FinancialSummaryCard } from '../../components/financial-summary-card/financial-summary-card';
import { TransactionForm } from '../../components/transaction-form/transaction-form';

import { IncomeExpenseChart } from '../../components/income-expense-chart/income-expense-chart';

import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrencyPipe,
    DatePipe,
    FinancialSummaryCard,
    IncomeExpenseChart,
    RouterLink,
    TransactionForm,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Connect to the TransactionService
  private readonly transactionService = inject(TransactionService);

  // Get calculated financial values from the service
  readonly totalBalance = this.transactionService.totalBalance;
  readonly totalIncome = this.transactionService.totalIncome;
  readonly totalExpenses = this.transactionService.totalExpenses;

  readonly totalSavings = computed(() => Math.max(0, this.totalBalance()));
  readonly recentTransactions = computed(() =>
    [...this.transactionService.transactions()]
      .sort((first, second) => second.date.localeCompare(first.date))
      .slice(0, 5),
  );
}
