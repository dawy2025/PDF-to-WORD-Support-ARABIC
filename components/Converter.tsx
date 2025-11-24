import React, { useState, useRef } from 'react';
import { Upload, FileType, CheckCircle, XCircle, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AppSettings, DocLanguage, SupportedMimeType } from '../types';
import { formatBytes } from '../utils';

interface ConverterProps {
  settings: AppSettings;
  onConvert: (file: File, lang: DocLanguage) => Promise<void>;
  isConverting: boolean;
}

const Converter: React.FC<ConverterProps> = ({ settings, onConvert, isConverting }) => {
  const isAr = settings.language === 'ar';
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [targetLang, setTargetLang] = useState<DocLanguage>(DocLanguage.AUTO);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (newFile: File) => {
    // 25MB limit
    if (newFile.size > 25 * 1024 * 1024) {
      setError(isAr ? "حجم الملف يتجاوز 25 ميجابايت" : "File size exceeds 25MB");
      return;
    }
    setError(null);
    setFile(newFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const getIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-brand-500" />;
    return <FileText className="w-8 h-8 text-brand-500" />;
  };

  const handleStartConversion = () => {
    if (file) {
      onConvert(file, targetLang);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-10 px-4">
      <div 
        className={`relative group cursor-pointer transition-all duration-300 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-white 
        ${dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'}
        ${file ? 'border-brand-200 bg-brand-50/30' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={file ? undefined : triggerUpload}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.jpg,.jpeg,.png"
        />

        {!file ? (
          <>
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {isAr ? "اسحب الملف هنا أو اضغط للرفع" : "Drag file here or click to upload"}
            </h3>
            <p className="text-slate-500 text-sm">
              PDF, Word, Excel, PowerPoint, Text, Images
            </p>
            <p className="text-xs text-slate-400 mt-4 font-mono bg-slate-100 px-2 py-1 rounded">
              Max: 25MB
            </p>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-brand-100">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="bg-brand-50 p-3 rounded-lg">
                  {getIcon(file.type)}
                </div>
                <div className="text-start">
                  <p className="font-semibold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center">
          <XCircle size={16} className="mr-2 rtl:mr-0 rtl:ml-2" />
          {error}
        </div>
      )}

      {file && (
        <div className="mt-8 space-y-6 animate-fade-in-up">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {isAr ? "لغة المستند" : "Document Language"}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: DocLanguage.AUTO, label: isAr ? 'تلقائي' : 'Auto' },
                { val: DocLanguage.ARABIC, label: isAr ? 'العربية' : 'Arabic' },
                { val: DocLanguage.ENGLISH, label: isAr ? 'الإنجليزية' : 'English' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setTargetLang(opt.val)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    targetLang === opt.val 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartConversion}
            disabled={isConverting}
            className={`w-full py-4 rounded-xl text-lg font-bold text-white flex items-center justify-center transition-all ${
              isConverting 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-lg hover:shadow-brand-500/40 hover:-translate-y-0.5'
            }`}
          >
            {isConverting ? (
              <>
                <Loader2 className="animate-spin mr-2 rtl:mr-0 rtl:ml-2" />
                {isAr ? "جاري التحويل..." : "Converting..."}
              </>
            ) : (
              isAr ? "تحويل إلى Word" : "Convert to Word"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Converter;