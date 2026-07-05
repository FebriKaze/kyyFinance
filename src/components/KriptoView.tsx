import React, { useState } from 'react';
import { Coins, Plus, Search, Trash2, ShieldAlert, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { AppState, CryptoTrade } from '../types';
import { formatUSD } from '../utils';

interface KriptoViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function KriptoView({ state, setState }: KriptoViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Form State
  const [tanggal, setTanggal] = useState('25 Mei 2024');
  const [pair, setPair] = useState('BTC/USDT');
  const [trend, setTrend] = useState<'Bullish' | 'Bearish' | 'Side'>('Bullish');
  const [posisi, setPosisi] = useState<'LONG' | 'SHORT'>('LONG');
  const [pnl, setPnl] = useState('450');
  const [gainPercent, setGainPercent] = useState('1.85');
  const [equity, setEquity] = useState('52890');
  const [status, setStatus] = useState<'WIN' | 'LOSS'>('WIN');

  // Calculations
  const cryptoTrades = state.cryptoTrades;
  const wins = cryptoTrades.filter(t => t.status === 'WIN');
  const totalCryptoTrades = cryptoTrades.length;
  const winRate = totalCryptoTrades > 0 ? Math.round((wins.length / totalCryptoTrades) * 100) : 0;
  const totalPnl = cryptoTrades.reduce((acc, t) => acc + t.pnl, 0);
  const latestEquity = cryptoTrades.length > 0 ? cryptoTrades[0].equity : 52440;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pair || !pnl || !gainPercent || !equity) return;

    const parsedPnl = status === 'WIN' ? Math.abs(Number(pnl)) : -Math.abs(Number(pnl));
    const parsedGain = status === 'WIN' ? Math.abs(Number(gainPercent)) : -Math.abs(Number(gainPercent));

    const newTrade: CryptoTrade = {
      id: `crypto-${Date.now()}`,
      tanggal,
      pair: pair.toUpperCase(),
      trend,
      posisi,
      pnl: parsedPnl,
      gainPercent: parsedGain,
      equity: Number(equity),
      status
    };

    setState(prev => ({
      ...prev,
      cryptoTrades: [newTrade, ...prev.cryptoTrades]
    }));

    setShowAddForm(false);
    // Reset inputs
    setPair('');
    setPnl('');
    setGainPercent('');
  };

  const handleDelete = (id: string) => {
    setState(prev => ({
      ...prev,
      cryptoTrades: prev.cryptoTrades.filter(t => t.id !== id)
    }));
  };

  const filteredTrades = cryptoTrades.filter(t => 
    t.pair.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Crypto stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-yellow-100 dark:bg-yellow-950/30 rounded-lg text-yellow-600">
            <Coins className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Ekuitas (USD)</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {formatUSD(latestEquity)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Estimasi IDR: Rp{new Intl.NumberFormat('id-ID').format(Math.round(latestEquity * 15500))}</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-green-50 dark:bg-green-950/40 rounded-lg text-green-700 dark:text-green-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Akumulasi PNL Kripto</span>
          <h3 className={`text-2xl font-black mt-2 font-display ${totalPnl >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
            {totalPnl >= 0 ? '+' : ''}{formatUSD(totalPnl)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Win Rate: {winRate}% ({wins.length} dari {totalCryptoTrades} trade)</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden bg-slate-950 text-white border-none">
          <div className="absolute right-4 top-4 p-2 bg-white/10 rounded-lg text-white">
            <Coins className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hot Trend Market</span>
          <h3 className="text-xl font-bold mt-2 font-display">SOL/USDT</h3>
          <p className="text-xs text-green-400 mt-1.5">+14.21% (BULLISH Momentum)</p>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Cari pair kripto (e.g. BTC/USDT)..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <Coins className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary dark:bg-brand-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurnal Kripto</span>
        </button>
      </div>

      {/* Add Crypto Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Tambah Jurnal Transaksi Kripto Baru
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
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Crypto Pair / Ticker</label>
              <input 
                type="text" 
                value={pair} 
                onChange={(e) => setPair(e.target.value)} 
                placeholder="misal: BTC/USDT" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 uppercase" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Trend Analisis</label>
              <select 
                value={trend} 
                onChange={(e) => setTrend(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="Bullish">Bullish (Naik)</option>
                <option value="Bearish">Bearish (Turun)</option>
                <option value="Side">Side (Samping)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Posisi</label>
              <select 
                value={posisi} 
                onChange={(e) => setPosisi(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="LONG">LONG (BUY)</option>
                <option value="SHORT">SHORT (SELL)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">P&L (USD $)</label>
              <input 
                type="number" 
                value={pnl} 
                onChange={(e) => setPnl(e.target.value)} 
                placeholder="misal: 150" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Gain (%)</label>
              <input 
                type="number" 
                step="0.01"
                value={gainPercent} 
                onChange={(e) => setGainPercent(e.target.value)} 
                placeholder="misal: 2.5" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Ekuitas Hasil ($)</label>
              <input 
                type="number" 
                value={equity} 
                onChange={(e) => setEquity(e.target.value)} 
                placeholder="misal: 52000" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Status Trade</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="WIN">WIN (Profit)</option>
                <option value="LOSS">LOSS (Rugi)</option>
              </select>
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
              Simpan Trade Kripto
            </button>
          </div>
        </form>
      )}

      {/* Crypto Trades Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Ticker / Pair</th>
                <th className="px-6 py-4">Analisis Trend</th>
                <th className="px-6 py-4">Posisi</th>
                <th className="px-6 py-4 text-right">P&L ($ USD)</th>
                <th className="px-6 py-4 text-right">Gain (%)</th>
                <th className="px-6 py-4 text-right">Ekuitas Akhir</th>
                <th className="px-6 py-4 text-center">Hasil</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{trade.tanggal}</td>
                  <td className="px-6 py-4 font-black text-yellow-600 dark:text-yellow-500">{trade.pair}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{trade.trend}</td>
                  <td className={`px-6 py-4 font-bold ${trade.posisi === 'LONG' ? 'text-green-600' : 'text-red-500'}`}>{trade.posisi}</td>
                  <td className={`px-6 py-4 text-right font-black ${trade.pnl >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{formatUSD(trade.pnl)}
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${trade.gainPercent >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                    {trade.gainPercent >= 0 ? '+' : ''}{trade.gainPercent}%
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">{formatUSD(trade.equity)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`mx-auto px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center justify-center gap-1 w-max ${
                      trade.status === 'WIN' 
                        ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    }`}>
                      {trade.status === 'WIN' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      <span>{trade.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(trade.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada data trading kripto yang cocok.
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
