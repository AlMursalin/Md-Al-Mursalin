
import React, { useEffect, useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  ShieldAlert, 
  MousePointer2, 
  AlertCircle,
  Terminal,
  Loader2
} from 'lucide-react';

const DiagnosticGraph: React.FC = () => {
  const [points, setPoints] = useState<number[]>(new Array(10).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => [...prev.slice(1), Math.floor(Math.random() * 40) + 10]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-[2px] h-10 w-24 px-2 border-l border-cyan-500/20">
      {points.map((p, i) => (
        <div 
          key={i} 
          className="bg-cyan-500/40 w-1 rounded-t-sm transition-all duration-300"
          style={{ height: `${p}%` }}
        />
      ))}
    </div>
  );
};

interface HeroProps {
  onContactOpen: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactOpen }) => {
  const [text, setText] = useState('');
  const fullText = "I build. I break. I secure.";
  const [cursorVisible, setCursorVisible] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  // Default operator photo – replace /profile.jpg with your own image path in the public folder
  const [operatorPhoto, setOperatorPhoto] = useState("/profile.jpg");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPhoto = () => {
      const savedPhoto = localStorage.getItem('operator_photo');
      if (savedPhoto) setOperatorPhoto(savedPhoto);
    };

    const handleCustomUpdate = (e: any) => {
      if (e.detail && e.detail.photo) {
        setOperatorPhoto(e.detail.photo);
      }
    };

    loadPhoto();
    window.addEventListener('storage', loadPhoto);
    window.addEventListener('identity_update', handleCustomUpdate as any);

    let currentIdx = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, currentIdx + 1));
      currentIdx++;
      if (currentIdx === fullText.length) {
        clearInterval(interval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);

    // Use pointer events so the 3D animation works on both mouse and touch devices
    const handlePointerMove = (e: PointerEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('storage', loadPhoto);
      window.removeEventListener('identity_update', handleCustomUpdate as any);
    };
  }, []);

  // Smooth identity reveal / close for both desktop and mobile (single click / tap)
  const triggerReveal = () => {
    if (isRevealed || isDecrypting) return;
    setIsDecrypting(true);
    setTimeout(() => {
      setIsDecrypting(false);
      setIsRevealed(true);
    }, 800);
  };

  const handleReveal = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerReveal();
  };

  const handleCloseIdentity = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsRevealed(false);
    setIsDecrypting(false);
  };

  return (
    <div 
      ref={containerRef}
      // On smaller widths (including mobile “desktop mode”), keep a single column
      // so the identity frame doesn’t get cut off. Two-column layout only on xl+.
      // Compact vertical spacing for mobile desktop mode (Windows-like)
      className="relative grid gap-4 sm:gap-6 md:gap-8 items-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[75vh] py-4 sm:py-6 md:py-12 xl:grid-cols-[100px_1fr_1fr]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Left Data Gaphs (Diagnostic Stream) */}
      <div className="hidden lg:flex flex-col gap-10 border-r border-cyan-500/10 pr-6 h-full justify-center mono select-none pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-700">
        <div className="space-y-4">
          <div className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest vertical-text">NETWORK_IO</div>
          <DiagnosticGraph />
          <div className="text-[8px] text-cyan-400 font-bold">ACK_443: OK</div>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest vertical-text">MEM_BLOCK</div>
          <div className="grid grid-cols-2 gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-sm ${Math.random() > 0.4 ? 'bg-cyan-500/40' : 'bg-gray-900'} animate-pulse`} style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <div className="text-[8px] text-cyan-400 font-bold">HEAP: 42%</div>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest vertical-text">CPU_LATENCY</div>
          <div className="w-1 h-32 bg-gray-900 rounded-full relative overflow-hidden">
             <div className="absolute bottom-0 w-full bg-cyan-500 animate-[latency_2s_ease-in-out_infinite]" />
          </div>
          <div className="text-[8px] text-cyan-400 font-bold">12ms</div>
        </div>

        <div className="space-y-2">
           <div className="text-[7px] text-cyan-500/30 overflow-hidden h-32 leading-[1.1] break-all text-right uppercase font-black">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
                  0x{Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="space-y-8 relative z-20" style={{ transformStyle: 'preserve-3d' }}>
        <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-widest mono uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>IDENTITY_VERIFIED // SESSION_ENCRYPTED</span>
        </div>
        
        <div className="space-y-4" style={{ transform: 'translateZ(20px)' }}>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase text-white shadow-cyan-500/10">
            Md Al <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-600 cyan-glow">Mursalin</span>
          </h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mono text-sm md:text-xl text-cyan-500/90 font-black uppercase tracking-[0.2em] border-l-4 border-cyan-500/70 pl-6 py-1">
            <span>Cyber Security Specialist</span>
            <span className="text-gray-800">|</span>
            <span>Software Engineer</span>
          </div>
        </div>
        
        <div className="mono text-2xl lg:text-4xl text-gray-300 font-bold h-12 flex items-center" style={{ transform: 'translateZ(10px)' }}>
          {text}
          <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-cyan-500 font-black`}>_</span>
        </div>

        <div className="max-w-xl space-y-6">
          <p className="text-gray-100 text-lg leading-relaxed font-semibold tracking-tight">
            I'm <span className="text-cyan-400">Md Al Mursalin</span>—a dedicated Computer Science and Engineering student with strong skills in <span className="text-cyan-400">IT support, troubleshooting, and software development</span>.
          </p>
          
          <p className="text-gray-400 text-base leading-relaxed border-l-2 border-cyan-500/40 pl-5 py-1">
            I am a hardworking, quick-to-learn individual passionate about solving technical problems through real-world experience and industry-standard software development life cycles.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 pt-6">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onContactOpen();
            }}
            type="button"
            className="px-8 sm:px-10 py-4 sm:py-5 bg-cyan-500 text-black font-black uppercase tracking-widest hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 mono shadow-[0_0_40px_rgba(0,243,255,0.4)] group relative overflow-hidden z-50 cursor-pointer pointer-events-auto touch-manipulation"
          >
            <span className="relative flex items-center gap-2 z-10 pointer-events-none">
               CONTACT INFO <ShieldCheck size={18} className="animate-pulse" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 pointer-events-none" />
          </button>
          <a 
            href="mailto:mdalmursalin123@gmail.com"
            className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-cyan-500/50 text-cyan-400 font-black uppercase tracking-widest hover:bg-cyan-500/10 transition-all mono backdrop-blur-md relative z-50 flex items-center justify-center cursor-pointer pointer-events-auto touch-manipulation"
          >
            PING_OPERATOR
          </a>
        </div>
      </div>

      {/* Identity Portal Box */}
      <div 
        className="relative group flex justify-center items-center select-none" 
        style={{ transform: `rotateY(${-mousePos.x}deg) rotateX(${mousePos.y}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* INTERACTION SHIELD: High-priority click layer */}
        {!isRevealed && !isDecrypting && (
          <div 
            onClick={handleReveal}
            onTouchEnd={handleReveal}
            className="absolute inset-0 z-[250] cursor-pointer"
            title="Tap / click to reveal identity"
          />
        )}

        {/* LOCKED UI: Made pointer-events-none so it doesn't block the shield */}
        {!isRevealed && !isDecrypting && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] animate-pulse pointer-events-none w-full max-w-[280px] flex justify-center">
            <div className="bg-white text-red-600 font-black mono text-base px-8 py-4 rounded-2xl shadow-[0_0_80px_rgba(255,255,255,0.8)] flex flex-col items-center gap-1 border-4 border-red-600 scale-90">
              <AlertCircle size={24} className="animate-bounce" />
              <span className="whitespace-nowrap uppercase tracking-[0.2em] text-center text-sm">
                IDENTITY LOCKED<br/>
                <span className="text-[10px] opacity-80 font-normal">Double click to unlock</span>
              </span>
            </div>
          </div>
        )}

        <div className={`absolute inset-0 bg-cyan-500/10 rounded-[5rem] blur-[120px] transition-all duration-1000 ${isRevealed ? 'opacity-30' : 'animate-pulse'}`}></div>
        
        <div 
          className={`relative w-full max-w-md aspect-square glass-panel rounded-[3rem] overflow-hidden border-[4px] transition-all duration-700 flex flex-col items-center justify-center shadow-2xl ${isRevealed ? 'border-transparent bg-black' : 'border-cyan-500/40 bg-black/60 shadow-[0_0_100px_rgba(0,243,255,0.1)]'}`}
        >
          {isRevealed ? (
            <div className="absolute inset-0 z-[100] transition-all duration-500 animate-in fade-in zoom-in-95">
               <img 
                 src={operatorPhoto} 
                 alt="Operator Identity" 
                 className="w-full h-full object-cover"
               />
               {/* Identity Overlay Label */}
               <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <div className="mono text-white font-black text-xl uppercase tracking-tighter italic">MURSALIN_SEC_CORE</div>
                  <div className="mono text-cyan-400 text-[8px] font-bold uppercase tracking-[0.4em]">Biometric_Authenticity: 100%</div>
               </div>
            </div>
          ) : (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center bg-black/90 px-8 py-10 transition-opacity duration-300 pointer-events-none">
               {isDecrypting ? (
                 <div className="space-y-8 animate-pulse">
                    <ShieldAlert className="w-24 h-24 text-cyan-400 mx-auto animate-bounce shadow-[0_0_60px_rgba(0,243,255,0.4)]" />
                    <div className="space-y-4">
                       <div className="mono text-cyan-400 text-xl font-black tracking-[0.6em] uppercase italic">DECRYPTING...</div>
                       <div className="w-full max-w-[200px] mx-auto h-3 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/40 p-[1px]">
                         <div className="h-full bg-gradient-to-r from-cyan-700 via-cyan-300 to-cyan-700 animate-[loading_1.5s_linear_infinite] shadow-[0_0_15px_#00f3ff]" />
                       </div>
                    </div>
                    <div className="mono text-[8px] text-cyan-500/40 uppercase tracking-[0.4em] font-bold">PARSING_BIO_DATA</div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-sm opacity-20 group-hover:opacity-40 transition-opacity">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-[40px] animate-pulse rounded-full"></div>
                      <div className="relative bg-black/95 p-6 rounded-full border-2 border-cyan-500/70 shadow-[0_0_100px_rgba(0,243,255,0.4)]">
                        <Lock className="w-10 h-10 text-cyan-400 animate-pulse" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-cyan-400 p-2 rounded-xl text-black animate-bounce shadow-[0_0_40px_#00f3ff]">
                        <MousePointer2 size={16} strokeWidth={4} />
                      </div>
                    </div>
                    
                    <div className="px-6 py-2 border-2 border-red-600/80 rounded-lg bg-red-600/10 shadow-2xl">
                        <h3 className="mono text-red-500 font-black text-lg uppercase tracking-[0.3em] animate-pulse">
                          ACCESS_LOCKED
                        </h3>
                    </div>
                       
                    <div className="bg-cyan-500/10 p-8 rounded-[2rem] border border-cyan-500/60 shadow-[0_0_80px_rgba(255,255,255,0.1)] backdrop-blur-3xl transition-all duration-500 relative overflow-hidden w-full">
                        <p className="mono text-2xl text-white font-black uppercase tracking-tight leading-tight mb-2 italic text-shadow-glow">
                          PLEASE <br /> DOUBLE <br /> CLICK
                        </p>
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f3ff] my-2"></div>
                        <p className="mono text-[8px] text-cyan-400 font-black uppercase tracking-[0.5em] opacity-90">
                          IDENTITY_REVEAL_GATEWAY
                        </p>
                    </div>
                 </div>
               )}
               {/* Background Grid */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
                    {Array.from({ length: 144 }).map((_, i) => (
                      <div key={i} className="border border-cyan-500/20" />
                    ))}
                  </div>
               </div>
               {/* Status Bar */}
               <div className="absolute bottom-6 left-0 w-full px-8 z-30 pointer-events-none">
                  <div className="flex justify-between items-center mb-2 mono text-[8px] font-black text-cyan-400/90 tracking-widest uppercase bg-black/80 backdrop-blur-xl p-2 rounded-lg border border-cyan-900/50 shadow-2xl">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={10} className="text-cyan-500" /> 
                      NODE: {isRevealed ? 'REVEALED' : 'LOCKED'}
                    </span>
                    <span className="opacity-50 tracking-[0.2em]">V8.1_SEC</span>
                  </div>
                  <div className="h-2 bg-black/90 rounded-full overflow-hidden border border-cyan-500/40 p-[1px] shadow-inner">
                    <div className={`h-full bg-gradient-to-r from-cyan-700 via-cyan-300 to-cyan-700 transition-all duration-700 ${isDecrypting ? 'w-full' : 'w-[20%] animate-pulse'} shadow-[0_0_20px_#00f3ff]`} />
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes latency {
          0% { height: 10%; opacity: 0.5; }
          50% { height: 80%; opacity: 1; }
          100% { height: 10%; opacity: 0.5; }
        }
        .text-shadow-glow {
          text-shadow: 0 0 25px rgba(0, 243, 255, 0.7);
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};
