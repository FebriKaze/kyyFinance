import React, { useState } from 'react';
import { PiggyBank, Plus, Trash2, Search, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { AppState, SavingTransaction } from '../types';
import { formatIDR } from '../utils';

interface TabunganViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function TabunganView({ state, setState }: TabunganViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Form State
  const [bulan, setBulan] = useState('November');
  const [namaTabungan, setNamaTabungan] = useState('Macbook Air M2');
  const [saldoAwal, setSaldoAwal] = useState('13000000');
  const [setoran, setSetoran] = useState('1500000');
  const [penarikan, setPenarikan] = useState('0');

  // Emergency Fund State Modifiers
  const [emergencyTarget, setEmergencyTarget] = useState(50000000);
  const [emergencyCurrent, setEmergencyCurrent] = useState(13000000);

  // Calculations
  const savings = state.savingTransactions;
  const totalSavingsVal = emergencyCurrent;
  const emergencyPercent = Math.round((emergencyCurrent / emergencyTarget) * 100);
  const totalSetoran = savings.reduce((sum, s) => sum + s.setoran, 0);
  const totalPenarikan = savings.reduce((sum, s) => sum + s.penarikan, 0);
  const latestBalance = savings.length > 0 ? savings[savings.length - 1].saldoSaatIni : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTabungan || !saldoAwal) return;

    const sAwal = Number(saldoAwal);
    const setVal = Number(setoran) || 0;
    const penVal = Number(penarikan) || 0;
    const sSaatIni = sAwal + setVal - penVal;

    const newSavingsTrx: SavingTransaction = {
      id: `saving-${Date.now()}`,
      bulan,
      namaTabungan,
      saldoAwal: sAwal,
      setoran: setVal,
      penarikan: penVal,
      saldoSaatIni: sSaatIni
    };

    setState(prev => ({
      ...prev,
      savingTransactions: [...prev.savingTransactions, newSavingsTrx]
    }));

    if (namaTabungan.toLowerCase().includes('darurat') || namaTabungan.toLowerCase().includes('macbook')) {
      setEmergencyCurrent(prev => prev + setVal - penVal);
    }

    setShowAddForm(false);
    setSetoran('1500000');
    setPenarikan('0');
  };

  const handleDelete = (id: string) => {
    const item = state.savingTransactions.find(s => s.id === id);
    if (item && (item.namaTabungan.toLowerCase().includes('darurat') || item.namaTabungan.toLowerCase().includes('macbook'))) {
      setEmergencyCurrent(prev => Math.max(0, prev - item.setoran + item.penarikan));
    }
    setState(prev => ({
      ...prev,
      savingTransactions: prev.savingTransactions.filter(s => s.id !== id)
    }));
  };

  const filteredSavings = savings.filter(s => 
    s.namaTabungan.toLowerCase().includes(filterQuery.toLowerCase()) ||
    s.bulan.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const maxBalance = Math.max(1, ...savings.map(s => s.saldoSaatIni));

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Saldo Tabungan */}
        <div className="rounded-2xl p-6 relative overflow-hidden bg-brand-primary dark:bg-slate-900/40 text-white border-none shadow-lg">
          <div className="absolute right-4 top-4 p-2 bg-white/10 rounded-lg">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Total Saldo Tabungan</span>
          <h3 className="text-2xl font-black mt-2 font-display">
            {formatIDR(totalSavingsVal)}
          </h3>
          <p className="text-xs text-white/70 mt-1.5">Tersimpan dalam rekening khusus & dana cair</p>
        </div>

        {/* Emergency Fund Progress */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progres Dana Darurat</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-1 font-display">
                {emergencyPercent}% Terkumpul
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{formatIDR(emergencyCurrent)}</span>
              <span>Target: {formatIDR(emergencyTarget)}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary rounded-full transition-all duration-700"
                style={{ width: `${emergencyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-2xl p-6">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ringkasan Mutasi</span>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-50 dark:bg-green-950/40 rounded-lg text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Setoran</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400 font-mono text-sm">+{formatIDR(totalSetoran)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-600 dark:text-red-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Penarikan</span>
              </div>
              <span className="font-bold text-red-600 font-mono text-sm">-{formatIDR(totalPenarikan)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Saldo Terakhir</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono text-sm">{formatIDR(latestBalance)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Savings Growth Chart */}
      {savings.length > 1 && (
        <div className="glass-card rounded-2xl p-6">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Pertumbuhan Saldo Tabungan</h4>
          <div className="h-44 flex items-end gap-2">
            {savings.map((s, i) => {
              const heightPercent = (s.saldoSaatIni / maxBalance) * 100;
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 dark:bg-slate-700 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    {formatIDR(s.saldoSaatIni)}
                  </div>
                  <div 
                    className="w-full rounded-t-md transition-all duration-500 ease-out cursor-pointer"
                    style={{ 
                      height: `${Math.max(heightPercent, 4)}%`,
                      background: `linear-gradient(to top, #0f5238, #2d6a4f)`
                    }}
                  />
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">{s.bulan.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Cari target tabungan atau bulan..."
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
          <span>Tambah Mutasi Tabungan</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Catat Setoran atau Penarikan Tabungan
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Bulan</label>
              <input 
                type="text" 
                value={bulan} 
                onChange={(e) => setBulan(e.target.value)} 
                placeholder="misal: November" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nama Tabungan / Tujuan</label>
              <input 
                type="text" 
                value={namaTabungan} 
                onChange={(e) => setNamaTabungan(e.target.value)} 
                placeholder="misal: Macbook Air M2, Dana Darurat" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 font-mono text-brand-primary">Saldo Awal (Rp)</label>
              <input 
                type="number" 
                value={saldoAwal} 
                onChange={(e) => setSaldoAwal(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Setoran (+) Rp</label>
              <input 
                type="number" 
                value={setoran} 
                onChange={(e) => setSetoran(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 font-mono text-red-500">Penarikan (-) Rp</label>
              <input 
                type="number" 
                value={penarikan} 
                onChange={(e) => setPenarikan(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
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

      {/* Savings Ledger Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Bulan</th>
                <th className="px-6 py-4">Pos Tabungan / Tujuan</th>
                <th className="px-6 py-4 text-right">Saldo Awal</th>
                <th className="px-6 py-4 text-right">Setoran (+)</th>
                <th className="px-6 py-4 text-right">Penarikan (-)</th>
                <th className="px-6 py-4 text-right">Saldo Akhir</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSavings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{item.bulan}</td>
                  <td className="px-6 py-4 font-medium text-brand-primary dark:text-brand-on-primary-container">{item.namaTabungan}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs">{formatIDR(item.saldoAwal)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-700 dark:text-green-400 font-mono text-xs">
                    {item.setoran > 0 ? `+${formatIDR(item.setoran)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600 font-mono text-xs">
                    {item.penarikan > 0 ? `-${formatIDR(item.penarikan)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-slate-100 font-mono text-xs">{formatIDR(item.saldoSaatIni)}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSavings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <PiggyBank className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm font-medium">Belum ada mutasi tabungan</p>
                      <p className="text-xs text-slate-400">Mulai catat tabungan bulanan kamu dengan klik tombol di atas</p>
                    </div>
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
