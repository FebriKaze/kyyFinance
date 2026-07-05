import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Briefcase, 
  CreditCard, 
  Heart, 
  Coins, 
  PiggyBank,
  MoreHorizontal,
  X
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'saham', label: 'Saham', icon: TrendingUp },
    { id: 'finansial', label: 'Finansial', icon: Wallet },
    { id: 'kripto', label: 'Kripto', icon: Coins },
  ];

  const secondaryItems = [
    { id: 'aset', label: 'Aset', icon: Briefcase },
    { id: 'hutang', label: 'Hutang', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'tabungan', label: 'Tabungan', icon: PiggyBank },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 px-4 z-40 transition-colors">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && !showMoreMenu;
          return (
            <button
              key={item.id}
              onClick={() => {
                setShowMoreMenu(false);
                setActiveTab(item.id);
              }}
              className={`flex flex-col items-center gap-1 flex-1 py-1 ${
                isActive 
                  ? 'text-brand-primary dark:text-brand-on-primary-container font-semibold' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center gap-1 flex-1 py-1 ${
            showMoreMenu || secondaryItems.some(item => item.id === activeTab)
              ? 'text-brand-primary dark:text-brand-on-primary-container font-semibold' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px]">Lainnya</span>
        </button>
      </nav>

      {/* More Options Drawer Overlay */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center md:hidden" onClick={() => setShowMoreMenu(false)}>
          <div 
            className="w-full bg-white dark:bg-slate-950 rounded-t-3xl p-6 pb-12 max-h-[80vh] overflow-y-auto space-y-6 transition-transform transform translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Fitur Keuangan Lainnya</h3>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'bg-brand-primary/10 dark:bg-brand-primary-container/20 border-brand-primary text-brand-primary dark:text-brand-on-primary-container font-bold'
                        : 'border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-brand-primary text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-900 grid grid-cols-2 gap-4 text-center">
              <div className="text-[11px] text-slate-400 dark:text-slate-500 col-span-2">
                KyyFinance - Manajemen Keuangan Pintar
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
