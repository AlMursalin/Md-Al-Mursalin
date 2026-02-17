
import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, Terminal, X, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Updated master key as per security update request
  const MASTER_KEY = "admin68620";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setError(false);

    // Simulate network delay for "security check"
    setTimeout(() => {
      if (password === MASTER_KEY) {
        onSuccess();
        setPassword('');
        onClose();
      } else {
        setError(true);
        setPassword('');
      }
      setIsAuthenticating(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel border-2 border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,0,0,0.15)]">
        <div className="p-6 border-b border-red-500/20 flex justify-between items-center bg-red-950/10">
          <div className="flex items-center gap-3">
            <Lock className="text-red-500 animate-pulse" size={20} />
            <span className="mono font-black text-white text-sm tracking-widest uppercase">SECURE_AUTH_GATEWAY</span>
          </div>
          <button onClick={onClose} className="text-red-500/50 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="p-5 bg-red-500/10 rounded-full border border-red-500/30 mb-4">
              <Terminal className="text-red-500" size={32} />
            </div>
            <p className="mono text-xs text-red-500 font-bold uppercase tracking-widest text-center">
              RESTRICTED ACCESS AREA<br/>
              <span className="text-gray-500 text-[10px]">PLEASE ENTER ACCESS CREDENTIALS</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="mono text-[10px] text-gray-500 uppercase tracking-widest pl-1">PASSWORD_STRING</label>
              <div className="relative">
                <input 
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-black/60 border ${error ? 'border-red-500' : 'border-red-500/30'} rounded-xl px-4 py-4 mono text-white text-center tracking-[0.5em] focus:outline-none focus:border-red-500 transition-all shadow-inner`}
                  placeholder="********"
                />
                {isAuthenticating && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                )}
              </div>
              {error && (
                <p className="text-red-500 mono text-[9px] font-black uppercase text-center animate-bounce pt-2">
                  <ShieldAlert className="inline-block mr-1" size={10} /> ACCESS_DENIED: INVALID_MASTER_KEY
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white mono font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-95 flex items-center justify-center gap-2"
            >
              GRANT_ACCESS <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="p-4 bg-black/60 border-t border-red-500/10 text-center">
          <p className="mono text-[9px] text-gray-600 uppercase tracking-widest">
            IP: LOGGED // BRUTE_FORCE_PROTECTION: ACTIVE
          </p>
        </div>
      </div>
    </div>
  );
};
