import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Briefcase, 
  CreditCard, 
  Heart, 
  Coins, 
  PiggyBank,
} from 'lucide-react';
import logoSrc from '@/assets/logo.jpeg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'saham', label: 'Saham', icon: TrendingUp },
  { id: 'finansial', label: 'Finansial', icon: Wallet },
  { id: 'aset', label: 'Aset', icon: Briefcase },
  { id: 'hutang', label: 'Hutang', icon: CreditCard },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'kripto', label: 'Kripto', icon: Coins },
  { id: 'tabungan', label: 'Tabungan', icon: PiggyBank },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-[72px] h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-5 z-40 hidden md:flex">
      <div className="mb-7">
        <img src={logoSrc} alt="KyyFinance" className="h-8 w-8 rounded-lg" />
      </div>

      <nav className="flex-grow flex flex-col items-center gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-primary dark:bg-brand-primary-container text-white shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-brand-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
