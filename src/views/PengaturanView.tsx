import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Settings, Save, AlertTriangle, RefreshCw, Trash2, CheckCircle } from 'lucide-react';

export const PengaturanView: React.FC = () => {
  const { settings, updateSettings, loadDemoData, clearAllData } = useFinance();
  
  // Local state for forms
  const [revenueTarget, setRevenueTarget] = useState(settings.monthlyRevenueTarget.toString());
  const [budgetLimit, setBudgetLimit] = useState(settings.monthlyBudgetLimit.toString());
  const [theme, setTheme] = useState<'light' | 'dark'>(settings.theme);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoConfirmOpen, setIsDemoConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(revenueTarget);
    const budget = parseFloat(budgetLimit);

    if (isNaN(target) || target <= 0 || isNaN(budget) || budget <= 0) {
      alert('Masukkan target dan batas anggaran yang valid (harus angka positif)');
      return;
    }

    updateSettings({
      monthlyRevenueTarget: target,
      monthlyBudgetLimit: budget,
      theme
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    clearAllData();
    setIsResetConfirmOpen(false);
  };

  const handleLoadDemoData = () => {
    loadDemoData();
    setIsDemoConfirmOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
      
      {/* Settings Form */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-sand dark:border-brand-charcoal">
          <Settings className="w-5 h-5 text-brand-gold" />
          <h3 className="font-serif font-bold text-lg text-brand-dark dark:text-brand-cream">
            Pengaturan Finansial Toko
          </h3>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Revenue Target Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Target Pendapatan Bulanan (Rp)
              </label>
              <input
                type="number"
                value={revenueTarget}
                onChange={(e) => setRevenueTarget(e.target.value)}
                className="w-full px-3 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-sm font-semibold"
                placeholder="15000000"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                Target omzet kotor penjualan pakaian per bulan.
              </p>
            </div>

            {/* Budget Limit Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Batas Pengeluaran Bulanan (Rp)
              </label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="w-full px-3 py-2 bg-brand-cream dark:bg-brand-charcoal text-brand-dark dark:text-brand-cream rounded-lg border border-brand-sand dark:border-brand-charcoal focus:outline-none focus:border-brand-gold text-sm font-semibold"
                placeholder="8000000"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                Limit anggaran biaya operasional, iklan & stok.
              </p>
            </div>

          </div>

          {/* Theme setting */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Tema Tampilan Dashboard
            </label>
            <div className="flex gap-2 max-w-xs">
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                    theme === t
                      ? 'border-brand-gold bg-brand-gold/15 text-brand-gold font-bold'
                      : 'border-brand-sand dark:border-brand-charcoal text-gray-500 hover:text-brand-gold'
                  }`}
                >
                  {t === 'light' ? 'Mode Terang' : 'Mode Gelap'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-sand dark:border-brand-charcoal flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark hover:bg-brand-gold hover:text-white dark:hover:bg-brand-gold dark:hover:text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>

        </form>
      </div>

      {/* Database utilities (Danger zone) */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-rose-200 dark:border-rose-950/30 p-6 shadow-xs">
        <h3 className="font-serif font-bold text-lg text-rose-600 dark:text-rose-400 mb-2">
          Area Sensitif & Pemeliharaan Data
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Kelola database mutasi kas lokal. Anda dapat me-reset seluruh catatan atau memuat data transaksi demo pakaian untuk uji coba.
        </p>

        <div className="flex flex-wrap gap-3">
          
          {/* Seeding button */}
          <button
            onClick={() => setIsDemoConfirmOpen(true)}
            className="flex items-center gap-1.5 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Data Demo Pakaian</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Semua Data</span>
          </button>

        </div>
      </div>

      {/* Demo Seeding Confirmation */}
      {isDemoConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsDemoConfirmOpen(false)} />
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-6 max-w-sm w-full z-10 animate-slide-in">
            <h3 className="font-serif font-bold text-base text-brand-dark dark:text-brand-cream mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-brand-gold" />
              <span>Muat Data Demo?</span>
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Tindakan ini akan menimpa seluruh transaksi yang ada dengan data demo fashion (stok pakaian, penjualan online/offline) selama 30 hari terakhir.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDemoConfirmOpen(false)}
                className="flex-1 py-2 text-xs border border-brand-sand dark:border-brand-charcoal text-gray-500 rounded-lg hover:bg-brand-cream dark:hover:bg-brand-charcoal transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLoadDemoData}
                className="flex-1 py-2 text-xs bg-brand-gold text-white rounded-lg hover:bg-brand-gold-hover transition-all font-semibold"
              >
                Muat Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsResetConfirmOpen(false)} />
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-rose-200 dark:border-rose-950/30 p-6 max-w-sm w-full z-10 animate-slide-in">
            <h3 className="font-serif font-bold text-base text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Hapus Permanen?</span>
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Apakah Anda yakin ingin menghapus seluruh transaksi modal, pendapatan, dan pengeluaran? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2 text-xs border border-brand-sand dark:border-brand-charcoal text-gray-500 rounded-lg hover:bg-brand-cream dark:hover:bg-brand-charcoal transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all font-semibold"
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
