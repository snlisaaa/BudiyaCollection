import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { FinancialInsights } from '../components/FinancialInsights';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Scale, 
  PlusCircle, 
  Calendar,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import type { Transaction } from '../types';

interface DashboardViewProps {
  onOpenTransaction: (type?: 'modal' | 'income' | 'expense') => void;
  onEditTransaction: (tx: Transaction) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTransaction,
  onEditTransaction,
  setActiveTab
}) => {
  const { totals, today, settings, stats, transactions } = useFinance();

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const getSelisihStatus = (val: number) => {
    if (val > 0) return { label: 'Surplus', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' };
    if (val < 0) return { label: 'Defisit', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40' };
    return { label: 'Netral', color: 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' };
  };

  // Calculate target percentages
  const targetPct = Math.min(100, Math.round((stats.monthlyIncome / settings.monthlyRevenueTarget) * 100));
  const budgetPct = Math.min(100, Math.round((stats.monthlyExpense / settings.monthlyBudgetLimit) * 100));

  return (
    <div className="space-y-6">
      
      {/* Upper Quick Summary Banner (Fashion Greeting) */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl"></div>
        <div>
          <h2 className="font-serif font-bold text-2xl text-brand-dark dark:text-brand-cream">
            Selamat Datang di Butik Keuangan Anda
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xl">
            Pantau arus modal, hasil penjualan bra, celana dalam, lingerie, serta pengeluaran bahan baku konveksi pakaian dalam secara real-time.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => onOpenTransaction('income')}
            className="flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Catat Pendapatan</span>
          </button>
          <button 
            onClick={() => onOpenTransaction('expense')}
            className="flex items-center gap-1.5 bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark hover:bg-brand-gold hover:text-white dark:hover:bg-brand-gold dark:hover:text-brand-cream text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Main 4 Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Modal */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between hover:border-brand-gold transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Total Modal Usaha
            </span>
            <h3 className="text-xl font-bold tracking-tight text-brand-dark dark:text-brand-cream">
              {formatCurrency(totals.modal)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Uang modal tersimpan di kas
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Income Today */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between hover:border-brand-gold transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Pendapatan Hari Ini
            </span>
            <h3 className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(today.income)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <span className="font-semibold">{today.incomeCount}</span> transaksi hari ini
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Expense Today */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between hover:border-brand-gold transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Pengeluaran Hari Ini
            </span>
            <h3 className="text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(today.expense)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <span className="font-semibold">{today.expenseCount}</span> transaksi pengeluaran
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Net Difference Today */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between hover:border-brand-gold transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Selisih Bersih Hari Ini
            </span>
            <h3 className={`text-xl font-bold tracking-tight ${
              today.netProfit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 
              today.netProfit < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {formatCurrency(today.netProfit)}
            </h3>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full border text-[9px] font-semibold ${
              getSelisihStatus(today.netProfit).color
            }`}>
              {getSelisihStatus(today.netProfit).label}
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-brand-sand/30 dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Target Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Revenue Target progress */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Pencapaian Omzet Bulan Ini
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Target: {formatCurrency(settings.monthlyRevenueTarget)}
              </p>
            </div>
            <span className="text-xs font-bold text-brand-gold bg-brand-cream dark:bg-brand-charcoal px-2 py-0.5 rounded-md">
              {targetPct}%
            </span>
          </div>
          <div className="w-full bg-brand-cream dark:bg-brand-charcoal h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-gold h-full rounded-full transition-all duration-500" 
              style={{ width: `${targetPct}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            Omzet terkumpul: <span className="font-semibold text-brand-dark dark:text-brand-cream">{formatCurrency(stats.monthlyIncome)}</span>
          </p>
        </div>

        {/* Budget limit progress */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Pemakaian Anggaran Operasional
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Limit Anggaran: {formatCurrency(settings.monthlyBudgetLimit)}
              </p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              budgetPct >= 90 ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-sand/55 dark:bg-brand-charcoal text-brand-gold'
            }`}>
              {budgetPct}%
            </span>
          </div>
          <div className="w-full bg-brand-cream dark:bg-brand-charcoal h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPct >= 90 ? 'bg-rose-500 animate-pulse' : 
                budgetPct >= 70 ? 'bg-amber-500' : 'bg-brand-dark dark:bg-brand-sand'
              }`} 
              style={{ width: `${budgetPct}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              Terpakai: <span className="font-semibold text-brand-dark dark:text-brand-cream">{formatCurrency(stats.monthlyExpense)}</span>
            </span>
            {budgetPct >= 90 && (
              <span className="text-[9px] text-rose-500 font-semibold flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Overlimit!
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Financial Health & Automated Insights Component */}
      <FinancialInsights />

      {/* Recent Transactions List Table */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Transaksi Terkini
            </h3>
          </div>
          <button 
            onClick={() => setActiveTab('reports')}
            className="text-[11px] text-brand-gold font-semibold flex items-center hover:underline hover:text-brand-gold-hover transition-all"
          >
            <span>Selengkapnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-sand dark:border-brand-charcoal text-gray-400 uppercase tracking-widest font-bold">
                  <th className="pb-2.5 font-semibold">Tanggal</th>
                  <th className="pb-2.5 font-semibold">Tipe</th>
                  <th className="pb-2.5 font-semibold">Deskripsi</th>
                  <th className="pb-2.5 font-semibold">Kategori</th>
                  <th className="pb-2.5 font-semibold text-right">Nominal</th>
                  <th className="pb-2.5 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/50 dark:divide-brand-charcoal/50 text-gray-700 dark:text-gray-300">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-brand-cream/30 dark:hover:bg-brand-charcoal/20">
                    <td className="py-3">{tx.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        tx.type === 'income' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200' :
                        tx.type === 'expense' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-200' :
                        'text-brand-gold bg-brand-cream dark:bg-brand-charcoal border-brand-sand'
                      }`}>
                        {tx.type === 'income' ? 'Income' : tx.type === 'expense' ? 'Expense' : 'Modal'}
                      </span>
                    </td>
                    <td className="py-3 font-medium max-w-[180px] truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">{tx.category}</td>
                    <td className={`py-3 font-semibold text-right ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' :
                      tx.type === 'expense' ? 'text-rose-600 dark:text-rose-400' :
                      'text-brand-dark dark:text-brand-cream'
                    }`}>
                      {tx.type === 'expense' ? '-' : ''}{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="text-brand-gold hover:text-brand-gold-hover text-[11px] font-semibold hover:underline"
                      >
                        Ubah
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
            <Calendar className="w-12 h-12 text-gray-300 stroke-1 mb-2" />
            <p className="text-xs">Belum ada transaksi tercatat.</p>
            <button
              onClick={() => onOpenTransaction()}
              className="mt-3 text-xs bg-brand-gold text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-gold-hover"
            >
              Tambah Transaksi Sekarang
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
