import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';

// Views
import DashboardView from './components/DashboardView';
import SahamView from './components/SahamView';
import FinansialView from './components/FinansialView';
import AsetView from './components/AsetView';
import HutangView from './components/HutangView';
import WishlistView from './components/WishlistView';
import KriptoView from './components/KriptoView';
import TabunganView from './components/TabunganView';

import { AppState, FinancialTransaction, StockTrade, CryptoTrade } from './types';
import { INITIAL_STATE } from './initialData';
import { formatIDR } from './utils';
import { Sparkles, Info, X, Check } from 'lucide-react';

export default function App() {
  // 1. Core State & Storage Persistence
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('kyy_finance_state_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('kyy_finance_state_v1', JSON.stringify(state));
  }, [state]);

  // 2. Active Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // 3. Dark Mode & Tailwind Synchronization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('kyy_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kyy_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // 4. Modal and Notification Overlays
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 5. Close modals on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowQuickAddModal(false);
        setShowHelpModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Quick Add Form States
  const [quickType, setQuickType] = useState<'income' | 'expense' | 'stock' | 'crypto'>('expense');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickLabel, setQuickLabel] = useState('');
  const [quickCategory, setQuickCategory] = useState('Makan');
  const [quickPair, setQuickPair] = useState('BBCA');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAmount || !quickLabel) return;

    const amountNum = Number(quickAmount);

    if (quickType === 'income' || quickType === 'expense') {
      const signedAmount = quickType === 'income' ? amountNum : -amountNum;
      const newTrx: FinancialTransaction = {
        id: `fin-${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        kategori: quickCategory,
        keperluan: quickLabel,
        akun: 'BLU (Bca Digital)',
        jumlah: signedAmount,
        tipe: quickType === 'income' ? 'Pemasukan' : 'Pengeluaran'
      };

      setState(prev => ({
        ...prev,
        transactions: [newTrx, ...prev.transactions],
        totalSaldo: prev.totalSaldo + signedAmount
      }));
      triggerToast(`Berhasil menambahkan catatan ${quickLabel} sebesar ${formatIDR(amountNum)}`);
    } else if (quickType === 'stock') {
      const newStock: StockTrade = {
        id: `stock-${Date.now()}`,
        tanggal: 'Hari ini',
        pair: quickPair.toUpperCase(),
        trend: 'Follow',
        posisi: 'Long',
        tf: '1d',
        pnl: amountNum,
        gainPercent: 3.5,
        equity: state.totalSaldo + amountNum,
        status: 'Win'
      };

      setState(prev => ({
        ...prev,
        stockTrades: [newStock, ...prev.stockTrades],
        totalSaldo: prev.totalSaldo + amountNum
      }));
      triggerToast(`Berhasil mencatat trade Saham ${quickPair} (+${formatIDR(amountNum)})`);
    } else if (quickType === 'crypto') {
      const newCrypto: CryptoTrade = {
        id: `crypto-${Date.now()}`,
        tanggal: 'Hari ini',
        pair: quickPair.toUpperCase() + '/USDT',
        trend: 'Bullish',
        posisi: 'LONG',
        pnl: amountNum / 15500,
        gainPercent: 2.1,
        equity: 52440 + (amountNum / 15500),
        status: 'WIN'
      };

      setState(prev => ({
        ...prev,
        cryptoTrades: [newCrypto, ...prev.cryptoTrades],
        totalSaldo: prev.totalSaldo + amountNum
      }));
      triggerToast(`Berhasil mencatat trade Kripto ${quickPair} (+${formatIDR(amountNum)})`);
    }

    setShowQuickAddModal(false);
    setQuickAmount('');
    setQuickLabel('');
  };

  // Get current page title
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Utama';
      case 'saham': return 'Jurnal Saham';
      case 'finansial': return 'Arus Kas Keuangan';
      case 'aset': return 'Pelacak Aset';
      case 'hutang': return 'Hutang & Piutang';
      case 'wishlist': return 'Wishlist Keuangan';
      case 'kripto': return 'Jurnal Kripto';
      case 'tabungan': return 'Tabungan & Dana Darurat';
      default: return 'KyyFinance';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* 1. Desktop Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 md:pl-[72px] pb-24 md:pb-6 flex flex-col min-w-0">
        
        <Header 
          title={getPageTitle()}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          searchQuery=""
          setSearchQuery={() => {}}
          onOpenHelp={() => setShowHelpModal(true)}
        />

        {/* Inner Content Padding Container */}
        <main className="p-4 md:p-8 flex-1 w-full mx-auto">
          
          {/* Active View Selector */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              state={state} 
              setState={setState} 
              setActiveTab={setActiveTab}
              onOpenQuickAdd={() => {
                setQuickType('expense');
                setShowQuickAddModal(true);
              }}
            />
          )}

          {activeTab === 'saham' && (
            <SahamView state={state} setState={setState} />
          )}

          {activeTab === 'finansial' && (
            <FinansialView state={state} setState={setState} />
          )}

          {activeTab === 'aset' && (
            <AsetView state={state} setState={setState} />
          )}

          {activeTab === 'hutang' && (
            <HutangView state={state} setState={setState} />
          )}

          {activeTab === 'wishlist' && (
            <WishlistView state={state} setState={setState} />
          )}

          {activeTab === 'kripto' && (
            <KriptoView state={state} setState={setState} />
          )}

          {activeTab === 'tabungan' && (
            <TabunganView state={state} setState={setState} />
          )}

        </main>
      </div>

      {/* 3. Mobile Navigation Bottom Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ================= MODAL WINDOWS & OVERLAYS ================= */}

      {/* A. TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto bg-slate-900/90 dark:bg-slate-800 text-white px-5 py-4 rounded-2xl flex items-center gap-3 z-50 shadow-2xl backdrop-blur-md max-w-md animate-bounce border border-slate-700/50">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* B. QUICK TRANSACTION MODAL (Kirim / Terima) */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowQuickAddModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative border border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowQuickAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                <span>Transaksi Kilat</span>
              </h3>
              <p className="text-xs text-slate-400">Catat transaksi cepat untuk mengupdate saldo dashboard Anda</p>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Tipe Transaksi</label>
                <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                  {(['expense', 'income', 'stock', 'crypto'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuickType(t)}
                      className={`py-1.5 text-[10px] font-extrabold rounded-lg capitalize transition-all ${
                        quickType === t 
                          ? 'bg-brand-primary dark:bg-brand-primary-container text-white shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {t === 'expense' ? 'Keluar' : t === 'income' ? 'Masuk' : t}
                    </button>
                  ))}
                </div>
              </div>

              {(quickType === 'stock' || quickType === 'crypto') && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ticker / Pair</label>
                  <input 
                    type="text" 
                    value={quickPair}
                    onChange={(e) => setQuickPair(e.target.value)}
                    placeholder={quickType === 'stock' ? 'BBCA' : 'BTC'}
                    className="w-full px-3 py-2 text-sm border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 uppercase"
                    required
                  />
                </div>
              )}

              {quickType === 'expense' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kategori</label>
                  <select 
                    value={quickCategory} 
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  >
                    <option value="Makan">Makan & Minum</option>
                    <option value="Hiburan">Hiburan / Langganan</option>
                    <option value="Wifi">Utilitas / Internet</option>
                    <option value="Investasi">Investasi Portofolio</option>
                    <option value="Belanja">Belanja Bulanan</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Keperluan / Keterangan</label>
                <input 
                  type="text" 
                  value={quickLabel}
                  onChange={(e) => setQuickLabel(e.target.value)}
                  placeholder="misal: Gaji, Kopi Starbucks, Trading Profit"
                  className="w-full px-3 py-2 text-sm border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nominal (Rupiah Rp)</label>
                <input 
                  type="number" 
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  placeholder="misal: 150000"
                  className="w-full px-3 py-2 text-sm border dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-primary dark:bg-brand-primary-container text-white py-3 rounded-2xl font-black text-sm hover:opacity-95 shadow-lg shadow-brand-primary/10 transition-all cursor-pointer"
              >
                Simpan & Update Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* C. HELP TUTORIAL MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative border dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-3 items-center">
              <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 font-display">Panduan KyyFinance</h3>
                <p className="text-xs text-slate-400">Cara memaksimalkan aplikasi catatan keuangan Anda</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 max-h-[350px] overflow-y-auto pr-2">
              <p>Selamat datang di <strong>KyyFinance</strong>, sistem manajemen keuangan modern yang terintegrasi penuh.</p>
              
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">📊 1. Integrasi Saldo & Tabungan</h5>
                <p className="text-xs">Dashboard secara otomatis menghitung ringkasan aset Anda. Menabung target liburan atau mendepositkan ke platform aset akan memotong saldo utama secara langsung demi keamanan anggaran.</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">📈 2. Jurnal Saham & Kripto Terpisah</h5>
                <p className="text-xs">Kami memisahkan jurnal portofolio Saham (dalam IDR) dan Kripto (dalam USD) agar Anda dapat menghitung Win Rate dan profitabilitas trading dengan presisi.</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">🤝 3. Hutang & Piutang</h5>
                <p className="text-xs">Kelola semua hutang jatuh tempo. Anda dapat mengubah status lunas, bayar sebagian, atau menghapus tagihan secara interaktif di menu Hutang.</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">💖 4. Offline Storage</h5>
                <p className="text-xs">Semua data disimpan secara lokal di browser Anda (Local Storage), sehingga data Anda 100% aman dan tidak akan hilang meskipun halaman di-refresh.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
