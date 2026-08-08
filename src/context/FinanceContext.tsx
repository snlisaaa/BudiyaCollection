import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Transaction, UserSettings, FinancialHealthMetrics } from '../types';

interface FinanceContextType {
  transactions: Transaction[];
  settings: UserSettings;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  
  // Derived state
  totals: {
    modal: number;
    income: number;
    expense: number;
    balance: number;
    netProfit: number;
  };
  today: {
    income: number;
    expense: number;
    netProfit: number;
    incomeCount: number;
    expenseCount: number;
  };
  stats: {
    monthlyIncome: number;
    monthlyExpense: number;
    avgDailyIncome: number;
    highestIncomeDay: { date: string; amount: number } | null;
    topExpenseCategory: { category: string; amount: number } | null;
  };
  healthMetrics: FinancialHealthMetrics;
  insights: string[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Helper to format date relative to today
const getRelativeDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const DEFAULT_SETTINGS: UserSettings = {
  currency: 'IDR',
  monthlyRevenueTarget: 15000000,
  monthlyBudgetLimit: 8000000,
  theme: 'light',
};

const generateDemoTransactions = (): Transaction[] => {
  const txs: Transaction[] = [];

  // Seed capital/modal
  txs.push({
    id: 'cap-1',
    type: 'modal',
    amount: 15000000,
    category: 'Modal Awal',
    description: 'Tabungan modal awal usaha',
    date: getRelativeDateString(-30),
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  });

  txs.push({
    id: 'cap-2',
    type: 'modal',
    amount: 5000000,
    category: 'Tambahan Modal',
    description: 'Tambahan modal untuk bahan baku & kain katun elastis konveksi',
    date: getRelativeDateString(-15),
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
  });

  // Seed income (last 30 days)
  const incomeSources = ['Grosir Pakaian Dalam', 'Penjualan Online (Eceran)', 'Penjualan Offline', 'Custom CD/Bra/Korset'];
  const incomeDescs = [
    'Penjualan 3 Lusin Lingerie Satin',
    'Orderan Shopee Celana Dalam Seamless',
    'Penjualan Bra Menyusui & Korset',
    'Custom order pakaian dalam pengantin (bridal lingerie)',
    'Penjualan Singlet & Kaos Dalam Katun',
    'Orderan TikTok Shop Seamless Bra Set',
  ];
  
  // Daily random sales
  for (let i = -29; i <= 0; i++) {
    const isWeekend = new Date(getRelativeDateString(i)).getDay() % 6 === 0;
    const probability = isWeekend ? 0.8 : 0.6; // Higher sales on weekend
    
    if (Math.random() < probability) {
      const numSales = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numSales; j++) {
        const amount = Math.floor(Math.random() * 4 + 1) * 150000 + (Math.random() < 0.2 ? 300000 : 0); // 150k to 900k
        const paymentMethod = Math.random() < 0.4 ? 'Cash' : Math.random() < 0.7 ? 'Transfer' : 'E-Wallet';
        
        txs.push({
          id: `inc-${i}-${j}`,
          type: 'income',
          amount,
          category: incomeSources[Math.floor(Math.random() * incomeSources.length)],
          description: incomeDescs[Math.floor(Math.random() * incomeDescs.length)],
          date: getRelativeDateString(i),
          paymentMethod: paymentMethod as any,
          createdAt: new Date(new Date().setDate(new Date().getDate() + i)).toISOString(),
        });
      }
    }
  }

  // Seed expenses
  // Stock purchase
  txs.push({
    id: 'exp-1',
    type: 'expense',
    amount: 6500000,
    category: 'Pembelian bahan konveksi',
    description: 'Pembelian gulungan katun combed & kain spandex',
    date: getRelativeDateString(-28),
    paymentMethod: 'Transfer',
    createdAt: new Date(Date.now() - 28 * 24 * 3600000).toISOString(),
  });

  txs.push({
    id: 'exp-2',
    type: 'expense',
    amount: 3000000,
    category: 'Pembelian bahan konveksi',
    description: 'Pre-order bahan lace brukat & cup busa bra',
    date: getRelativeDateString(-12),
    paymentMethod: 'Transfer',
    createdAt: new Date(Date.now() - 12 * 24 * 3600000).toISOString(),
  });

  // Marketing (Facebook Ads)
  txs.push({
    id: 'exp-3',
    type: 'expense',
    amount: 800000,
    category: 'Marketing',
    description: 'Iklan Instagram & TikTok Ads',
    date: getRelativeDateString(-25),
    paymentMethod: 'E-Wallet',
    createdAt: new Date(Date.now() - 25 * 24 * 3600000).toISOString(),
  });

  txs.push({
    id: 'exp-4',
    type: 'expense',
    amount: 500000,
    category: 'Marketing',
    description: 'Endorsement micro-influencer underwear/lingerie',
    date: getRelativeDateString(-10),
    paymentMethod: 'Transfer',
    createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
  });

  // Packaging
  txs.push({
    id: 'exp-5',
    type: 'expense',
    amount: 450000,
    category: 'Packaging',
    description: 'Beli polymailer custom logo & pita satin',
    date: getRelativeDateString(-22),
    paymentMethod: 'E-Wallet',
    createdAt: new Date(Date.now() - 22 * 24 * 3600000).toISOString(),
  });

  // Rent / Operational
  txs.push({
    id: 'exp-6',
    type: 'expense',
    amount: 1200000,
    category: 'Operasional',
    description: 'Sewa ruko/gudang bulanan + Listrik',
    date: getRelativeDateString(-20),
    paymentMethod: 'Transfer',
    createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString(),
  });

  // Wages
  txs.push({
    id: 'exp-7',
    type: 'expense',
    amount: 1500000,
    category: 'Gaji',
    description: 'Gaji admin packing & sosmed part-time',
    date: getRelativeDateString(-5),
    paymentMethod: 'Transfer',
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  });

  // Delivery
  txs.push({
    id: 'exp-8',
    type: 'expense',
    amount: 180000,
    category: 'Pengiriman',
    description: 'Drop off paket Shopee J&T pick-up fee',
    date: getRelativeDateString(-14),
    paymentMethod: 'Cash',
    createdAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
  });

  // Ensure some transaction today for visual validation
  const todayStr = getRelativeDateString(0);
  txs.push({
    id: 'inc-today-1',
    type: 'income',
    amount: 450000,
    category: 'Penjualan Online (Eceran)',
    description: '2 Lusin Seamless Panties (Premium Series)',
    date: todayStr,
    paymentMethod: 'Transfer',
    createdAt: new Date().toISOString(),
  });

  txs.push({
    id: 'inc-today-2',
    type: 'income',
    amount: 250000,
    category: 'Grosir Pakaian Dalam',
    description: '1 Lusin Korset Pembentuk Tubuh',
    date: todayStr,
    paymentMethod: 'Cash',
    createdAt: new Date(Date.now() - 1000 * 3600).toISOString(),
  });

  txs.push({
    id: 'exp-today-1',
    type: 'expense',
    amount: 120000,
    category: 'Packaging',
    description: 'Beli kertas kado & box hampers custom',
    date: todayStr,
    paymentMethod: 'E-Wallet',
    createdAt: new Date().toISOString(),
  });

  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Initialize state from localstorage or use seeded data on first load
  useEffect(() => {
    const savedTxs = localStorage.getItem('budiyah_transactions');
    const savedSettings = localStorage.getItem('budiyah_settings');

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }

    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch (e) {
        console.error('Failed to parse transactions', e);
      }
    } else {
      // First-time visit: Seed with demo transactions automatically
      const demo = generateDemoTransactions();
      setTransactions(demo);
      localStorage.setItem('budiyah_transactions', JSON.stringify(demo));
    }
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const saveTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    localStorage.setItem('budiyah_transactions', JSON.stringify(newTxs));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    saveTransactions(updated);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    const updated = transactions.map((tx) =>
      tx.id === id ? { ...tx, ...updatedFields } as Transaction : tx
    );
    saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    saveTransactions(updated);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('budiyah_settings', JSON.stringify(updated));
  };

  const loadDemoData = () => {
    const demo = generateDemoTransactions();
    saveTransactions(demo);
  };

  const clearAllData = () => {
    saveTransactions([]);
  };

  // CALCULATE DERIVED STATE
  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'modal') acc.modal += tx.amount;
      if (tx.type === 'income') acc.income += tx.amount;
      if (tx.type === 'expense') acc.expense += tx.amount;
      return acc;
    },
    { modal: 0, income: 0, expense: 0, balance: 0, netProfit: 0 }
  );
  totals.netProfit = totals.income - totals.expense;
  totals.balance = totals.modal + totals.income - totals.expense;

  // Today's stats
  const todayStr = new Date().toISOString().split('T')[0];
  const today = transactions.reduce(
    (acc, tx) => {
      if (tx.date === todayStr) {
        if (tx.type === 'income') {
          acc.income += tx.amount;
          acc.incomeCount += 1;
        }
        if (tx.type === 'expense') {
          acc.expense += tx.amount;
          acc.expenseCount += 1;
        }
      }
      return acc;
    },
    { income: 0, expense: 0, netProfit: 0, incomeCount: 0, expenseCount: 0 }
  );
  today.netProfit = today.income - today.expense;

  // Monthly breakdown and advanced stats
  const currentMonthStr = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  
  const monthlyTxs = transactions.filter(tx => tx.date.startsWith(currentMonthStr));
  const monthlyIncome = monthlyTxs.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyExpense = monthlyTxs.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

  // Income daily average (excluding today)
  const incomeTxs = transactions.filter(tx => tx.type === 'income');
  const uniqueIncomeDays = Array.from(new Set(incomeTxs.map(tx => tx.date)));
  const avgDailyIncome = uniqueIncomeDays.length > 0 
    ? incomeTxs.reduce((sum, tx) => sum + tx.amount, 0) / uniqueIncomeDays.length
    : 0;

  // Highest income day
  const incomeByDay = incomeTxs.reduce((acc: { [key: string]: number }, tx) => {
    acc[tx.date] = (acc[tx.date] || 0) + tx.amount;
    return acc;
  }, {});
  let highestIncomeDay: { date: string; amount: number } | null = null;
  for (const [date, amount] of Object.entries(incomeByDay)) {
    if (!highestIncomeDay || amount > highestIncomeDay.amount) {
      highestIncomeDay = { date, amount };
    }
  }

  // Top expense category
  const expenseTxs = transactions.filter(tx => tx.type === 'expense');
  const expenseByCat = expenseTxs.reduce((acc: { [key: string]: number }, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  let topExpenseCategory: { category: string; amount: number } | null = null;
  for (const [category, amount] of Object.entries(expenseByCat)) {
    if (!topExpenseCategory || amount > topExpenseCategory.amount) {
      topExpenseCategory = { category, amount };
    }
  }

  // Financial health metrics
  const profitMargin = totals.income > 0 ? (totals.netProfit / totals.income) * 100 : 0;
  const burnRate = expenseTxs.length > 0 && uniqueIncomeDays.length > 0
    ? (totals.expense / (uniqueIncomeDays.length / 30)) // normalized monthly expense
    : 0;
  const runwayMonths = burnRate > 0 ? totals.balance / burnRate : 99;

  let score = 50; // base score
  if (profitMargin > 20) score += 20;
  if (profitMargin > 40) score += 10;
  if (totals.balance > burnRate * 3) score += 20; // 3 months runway
  if (monthlyExpense > settings.monthlyBudgetLimit) score -= 15;
  if (monthlyIncome > settings.monthlyRevenueTarget) score += 10;
  score = Math.max(0, Math.min(100, score));

  let healthStatus: FinancialHealthMetrics['status'] = 'good';
  if (score > 80) healthStatus = 'excellent';
  else if (score >= 50) healthStatus = 'good';
  else if (score >= 30) healthStatus = 'warning';
  else healthStatus = 'critical';

  const healthMetrics: FinancialHealthMetrics = {
    status: healthStatus,
    score,
    runwayMonths,
    burnRate,
    profitMargin,
  };

  // Generate automated insights (text paragraphs)
  const insights: string[] = [];
  
  if (monthlyIncome >= settings.monthlyRevenueTarget) {
    insights.push(`🎉 Selamat! Budiyah Collection telah mencapai target pendapatan bulanan sebesar Rp ${settings.monthlyRevenueTarget.toLocaleString('id-ID')}. Performa penjualan sangat baik.`);
  } else {
    const percentage = Math.round((monthlyIncome / settings.monthlyRevenueTarget) * 100);
    insights.push(`📈 Pendapatan bulan ini baru mencapai ${percentage}% dari target bulanan Rp ${settings.monthlyRevenueTarget.toLocaleString('id-ID')}. Butuh Rp ${(settings.monthlyRevenueTarget - monthlyIncome).toLocaleString('id-ID')} lagi.`);
  }

  if (monthlyExpense > settings.monthlyBudgetLimit) {
    insights.push(`⚠️ Pengeluaran bulan ini sebesar Rp ${monthlyExpense.toLocaleString('id-ID')} telah MELEBIHI batas anggaran bulanan Rp ${settings.monthlyBudgetLimit.toLocaleString('id-ID')}. Harap kurangi pengeluaran operasional non-esensial.`);
  } else if (monthlyExpense > settings.monthlyBudgetLimit * 0.8) {
    insights.push(`🔔 Pengeluaran operasional mendekati batas anggaran bulanan (${Math.round((monthlyExpense / settings.monthlyBudgetLimit) * 100)}%). Tetap pantau pengeluaran Anda.`);
  } else {
    insights.push(`🟢 Anggaran terkontrol dengan baik. Sisa budget pengeluaran bulan ini: Rp ${(settings.monthlyBudgetLimit - monthlyExpense).toLocaleString('id-ID')}.`);
  }

  if (topExpenseCategory) {
    const expensePercentage = totals.expense > 0 ? Math.round((topExpenseCategory.amount / totals.expense) * 100) : 0;
    insights.push(`🛒 Kategori pengeluaran terbesar adalah "${topExpenseCategory.category}" sebesar Rp ${topExpenseCategory.amount.toLocaleString('id-ID')} (${expensePercentage}% dari total pengeluaran).`);
  }

  if (profitMargin > 30) {
    insights.push(`💎 Margin keuntungan bersih Anda sangat tinggi (${Math.round(profitMargin)}%). Model bisnis konveksi pakaian dalam Anda menghasilkan profitabilitas yang premium.`);
  } else if (profitMargin < 10 && totals.income > 0) {
    insights.push(`🔍 Margin keuntungan cukup rendah (${Math.round(profitMargin)}%). Pertimbangkan untuk meninjau kembali harga jual produk atau kurangi biaya pokok pembelian bahan konveksi.`);
  }

  if (runwayMonths < 2 && totals.balance > 0) {
    insights.push(`🚨 Sisa saldo kas Anda hanya cukup mendanai operasional selama ${runwayMonths.toFixed(1)} bulan lagi. Disarankan menambah modal usaha atau mempercepat konversi produk pakaian dalam menjadi kas.`);
  }

  const stats = {
    monthlyIncome,
    monthlyExpense,
    avgDailyIncome,
    highestIncomeDay,
    topExpenseCategory,
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        settings,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateSettings,
        loadDemoData,
        clearAllData,
        totals,
        today,
        stats,
        healthMetrics,
        insights,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
