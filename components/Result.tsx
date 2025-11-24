import React from 'react';
import { Download, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppSettings, ConversionItem } from '../types';

interface ResultProps {
  settings: AppSettings;
  result: { blob: Blob, fileName: string } | null;
  onReset: () => void;
}

const Result: React.FC<ResultProps> = ({ settings, result, onReset }) => {
  const isAr = settings.language === 'ar';

  const handleDownload = () => {
    if (!result) return;
    const url = window.URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.fileName.replace(/\.[^/.]+$/, "") + ".doc"; // Using .doc for HTML-word compatibility
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!result) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-lg mx-auto text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <CheckCircle size={48} />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        {isAr ? "تم التحويل بنجاح!" : "Conversion Successful!"}
      </h2>
      <p className="text-slate-500 mb-10">
        {isAr 
          ? "ملف Word الخاص بك جاهز للتحميل والتعديل." 
          : "Your editable Word file is ready for download."}
      </p>

      <div className="w-full space-y-4">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5"
        >
          <Download className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2" />
          {isAr ? "تحميل ملف Word" : "Download Word File"}
        </button>
        
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
          {isAr ? "تحويل ملف آخر" : "Convert Another File"}
        </button>
      </div>
    </div>
  );
};

export default Result;