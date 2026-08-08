import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  FileSpreadsheet, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Plus,
  Sparkles,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTransaction: (type?: 'modal' | 'income' | 'expense') => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onOpenTransaction 
}) => {
  const { settings, updateSettings } = useFinance();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'modal', label: 'Modal', icon: Coins },
    { id: 'income', label: 'Pendapatan', icon: TrendingUp },
    { id: 'expense', label: 'Pengeluaran', icon: TrendingDown },
    { id: 'reports', label: 'Laporan Keuangan', icon: FileSpreadsheet },
    { id: 'stats', label: 'Statistik', icon: BarChart3 },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.id === activeTab);
    return activeItem ? activeItem.label : 'Dashboard';
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-cream dark:bg-brand-dark transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col border-r border-brand-sand dark:border-brand-charcoal bg-white dark:bg-[#1a1a1a] transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-4 border-b border-brand-sand dark:border-brand-charcoal gap-3 overflow-hidden">
          <div className="flex items-center justify-center min-w-[2.5rem] h-10 w-10 rounded-full bg-brand-gold text-white font-serif text-xl font-bold shadow-md shadow-brand-gold/20">
            B
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col animate-slide-in">
              <span className="font-serif font-bold text-lg leading-tight tracking-wide text-brand-dark dark:text-brand-cream">
                Budiyah
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-medium">
                Collection
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-gold text-white shadow-sm shadow-brand-gold/15' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-brand-cream dark:hover:bg-brand-charcoal hover:text-brand-gold dark:hover:text-brand-gold'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Quick Add Button */}
        <div className="p-4 border-t border-brand-sand dark:border-brand-charcoal">
          {isSidebarOpen ? (
            <button
              onClick={() => onOpenTransaction()}
              className="w-full flex items-center justify-center gap-2 bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-white dark:hover:text-white shadow-md shadow-brand-dark/10"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Transaksi</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenTransaction()}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-dark dark:bg-brand-cream text-brand-cream dark:text-brand-dark mx-auto hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-white dark:hover:text-white transition-all shadow-md"
              title="Tambah Transaksi"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapsible toggle footer */}
        <div className="p-4 flex items-center justify-between border-t border-brand-sand dark:border-brand-charcoal">
          {isSidebarOpen && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
              v1.0.0
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-md hover:bg-brand-cream dark:hover:bg-brand-charcoal text-gray-500 hover:text-brand-gold transition-all ml-auto"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-[#1a1a1a] border-b border-brand-sand dark:border-brand-charcoal z-20">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-gold text-white font-serif text-sm font-bold">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm tracking-wide text-brand-dark dark:text-brand-cream">
              Budiyah Collection
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onOpenTransaction()}
            className="p-2 bg-brand-gold text-white rounded-full shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-brand-gold dark:text-gray-400 rounded-lg hover:bg-brand-cream dark:hover:bg-brand-charcoal"
          >
            {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-brand-cream dark:hover:bg-brand-charcoal"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside 
        className={`md:hidden fixed top-0 bottom-0 right-0 w-64 bg-white dark:bg-[#1a1a1a] z-40 border-l border-brand-sand dark:border-brand-charcoal transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-sand dark:border-brand-charcoal">
          <span className="font-serif font-bold text-brand-dark dark:text-brand-cream">Menu Navigasi</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:bg-brand-cream dark:hover:bg-brand-charcoal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-gold text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-brand-cream dark:hover:bg-brand-charcoal hover:text-brand-gold'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Desktop */}
        <header className="hidden md:flex items-center justify-between h-16 px-6 bg-white dark:bg-[#1a1a1a] border-b border-brand-sand dark:border-brand-charcoal z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl text-brand-dark dark:text-brand-cream">
              {getPageTitle()}
            </h1>
            <div className="h-4 w-px bg-brand-sand dark:bg-brand-charcoal mx-2"></div>
            <div className="flex items-center gap-1 text-[11px] text-brand-gold font-medium bg-brand-cream dark:bg-brand-charcoal px-2 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fashion Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Stats Summary on Header */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-brand-gold dark:text-gray-400 rounded-full hover:bg-brand-cream dark:hover:bg-brand-charcoal transition-all"
              title={settings.theme === 'light' ? 'Nyalakan Mode Gelap' : 'Nyalakan Mode Terang'}
            >
              {settings.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <div className="h-6 w-px bg-brand-sand dark:bg-brand-charcoal"></div>

            {/* Profile Menu */}
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-brand-dark dark:text-brand-cream">Owner</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Budiyah Collection</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-brand-sand dark:bg-brand-charcoal flex items-center justify-center text-brand-dark dark:text-brand-cream border border-brand-gold/30">
                <User className="w-4 h-4 text-brand-gold" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-brand-cream dark:bg-brand-dark text-brand-dark dark:text-gray-200">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};
