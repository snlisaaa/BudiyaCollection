import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { HelpCircle } from 'lucide-react';

export const StatistikView: React.FC = () => {
  const { transactions, stats, totals } = useFinance();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Format IDR helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. DATA GROUPING FOR INCOME VS EXPENSE CHART
  const getAggregatedChartData = () => {
    // Sort transactions chronological
    const sortedTxs = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (timeframe === 'daily') {
      // Group by date - get last 10 days of activity
      const dailyMap: { [key: string]: { date: string; Pendapatan: number; Pengeluaran: number } } = {};
      
      // Seed last 10 days
      for (let i = 9; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        // Format display
        const displayDate = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        dailyMap[dateStr] = { date: displayDate, Pendapatan: 0, Pengeluaran: 0 };
      }

      sortedTxs.forEach((tx) => {
        if (dailyMap[tx.date]) {
          if (tx.type === 'income') dailyMap[tx.date].Pendapatan += tx.amount;
          if (tx.type === 'expense') dailyMap[tx.date].Pengeluaran += tx.amount;
        }
      });

      return Object.values(dailyMap);
      
    } else if (timeframe === 'weekly') {
      // Group by last 4 weeks
      const weeklyData: { [key: string]: { date: string; Pendapatan: number; Pengeluaran: number } } = {};
      
      // Set up weeks
      for (let i = 3; i >= 0; i--) {
        const start = new Date();
        start.setDate(start.getDate() - (i * 7 + 6));
        const end = new Date();
        end.setDate(end.getDate() - (i * 7));
        const label = `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;
        weeklyData[i] = { date: label, Pendapatan: 0, Pengeluaran: 0 };

        sortedTxs.forEach((tx) => {
          const txDate = new Date(tx.date);
          // Set to midnight
          txDate.setHours(0,0,0,0);
          start.setHours(0,0,0,0);
          end.setHours(23,59,59,999);
          if (txDate >= start && txDate <= end) {
            if (tx.type === 'income') weeklyData[i].Pendapatan += tx.amount;
            if (tx.type === 'expense') weeklyData[i].Pengeluaran += tx.amount;
          }
        });
      }

      return Object.values(weeklyData);
      
    } else {
      // Group by months (last 6 months)
      const monthlyMap: { [key: string]: { date: string; Pendapatan: number; Pengeluaran: number } } = {};
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const displayLabel = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
        monthlyMap[yearMonth] = { date: displayLabel, Pendapatan: 0, Pengeluaran: 0 };
      }

      sortedTxs.forEach((tx) => {
        const ym = tx.date.substring(0, 7);
        if (monthlyMap[ym]) {
          if (tx.type === 'income') monthlyMap[ym].Pendapatan += tx.amount;
          if (tx.type === 'expense') monthlyMap[ym].Pengeluaran += tx.amount;
        }
      });

      return Object.values(monthlyMap);
    }
  };

  const comparisonData = getAggregatedChartData();

  // 2. DATA GROUPING FOR BALANCE TREND CHART (Cumulative Balance)
  const getBalanceTrendData = () => {
    // Sort transactions chronological (oldest first)
    const sortedTxs = [...transactions]
      .filter(tx => tx.type !== 'modal' || tx.category === 'Modal Awal' || tx.category === 'Tambahan Modal')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    const dailyBalance: { [key: string]: number } = {};

    sortedTxs.forEach((tx) => {
      if (tx.type === 'modal') {
        runningBalance += tx.amount;
      } else if (tx.type === 'income') {
        runningBalance += tx.amount;
      } else if (tx.type === 'expense') {
        runningBalance -= tx.amount;
      }
      dailyBalance[tx.date] = runningBalance;
    });

    // Convert to points and take the last 15 days of active records
    const points = Object.entries(dailyBalance).map(([date, balance]) => {
      const d = new Date(date);
      return {
        rawDate: date,
        date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        Saldo: balance
      };
    });

    // Return last 12 points
    return points.slice(-12);
  };

  const trendData = getBalanceTrendData();

  // 3. PIE CHART DATA FOR EXPENSES
  const getExpensePieData = () => {
    const expenseTxs = transactions.filter(tx => tx.type === 'expense');
    const breakdown = expenseTxs.reduce((acc: { [key: string]: number }, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value
    }));
  };

  const pieData = getExpensePieData();
  const COLORS = ['#a21c26', '#d67e83', '#9ca3af', '#4b5563', '#a78bfa', '#f87171', '#34d399'];

  return (
    <div className="space-y-6 animate-slide-in">
      
      {/* Timeframe selector header */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-brand-cream">
            Analisis Grafik Keuangan
          </h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            Visualisasi modal, omzet penjualan pakaian dalam, dan pos pengeluaran konveksi.
          </p>
        </div>
        <div className="flex bg-brand-cream dark:bg-brand-charcoal p-1 rounded-lg self-start sm:self-auto">
          {[
            { id: 'daily', label: 'Harian' },
            { id: 'weekly', label: 'Mingguan' },
            { id: 'monthly', label: 'Bulanan' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === item.id
                  ? 'bg-brand-gold text-white shadow-sm'
                  : 'text-gray-500 hover:text-brand-gold'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Income vs Expense Comparison */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            Perbandingan Pendapatan vs Pengeluaran
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-brand-charcoal" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}k` : val} 
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Pendapatan" fill="#a21c26" name="Pendapatan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#d67e83" name="Pengeluaran" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cumulative Balance Trend */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            Tren Perkembangan Kas (Saldo Akhir)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-brand-charcoal" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}k` : val}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Saldo']}
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', fontSize: '11px', border: 'none' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Saldo" 
                  stroke="#a21c26" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, stroke: '#a21c26', strokeWidth: 1.5, fill: '#fff' }}
                  activeDot={{ r: 6 }} 
                  name="Sisa Saldo Kas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Lower Breakdown Row: Pie Chart and Analytics Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart of Expense allocation */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            Alokasi Pengeluaran Terbesar
          </h4>
          <div className="h-56 flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">Belum ada pengeluaran.</p>
            )}
          </div>
          
          {/* Pie Chart Legend List */}
          <div className="space-y-1.5 mt-3 max-h-[120px] overflow-y-auto pr-1">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="truncate max-w-[120px]">{entry.name}</span>
                </div>
                <span className="font-semibold text-brand-dark dark:text-brand-cream">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytical Indices Summary Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Ringkasan Performa & Indeks Bisnis
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="border-b sm:border-b-0 sm:border-r border-brand-sand dark:border-brand-charcoal pb-4 sm:pb-0 sm:pr-4 space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Omzet Bulan Ini</span>
                  <p className="text-sm font-bold text-brand-dark dark:text-brand-cream">
                    {formatCurrency(stats.monthlyIncome)}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Total Pengeluaran Bulan Ini</span>
                  <p className="text-sm font-bold text-brand-dark dark:text-brand-cream">
                    {formatCurrency(stats.monthlyExpense)}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Total Keuntungan Bersih (All-time)</span>
                  <p className={`text-sm font-bold ${totals.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {formatCurrency(totals.netProfit)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pl-0 sm:pl-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Rata-rata Penjualan Harian</span>
                  <p className="text-sm font-bold text-brand-dark dark:text-brand-cream">
                    {formatCurrency(stats.avgDailyIncome)}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Penjualan Harian Tertinggi</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.highestIncomeDay 
                      ? `${formatCurrency(stats.highestIncomeDay.amount)} (${stats.highestIncomeDay.date})`
                      : '-'
                    }
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">Pos Pengeluaran Terbesar</span>
                  <p className="text-sm font-bold text-rose-500">
                    {stats.topExpenseCategory 
                      ? `${stats.topExpenseCategory.category} (${formatCurrency(stats.topExpenseCategory.amount)})`
                      : '-'
                    }
                  </p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-5 pt-3 border-t border-brand-sand dark:border-brand-charcoal text-[10px] text-gray-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
            <span>Indikator data dihitung secara dinamis dari database mutasi kas lokal Anda.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
