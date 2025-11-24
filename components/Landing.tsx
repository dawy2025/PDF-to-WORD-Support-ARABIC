import React from 'react';
import { FileText, Zap, ShieldCheck, Languages, UploadCloud } from 'lucide-react';
import { AppSettings } from '../types';

interface LandingProps {
  onStart: () => void;
  settings: AppSettings;
}

const Landing: React.FC<LandingProps> = ({ onStart, settings }) => {
  const isAr = settings.language === 'ar';

  const content = {
    title: isAr ? "حوّل أي ملف إلى Word قابل للتعديل" : "Convert Any File to Editable Word",
    subtitle: isAr 
      ? "يدعم العربية – ويحافظ على التنسيق الكامل للنصوص، الصور، الجداول، والاتجاه." 
      : "Full Arabic Support – Preserves formatting, images, tables, and RTL direction.",
    cta: isAr ? "ابدأ التحويل الآن" : "Start Converting Now",
    features: [
      { icon: Languages, title: isAr ? "دعم عربي 100%" : "100% Arabic Support", desc: isAr ? "معالجة دقيقة للنصوص العربية واتجاه اليمين لليسار." : "Precise processing for Arabic text and RTL layout." },
      { icon: FileText, title: isAr ? "يحافظ على التنسيق" : "Preserves Formatting", desc: isAr ? "تبقى الجداول والصور في مكانها الصحيح." : "Tables, images, and styles stay exactly where they belong." },
      { icon: Zap, title: isAr ? "سريع وذكي" : "Fast & Smart", desc: isAr ? "مدعوم بذكاء Gemini AI لاستخراج النصوص." : "Powered by Gemini AI for superior text extraction." },
      { icon: ShieldCheck, title: isAr ? "آمن ومحمي" : "Secure & Private", desc: isAr ? "تتم المعالجة بخصوصية تامة." : "Your documents are processed with strict privacy." },
    ]
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium border border-brand-100 mb-4 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-brand-600 mr-2 rtl:mr-0 rtl:ml-2"></span>
          {isAr ? "الجيل الجديد من التحويل" : "Next Gen Conversion"}
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          {content.title.split('Word').map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i === 0 && <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600"> Word </span>}
            </React.Fragment>
          ))}
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {content.subtitle}
        </p>

        <div className="pt-8">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full hover:shadow-lg hover:shadow-brand-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-600"
          >
            <UploadCloud className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 group-hover:scale-110 transition-transform" />
            {content.cta}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24 max-w-7xl w-full">
        {content.features.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-4">
              <f.icon size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
         <p className="text-sm text-slate-400 font-medium">
           {isAr ? "الملفات المدعومة" : "Supported Files"}: PDF, DOCX, XLSX, PPTX, JPG, PNG, TXT
         </p>
      </div>
    </div>
  );
};

export default Landing;