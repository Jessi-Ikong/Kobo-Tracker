import { Injectable, signal, computed } from '@angular/core';
import { type Transaction } from '../models/transaction.model';

const STORAGE_KEY = 'kobo-tracker.transactions';

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const transaction = value as Record<string, unknown>;

  return (
    typeof transaction['id'] === 'string' &&
    typeof transaction['description'] === 'string' &&
    (transaction['type'] === 'income' || transaction['type'] === 'expense') &&
    typeof transaction['amount'] === 'number' &&
    Number.isFinite(transaction['amount']) &&
    transaction['amount'] > 0 &&
    (transaction['category'] === undefined || typeof transaction['category'] === 'string') &&
    typeof transaction['date'] === 'string' &&
    !Number.isNaN(Date.parse(`${transaction['date']}T00:00:00`))
  );
}

function readStoredTransactions(): Transaction[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const storedTransactions: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(storedTransactions) ? storedTransactions.filter(isTransaction) : [];
  } catch {
    return [];
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  readonly transactions = signal<Transaction[]>(readStoredTransactions());

  // Calculate total income
  readonly totalIncome = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0),
  );

  // Calculate total expenses
  readonly totalExpenses = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0),
  );

  // Calculate available balance
  readonly totalBalance = computed(() => this.totalIncome() - this.totalExpenses());

  // Add a transaction
  addTransaction(transaction: Transaction): void {
    this.transactions.update((currentTransactions) => [...currentTransactions, transaction]);
    this.persistTransactions();
  }

  updateTransaction(updatedTransaction: Transaction): void {
    this.transactions.update((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    );
    this.persistTransactions();
  }

  deleteTransaction(id: string): void {
    this.transactions.update((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    );
    this.persistTransactions();
  }

  private persistTransactions(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.transactions()));
    } catch {
      // Storage may be disabled or full; in-memory transactions still work.
    }
  }
}
