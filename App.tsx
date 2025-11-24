import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnalysisType, ScanResult, FileData } from './types';
import { analyzeContent } from './services/geminiService';
import AnalysisReport from './components/AnalysisReport';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisType>(AnalysisType.TEXT);
  const [inputText, setInputText] = useState('');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'images' | 'docs' | 'web'>('all');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const fileFilters = {
    all: "image/*,.heic,.heif,.webp,.bmp,.tiff,.tif,application/pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.msg,.html,.htm,.eml",
    images: "image/*,.heic,.heif,.webp,.bmp,.tiff,.tif",
    docs: "application/pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt",
    web: ".msg,.html,.htm,.eml"
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { 
      setError("File size too large. Please upload files under 10MB.");
      return;
    }

    let mimeType = file.type;
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'msg' || extension === 'eml') {
      mimeType = 'application/vnd.ms-outlook';
    } else if (extension === 'html' || extension === 'htm') {
      mimeType = 'text/html';
    } else if (!mimeType && extension) {
      const imageTypes: { [key: string]: string } = {
        'jpg': 'image/jpeg', 
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'heic': 'image/heic',
        'heif': 'image/heif',
        'bmp': 'image/bmp',
        'tiff': 'image/tiff',
        'tif': 'image/tiff',
        'ico': 'image/x-icon'
      };
      if (imageTypes[extension]) {
        mimeType = imageTypes[extension];
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.includes(',') ? base64String.split(',')[1] : base64String;
      
      setFileData({
        name: file.name,
        type: mimeType || 'application/octet-stream',
        base64: base64Content
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = useCallback(async () => {
    if (!inputText && !fileData) {
      setError("Please input text or upload a file to start scanning.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeContent(inputText, fileData ? { base64: fileData.base64, mimeType: fileData.type } : undefined);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  }, [inputText, fileData]);

  const clearAll = () => {
    setInputText('');
    setFileData(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen relative text-slate-800 dark:text-slate-200 font-sans selection:bg-purple-500/30 transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-[120px] animate-float transition-colors duration-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 dark:bg-blue-900/20 blur-[120px] animate-float transition-colors duration-500" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-rose-300/20 dark:bg-rose-900/10 blur-[80px] animate-float transition-colors duration-500" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-slate-200 dark:border-white/5 transition-colors">
          <div className="flex items-center gap-4 group">
             <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <div className="absolute inset-0 rounded-xl border border-white/20"></div>
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors">
                 MR. <span className="gradient-text">SCAMFINDER</span>
               </h1>
               <p className="text-slate-500 text-sm font-medium tracking-wide">AI-POWERED FRAUD DETECTION</p>
             </div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4 items-center">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full glass-panel hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-2 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               SYSTEM ONLINE
            </div>
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Input Section */}
          <div className="xl:col-span-4 space-y-6">
            
            <div className="glass-panel p-1 rounded-2xl flex relative overflow-hidden transition-all">
              <div 
                className={`absolute inset-y-1 w-[50%] bg-white shadow-sm dark:bg-slate-800 rounded-xl transition-all duration-300 ease-in-out ${activeTab === AnalysisType.TEXT ? 'left-1' : 'left-[calc(50%-4px)] translate-x-full'}`} 
              />
              <button
                onClick={() => setActiveTab(AnalysisType.TEXT)}
                className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors z-10 flex items-center justify-center gap-2 ${activeTab === AnalysisType.TEXT ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                TEXT
              </button>
              <button
                onClick={() => setActiveTab(AnalysisType.FILE)}
                className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors z-10 flex items-center justify-center gap-2 ${activeTab === AnalysisType.FILE ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                FILE / IMAGE
              </button>
            </div>

            <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden group transition-colors">
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: `radial-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '20px 20px'}}></div>

              {activeTab === AnalysisType.TEXT ? (
                <div className="space-y-4 relative z-10">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Investigate Text</label>
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste suspicious messages, emails, or links here..."
                      className="w-full h-80 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all resize-none font-mono text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-600 font-mono">{inputText.length} chars</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload Evidence</label>
                  
                  {/* Filter Buttons */}
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl overflow-x-auto scrollbar-none transition-colors">
                     {(['all', 'images', 'docs', 'web'] as const).map((type) => (
                       <button
                         key={type}
                         onClick={() => setFilterMode(type)}
                         className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                           filterMode === type 
                           ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-slate-600 shadow-sm' 
                           : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                         }`}
                       >
                         {type}
                       </button>
                     ))}
                  </div>

                  <div 
                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/drop
                    ${fileData 
                      ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/5' 
                      : 'border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-800/50'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept={fileFilters[filterMode]}
                    />
                    
                    {fileData ? (
                       <div className="text-center relative z-10">
                          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-lg truncate max-w-[250px]">{fileData.name}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-mono uppercase tracking-widest">Ready to Scan</p>
                       </div>
                    ) : (
                      <div className="text-center relative z-10 group-hover/drop:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700 group-hover/drop:border-purple-500/50 group-hover/drop:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover/drop:text-purple-500 dark:group-hover/drop:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                           </svg>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">Click to Upload</p>
                        <p className="text-xs text-slate-500 mt-2 max-w-[250px] mx-auto">
                          {filterMode === 'all' && 'Supports All Images, PDFs, Docs, Outlook, HTML'}
                          {filterMode === 'images' && 'Supports JPG, PNG, HEIC, WEBP, BMP, TIFF'}
                          {filterMode === 'docs' && 'Supports PDF, Word, Excel, PowerPoint, Text'}
                          {filterMode === 'web' && 'Supports Outlook (.msg), EML, HTML Source'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                     <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Additional Context</label>
                     <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="e.g. Sent from unknown number..."
                      className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:border-purple-500/50 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 relative z-10">
                <button
                  onClick={clearAll}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-semibold text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`flex-1 relative overflow-hidden rounded-xl font-bold text-white transition-all transform active:scale-[0.98]
                    ${loading ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)]'}`}
                >
                   {/* Button Content */}
                   <div className="relative z-10 flex items-center justify-center gap-3 py-4">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="tracking-wide text-sm uppercase">Analyzing...</span>
                        </>
                      ) : (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                           <span className="tracking-wide text-sm uppercase">Run Scan</span>
                        </>
                      )}
                   </div>
                   
                   {/* Loading Shimmer */}
                   {loading && (
                     <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                   )}
                </button>
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                   <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                   </div>
                   {error}
                </div>
              )}

            </div>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-8 min-h-[600px] relative">
            {result ? (
              <AnalysisReport result={result} fileName={fileData?.name} />
            ) : (
              <div className="h-full w-full glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                 {/* Decorative Background Elements */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
                    <div className="w-64 h-64 border border-slate-500 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute w-48 h-48 border border-dashed border-slate-500 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                 </div>
                 
                 <div className="relative z-10 flex flex-col items-center max-w-md text-center p-6">
                   <div className="w-24 h-24 bg-white dark:bg-slate-900/80 rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">Awaiting Evidence</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">
                     Mr. ScamFinder is ready to analyze your data. Input text or upload a file to detect fraud, analyze risk, and uncover hidden threats.
                   </p>
                 </div>
              </div>
            )}
            
            {/* Loading Overlay */}
            {loading && (
               <div className="absolute inset-0 z-50 glass-panel rounded-3xl flex flex-col items-center justify-center backdrop-blur-xl">
                  <div className="relative w-full max-w-md h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
                     <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 w-1/2 animate-[translateX_2s_ease-in-out_infinite]"></div>
                  </div>
                  <div className="font-mono text-emerald-600 dark:text-emerald-400 text-lg animate-pulse">ANALYZING PATTERNS...</div>
                  <div className="text-slate-500 text-xs mt-2 font-mono">DETECTING ANOMALIES // PARSING HEADERS</div>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;