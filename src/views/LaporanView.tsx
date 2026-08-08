import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FileSpreadsheet, Download, Printer, Calendar } from 'lucide-react';

export const LaporanView: React.FC = () => {
  const { transactions } = useFinance();
  const [filterType, setFilterType] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  
  // Custom date range inputs
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Date boundary checkers
  const getFilterBoundaries = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    switch (filterType) {
      case 'today':
        return { start: todayStr, end: todayStr };
      case 'week': {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return { 
          start: lastWeek.toISOString().split('T')[0], 
          end: todayStr 
        };
      }
      case 'month': {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Correct timezone offset offsetting firstDayOfMonth to string
        const offset = firstDayOfMonth.getTimezoneOffset();
        const adjustedDate = new Date(firstDayOfMonth.getTime() - (offset * 60 * 1000));
        return { 
          start: adjustedDate.toISOString().split('T')[0], 
          end: todayStr 
        };
      }
      case 'custom':
        return { start: startDate, end: endDate };
      default:
        return { start: '', end: '' };
    }
  };

  const { start, end } = getFilterBoundaries();

  // Filter transactions within boundaries
  const filteredTxs = transactions.filter((tx) => {
    if (!start || !end) return true;
    return tx.date >= start && tx.date <= end;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // sort ascending for chronological report

  // Calculate filtered totals
  const reportTotals = filteredTxs.reduce(
    (acc, tx) => {
      if (tx.type === 'modal') acc.modal += tx.amount;
      if (tx.type === 'income') acc.income += tx.amount;
      if (tx.type === 'expense') acc.expense += tx.amount;
      return acc;
    },
    { modal: 0, income: 0, expense: 0, balance: 0, netProfit: 0 }
  );
  reportTotals.netProfit = reportTotals.income - reportTotals.expense;
  reportTotals.balance = reportTotals.modal + reportTotals.income - reportTotals.expense;

  // Export to CSV Function
  const exportToCSV = () => {
    // CSV headers
    let csvContent = "Tanggal,Tipe,Kategori,Deskripsi,Metode Pembayaran,Nominal (Rp)\n";
    
    // Rows
    filteredTxs.forEach((tx) => {
      const typeLabel = tx.type === 'income' ? 'Pendapatan' : tx.type === 'expense' ? 'Pengeluaran' : 'Modal';
      const pm = tx.paymentMethod || '-';
      const row = `"${tx.date}","${typeLabel}","${tx.category}","${tx.description.replace(/"/g, '""')}","${pm}",${tx.amount}\n`;
      csvContent += row;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_keuangan_budiyah_${start}_to_${end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger PDF print layout
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Printable Report Header Style Override */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-size: 11px !important;
          }
          aside, header, nav, button, .no-print, input, select {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            padding: 0 !important;
          }
          .print-header {
            display: block !important;
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #ddd !important;
            padding: 6px 10px !important;
          }
        }
        .print-header {
          display: none;
        }
      `}</style>

      {/* Control bar - no print */}
      <div className="no-print bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Date presets */}
        <div className="flex flex-wrap gap-1.5 bg-brand-cream dark:bg-brand-charcoal p-1 rounded-lg">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'week', label: '7 Hari Terakhir' },
            { id: 'month', label: 'Bulan Ini' },
            { id: 'custom', label: 'Rentang Kustom' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setFilterType(preset.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === preset.id
                  ? 'bg-brand-gold text-white shadow-sm'
                  : 'text-gray-500 hover:text-brand-gold'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom date range inputs */}
        {filterType === 'custom' && (
          <div className="flex items-center gap-2 animate-slide-in">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-md border border-brand-sand dark:border-brand-charcoal text-xs focus:outline-none focus:border-brand-gold"
            />
            <span className="text-gray-400 text-xs">sampai</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-md border border-brand-sand dark:border-brand-charcoal text-xs focus:outline-none focus:border-brand-gold"
            />
          </div>
        )}

        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            disabled={filteredTxs.length === 0}
            className="flex items-center gap-1.5 border border-brand-sand dark:border-brand-charcoal text-gray-600 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-brand-cream dark:hover:bg-brand-charcoal text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={filteredTxs.length === 0}
            className="flex items-center gap-1.5 bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark hover:bg-brand-gold hover:text-white dark:hover:bg-brand-gold dark:hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>

      </div>

      {/* Main Report Page Layout (Print Container) */}
      <div className="print-container bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-8 shadow-xs space-y-6">
        
        {/* PRINT ONLY HEADER */}
        <div className="print-header">
          <h1 className="font-serif font-bold text-2xl text-black">BUDIYAH COLLECTION</h1>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">LAPORAN KEUANGAN BULANAN / BERKALA</h2>
          <p className="text-[10px] text-gray-400 mt-1">
            Periode: {start} s.d {end}
          </p>
          <hr className="my-4 border-gray-300" />
        </div>

        {/* Visual Header Display on Screen */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-brand-sand/55 dark:border-brand-charcoal/50">
          <div>
            <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-brand-cream">
              Laporan Keuangan
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Menampilkan mutasi keuangan untuk periode <span className="font-semibold text-brand-gold">{start}</span> hingga <span className="font-semibold text-brand-gold">{end}</span>
            </p>
          </div>
          <FileSpreadsheet className="w-10 h-10 text-brand-gold/30 stroke-1" />
        </div>

        {/* Financial Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-brand-cream dark:bg-brand-charcoal/40 p-4 rounded-xl border border-brand-sand dark:border-brand-charcoal">
          
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Total Modal (In)
            </span>
            <h4 className="text-sm font-bold text-brand-dark dark:text-brand-cream">
              {formatCurrency(reportTotals.modal)}
            </h4>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Total Pendapatan
            </span>
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(reportTotals.income)}
            </h4>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Total Pengeluaran
            </span>
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(reportTotals.expense)}
            </h4>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Selisih Bersih
            </span>
            <h4 className={`text-sm font-bold ${
              reportTotals.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatCurrency(reportTotals.netProfit)}
            </h4>
          </div>

          <div className="col-span-2 md:col-span-1 space-y-1 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-brand-sand dark:border-brand-charcoal md:pl-4">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Saldo Akhir Periode
            </span>
            <h4 className="text-sm font-extrabold text-brand-dark dark:text-brand-cream">
              {formatCurrency(reportTotals.balance)}
            </h4>
          </div>

        </div>

        {/* Chronological Transaction Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Daftar Jurnal Mutasi ({filteredTxs.length} Item)
          </h4>

          {filteredTxs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-brand-charcoal text-gray-400 font-bold uppercase tracking-widest">
                    <th className="pb-2.5 font-semibold">Tanggal</th>
                    <th className="pb-2.5 font-semibold">Tipe</th>
                    <th className="pb-2.5 font-semibold">Kategori</th>
                    <th className="pb-2.5 font-semibold">Deskripsi</th>
                    <th className="pb-2.5 font-semibold">Metode</th>
                    <th className="pb-2.5 font-semibold text-right">Debit (Masuk)</th>
                    <th className="pb-2.5 font-semibold text-right">Kredit (Keluar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-brand-charcoal/50 text-gray-700 dark:text-gray-300">
                  {filteredTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-brand-cream/30 dark:hover:bg-brand-charcoal/20">
                      <td className="py-2.5 font-medium">{tx.date}</td>
                      <td className="py-2.5">
                        <span className="capitalize font-semibold">{tx.type === 'modal' ? 'Modal' : tx.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}</span>
                      </td>
                      <td className="py-2.5 text-gray-500 dark:text-gray-400">{tx.category}</td>
                      <td className="py-2.5 max-w-[200px] truncate" title={tx.description}>{tx.description}</td>
                      <td className="py-2.5 text-gray-500">{tx.paymentMethod || '-'}</td>
                      <td className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {tx.type !== 'expense' ? formatCurrency(tx.amount) : '-'}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-rose-600 dark:text-rose-400">
                        {tx.type === 'expense' ? formatCurrency(tx.amount) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
              <Calendar className="w-10 h-10 text-gray-300 stroke-1 mb-2" />
              <p className="text-xs">Tidak ada mutasi transaksi pada periode ini.</p>
            </div>
          )}
        </div>

        {/* PRINT ONLY SIGN-OFF */}
        <div className="print-header mt-12 text-right">
          <div className="inline-block text-center">
            <p className="text-xs">Jakarta, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs font-semibold mt-1">Pemilik Budiyah Collection</p>
            <div className="h-16"></div>
            <p className="text-xs underline font-bold">Budiyah Collection Owner</p>
          </div>
        </div>

      </div>

    </div>
  );
};
