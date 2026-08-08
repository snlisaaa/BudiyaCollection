export interface Transaction {
  id: string;
  type: 'modal' | 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: 'Cash' | 'Transfer' | 'E-Wallet';
  createdAt: string;
}

export interface UserSettings {
  currency: string;
  monthlyRevenueTarget: number;
  monthlyBudgetLimit: number;
  theme: 'light' | 'dark';
}

export interface FinancialHealthMetrics {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  score: number;
  runwayMonths: number;
  burnRate: number;
  profitMargin: number;
}
