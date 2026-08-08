import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ShieldAlert, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';

export const FinancialInsights: React.FC = () => {
  const { healthMetrics, insights } = useFinance();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40';
      case 'good':
        return 'text-brand-gold bg-brand-cream dark:bg-brand-charcoal border-brand-sand dark:border-brand-charcoal';
      case 'warning':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40';
      case 'critical':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Sangat Sehat (Premium)';
      case 'good':
        return 'Sehat & Stabil';
      case 'warning':
        return 'Perlu Pemantauan';
      case 'critical':
        return 'Kondisi Kritis';
      default:
        return 'Tidak Diketahui';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Financial Health Indicator Card */}
      <div className="lg:col-span-1 bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl"></div>
        
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 self-start mb-4">
          Financial Health Score
        </h3>

        {/* Dial SVG gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              className="text-gray-100 dark:text-brand-charcoal"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              className={`transition-all duration-1000 ${
                healthMetrics.status === 'excellent' ? 'text-emerald-500' :
                healthMetrics.status === 'good' ? 'text-brand-gold' :
                healthMetrics.status === 'warning' ? 'text-amber-500' : 'text-rose-500'
              }`}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * healthMetrics.score) / 100}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Score display inside the gauge */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tracking-tight text-brand-dark dark:text-brand-cream">
              {healthMetrics.score}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
              Skor Bisnis
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`mt-5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide ${getStatusColor(healthMetrics.status)}`}>
          {getStatusLabel(healthMetrics.status)}
        </div>

        <p className="mt-3 text-center text-[11px] text-gray-400 dark:text-gray-500">
          Analisis otomatis berdasarkan margin keuntungan, runway kas, target bulanan, dan batasan anggaran operasional.
        </p>
      </div>

      {/* Financial Insights List Card */}
      <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-xl border border-brand-sand dark:border-brand-charcoal p-5 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-brand-gold/10 text-brand-gold rounded-lg">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Smart Financial Insights
          </h3>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>Real-time</span>
          </div>
        </div>

        {/* List of Insights */}
        {insights.length > 0 ? (
          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[170px] pr-1">
            {insights.map((insight, idx) => {
              const isWarning = insight.includes('⚠️') || insight.includes('🚨');
              const isSuccess = insight.includes('🎉') || insight.includes('🟢') || insight.includes('💎');
              
              return (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs leading-relaxed transition-all hover:translate-x-0.5 ${
                    isWarning 
                      ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300' 
                      : isSuccess
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-brand-cream/50 dark:bg-brand-charcoal/50 border-brand-sand/50 dark:border-brand-charcoal/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isWarning ? (
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                    )}
                  </div>
                  <div>{insight}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-6">
            <Lightbulb className="w-8 h-8 text-gray-300 mb-2 stroke-1" />
            <p className="text-xs">Belum ada analisis insight. Tambahkan beberapa transaksi pendapatan atau pengeluaran.</p>
          </div>
        )}
      </div>

    </div>
  );
};
