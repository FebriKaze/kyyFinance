import React from 'react';
import { Search, Bell, HelpCircle, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  title: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenHelp: () => void;
}

export default function Header({ 
  title, 
  isDarkMode, 
  toggleDarkMode, 
  searchQuery,
  setSearchQuery,
  onOpenHelp
}: HeaderProps) {
  return (
    <header className="h-16 w-full sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-4">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-display">{title}</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Hidden on small mobile */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Cari transaksi atau data..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-48 lg:w-64 focus:ring-2 focus:ring-brand-primary/20 dark:focus:ring-brand-primary-container/30 focus:outline-none text-slate-800 dark:text-slate-100"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Help */}
        <button 
          onClick={onOpenHelp}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
