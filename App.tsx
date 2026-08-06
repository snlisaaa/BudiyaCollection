import { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { TransactionModal } from './components/TransactionModal';
import { DashboardView } from './views/DashboardView';
import { ModalView } from './views/ModalView';
import { PendapatanView } from './views/PendapatanView';
import { PengeluaranView } from './views/PengeluaranView';
import { LaporanView } from './views/LaporanView';
import { StatistikView } from './views/StatistikView';
import { PengaturanView } from './views/PengaturanView';
import type { Transaction } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<'modal' | 'income' | 'expense'>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { deleteTransaction } = useFinance();

  const handleOpenTransaction = (type?: 'modal' | 'income' | 'expense') => {
    setEditingTransaction(null);
    setModalDefaultType(type || 'income');
    setIsModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            setActiveTab={setActiveTab}
          />
        );
      case 'modal':
        return (
          <ModalView 
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'income':
        return (
          <PendapatanView 
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'expense':
        return (
          <PengeluaranView 
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case 'reports':
        return <LaporanView />;
      case 'stats':
        return <StatistikView />;
      case 'settings':
        return <PengaturanView />;
      default:
        return (
          <DashboardView 
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onOpenTransaction={handleOpenTransaction}
    >
      {renderView()}
      
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTransaction={editingTransaction}
        defaultType={modalDefaultType}
      />
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}

export default App;
