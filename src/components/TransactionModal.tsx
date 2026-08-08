import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { Transaction } from '../types';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction: Transaction | null;
  defaultType?: 'modal' | 'income' | 'expense';
}

const CATEGORIES_BY_TYPE = {
  modal: ['Modal Awal', 'Tambahan Modal', 'Lainnya'],
  income: ['Grosir Pakaian Dalam', 'Penjualan Online (Eceran)', 'Penjualan Offline', 'Custom CD/Bra/Korset'],
  expense: [
    'Pembelian bahan konveksi',
    'Operasional',
    'Packaging',
    'Pengiriman',
    'Marketing',
    'Gaji',
    'Lainnya',
  ],
};

const PAYMENT_METHODS = ['Cash', 'Transfer', 'E-Wallet'];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTransaction,
  defaultType = 'income',
}) => {
  const { addTransaction, updateTransaction } = useFinance();

  const [type, setType] = useState<'modal' | 'income' | 'expense'>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'E-Wallet'>('Cash');
  const [error, setError] = useState<string>('');

  // Set initial fields when opening or editing
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmount(editTransaction.amount.toString());
        setCategory(editTransaction.category);
        setDescription(editTransaction.description);
        setDate(editTransaction.date);
        if (editTransaction.paymentMethod) {
          setPaymentMethod(editTransaction.paymentMethod);
        }
        setError('');
      } else {
        setType(defaultType);
        setAmount('');
        setCategory(CATEGORIES_BY_TYPE[defaultType][0]);
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod('Cash');
        setError('');
      }
    }
  }, [isOpen, editTransaction, defaultType]);

  // Adjust default category when type changes (only in add mode)
  useEffect(() => {
    if (isOpen && !editTransaction) {
      setCategory(CATEGORIES_BY_TYPE[type][0]);
    }
  }, [type, editTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Nominal harus berupa angka positif yang valid');
      return;
    }

    if (!category) {
      setError('Pilih kategori terlebih dahulu');
      return;
    }

    if (!date) {
      setError('Tanggal wajib diisi');
      return;
    }

    const payload = {
      type,
      amount: parsedAmount,
      category,
      description: description.trim() || `${category} - ${type === 'income' ? 'Penjualan' : type === 'expense' ? 'Pengeluaran' : 'Modal'}`,
      date,
      paymentMethod: type === 'modal' ? undefined : paymentMethod,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-xl border border-brand-sand dark:border-brand-charcoal shadow-2xl p-6 overflow-hidden z-10 animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-sand dark:border-brand-charcoal">
          <h2 className="font-serif font-bold text-lg text-brand-dark dark:text-brand-cream">
            {editTransaction ? 'Ubah Transaksi' : 'Tambah Transaksi Baru'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-brand-gold hover:bg-brand-cream dark:hover:bg-brand-charcoal transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs rounded border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Type Selection Tabs (Only active in ADD mode) */}
          {!editTransaction && (
            <div className="flex rounded-lg bg-brand-cream dark:bg-brand-charcoal p-1">
              {(['income', 'expense', 'modal'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    type === t
                      ? 'bg-brand-gold text-white shadow-sm'
                      : 'text-gray-500 hover:text-brand-gold'
                  }`}
                >
                  {t === 'income' ? 'Pendapatan' : t === 'expense' ? 'Pengeluaran' : 'Modal'}
                </button>
              ))}
            </div>
          )}

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Nominal (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 text-sm font-semibold">
                Rp
              </span>
              <input
                type="number"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold font-semibold text-sm"
              />
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-sm"
            />
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-sm"
            >
              {CATEGORIES_BY_TYPE[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method (Income / Expense only) */}
          {type !== 'modal' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Metode Pembayaran
              </label>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method as any)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                      paymentMethod === method
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-brand-sand dark:border-brand-charcoal text-gray-500 hover:border-brand-gold hover:text-brand-gold'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Catatan / Keterangan
            </label>
            <textarea
              placeholder="Masukkan detail catatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-sm resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3 border-t border-brand-sand dark:border-brand-charcoal">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-brand-sand dark:border-brand-charcoal hover:bg-brand-cream dark:hover:bg-brand-charcoal text-gray-500 hover:text-brand-gold text-sm font-medium transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-white dark:hover:text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-brand-dark/15 dark:shadow-none"
            >
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
