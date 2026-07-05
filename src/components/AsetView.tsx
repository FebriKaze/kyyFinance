import React, { useState } from 'react';
import { Briefcase, Plus, Search, Trash2, Calendar, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AppState, MonthlyAsset } from '../types';
import { formatIDR } from '../utils';

interface AsetViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function AsetView({ state, setState }: AsetViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Form State
  const [bulanTahun, setBulanTahun] = useState('April 2026');
  const [namaAset, setNamaAset] = useState('Stockbit');
  const [modalAwal, setModalAwal] = useState('500000');
  const [totalDeposit, setTotalDeposit] = useState('0');
  const [saldoSaatIni, setSaldoSaatIni] = useState('545000');
  const [status, setStatus] = useState<'Active' | 'Drawdown'>('Active');

  // Calculations
  const assets = state.monthlyAssets;
  const totalModalTerinvestasi = assets.reduce((acc, a) => acc + a.modalAwal + a.totalDeposit, 0);
  const totalSaldoSaatIni = assets.reduce((acc, a) => acc + a.saldoSaatIni, 0);
  const totalPnl = totalSaldoSaatIni - totalModalTerinvestasi;
  const averageGainPercent = totalModalTerinvestasi > 0 ? (totalPnl / totalModalTerinvestasi) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAset || !modalAwal || !saldoSaatIni) return;

    const mVal = Number(modalAwal);
    const dVal = Number(totalDeposit);
    const sVal = Number(saldoSaatIni);
    const calculatedPnl = sVal - (mVal + dVal);
    const calculatedGain = (mVal + dVal) > 0 ? (calculatedPnl / (mVal + dVal)) * 100 : 0;

    const newAsset: MonthlyAsset = {
      id: `asset-${Date.now()}`,
      bulanTahun,
      namaAset,
      modalAwal: mVal,
      totalDeposit: dVal,
      saldoSaatIni: sVal,
      pnl: calculatedPnl,
      gainPercent: parseFloat(calculatedGain.toFixed(2)),
      status: calculatedPnl < 0 ? 'Drawdown' : 'Active'
    };

    setState(prev => ({
      ...prev,
      monthlyAssets: [newAsset, ...prev.monthlyAssets],
      // Adjust overall balance too!
      totalSaldo: prev.totalSaldo + calculatedPnl
    }));

    setShowAddForm(false);
    // Reset inputs
    setNamaAset('');
    setModalAwal('');
    setTotalDeposit('');
    setSaldoSaatIni('');
  };

  const handleDelete = (id: string) => {
    const assetToDelete = state.monthlyAssets.find(a => a.id === id);
    if (!assetToDelete) return;

    setState(prev => ({
      ...prev,
      monthlyAssets: prev.monthlyAssets.filter(a => a.id !== id),
      totalSaldo: prev.totalSaldo - assetToDelete.pnl
    }));
  };

  const filteredAssets = assets.filter(a => 
    a.namaAset.toLowerCase().includes(filterQuery.toLowerCase()) ||
    a.bulanTahun.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Asset Tracker Headers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Worth */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-brand-primary/10 rounded-lg text-brand-primary dark:text-brand-on-primary-container">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nilai Aset Bersih</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {formatIDR(totalSaldoSaatIni)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">+12.4% vs bulan lalu</p>
        </div>

        {/* Modal Terinvestasi */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-700 dark:text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Modal Terinvestasi</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {formatIDR(totalModalTerinvestasi)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Total modal pokok masuk</p>
        </div>

        {/* Total Profit/Loss */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-green-50 dark:bg-green-950/40 rounded-lg text-green-700 dark:text-green-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Profit/Loss</span>
          <h3 className={`text-2xl font-black mt-2 font-display ${totalPnl >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
            {formatIDR(totalPnl)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Gain rata-rata: {averageGainPercent.toFixed(2)}%</p>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Cari aset atau bulan..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary dark:bg-brand-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Aset Bulanan</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-primary" />
            <span>Tambah Pencatatan Portofolio Aset</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Bulan & Tahun</label>
              <input 
                type="text" 
                value={bulanTahun} 
                onChange={(e) => setBulanTahun(e.target.value)} 
                placeholder="misal: April 2026" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nama Aset / Platform</label>
              <input 
                type="text" 
                value={namaAset} 
                onChange={(e) => setNamaAset(e.target.value)} 
                placeholder="misal: Stockbit, Bibit, Pluang" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Modal Awal (Rp)</label>
              <input 
                type="number" 
                value={modalAwal} 
                onChange={(e) => setModalAwal(e.target.value)} 
                placeholder="misal: 1000000" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Total Deposit Tambahan (Rp)</label>
              <input 
                type="number" 
                value={totalDeposit} 
                onChange={(e) => setTotalDeposit(e.target.value)} 
                placeholder="0" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Saldo Saat Ini (Rp)</label>
              <input 
                type="number" 
                value={saldoSaatIni} 
                onChange={(e) => setSaldoSaatIni(e.target.value)} 
                placeholder="misal: 1100000" 
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
              Simpan Pencatatan
            </button>
          </div>
        </form>
      )}

      {/* Asset List Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Bulan & Tahun</th>
                <th className="px-6 py-4">Nama Aset / Akun</th>
                <th className="px-6 py-4 text-right">Modal Pokok (Awal)</th>
                <th className="px-6 py-4 text-right">Top Up / Deposit</th>
                <th className="px-6 py-4 text-right">Saldo Saat Ini</th>
                <th className="px-6 py-4 text-right">P&L</th>
                <th className="px-6 py-4 text-right">Gain (%)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{asset.bulanTahun}</td>
                  <td className="px-6 py-4 font-medium text-brand-primary dark:text-brand-on-primary-container">{asset.namaAset}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">{formatIDR(asset.modalAwal)}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">{formatIDR(asset.totalDeposit)}</td>
                  <td className="px-6 py-4 text-right font-bold font-mono text-xs text-slate-900 dark:text-slate-100">{formatIDR(asset.saldoSaatIni)}</td>
                  <td className={`px-6 py-4 text-right font-black font-mono text-xs ${asset.pnl >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                    {asset.pnl >= 0 ? '+' : ''}{formatIDR(asset.pnl)}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold font-mono text-xs ${asset.gainPercent >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                    {asset.gainPercent >= 0 ? '+' : ''}{asset.gainPercent}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`mx-auto px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center justify-center gap-1 w-max ${
                      asset.pnl >= 0 
                        ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    }`}>
                      {asset.pnl >= 0 ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{asset.pnl >= 0 ? 'Active' : 'Drawdown'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(asset.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                    Belum ada portofolio aset bulanan yang dicatat.
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
