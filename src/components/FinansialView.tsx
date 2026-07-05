import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Search, Trash2, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { AppState, FinancialTransaction } from '../types';
import { formatIDR } from '../utils';

interface FinansialViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function FinansialView({ state, setState }: FinansialViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  
  // Form State
  const [tanggal, setTanggal] = useState('2025-02-28');
  const [kategori, setKategori] = useState('Gaji');
  const [keperluan, setKeperluan] = useState('');
  const [akun, setAkun] = useState('BLU (Bca Digital)');
  const [jumlah, setJumlah] = useState('');
  const [tipe, setTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pengeluaran');

  const categories = [
    'Gaji', 'Bonus', 'Makan', 'Hiburan', 'Investasi', 
    'Ngasih Ortu', 'Hutang', 'Wifi', 'Belanja', 'Lainnya'
  ];

  const accounts = [
    'BLU (Bca Digital)', 'BCA Utama', 'Mandiri', 
    'GoPay', 'OVO', 'Cash (Tunai)'
  ];

  // Calculations
  const transactions = state.transactions;
  const totalPemasukan = transactions
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((acc, t) => acc + Math.abs(t.jumlah), 0);

  const totalPengeluaran = transactions
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((acc, t) => acc + Math.abs(t.jumlah), 0);

  const totalSaldoBulanIni = totalPemasukan - totalPengeluaran;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumlah || !keperluan) return;

    const numAmount = Math.abs(Number(jumlah));
    const signedAmount = tipe === 'Pemasukan' ? numAmount : -numAmount;

    const newTransaction: FinancialTransaction = {
      id: `fin-${Date.now()}`,
      tanggal,
      kategori,
      keperluan,
      akun,
      jumlah: signedAmount,
      tipe
    };

    setState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
      // Adjust overall dashboard total balance
      totalSaldo: prev.totalSaldo + signedAmount
    }));

    setShowAddForm(false);
    // Reset inputs
    setKeperluan('');
    setJumlah('');
  };

  const handleDelete = (id: string) => {
    const trxToDelete = state.transactions.find(t => t.id === id);
    if (!trxToDelete) return;

    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
      totalSaldo: prev.totalSaldo - trxToDelete.jumlah
    }));
  };

  const filteredTransactions = transactions.filter(t => 
    t.kategori.toLowerCase().includes(filterCategory.toLowerCase()) ||
    t.keperluan.toLowerCase().includes(filterCategory.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Finansial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Saldo Bulan Ini */}
        <div className="rounded-2xl p-6 relative overflow-hidden bg-brand-primary dark:bg-slate-900/40 border-none text-white shadow-lg">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute right-4 top-4 p-2 bg-white/10 rounded-lg text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Arus Kas Bersih (Bulan Ini)</span>
          <h3 className="text-2xl font-black mt-2 font-display">
            {formatIDR(totalSaldoBulanIni)}
          </h3>
          <p className="text-xs text-white/70 mt-1.5">Kombinasi kas masuk dan keluar</p>
        </div>

        {/* Total Pemasukan */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute right-4 top-4 p-2 bg-green-50 dark:bg-green-950/40 rounded-lg text-green-700 dark:text-green-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pemasukan</span>
          <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mt-2 font-display">
            {formatIDR(totalPemasukan)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Dari {transactions.filter(t => t.tipe === 'Pemasukan').length} pemasukan</p>
        </div>

        {/* Total Pengeluaran */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute right-4 top-4 p-2 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-600 dark:text-red-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pengeluaran</span>
          <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mt-2 font-display">
            {formatIDR(totalPengeluaran)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Tersebar di {transactions.filter(t => t.tipe === 'Pengeluaran').length} pos pengeluaran</p>
        </div>

      </div>

      {/* Filter & Tambah Transaksi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Cari keperluan atau kategori (e.g. Gaji, Makan)..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary dark:bg-brand-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi Baru</span>
        </button>
      </div>

      {/* Form Tambah Transaksi */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-brand-primary" />
            <span>Form Input Catatan Keuangan</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Tipe Transaksi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipe('Pemasukan')}
                  className={`py-2 text-sm font-bold rounded-lg transition-all border ${
                    tipe === 'Pemasukan' 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pemasukan (+)
                </button>
                <button
                  type="button"
                  onClick={() => setTipe('Pengeluaran')}
                  className={`py-2 text-sm font-bold rounded-lg transition-all border ${
                    tipe === 'Pengeluaran' 
                      ? 'bg-red-500 border-red-500 text-white' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pengeluaran (-)
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Tanggal</label>
              <input 
                type="date" 
                value={tanggal} 
                onChange={(e) => setTanggal(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Kategori</label>
              <select 
                value={kategori} 
                onChange={(e) => setKategori(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Metode Pembayaran (Akun)</label>
              <select 
                value={akun} 
                onChange={(e) => setAkun(e.target.value)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {accounts.map((acc) => (
                  <option key={acc} value={acc}>{acc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Keperluan / Keterangan</label>
              <input 
                type="text" 
                value={keperluan} 
                onChange={(e) => setKeperluan(e.target.value)} 
                placeholder="misal: Makan Siang Nasi Padang" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nominal (Rp)</label>
              <input 
                type="number" 
                value={jumlah} 
                onChange={(e) => setJumlah(e.target.value)} 
                placeholder="misal: 55000" 
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
              Simpan Transaksi
            </button>
          </div>
        </form>
      )}

      {/* Tabel Transaksi */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Keperluan / Deskripsi</th>
                <th className="px-6 py-4">Akun Pembayaran</th>
                <th className="px-6 py-4 text-right">Jumlah (IDR)</th>
                <th className="px-6 py-4 text-center">Tipe</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{trx.tanggal}</td>
                  <td className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <Tag className="w-3.5 h-3.5 text-brand-primary/60" />
                      <span>{trx.kategori}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{trx.keperluan}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{trx.akun}</td>
                  <td className={`px-6 py-4 text-right font-extrabold ${trx.tipe === 'Pemasukan' ? 'text-green-700 dark:text-green-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {trx.tipe === 'Pemasukan' ? '+' : '-'}{formatIDR(Math.abs(trx.jumlah))}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`mx-auto px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center justify-center gap-1 w-max ${
                      trx.tipe === 'Pemasukan' 
                        ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    }`}>
                      {trx.tipe === 'Pemasukan' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{trx.tipe}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(trx.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    Belum ada data transaksi keuangan yang tercatat.
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
