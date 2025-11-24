import React from 'react';
import { Settings, Globe, History as HistoryIcon } from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  settings: AppSettings;
  openSettings: () => void;
  openHistory: () => void;
  navigateHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ settings, openSettings, openHistory, navigateHome }) => {
  const isArabic = settings.language === 'ar';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={navigateHome}>
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
              V
            </div>
            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              UniDoc
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
            <button 
              onClick={openHistory}
              className="p-2 text-slate-500 hover:text-brand-600 transition-colors rounded-full hover:bg-slate-50"
              title={isArabic ? "السجل" : "History"}
            >
              <HistoryIcon size={20} />
            </button>
            <button 
              onClick={openSettings}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-200"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">{isArabic ? "الإعدادات" : "Settings"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;