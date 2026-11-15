import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  effect,
  inject,
} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { TransactionService } from '../../services/transaction';

Chart.register(...registerables);

@Component({
  selector: 'app-income-expense-chart',
  imports: [],
  templateUrl: './income-expense-chart.html',
  styleUrl: './income-expense-chart.css',
})
export class IncomeExpenseChart implements AfterViewInit, OnDestroy {
  @ViewChild('incomeExpenseCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private readonly transactionService = inject(TransactionService);
  private readonly syncChartWithTransactions = effect(() => {
    const monthlyTotals = this.getMonthlyTotals(this.transactionService.transactions());

    if (!this.chart) {
      return;
    }

    this.chart.data.labels = monthlyTotals.labels;
    this.chart.data.datasets[0].data = monthlyTotals.income;
    this.chart.data.datasets[1].data = monthlyTotals.expenses;
    this.chart.update();
  });

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart(): void {
    const monthlyTotals = this.getMonthlyTotals(this.transactionService.transactions());

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',

      data: {
        labels: monthlyTotals.labels,

        datasets: [
          {
            label: 'Income',
            data: monthlyTotals.income,
            backgroundColor: '#16a36a',
            borderRadius: 6,
          },
          {
            label: 'Expenses',
            data: monthlyTotals.expenses,
            backgroundColor: '#dc6464',
            borderRadius: 6,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            position: 'top',
          },
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '₦' + Number(value).toLocaleString(),
            },
          },
        },
      },
    });
  }

  private getMonthlyTotals(transactions: ReturnType<TransactionService['transactions']>) {
    const currentDate = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5 + index, 1);

      return {
        key: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`,
        label: monthDate.toLocaleString('en-US', { month: 'short' }),
        income: 0,
        expenses: 0,
      };
    });

    for (const transaction of transactions) {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);
      const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      const month = months.find((entry) => entry.key === monthKey);

      if (month) {
        if (transaction.type === 'income') {
          month.income += transaction.amount;
        } else {
          month.expenses += transaction.amount;
        }
      }
    }

    return {
      labels: months.map((month) => month.label),
      income: months.map((month) => month.income),
      expenses: months.map((month) => month.expenses),
    };
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
