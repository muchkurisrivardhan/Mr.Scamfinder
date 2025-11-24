
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLogin: (user: UserProfile) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSocialLogin = (provider: 'google' | 'github' | 'apple') => {
    setIsLoading(provider);
    
    // Simulate API Network Delay & User Data Retrieval
    setTimeout(() => {
      let mockUser: UserProfile;

      switch (provider) {
        case 'google':
          mockUser = {
            id: 'g_12345',
            name: 'Alex D.',
            email: 'alex.dev@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede',
            provider: 'google'
          };
          break;
        case 'github':
          mockUser = {
            id: 'gh_67890',
            name: 'CyberNinja',
            email: 'ninja@github.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja&backgroundColor=d1d4f9',
            provider: 'github'
          };
          break;
        case 'apple':
          mockUser = {
            id: 'a_11223',
            name: 'User 8492',
            email: 'hide-my-email@apple.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Apple&backgroundColor=b6e3f4',
            provider: 'apple'
          };
          break;
      }

      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px] animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Theme Toggle (Absolute Top Right) */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full glass-panel hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-400 shadow-lg"
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
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl">
          
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mx-auto mb-6 transform rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              MR. <span className="gradient-text">SCAMFINDER</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Identify Fraud. Protect Your Digital Life.</p>
          </div>

          {/* Mode Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'signin' ? 'Sign in to continue your investigation' : 'Join the anti-fraud network today'}
            </p>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            
            {/* Google Button */}
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={!!isLoading}
              className="w-full group relative flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white p-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 shadow-sm"
            >
              {isLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>{mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                </>
              )}
            </button>

            {/* Apple Button */}
            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={!!isLoading}
              className="w-full group relative flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black p-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 shadow-lg"
            >
              {isLoading === 'apple' ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.09-.48-3.08.35 1.04 1.37 1.87 2.17 2.17 2.45.65.6 1.44 1.04 2.27.42.71-.53 1.25-1.57 1.72-3.57zm-3.66-13.43c.27-1.53 1.4-2.64 2.76-2.85.22 1.64-1.25 3.09-2.76 2.85zm-4.32 1.3c1.78-1.04 3.96-.53 4.93.85.95 1.36 2.5 1.15 3.34.69.83-.45 2.09-1.04 3.75.09 1.66 1.12 2.71 4.5 1.04 7.6-.83 1.55-1.87 2.89-3.33 2.89-.63 0-1.25-.21-2.09-.53-.83-.31-1.66-.42-2.29-.42-.63 0-1.46.1-2.29.42-.83.31-1.46.53-1.88.53-1.45 0-2.71-1.55-3.54-2.89-1.66-2.71-2.08-6.25-.21-8.54.83-1.04 1.46-1.46 2.5-1.46.63 0 1.25.31 1.88.76z" />
                  </svg>
                  <span>{mode === 'signin' ? 'Sign in with Apple' : 'Sign up with Apple'}</span>
                </>
              )}
            </button>

            {/* GitHub Button */}
            <button
              onClick={() => handleSocialLogin('github')}
              disabled={!!isLoading}
              className="w-full group relative flex items-center justify-center gap-3 bg-[#24292F] text-white p-4 rounded-xl font-bold transition-all hover:bg-[#24292F]/90 hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 shadow-lg"
            >
              {isLoading === 'github' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>{mode === 'signin' ? 'Sign in with GitHub' : 'Sign up with GitHub'}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
             <div className="flex items-center justify-center gap-2 mb-4">
               <span>{mode === 'signin' ? "Don't have an account?" : "Already have an account?"}</span>
               <button 
                 onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                 className="text-blue-500 dark:text-blue-400 font-bold hover:underline"
               >
                 {mode === 'signin' ? "Sign Up" : "Sign In"}
               </button>
             </div>
             
             <p className="border-t border-slate-200 dark:border-white/10 pt-4">
               By continuing, you agree to our Terms of Service and Privacy Policy.
               <br/>
               <span className="opacity-70 mt-2 block">Secured by Gemini AI Technology</span>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
