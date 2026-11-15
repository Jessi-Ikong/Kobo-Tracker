import { TestBed } from '@angular/core/testing';
import { type Transaction } from '../models/transaction.model';

import { TransactionService } from './transaction';

describe('TransactionService', () => {
  let service: TransactionService;

  const sampleTransaction: Transaction = {
    id: 'transaction-1',
    description: 'Payday',
    type: 'income',
    amount: 120000,
    date: '2026-11-13',
  };

  beforeEach(() => {
    localStorage.removeItem('kobo-tracker.transactions');
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds transactions, updates totals, and persists them', () => {
    service.addTransaction(sampleTransaction);

    expect(service.totalIncome()).toBe(120000);
    expect(JSON.parse(localStorage.getItem('kobo-tracker.transactions') ?? '[]')).toEqual([
      sampleTransaction,
    ]);
  });

  it('updates and deletes transactions', () => {
    service.addTransaction(sampleTransaction);
    service.updateTransaction({ ...sampleTransaction, amount: 140000 });

    expect(service.totalIncome()).toBe(140000);

    service.deleteTransaction(sampleTransaction.id);

    expect(service.transactions()).toEqual([]);
    expect(service.totalIncome()).toBe(0);
  });

  it('ignores malformed stored data', () => {
    localStorage.setItem('kobo-tracker.transactions', '{invalid');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const restoredService = TestBed.inject(TransactionService);

    expect(restoredService.transactions()).toEqual([]);
  });
});
