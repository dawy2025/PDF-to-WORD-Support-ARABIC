import React from 'react';
import { X, Languages, LayoutDirection } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings }) => {
  if (!isOpen) return null;
  const isAr = settings.language === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            {isAr ? "الإعدادات" : "Settings"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700">
              <div className="bg-slate-100 p-2 rounded-lg"><Languages size={20}/></div>
              <span className="font-medium">{isAr ? "لغة الواجهة" : "Interface Language"}</span>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => updateSettings({ language: 'en', isRTL: false })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${settings.language === 'en' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
              >
                English
              </button>
              <button 
                onClick={() => updateSettings({ language: 'ar', isRTL: true })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${settings.language === 'ar' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
            {isAr ? "تم" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;