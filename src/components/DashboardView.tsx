import React, { useState } from 'react';
import { 
  Send, 
  Download, 
  FileText, 
  ArrowUpRight, 
  ArrowRight, 
  CreditCard, 
  TrendingUp, 
  ShoppingBag, 
  Coins, 
  Compass,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { AppState } from '../types';
import { formatIDR } from '../utils';

interface DashboardViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setActiveTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
}

export default function DashboardView({ state, setState, setActiveTab, onOpenQuickAdd }: DashboardViewProps) {
  const [noteText, setNoteText] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);
  const [notesList, setNotesList] = useState<string[]>(['Gaji bulan depan dialokasikan 40% ke Saham.', 'Bayar tagihan listrik maksimal tanggal 10.']);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim()) {
      setNotesList([noteText, ...notesList]);
      setNoteText('');
      setShowNoteField(false);
    }
  };

  // Find upcoming unpaid debts (like Kredivo)
  const upcomingDebts = state.debtItems.filter(item => item.tipe === 'Hutang' && item.status !== 'Lunas');

  return (
    <div className="space-y-6">
      
      {/* Row 1: Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Saldo */}
        <div className="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col gap-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-primary/5 dark:bg-brand-primary-container/10 rounded-full blur-3xl"></div>
          
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Saldo</span>
            <div className="flex items-baseline mt-1">
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300 mr-1.5">Rp</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-950 dark:text-slate-50 font-display">
                {new Intl.NumberFormat('id-ID').format(state.totalSaldo)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button 
              onClick={onOpenQuickAdd}
              className="flex items-center justify-center gap-2 bg-brand-primary dark:bg-brand-primary-container text-white py-3 px-4 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/10 dark:shadow-none"
            >
              <Send className="w-4 h-4" />
              <span>Kirim</span>
            </button>
            <button 
              onClick={onOpenQuickAdd}
              className="flex items-center justify-center gap-2 bg-brand-secondary-container dark:bg-slate-800 text-brand-on-secondary-container dark:text-slate-200 py-3 px-4 rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Terima</span>
            </button>
          </div>

          <div className="space-y-2 max-w-md">
            <button 
              onClick={() => setShowNoteField(!showNoteField)}
              className="w-full py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Tambah Catatan Keuangan</span>
            </button>

            {showNoteField && (
              <form onSubmit={handleAddNote} className="space-y-2 mt-2">
                <input 
                  type="text" 
                  placeholder="Tulis catatan keuangan cepat..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowNoteField(false)} className="text-[10px] px-2 py-1 text-slate-400">Batal</button>
                  <button type="submit" className="text-[10px] bg-brand-primary text-white px-2 py-1 rounded">Simpan</button>
                </div>
              </form>
            )}

            {notesList.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 max-h-[100px] overflow-y-auto">
                {notesList.map((note, idx) => (
                  <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-brand-primary">•</span>
                    <span className="flex-1">{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hutang Mendatang */}
        <div className="glass-card rounded-3xl p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Hutang Mendatang</h4>
              <button onClick={() => setActiveTab('hutang')} className="text-slate-400 dark:text-slate-500 hover:text-brand-primary">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {upcomingDebts.length > 0 ? (
                upcomingDebts.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{item.nama}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Jatuh tempo: {item.jatuhTempo || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600 dark:text-red-400 text-sm">{formatIDR(item.jumlah)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  Tidak ada hutang mendatang yang belum lunas.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Full Width Chart */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">Spending vs Income</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Perbandingan arus kas bulanan</p>
          </div>
          <div>
            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1.5 text-slate-700 dark:text-slate-300">
              <option>Desember 2024</option>
              <option>November 2024</option>
            </select>
          </div>
        </div>

        <div className="relative w-full h-[300px] overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-green" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0f5238', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#0f5238', stopOpacity: 0 }} />
                  </linearGradient>
                  <linearGradient id="grad-blue" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#064c6c', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#064c6c', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="90" x2="800" y2="90" stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="140" x2="800" y2="140" stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="190" x2="800" y2="190" stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" className="dark:stroke-slate-800" />
                
                {/* Income Curve (Green) */}
                <path 
                  d="M0,170 C100,150 200,80 300,100 C400,120 500,50 600,70 C700,90 800,40 800,40 V220 H0 Z" 
                  fill="url(#grad-green)" 
                />
                <path 
                  d="M0,170 C100,150 200,80 300,100 C400,120 500,50 600,70 C700,90 800,40 800,40" 
                  fill="none" 
                  stroke="#0f5238" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                
                {/* Spending Curve (Blue, Dashed) */}
                <path 
                  d="M0,200 C100,185 200,165 300,180 C400,190 500,140 600,160 C700,180 800,140 800,140 V220 H0 Z" 
                  fill="url(#grad-blue)" 
                />
                <path 
                  d="M0,200 C100,185 200,165 300,180 C400,190 500,140 600,160 C700,180 800,140 800,140" 
                  fill="none" 
                  stroke="#064c6c" 
                  strokeWidth="3" 
                  strokeDasharray="6 3" 
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-primary"></span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-tertiary"></span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pengeluaran</span>
              </div>
            </div>
          </div>

      {/* Row 3: Asset Allocation & Savings Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Alokasi Aset */}
        <div className="glass-card rounded-3xl p-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Alokasi Aset</h4>
          
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="transparent" stroke="#eceef0" strokeWidth="11" className="dark:stroke-slate-800" />
                <circle cx="60" cy="60" r="48" fill="transparent" stroke="#0f5238" strokeWidth="12" strokeDasharray="301.5" strokeDashoffset="180.9" strokeLinecap="round" />
                <circle cx="60" cy="60" r="48" fill="transparent" stroke="#064c6c" strokeWidth="12" strokeDasharray="301.5" strokeDashoffset="241.2" strokeLinecap="round" transform="rotate(144 60 60)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase leading-none">Kyy</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">Balanced</span>
              </div>
            </div>

            <div className="flex-grow space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                  <span className="text-slate-600 dark:text-slate-400">Saham</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-tertiary"></span>
                  <span className="text-slate-600 dark:text-slate-400">Crypto</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary"></span>
                  <span className="text-slate-600 dark:text-slate-400">Tabungan</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-slate-600 dark:text-slate-400">Cash</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Goal Target Liburan */}
        <div className="rounded-3xl p-6 bg-brand-primary dark:bg-slate-900/40 border-none text-white flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-on-primary-container dark:text-brand-on-primary-container">Target Liburan</h4>
              <p className="text-sm text-slate-200 mt-1">Jepang Autumn 2025</p>
            </div>
            <div className="p-2 bg-white/10 rounded-full">
              <Compass className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-xs font-bold">
              <span>Progres {Math.round((state.targetLiburanTerkumpul / state.targetLiburanTotal) * 100)}%</span>
              <span>{formatIDR(state.targetLiburanTerkumpul)} / {formatIDR(state.targetLiburanTotal)}</span>
            </div>
            
            <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000" 
                style={{ width: `${(state.targetLiburanTerkumpul / state.targetLiburanTotal) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/85 pt-1">
              <span className="italic">Sisa 10 bulan lagi!</span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => {
                    if (state.targetLiburanTerkumpul + 1000000 <= state.targetLiburanTotal) {
                      setState(prev => ({
                        ...prev,
                        targetLiburanTerkumpul: prev.targetLiburanTerkumpul + 1000000,
                        totalSaldo: prev.totalSaldo - 1000000
                      }));
                    }
                  }}
                  className="px-2 py-0.5 bg-white/20 rounded hover:bg-white/30 text-[10px]"
                >
                  + Tabung Rp1Jt
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabel Transaksi Terbaru */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">Transaksi Terbaru</h3>
          <button 
            onClick={() => setActiveTab('finansial')} 
            className="text-brand-primary dark:text-brand-on-primary-container font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Aset / Item</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">BBCA (BCA Stocks)</p>
                      <p className="text-xs text-slate-400">Dividen</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Saham</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">08 Des 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-max">
                    <CheckCircle className="w-3 h-3" />
                    <span>Berhasil</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-brand-primary dark:text-brand-on-primary-container">+Rp450.000</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Starbucks Coffee</p>
                      <p className="text-xs text-slate-400">Entertainment</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Keuangan</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">07 Des 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-max">
                    <CheckCircle className="w-3 h-3" />
                    <span>Berhasil</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">-Rp55.000</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-yellow-100 dark:bg-yellow-950/30 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Solana (SOL)</p>
                      <p className="text-xs text-slate-400">Investasi</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Crypto</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">06 Des 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-max">
                    <Clock className="w-3 h-3" />
                    <span>Proses</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">-Rp1.200.000</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-100 dark:bg-red-950/40 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Cicilan Motor</p>
                      <p className="text-xs text-slate-400">Hutang</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Aset</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">05 Des 2024</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full flex items-center gap-1 w-max">
                    <CheckCircle className="w-3 h-3" />
                    <span>Berhasil</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">-Rp2.150.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
