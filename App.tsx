import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Converter from './components/Converter';
import Result from './components/Result';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import { AppSettings, DocLanguage, ConversionItem } from './types';
import { convertToWordHtml, wrapHtmlForWord } from './services/geminiService';
import { fileToBase64, saveToHistory, getHistory, clearHistory } from './utils';

// Initial state
const initialSettings: AppSettings = {
  language: 'ar',
  isRTL: true
};

function App() {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [view, setView] = useState<'landing' | 'converter' | 'result'>('landing');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ConversionItem[]>([]);
  
  // Conversion State
  const [isConverting, setIsConverting] = useState(false);
  const [resultData, setResultData] = useState<{ blob: Blob, fileName: string } | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, [isHistoryOpen]);

  // Handle Global Direction
  useEffect(() => {
    document.documentElement.dir = settings.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    // Set font class on body
    if (settings.language === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [settings]);

  const handleStart = () => {
    setView('converter');
  };

  const handleConvert = async (file: File, lang: DocLanguage) => {
    setIsConverting(true);
    try {
      // 1. Convert File to Base64
      const base64 = await fileToBase64(file);
      
      // 2. Send to Gemini
      const htmlContent = await convertToWordHtml(base64, file.type, lang);
      
      // 3. Wrap HTML for Word
      // Determine RTL for the document content specifically
      const contentIsRtl = lang === DocLanguage.ARABIC || (lang === DocLanguage.AUTO && settings.language === 'ar');
      const finalDoc = wrapHtmlForWord(htmlContent, contentIsRtl);
      
      // 4. Create Blob
      const blob = new Blob(['\ufeff', finalDoc], {
        type: 'application/msword'
      });

      setResultData({
        blob,
        fileName: file.name
      });

      // 5. Save History
      const historyItem: ConversionItem = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.name.split('.').pop() || 'file',
        fileSize: file.size,
        date: new Date().toISOString(),
        status: 'success'
      };
      saveToHistory(historyItem);
      setHistory(prev => [historyItem, ...prev]);

      setView('result');
    } catch (error) {
      alert(settings.language === 'ar' ? 'حدث خطأ أثناء التحويل. يرجى المحاولة مرة أخرى.' : 'Error during conversion. Please try again.');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setView('converter');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-300">
        <Navbar 
          settings={settings}
          openSettings={() => setIsSettingsOpen(true)}
          openHistory={() => setIsHistoryOpen(true)}
          navigateHome={() => setView('landing')}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'landing' && <Landing onStart={handleStart} settings={settings} />}
          
          {view === 'converter' && (
            <Converter 
              settings={settings} 
              onConvert={handleConvert}
              isConverting={isConverting}
            />
          )}

          {view === 'result' && (
            <Result 
              settings={settings}
              result={resultData}
              onReset={handleReset}
            />
          )}
        </main>

        <footer className="py-8 text-center text-slate-400 text-sm">
          <p>© 2024 Vibe Code. {settings.language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </footer>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          updateSettings={(s) => setSettings(prev => ({ ...prev, ...s }))}
        />

        <HistoryModal 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onClear={() => {
            clearHistory();
            setHistory([]);
          }}
          settings={settings}
        />
      </div>
    </Router>
  );
}

export default App;