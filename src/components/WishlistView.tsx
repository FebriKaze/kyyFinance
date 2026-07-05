import React, { useState } from 'react';
import { Heart, Plus, Trash2, Laptop, Plane, Car, Smartphone, Home, Sparkles, HelpCircle } from 'lucide-react';
import { AppState, WishlistItem } from '../types';
import { formatIDR } from '../utils';

interface WishlistViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function WishlistView({ state, setState }: WishlistViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Form State
  const [nama, setNama] = useState('');
  const [targetHarga, setTargetHarga] = useState('');
  const [terkumpul, setTerkumpul] = useState('');
  const [targetTanggal, setTargetTanggal] = useState('1 Desember 2026');
  const [iconName, setIconName] = useState<WishlistItem['iconName']>('other');

  // Calculations
  const wishlist = state.wishlistItems;
  const totalTarget = wishlist.reduce((acc, item) => acc + item.targetHarga, 0);
  const totalTerkumpul = wishlist.reduce((acc, item) => acc + item.terkumpul, 0);
  const averageProgress = wishlist.length > 0 ? Math.round((totalTerkumpul / totalTarget) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !targetHarga) return;

    const newWish: WishlistItem = {
      id: `wish-${Date.now()}`,
      nama,
      targetHarga: Number(targetHarga),
      terkumpul: Number(terkumpul) || 0,
      targetTanggal,
      iconName
    };

    setState(prev => ({
      ...prev,
      wishlistItems: [...prev.wishlistItems, newWish]
    }));

    setShowAddForm(false);
    // Reset
    setNama('');
    setTargetHarga('');
    setTerkumpul('');
  };

  const handleDelete = (id: string) => {
    setState(prev => ({
      ...prev,
      wishlistItems: prev.wishlistItems.filter(w => w.id !== id)
    }));
  };

  const handleFund = (id: string, amount: number) => {
    setState(prev => {
      const item = prev.wishlistItems.find(w => w.id === id);
      if (!item || prev.totalSaldo < amount) return prev; // check balance
      
      const newTerkumpul = Math.min(item.terkumpul + amount, item.targetHarga);
      return {
        ...prev,
        totalSaldo: prev.totalSaldo - amount,
        wishlistItems: prev.wishlistItems.map(w => 
          w.id === id ? { ...w, terkumpul: newTerkumpul } : w
        )
      };
    });
  };

  const renderIcon = (name: WishlistItem['iconName']) => {
    switch(name) {
      case 'laptop_mac': return <Laptop className="w-5 h-5" />;
      case 'flight_takeoff': return <Plane className="w-5 h-5" />;
      case 'directions_car': return <Car className="w-5 h-5" />;
      case 'smartphone': return <Smartphone className="w-5 h-5" />;
      case 'house': return <Home className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const filteredWishlist = wishlist.filter(w => 
    w.nama.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Target Wishlist</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {formatIDR(totalTarget)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Jumlah dana yang dibutuhkan</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Terkumpul</span>
          <h3 className="text-2xl font-black text-brand-primary dark:text-brand-on-primary-container mt-2 font-display">
            {formatIDR(totalTerkumpul)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Dana teralokasikan aman</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rata-rata Progress</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-2 font-display">
            {averageProgress}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Dari total {wishlist.length} item impian</p>
        </div>

      </div>

      {/* Filter and Add */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input 
          type="text" 
          placeholder="Cari item impian..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="px-4 py-2 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-primary dark:bg-brand-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Impian</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Tambah Item Baru ke Daftar Wishlist
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nama Barang / Impian</label>
              <input 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                placeholder="misal: Vespa Matic, iPhone 17" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Pilih Kategori Icon</label>
              <select 
                value={iconName} 
                onChange={(e) => setIconName(e.target.value as any)} 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="laptop_mac">Laptop / Komputer</option>
                <option value="flight_takeoff">Liburan / Travel</option>
                <option value="directions_car">Kendaraan / Servis</option>
                <option value="smartphone">Gawai / Smartphone</option>
                <option value="house">Properti / Rumah</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Target Harga (Rp)</label>
              <input 
                type="number" 
                value={targetHarga} 
                onChange={(e) => setTargetHarga(e.target.value)} 
                placeholder="misal: 15000000" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Sudah Terkumpul (Rp)</label>
              <input 
                type="number" 
                value={terkumpul} 
                onChange={(e) => setTerkumpul(e.target.value)} 
                placeholder="0" 
                className="w-full p-2 text-sm border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Estimasi Tanggal Terwujud</label>
              <input 
                type="text" 
                value={targetTanggal} 
                onChange={(e) => setTargetTanggal(e.target.value)} 
                placeholder="misal: Desember 2026" 
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
              Simpan Impian
            </button>
          </div>
        </form>
      )}

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWishlist.map((item) => {
          const percent = Math.round((item.terkumpul / item.targetHarga) * 100);
          return (
            <div key={item.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary dark:text-brand-on-primary-container">
                  {renderIcon(item.iconName)}
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-300 hover:text-red-500 dark:hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{item.nama}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: {item.targetTanggal}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Progres: {percent}%</span>
                  <span>{formatIDR(item.terkumpul)} / {formatIDR(item.targetHarga)}</span>
                </div>
                
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary dark:bg-brand-primary-container rounded-full" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Alokasikan dari saldo utama:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleFund(item.id, 500000)}
                    disabled={state.totalSaldo < 500000}
                    className="px-2.5 py-1 bg-brand-primary/10 dark:bg-slate-800 text-brand-primary dark:text-slate-300 font-bold text-[10px] rounded hover:bg-brand-primary/20 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                  >
                    +500rb
                  </button>
                  <button
                    onClick={() => handleFund(item.id, 1000000)}
                    disabled={state.totalSaldo < 1000000}
                    className="px-2.5 py-1 bg-brand-primary text-white font-bold text-[10px] rounded hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    +1Jt
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredWishlist.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs">
            Tidak ada item wishlist yang ditemukan.
          </div>
        )}
      </div>

    </div>
  );
}
