export interface Transaction {
  id: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category?: string;
  date: string;
}
