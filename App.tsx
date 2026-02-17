
import React, { useState, useEffect, useRef } from 'react';
import { TerminalHeader } from './components/TerminalHeader.tsx';
import { Hero } from './components/Hero.tsx';
import { MatrixBackground } from './components/MatrixBackground.tsx';
import { AboutMe } from './components/AboutMe.tsx';
import { SkillsMatrix } from './components/SkillsMatrix.tsx';
import { EducationTimeline } from './components/EducationTimeline.tsx';
import { ProjectsGrid } from './components/ProjectsGrid.tsx';
import { FreelanceServices } from './components/FreelanceServices.tsx';
import { AdminConsole } from './components/AdminConsole.tsx';
import { AdminLogin } from './components/AdminLogin.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { ShieldAlert, Terminal as TerminalIcon } from 'lucide-react';
import { Visitor } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ROOT');
  const [currentView, setCurrentView] = useState<'HOME' | 'CONTACT'>('HOME');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean, msg: string }>({ show: false, msg: '' });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentSessionId = useRef<string | null>(null);

  // Helper to normalize device name from userAgent so Admin console
  // and header show consistent labels (and mobile devices are detected properly).
  const detectDevice = (ua: string): string => {
    const uaLower = ua.toLowerCase();
    if (uaLower.includes('android')) return 'Android Mobile';
    if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) return 'iOS Device';
    if (uaLower.includes('windows')) return 'Windows PC';
    if (uaLower.includes('mac os') || uaLower.includes('macintosh')) return 'Macintosh';
    if (uaLower.includes('linux')) return 'Linux Terminal';
    return 'Unknown Device';
  };

  // Visitor Tracking
  useEffect(() => {
    const logVisit = async () => {
      let ip = '127.0.0.1';
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (res.ok) {
          const data = await res.json();
          ip = data.ip;
        }
      } catch (e) {}

      const ua = navigator.userAgent;
      const deviceLabel = detectDevice(ua);

      const sessionId = `node-${Math.random().toString(36).substr(2, 9)}`;
      const newVisitor: Visitor = {
        id: sessionId,
        timestamp: new Date().toISOString(),
        ip: ip,
        userAgent: ua,
        deviceLabel,
        duration: '0s',
        sessionCount: 1
      };

      const existingLogs = localStorage.getItem('visitor_logs');
      let logs: Visitor[] = existingLogs ? JSON.parse(existingLogs) : [];
      const sessionActive = sessionStorage.getItem('session_active');
      
      if (!sessionActive) {
        currentSessionId.current = sessionId;
        logs.unshift(newVisitor);
        localStorage.setItem('visitor_logs', JSON.stringify(logs.slice(0, 500)));
        sessionStorage.setItem('session_active', sessionId);
        setNotification({ show: true, msg: `ALERT: INBOUND_CONNECTION // NODE_${newVisitor.ip}` });
        setTimeout(() => setNotification({ show: false, msg: '' }), 5000);
      } else {
        currentSessionId.current = sessionActive;
      }
    };
    logVisit();
  }, []);

  useEffect(() => {
    // Use pointer events so the parallax reacts to both mouse and touch
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 5;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      setMousePos({ x, y });
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const handleAdminAuthTrigger = () => {
    if (isAuthorized) setIsAdminOpen(true);
    else setIsAdminLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthorized(true);
    setIsAdminOpen(true);
  };

  const openContact = () => setCurrentView('CONTACT');

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505]">
      <MatrixBackground />
      
      <TerminalHeader 
        activeTab={currentView === 'CONTACT' ? 'CONTACT' : activeTab} 
        onTabChange={(tab) => {
          if (tab === 'ROOT') setCurrentView('HOME');
          setActiveTab(tab);
        }} 
        onAdminClick={handleAdminAuthTrigger}
        isAdmin={isAuthorized}
      />
      
      {notification.show && (
        <div className="fixed bottom-8 right-8 z-[300] animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="glass-panel border-l-4 border-l-red-500 p-6 rounded-2xl flex items-center gap-4 bg-black/80 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            <ShieldAlert className="text-red-500 animate-pulse" size={24} />
            <div className="mono">
              <div className="text-[10px] text-red-500/60 font-black uppercase tracking-[0.2em]">System_Alert</div>
              <div className="text-white text-xs font-bold uppercase">{notification.msg}</div>
            </div>
          </div>
        </div>
      )}

      <AdminLogin isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onSuccess={handleLoginSuccess} />
      <AdminConsole isOpen={isAdminOpen} onClose={() => { setIsAdminOpen(false); setIsAuthorized(false); }} />

      {/* Transition Layer */}
      <div className="relative w-full h-full">
        {/* Contact Page Layer */}
        {currentView === 'CONTACT' && (
          <div className="fixed inset-0 z-[110] animate-in fade-in zoom-in-95 duration-500 ease-out">
            <ContactPage onBack={() => setCurrentView('HOME')} />
          </div>
        )}

        {/* Home Page Layer */}
        <div 
          ref={containerRef}
          className={`transition-all duration-700 ease-in-out will-change-transform ${
            currentView === 'CONTACT' ? 'opacity-0 scale-90 blur-md pointer-events-none' : 'opacity-100 scale-100'
          }`}
          style={{ 
            perspective: '2000px',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`
          }}
        >
          <main className="container mx-auto px-4 pt-32 pb-12 relative z-10">
            <section id="hero" className="mb-48">
              <Hero onContactOpen={openContact} />
            </section>

            <div className="space-y-48">
              <section id="about" className="scroll-mt-32"><AboutMe /></section>
              <section id="skills" className="scroll-mt-32"><SkillsMatrix /></section>
              <section id="projects" className="scroll-mt-32"><ProjectsGrid /></section>
              <section id="education" className="scroll-mt-32"><EducationTimeline /></section>
              <section id="freelance" className="scroll-mt-32"><FreelanceServices onContactOpen={openContact} /></section>
            </div>

            <footer className="mt-64 pt-16 border-t border-cyan-900/30 text-center text-sm text-gray-500 mono pb-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3 bg-black/40 px-6 py-2 rounded-full border border-cyan-500/20 shadow-lg cursor-help" onClick={handleAdminAuthTrigger}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="tracking-[0.3em] font-bold uppercase italic">SYSTEM: IT'S_OPERATIONAL</span>
                </div>
                <p className="opacity-60">© {new Date().getFullYear()} Md Al Mursalin's // CORE_OS.V3. SECURE_CONNECTION_ESTABLISHED.</p>
                <button onClick={handleAdminAuthTrigger} className="mt-8 text-[10px] text-cyan-500/20 hover:text-cyan-500/80 transition-all uppercase tracking-[0.5em] font-black group">
                  [ <TerminalIcon size={10} className="inline-block mr-2 group-hover:animate-pulse" /> OPERATOR'S_NODE ]
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>
      
      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
    </div>
  );
};

export default App;
