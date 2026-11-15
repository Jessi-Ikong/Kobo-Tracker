import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transactions',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  private readonly transactionService = inject(TransactionService);

  readonly transactions = this.transactionService.transactions;
  readonly search = signal('');
  readonly typeFilter = signal<'all' | 'income' | 'expense'>('all');
  readonly categoryFilter = signal('all');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly sortOrder = signal<'newest' | 'oldest'>('newest');
  readonly editingId = signal<string | null>(null);
  readonly categories = computed(() =>
    [
      ...new Set(
        this.transactions()
          .map((transaction) => transaction.category)
          .filter(Boolean),
      ),
    ].sort(),
  );
  readonly filteredTransactions = computed(() => {
    const searchTerm = this.search().trim().toLocaleLowerCase();
    const type = this.typeFilter();
    const category = this.categoryFilter();
    const from = this.dateFrom();
    const to = this.dateTo();

    return this.transactions()
      .filter(
        (transaction) =>
          !searchTerm || transaction.description.toLocaleLowerCase().includes(searchTerm),
      )
      .filter((transaction) => type === 'all' || transaction.type === type)
      .filter((transaction) => category === 'all' || transaction.category === category)
      .filter((transaction) => !from || transaction.date >= from)
      .filter((transaction) => !to || transaction.date <= to)
      .sort((first, second) =>
        this.sortOrder() === 'newest'
          ? second.date.localeCompare(first.date) || second.id.localeCompare(first.id)
          : first.date.localeCompare(second.date) || first.id.localeCompare(second.id),
      );
  });

  editDescription = '';
  editAmount: number | null = null;
  editType: 'income' | 'expense' = 'expense';
  editCategory = '';
  editDate = '';
  feedback = '';
  errorMessage = '';

  startEdit(transaction: Transaction): void {
    this.editingId.set(transaction.id);
    this.editDescription = transaction.description;
    this.editAmount = transaction.amount;
    this.editType = transaction.type;
    this.editCategory = transaction.category ?? '';
    this.editDate = transaction.date;
    this.feedback = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.errorMessage = '';
  }

  saveEdit(transaction: Transaction): void {
    this.errorMessage = '';

    if (!this.editDescription.trim() || !this.editDate) {
      this.errorMessage = 'Description and date are required.';
      return;
    }

    if (this.editAmount === null || !Number.isFinite(this.editAmount) || this.editAmount <= 0) {
      this.errorMessage = 'Enter an amount greater than ₦0.';
      return;
    }

    if (this.editType === 'expense' && !this.editCategory.trim()) {
      this.errorMessage = 'Enter a category for this expense.';
      return;
    }

    this.transactionService.updateTransaction({
      id: transaction.id,
      description: this.editDescription.trim(),
      amount: this.editAmount,
      type: this.editType,
      ...(this.editType === 'expense' ? { category: this.editCategory.trim() } : {}),
      date: this.editDate,
    });
    this.editingId.set(null);
    this.feedback = 'Transaction updated.';
  }

  deleteTransaction(transaction: Transaction): void {
    if (!window.confirm(`Delete “${transaction.description}”? This cannot be undone.`)) {
      return;
    }

    this.transactionService.deleteTransaction(transaction.id);
    this.feedback = 'Transaction deleted.';
    this.errorMessage = '';
  }
}
