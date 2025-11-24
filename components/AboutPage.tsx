import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Hero Section */}
      <div className="glass-panel p-10 md:p-14 rounded-3xl text-center relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500"></div>
        
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Exposing Deception with <br />
          <span className="gradient-text">Artificial Intelligence</span>
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Mr. ScamFinder is an advanced cybersecurity tool designed to empower individuals against the rising tide of digital fraud. By leveraging cutting-edge Generative AI, we analyze patterns, linguistics, and metadata to identify threats before they strike.
        </p>
      </div>

      {/* Stats/Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Gemini 2.5 Powered",
            desc: "Utilizing Google's latest multimodal models for deep semantic analysis of text and images.",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },
          {
            title: "Universal Analysis",
            desc: "From Outlook emails to suspicious websites and manipulated images, we scan it all.",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )
          },
          {
            title: "Privacy First",
            desc: "Your data is analyzed in real-time and never stored permanently on our servers.",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )
          }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="bg-slate-100 dark:bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-8">
         <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
         </div>
         <div className="text-center md:text-left">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Developed by Security Experts</h3>
           <p className="text-slate-600 dark:text-slate-300">
             Our team consists of former intelligence analysts and AI researchers dedicated to making the internet a safer place for everyone. We believe that security tools should be accessible, intuitive, and effective.
           </p>
         </div>
      </div>
    </div>
  );
};

export default AboutPage;