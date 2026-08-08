import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Transaction } from '../types';
import { TrendingDown, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

interface PengeluaranViewProps {
  onOpenTransaction: (type?: 'modal' | 'income' | 'expense') => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const PengeluaranView: React.FC<PengeluaranViewProps> = ({
  onOpenTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const { transactions, totals } = useFinance();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Filter only expense transactions
  const expenseTxs = transactions.filter((tx) => tx.type === 'expense');

  // Categories breakdown
  const categoryBreakdown = expenseTxs.reduce(
    (acc: { [key: string]: number }, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    },
    {}
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    setDeleteConfirmId(null);
  };

  // Categories and Payment options for filters
  const categories = ['All', 'Pembelian bahan konveksi', 'Operasional', 'Packaging', 'Pengiriman', 'Marketing', 'Gaji', 'Lainnya'];
  const paymentMethods = ['All', 'Cash', 'Transfer', 'E-Wallet'];

  // Apply filters
  const filteredTxs = expenseTxs.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase()) || 
                          tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tx.category === categoryFilter;
    const matchesPayment = paymentFilter === 'All' || tx.paymentMethod === paymentFilter;
    return matchesSearch && matchesCategory && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-slide-in">
      
      {/* Upper Cards - Total Expense and Major Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Expense Card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Total Pengeluaran
            </span>
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totals.expense)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Akumulasi biaya operasional & stok
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Major Category Cards (Top 3 default categories) */}
        {[
          { key: 'Pembelian bahan konveksi', label: 'Bahan Konveksi' },
          { key: 'Marketing', label: 'Pemasaran/Ads' },
          { key: 'Operasional', label: 'Operasional' }
        ].map((item) => {
          const total = categoryBreakdown[item.key] || 0;
          return (
            <div 
              key={item.key}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
                {item.label}
              </span>
              <h3 className="text-lg font-bold text-brand-dark dark:text-brand-cream mt-1">
                {formatCurrency(total)}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Total belanja terkategori
              </p>
            </div>
          );
        })}

      </div>

      {/* Main Expense Database & Filters */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
        
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-brand-sand/55 dark:border-brand-charcoal/50">
          <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-brand-cream">
            Catatan Pengeluaran Bisnis
          </h3>
          <button
            onClick={() => onOpenTransaction('expense')}
            className="flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari deskripsi pengeluaran..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-xs font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-xs font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Kategori: {cat === 'All' ? 'Semua' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-2 px-3 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-xs font-medium"
            >
              {paymentMethods.map((pm) => (
                <option key={pm} value={pm}>
                  Metode: {pm === 'All' ? 'Semua' : pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table list */}
        {filteredTxs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-sand dark:border-brand-charcoal text-gray-400 uppercase tracking-widest font-bold">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">Metode</th>
                  <th className="pb-3 font-semibold">Deskripsi Pengeluaran</th>
                  <th className="pb-3 font-semibold">Kategori</th>
                  <th className="pb-3 font-semibold text-right">Nominal</th>
                  <th className="pb-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/40 dark:divide-brand-charcoal/40 text-gray-700 dark:text-gray-300">
                {filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-brand-cream/30 dark:hover:bg-brand-charcoal/20">
                    <td className="py-3.5 font-medium">{tx.date}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold border border-brand-sand dark:border-brand-charcoal text-gray-500">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-800 dark:text-gray-200 max-w-[220px] truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className="py-3.5 text-gray-400 dark:text-gray-500">{tx.category}</td>
                    <td className="py-3.5 font-bold text-right text-rose-600 dark:text-rose-400">
                      -{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1 text-gray-400 hover:text-brand-gold transition-all"
                          title="Ubah"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tx.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 py-12">
            <TrendingDown className="w-12 h-12 text-gray-300 stroke-1 mb-2" />
            <p className="text-xs">Tidak ada data pengeluaran yang cocok dengan kriteria filter.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-6 max-w-sm w-full z-10 animate-slide-in">
            <h3 className="font-serif font-bold text-base text-brand-dark dark:text-brand-cream mb-2">Konfirmasi Hapus</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus data pengeluaran ini? Pengurangan nominal ini akan langsung menaikkan sisa saldo kas Anda.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs border border-brand-sand dark:border-brand-charcoal text-gray-500 rounded-lg hover:bg-brand-cream dark:hover:bg-brand-charcoal transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
