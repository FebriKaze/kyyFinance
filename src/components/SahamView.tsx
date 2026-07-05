import React, { useState } from 'react';
import { TrendingUp, Plus, Search, Calendar, DollarSign, Filter, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppState, StockTrade } from '../types';
import { formatIDR } from '../utils';

interface SahamViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function SahamView({ state, setState }: SahamViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterPair, setFilterPair] = useState('');
  
  // Form State
  const [tanggal, setTanggal] = useState('28 Februari 2026');
  const [pair, setPair] = useState('BBCA');
  const [trend, setTrend] = useState<'Follow' | 'Counter'>('Follow');
  const [posisi, setPosisi] = useState<'Long' | 'Short'>('Long');
  const [tf, setTf] = useState('15m');
  const [pnl, setPnl] = useState('150000');
  const [gainPercent, setGainPercent] = useState('4.2');
  const [equity, setEquity] = useState('3600000');
  const [status, setStatus] = useState<'Win' | 'Lose'>('Win');

  // Calculations
  const stockTrades = state.stockTrades;
  const winTrades = stockTrades.filter(t => t.status === 'Win');
  const totalTradesCount = stockTrades.length;
  const winRate = totalTradesCount > 0 ? Math.round((winTrades.length / totalTradesCount) * 100) : 0;
  const totalPnl = stockTrades.reduce((acc, t) => acc + t.pnl, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pair || !pnl || !gainPercent || !equity) return;

    const newTrade: StockTrade = {
      id: `stock-${Date.now()}`,
      tanggal,
      pair,
      trend,
      posisi,
      tf,
      pnl: status === 'Win' ? Math.abs(Number(pnl)) : -Math.abs(Number(pnl)),
      gainPercent: status === 'Win' ? Math.abs(Number(gainPercent)) : -Math.abs(Number(gainPercent)),
      equity: Number(equity),
      status
    };

    setState(prev => ({
      ...prev,
      stockTrades: [newTrade, ...prev.stockTrades],
      // Adjust total saldo with PNL
      totalSaldo: prev.totalSaldo + newTrade.pnl
    }));

    setShowAddForm(false);
    // Reset inputs
    setPair('');
    setPnl('');
    setGainPercent('');
  };

  const handleDelete = (id: string) => {
    const tradeToDelete = state.stockTrades.find(t => t.id === id);
    if (!tradeToDelete) return;

    setState(prev => ({
      ...prev,
      stockTrades: prev.stockTrades.filter(t => t.id !== id),
      totalSaldo: prev.totalSaldo - tradeToDelete.pnl
    }));
  };

  const filteredTrades = stockTrades.filter(t => 
    t.pair.toLowerCase().includes(filterPair.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Kartu Statistika Saham */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total PNL Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-green-50 dark:bg-green-950/40 rounded-lg text-green-700 dark:text-green-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total P&L (Estimasi)</span>
          <h3 className={`text-2xl font-black mt-2 font-display ${totalPnl >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
            {formatIDR(totalPnl)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">+12.4% vs bulan lalu</p>
        </div>

        {/* Win Rate Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-brand-primary/10 rounded-lg text-brand-primary dark:text-brand-on-primary-container">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Win Rate</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {winRate}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Dari total {totalTradesCount} transaksi</p>
        </div>

        {/* Total Transaksi Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-700 dark:text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Transaksi</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {totalTradesCount}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Jurnal aktif terverifikasi</p>
        </div>

      </div>

      {/* Filter & Tambah Transaksi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Cari kode saham (e.g. BBCA, TLKM)..."
            value={filterPair}
            onChange={(e) => setFilterPair(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary dark:bg-brand-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurnal Saham</span>
        </button>
      </div>

      {/* Form Tambah Saham */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            <span>Form Tambah Jurnal Saham Baru</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Tanggal</label>
              <input 
                type="text" 
                value={tanggal} 
                onChange={(e) => setTanggal(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kode Saham (Ticker)</label>
              <input 
                type="text" 
                value={pair} 
                onChange={(e) => setPair(e.target.value)} 
                placeholder="misal: TLKM" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 uppercase" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Timeframe</label>
              <input 
                type="text" 
                value={tf} 
                onChange={(e) => setTf(e.target.value)} 
                placeholder="misal: 1d, 4h, 15m" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Trend</label>
              <select 
                value={trend} 
                onChange={(e) => setTrend(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="Follow">Follow Trend</option>
                <option value="Counter">Counter Trend</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Posisi</label>
              <select 
                value={posisi} 
                onChange={(e) => setPosisi(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="Long">Long (Beli)</option>
                <option value="Short">Short (Jual/Shoring)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Hasil (Status)</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="Win">Win (Untung)</option>
                <option value="Lose">Lose (Rugi)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">PNL Nominal (Rp)</label>
              <input 
                type="number" 
                value={pnl} 
                onChange={(e) => setPnl(e.target.value)} 
                placeholder="misal: 100000" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Gain Persentase (%)</label>
              <input 
                type="number" 
                step="0.01"
                value={gainPercent} 
                onChange={(e) => setGainPercent(e.target.value)} 
                placeholder="misal: 4.5" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ekuitas Akhir (Rp)</label>
              <input 
                type="number" 
                value={equity} 
                onChange={(e) => setEquity(e.target.value)} 
                placeholder="misal: 3500000" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="px-4 py-2 border dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-sm"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold"
            >
              Simpan Trade
            </button>
          </div>
        </form>
      )}

      {/* Tabel Jurnal Saham */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Saham (Pair)</th>
                <th className="px-6 py-4">Trend / Posisi</th>
                <th className="px-6 py-4">TF</th>
                <th className="px-6 py-4 text-right">P&L (IDR)</th>
                <th className="px-6 py-4 text-right">Gain (%)</th>
                <th className="px-6 py-4 text-right">Equity</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{trade.tanggal}</td>
                  <td className="px-6 py-4 font-black text-slate-800 dark:text-slate-200">{trade.pair}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">{trade.trend}</span>
                      <span className="text-slate-300">|</span>
                      <span className={`font-semibold ${trade.posisi === 'Long' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-500'}`}>{trade.posisi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{trade.tf}</td>
                  <td className={`px-6 py-4 text-right font-extrabold ${trade.pnl >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{formatIDR(trade.pnl)}
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${trade.gainPercent >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                    {trade.gainPercent >= 0 ? '+' : ''}{trade.gainPercent}%
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-slate-600 dark:text-slate-400">{formatIDR(trade.equity)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`mx-auto px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center justify-center gap-1 w-max ${
                      trade.status === 'Win' 
                        ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    }`}>
                      {trade.status === 'Win' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      <span>{trade.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(trade.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada data transaksi saham yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
