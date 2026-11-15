import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  imports: [FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  description = '';
  amount: number | null = null;
  type: 'income' | 'expense' = 'expense';
  category = '';
  date = new Date().toISOString().split('T')[0];
  successMessage = '';
  errorMessage = '';

  constructor(private transactionService: TransactionService) {}

  addTransaction(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.description.trim() || !this.date) {
      this.errorMessage = 'Complete the description and date fields.';
      return;
    }

    if (this.type === 'expense' && !this.category.trim()) {
      this.errorMessage = 'Enter a category for this expense.';
      return;
    }

    if (this.amount === null || !Number.isFinite(this.amount) || this.amount <= 0) {
      this.errorMessage = 'Enter an amount greater than ₦0.';
      return;
    }

    this.transactionService.addTransaction({
      id: crypto.randomUUID(),
      description: this.description.trim(),
      type: this.type,
      amount: this.amount,
      ...(this.type === 'expense' ? { category: this.category.trim() } : {}),
      date: this.date,
    });

    this.description = '';
    this.amount = null;
    this.type = 'expense';
    this.category = '';
    this.date = new Date().toISOString().split('T')[0];
    this.successMessage = 'Transaction added successfully.';
  }

  onTypeChange(type: 'income' | 'expense'): void {
    this.type = type;
    this.errorMessage = '';

    if (type === 'income') {
      this.category = '';
    }
  }
}
