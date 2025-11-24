import React, { useEffect, useState } from 'react';
import { ScanResult } from '../types';

interface AnalysisReportProps {
  result: ScanResult;
  fileName?: string;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, fileName }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the score number on mount
    const duration = 1500;
    const startTime = performance.now();
    const target = result.scam_score;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedScore(Math.round(ease * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [result.scam_score]);

  const isScam = result.scam_score > 70;
  const isSafe = result.scam_score < 20;
  
  // Dynamic color determination based on score
  const getScoreColor = (score: number) => {
    if (score > 70) return '#ef4444'; // Red
    if (score > 40) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };

  const scoreColor = getScoreColor(result.scam_score);
  
  // Gauge calculations
  const size = 280;
  const center = size / 2;
  const radius = 100;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((animatedScore / 100) * circumference);
  
  // Tick marks generation
  const ticks = Array.from({ length: 40 }).map((_, i) => {
    const angle = (i / 40) * 360;
    const isMajor = i % 5 === 0;
    return (
      <line
        key={i}
        x1={center}
        y1={center - radius - 25}
        x2={center}
        y2={center - radius - (isMajor ? 35 : 28)}
        stroke="currentColor"
        strokeWidth={isMajor ? 2 : 1}
        className={isMajor ? "text-slate-400 dark:text-slate-500" : "text-slate-300 dark:text-slate-700"}
        transform={`rotate(${angle} ${center} ${center})`}
      />
    );
  });

  return (
    <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl animate-[fadeIn_0.5s_ease-out] transition-colors">
      
      {/* Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-200 dark:border-white/5 mb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <span className="text-slate-500 font-mono text-xs tracking-widest uppercase">Investigation Report</span>
             <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600"></span>
             <span className="text-slate-500 font-mono text-xs">{new Date().toLocaleDateString()}</span>
           </div>
           <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2 tracking-tight transition-colors">
             {fileName ? fileName : 'Text Evidence'}
           </h2>
        </div>
        
        <div className={`mt-4 md:mt-0 px-6 py-3 rounded-xl font-black text-xl uppercase tracking-widest border shadow-lg transform rotate-[-2deg]
          ${isScam ? 'bg-red-500 text-white border-red-400' : 
            isSafe ? 'bg-emerald-500 text-white border-emerald-400' : 
            'bg-yellow-500 text-white border-yellow-400'}`}>
          {result.verdict}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visuals & Key Metrics */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Score Card */}
           <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-8 border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center relative overflow-hidden group transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/80 pointer-events-none"></div>
              
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 relative z-10">Risk Probability Analysis</h3>
              
              <div className="relative flex items-center justify-center z-10 py-4">
                 {/* Outer Glow */}
                 <div className="absolute inset-0 rounded-full blur-[80px] opacity-20 transition-colors duration-500" style={{backgroundColor: scoreColor}}></div>
                 
                 <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={scoreColor} stopOpacity="1" />
                        <stop offset="50%" stopColor={scoreColor} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={scoreColor} stopOpacity="0.4" />
                      </linearGradient>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                           <feMergeNode in="coloredBlur"/>
                           <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Rotating Rings Background */}
                    <g className="origin-center animate-[spin_20s_linear_infinite] opacity-20 text-slate-400">
                       <circle cx={center} cy={center} r={radius + 15} stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    </g>
                    <g className="origin-center animate-[spin_15s_linear_infinite_reverse] opacity-10 text-slate-300">
                       <circle cx={center} cy={center} r={radius + 30} stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="2 10" />
                    </g>

                    {/* Tick Marks */}
                    {ticks}

                    {/* Background Track */}
                    <circle cx={center} cy={center} r={radius} className="stroke-slate-200 dark:stroke-slate-800 transition-colors" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
                    
                    {/* Progress Indicator */}
                    {/* Rotated group to start from top */}
                    <g transform={`rotate(-90 ${center} ${center})`}>
                      <circle 
                        cx={center} cy={center} r={radius} 
                        stroke="url(#scoreGradient)" 
                        strokeWidth={strokeWidth} 
                        fill="none" 
                        strokeLinecap="round"
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset}
                        filter="url(#glow)"
                        className="transition-[stroke-dashoffset] duration-300 ease-out"
                      />
                      
                      {/* End Marker (The glowing dot at the tip) */}
                      <g transform={`rotate(${(animatedScore / 100) * 360} ${center} ${center})`}>
                         <circle cx={center + radius} cy={center} r="6" fill="white" filter="url(#glow)" className="shadow-lg" />
                      </g>
                    </g>
                    
                    {/* Inner Decoration */}
                    <circle cx={center} cy={center} r={radius - 20} stroke="#64748b" strokeWidth="1" fill="none" opacity="0.3" />
                 </svg>

                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {/* Reduced Text Size */}
                    <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter drop-shadow-2xl font-mono transition-colors" style={{textShadow: `0 0 15px ${scoreColor}44`}}>
                      {animatedScore}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Score</span>
                 </div>
              </div>

              <div className="mt-4 text-center relative z-10 w-full">
                 <div className={`py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest border w-full text-center transition-all duration-500 shadow-lg
                    ${isScam ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 shadow-red-900/20' : 
                      isSafe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-900/20' : 
                      'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 shadow-yellow-900/20'}`}>
                    {isScam ? 'CRITICAL THREAT' : isSafe ? 'SYSTEM SECURE' : 'POTENTIAL RISK'}
                 </div>
              </div>
           </div>

           {/* AI Image Probability (Conditional) */}
           {result.ai_image_probability !== undefined && (
             <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors">
                <div className="absolute right-0 top-0 p-3 opacity-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                   <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                   AI Manipulation
                </h3>
                <div className="flex items-end gap-2 mb-2 relative z-10">
                   <span className="text-3xl font-black text-slate-800 dark:text-white font-mono">{(result.ai_image_probability * 100).toFixed(0)}%</span>
                   <span className="text-sm text-slate-500 mb-1 font-mono">PROBABILITY</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative z-10">
                   <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000" style={{width: `${result.ai_image_probability * 100}%`}}></div>
                </div>
             </div>
           )}

            {/* AI Image Details */}
            {result.image_analysis_details && (
              <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-white/5 space-y-3 transition-colors">
                 {Object.entries(result.image_analysis_details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                       <span className="text-slate-500 capitalize font-mono text-xs">{key.replace(/_/g, ' ')}</span>
                       <span className="text-slate-800 dark:text-slate-200 font-medium text-right truncate max-w-[120px]">{value}</span>
                    </div>
                 ))}
              </div>
            )}
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="bg-slate-100 dark:bg-slate-800/30 rounded-2xl p-6 border-l-4 border-blue-500 backdrop-blur-sm shadow-lg transition-colors">
            <h3 className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Executive Summary
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-light">
              {result.summary}
            </p>
          </div>

          {/* Red Flags Grid */}
          <div>
             <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Detected Threats ({result.red_flags.length})
             </h3>
             {result.red_flags.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.red_flags.map((flag, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 dark:bg-red-500/5 dark:border-red-500/20 p-4 rounded-xl flex items-start gap-3 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors group">
                       <span className="text-red-500 mt-0.5 group-hover:scale-125 transition-transform">•</span>
                       <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{flag}</span>
                    </div>
                  ))}
                </div>
             ) : (
               <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  No significant red flags found in this content.
               </div>
             )}
          </div>

          {/* URL Analysis */}
          {result.urls.length > 0 && (
             <div>
               <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
                  Link Analysis
               </h3>
               <div className="space-y-3">
                 {result.urls.map((u, idx) => (
                   <div key={idx} className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group hover:border-indigo-500/30 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/80">
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-indigo-500 dark:text-indigo-300 font-mono text-xs opacity-70">TARGET URL</span>
                            {u.issues.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                         </div>
                         <div className="text-slate-800 dark:text-white font-mono text-sm truncate bg-slate-100 dark:bg-black/30 p-2 rounded border border-slate-200 dark:border-white/5 mb-2 group-hover:border-indigo-500/20 transition-colors" title={u.url}>{u.url}</div>
                         {u.issues.length > 0 && (
                            <div className="text-red-500 dark:text-red-400 text-xs flex flex-wrap gap-2">
                               {u.issues.map((issue, i) => <span key={i} className="flex items-center gap-1">⚠️ {issue}</span>)}
                            </div>
                         )}
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border shadow-sm whitespace-nowrap
                        ${u.risk === 'High' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 
                          u.risk === 'Medium' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' : 
                          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}`}>
                        {u.risk} Risk
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* Extracted Text Snippet */}
          {result.extracted_text_preview && (
            <div className="pt-4 border-t border-slate-200 dark:border-white/5">
               <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Decoded Content Preview</h4>
               <p className="font-mono text-xs text-slate-600 break-words line-clamp-3 bg-slate-100 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                 {result.extracted_text_preview}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;