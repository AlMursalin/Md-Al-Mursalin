import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Code, User, Coffee, Activity, X, Minus, ArrowLeft, Lock } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAdminClick: () => void;
  isAdmin: boolean;
}

export const TerminalHeader: React.FC<Props> = ({ activeTab, onTabChange, onAdminClick, isAdmin }) => {
  // Show local time in 12-hour format (HH:MM:SS AM/PM)
  const getFormattedTime = () =>
    new Date().toLocaleTimeString(undefined, {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [device, setDevice] = useState('DETECTING...');

  useEffect(() => {
    // Clock update (local 24h time)
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);

    // Device Detection
    const ua = navigator.userAgent;
    let deviceName = "Unknown Device";
    if (/android/i.test(ua)) deviceName = "Android Mobile";
    else if (/iPhone|iPad|iPod/i.test(ua)) deviceName = "iOS Device";
    else if (/Windows/i.test(ua)) deviceName = "Windows PC";
    else if (/Mac/i.test(ua)) deviceName = "Macintosh";
    else if (/Linux/i.test(ua)) deviceName = "Linux Terminal";
    setDevice(deviceName);

    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'hero', label: 'ROOT', icon: <Terminal size={16} /> },
    { id: 'about', label: 'PROFILE', icon: <User size={16} /> },
    { id: 'skills', label: 'ARSENAL', icon: <Shield size={16} /> },
    { id: 'projects', label: 'LABS', icon: <Cpu size={16} /> },
    { id: 'education', label: 'RECORDS', icon: <Code size={16} /> },
    { id: 'freelance', label: 'SERVICES', icon: <Coffee size={16} /> },
  ];

  const scrollTo = (id: string) => {
    onTabChange(id.toUpperCase());
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClose = () => {
    if (confirm("TERMINATE SESSION? All unsaved data will be lost.")) {
      window.location.reload();
    }
  };

  const handleMinimize = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onTabChange('ROOT');
  };

  const handleBack = () => {
    window.history.back();
    // If no history, default to top
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onTabChange('ROOT');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-cyan-500/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 mono font-bold text-cyan-400">
          <div className="flex items-center space-x-2 group/controls">
            <button 
              onClick={handleClose}
              title="Terminate (Close)"
              className="w-3.5 h-3.5 bg-[#ff5f56] rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <X size={10} className="text-black opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={4} />
            </button>
            <button 
              onClick={handleMinimize}
              title="Minimize (Top)"
              className="w-3.5 h-3.5 bg-[#ffbd2e] rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <Minus size={10} className="text-black opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={4} />
            </button>
            <button 
              onClick={handleBack}
              title="Back"
              className="w-3.5 h-3.5 bg-[#27c93f] rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            >
              <ArrowLeft size={10} className="text-black opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={4} />
            </button>
          </div>
          <span className="ml-4 tracking-tighter text-lg uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">@best_tech_hero</span>
        </div>

        <nav className="hidden xl:flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center space-x-2 mono text-xs uppercase tracking-widest transition-all duration-300 hover:text-cyan-400 ${
                activeTab === item.label ? 'text-cyan-400 border-b border-cyan-400 pb-1' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right side: admin button + device + live time.
            Optimised so device + live time are always visible on mobile. */}
        <div className="flex items-center gap-3 mono text-[9px] sm:text-[10px] md:text-xs">
          {/* Admin Login Button */}
          <button 
            onClick={onAdminClick}
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border mono font-bold uppercase tracking-widest transition-all ${
              isAdmin 
                ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-500/30' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <Lock size={12} className={isAdmin ? 'animate-pulse' : ''} />
            <span className="hidden sm:inline">{isAdmin ? 'ADMIN_OPEN' : 'LOG_IN'}</span>
          </button>

          {/* Device + time stack vertically on small screens */}
          <div className="flex items-end gap-2 sm:gap-4 border-l border-cyan-900/50 pl-3 leading-tight">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-gray-500 uppercase">SYS_NODE</span>
              <span className="text-cyan-400 font-bold max-w-[120px] truncate">{device}</span>
            </div>
            <div className="flex flex-col items-end min-w-[80px]">
              <span className="text-gray-500 uppercase flex items-center">
                <Activity size={10} className="mr-1 animate-pulse text-green-500" /> LIVE_TIME
              </span>
              <span className="text-white font-bold">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};