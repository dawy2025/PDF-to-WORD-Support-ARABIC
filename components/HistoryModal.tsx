import React from 'react';
import { X, Trash2, FileText, CheckCircle, Clock } from 'lucide-react';
import { ConversionItem, AppSettings } from '../types';
import { formatBytes } from '../utils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversionItem[];
  onClear: () => void;
  settings: AppSettings;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClear, settings }) => {
  if (!isOpen) return null;
  const isAr = settings.language === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[80vh] flex flex-col animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <h3 className="text-xl font-bold text-slate-900">
            {isAr ? "سجل التحويلات" : "Conversion History"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Clock size={48} className="mb-4 opacity-50" />
              <p>{isAr ? "لا يوجد سجل حتى الآن" : "No history yet"}</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-white p-3 rounded-lg shadow-sm text-brand-500 mr-4 rtl:mr-0 rtl:ml-4">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{item.fileName}</h4>
                  <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2 rtl:space-x-reverse">
                    <span className="uppercase">{item.fileType}</span>
                    <span>•</span>
                    <span>{formatBytes(item.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-green-500">
                   <CheckCircle size={20} />
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 shrink-0">
            <button 
              onClick={onClear}
              className="w-full flex items-center justify-center py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
            >
              <Trash2 size={18} className="mr-2 rtl:mr-0 rtl:ml-2" />
              {isAr ? "حذف السجل" : "Clear History"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;