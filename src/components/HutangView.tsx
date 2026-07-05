import React, { useState } from 'react';
import { CreditCard, Plus, Search, Trash2, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AppState, DebtItem } from '../types';
import { formatIDR } from '../utils';

interface HutangViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function HutangView({ state, setState }: HutangViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Form State
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState<'Hutang' | 'Piutang'>('Hutang');
  const [jumlah, setJumlah] = useState('');
  const [jatuhTempo, setJatuhTempo] = useState('-');
  const [status, setStatus] = useState<'Lunas' | 'Belum Lunas' | 'Bayar Sebagian'>('Belum Lunas');
  const [catatan, setCatatan] = useState('Pinjam');

  // Calculations
  const debts = state.debtItems;
  const totalHutang = debts
    .filter(d => d.tipe === 'Hutang' && d.status !== 'Lunas')
    .reduce((acc, d) => acc + d.jumlah, 0);

  const totalPiutang = debts
    .filter(d => d.tipe === 'Piutang' && d.status !== 'Lunas')
    .reduce((acc, d) => acc + d.jumlah, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !jumlah) return;

    const newDebt: DebtItem = {
      id: `debt-${Date.now()}`,
      nama,
      tipe,
      jumlah: Number(jumlah),
      jatuhTempo: jatuhTempo || '-',
      status,
      catatan
    };

    setState(prev => ({
      ...prev,
      debtItems: [newDebt, ...prev.debtItems]
    }));

    setShowAddForm(false);
    // Reset inputs
    setNama('');
    setJumlah('');
    setJatuhTempo('-');
    setCatatan('Pinjam');
  };

  const handleDelete = (id: string) => {
    setState(prev => ({
      ...prev,
      debtItems: prev.debtItems.filter(d => d.id !== id)
    }));
  };

  const handleToggleStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      debtItems: prev.debtItems.map(d => {
        if (d.id === id) {
          const nextStatus = d.status === 'Belum Lunas' 
            ? 'Bayar Sebagian' 
            : d.status === 'Bayar Sebagian' 
              ? 'Lunas' 
              : 'Belum Lunas';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    }));
  };

  const filteredDebts = debts.filter(d => 
    d.nama.toLowerCase().includes(filterName.toLowerCase()) ||
    d.catatan.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Debt and Claims Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Hutang Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-600 dark:text-red-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Hutang Anda (Belum Lunas)</span>
          <h3 className="text-2xl font-black text-red-600 mt-2 font-display">
            {formatIDR(totalHutang)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Uang yang wajib Anda kembalikan</p>
        </div>

        {/* Total Piutang Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-green-50 dark:bg-green-950/40 rounded-lg text-green-700 dark:text-green-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Piutang (Klaim Tagihan)</span>
          <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mt-2 font-display">
            {formatIDR(totalPiutang)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Uang orang lain yang ada di Anda</p>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Cari nama orang atau catatan..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary dark:bg-brand-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Hutang / Piutang</span>
        </button>
      </div>

      {/* Add Debt Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-primary" />
            <span>Form Input Catatan Hutang Piutang</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Tipe</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipe('Hutang')}
                  className={`py-2 text-sm font-bold rounded-lg transition-all border ${
                    tipe === 'Hutang' 
                      ? 'bg-red-500 border-red-500 text-white' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Hutang (Pinjam Ke Orang)
                </button>
                <button
                  type="button"
                  onClick={() => setTipe('Piutang')}
                  className={`py-2 text-sm font-bold rounded-lg transition-all border ${
                    tipe === 'Piutang' 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Piutang (Orang Pinjam Ke Kita)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nama Orang / Lembaga</label>
              <input 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                placeholder="misal: Herman, Bank Mandiri" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Jumlah (Nominal Rp)</label>
              <input 
                type="number" 
                value={jumlah} 
                onChange={(e) => setJumlah(e.target.value)} 
                placeholder="misal: 300000" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Jatuh Tempo (Opsional)</label>
              <input 
                type="text" 
                value={jatuhTempo} 
                onChange={(e) => setJatuhTempo(e.target.value)} 
                placeholder="misal: 25 Oktober 2026 atau -" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Keterangan / Catatan</label>
              <input 
                type="text" 
                value={catatan} 
                onChange={(e) => setCatatan(e.target.value)} 
                placeholder="misal: Pinjam, Paylater, Cicilan" 
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
              Simpan Catatan
            </button>
          </div>
        </form>
      )}

      {/* Debts Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Pemberi / Penerima</th>
                <th className="px-6 py-4">Kategori (Tipe)</th>
                <th className="px-6 py-4 text-right">Jumlah Tagihan</th>
                <th className="px-6 py-4">Jatuh Tempo</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-center">Status Pembayaran</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDebts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{item.nama}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full w-max flex items-center gap-1 ${
                      item.tipe === 'Hutang' 
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400' 
                        : 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                    }`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black font-mono text-xs ${item.tipe === 'Hutang' ? 'text-red-600' : 'text-green-700 dark:text-green-400'}`}>
                    {formatIDR(item.jumlah)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-mono">{item.jatuhTempo}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">{item.catatan}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggleStatus(item.id)}
                      className={`mx-auto px-2.5 py-1.5 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                        item.status === 'Lunas' 
                          ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                          : item.status === 'Bayar Sebagian' 
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' 
                            : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      }`}
                      title="Klik untuk ubah status"
                    >
                      {item.status === 'Lunas' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{item.status}</span>
                    </button>
                  </td>
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

              {filteredDebts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada catatan hutang piutang yang sesuai.
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
