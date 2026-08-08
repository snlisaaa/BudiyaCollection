import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Transaction } from '../types';
import { Coins, Plus, Edit2, Trash2 } from 'lucide-react';

interface ModalViewProps {
  onOpenTransaction: (type?: 'modal' | 'income' | 'expense') => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const ModalView: React.FC<ModalViewProps> = ({
  onOpenTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const { transactions, totals } = useFinance();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter only modal transactions
  const modalTxs = transactions.filter((tx) => tx.type === 'modal');

  // Breakdown of capital categories
  const categoriesBreakdown = modalTxs.reduce(
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

  return (
    <div className="space-y-6 animate-slide-in">
      
      {/* Upper stats display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Capital Card */}
        <div className="md:col-span-1 bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
              Total Modal Masuk
            </span>
            <h3 className="text-2xl font-bold text-brand-dark dark:text-brand-cream">
              {formatCurrency(totals.modal)}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Akumulasi dana usaha Budiyah Collection
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Dynamic Category cards */}
        {['Modal Awal', 'Tambahan Modal'].map((cat) => {
          const total = categoriesBreakdown[cat] || 0;
          return (
            <div 
              key={cat}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
                  {cat}
                </span>
                <h3 className="text-xl font-bold text-brand-dark dark:text-brand-cream">
                  {formatCurrency(total)}
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Total dana terkategori
                </p>
              </div>
            </div>
          );
        })}

      </div>

      {/* Capital History Section */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-brand-cream">
            Riwayat Setoran Modal
          </h3>
          <button
            onClick={() => onOpenTransaction('modal')}
            className="flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Modal</span>
          </button>
        </div>

        {modalTxs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-sand dark:border-brand-charcoal text-gray-400 uppercase tracking-widest font-bold">
                  <th className="pb-3 font-semibold">Tanggal</th>
                  <th className="pb-3 font-semibold">Kategori</th>
                  <th className="pb-3 font-semibold">Deskripsi / Sumber</th>
                  <th className="pb-3 font-semibold text-right">Nominal</th>
                  <th className="pb-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/40 dark:divide-brand-charcoal/40 text-gray-700 dark:text-gray-300">
                {modalTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-brand-cream/30 dark:hover:bg-brand-charcoal/20">
                    <td className="py-3.5 font-medium">{tx.date}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-brand-sand dark:border-brand-charcoal bg-brand-cream dark:bg-brand-charcoal text-brand-gold tracking-wide">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className="py-3.5 font-bold text-right text-brand-dark dark:text-brand-cream">
                      {formatCurrency(tx.amount)}
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
            <Coins className="w-12 h-12 text-gray-300 stroke-1 mb-2" />
            <p className="text-xs">Belum ada modal yang tercatat.</p>
            <button
              onClick={() => onOpenTransaction('modal')}
              className="mt-3 text-xs bg-brand-gold text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-gold-hover"
            >
              Catat Modal Awal
            </button>
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
              Apakah Anda yakin ingin menghapus data modal ini? Tindakan ini akan secara otomatis memperbarui saldo Anda.
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
