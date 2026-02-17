
import React, { useState } from 'react';
import { Palette, Layers, PenTool, Globe, Terminal, ChevronRight, Settings } from 'lucide-react';

const ServiceTile: React.FC<{ service: any, onClick: () => void }> = ({ service, onClick }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -20, y: x * 20 });
  };

  return (
    <div 
      className="p-10 border-2 border-cyan-500/10 bg-black/40 hover:bg-cyan-950/20 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer group rounded-3xl relative overflow-hidden three-d-card flex flex-col h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      onClick={onClick}
      style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
    >
      <div className="mb-8 text-cyan-500 group-hover:scale-125 transition-all duration-500 group-hover:text-cyan-400" style={{ transform: 'translateZ(40px)' }}>
        {React.cloneElement(service.icon, { size: 40, strokeWidth: 2.5 })}
      </div>
      <h3 className="mono text-2xl font-black text-white mb-3 uppercase group-hover:text-cyan-400 transition-colors" style={{ transform: 'translateZ(30px)' }}>
        {service.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed font-medium mb-8 flex-grow" style={{ transform: 'translateZ(20px)' }}>
        {service.desc}
      </p>
      
      <div className="flex items-center text-cyan-500/60 mono text-[10px] font-black tracking-widest uppercase group-hover:text-cyan-400 transition-colors mt-auto" style={{ transform: 'translateZ(25px)' }}>
        INIT_INQUIRY <ChevronRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full pointer-events-none -z-10 group-hover:bg-cyan-500/20 transition-all duration-700" />
    </div>
  );
};

interface FreelanceServicesProps {
  onContactOpen: () => void;
}

export const FreelanceServices: React.FC<FreelanceServicesProps> = ({ onContactOpen }) => {
  const services = [
    {
      title: "Graphic Design",
      desc: "High-impact visual assets and digital branding with a focus on technical precision and aesthetic integrity.",
      icon: <Palette />
    },
    {
      title: "UI/UX Design",
      desc: "Architecting intuitive user journeys and high-fidelity interfaces optimized for performance and human interaction.",
      icon: <Layers />
    },
    {
      title: "Logo Design",
      desc: "Crafting distinct identity marks that serve as the visual handshake for your digital node or enterprise.",
      icon: <PenTool />
    },
    {
      title: "Web Design & Dev",
      desc: "Engineering secure, responsive, and performance-optimized digital platforms using modern full-stack architectures.",
      icon: <Globe />
    },
    {
      title: "SW Maint & Dev",
      desc: "Comprehensive software lifecycle support, including system patching, performance tuning, and robust backend engineering.",
      icon: <Settings />
    }
  ];

  return (
    <div className="space-y-20 py-12">
      <div className="flex flex-col md:flex-row md:items-center gap-6" style={{ transform: 'translateZ(50px)' }}>
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
          Freelance_<span className="text-cyan-500">Operations</span>
        </h2>
        <div className="h-[3px] flex-grow bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent"></div>
        <div className="mono text-xs text-cyan-500/50 tracking-widest uppercase font-black">Service_Deployment_Ready</div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {services.map((service, idx) => (
          <ServiceTile key={idx} service={service} onClick={onContactOpen} />
        ))}
      </div>

      <div 
        className="mt-20 glass-panel p-16 rounded-[4rem] border-dashed border-4 border-cyan-500/20 text-center hover:border-cyan-500/60 transition-all duration-700 bg-black/40 group relative overflow-hidden"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="relative z-10">
          <h4 className="mono text-4xl font-black text-cyan-400 mb-6 uppercase tracking-tight">Request Operational Support</h4>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg font-medium">
            Looking for elite design or development support? <br />
            Initiate an encrypted connection directly to the operator's node.
          </p>
          <button 
            onClick={onContactOpen}
            className="px-16 py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(0,243,255,0.4)] group/btn"
          >
            <span className="flex items-center gap-3">
              EXEC_INIT_CONNECTION <Terminal size={24} className="group-hover/btn:animate-pulse" />
            </span>
          </button>
        </div>
        
        {/* Background Glitch Layer */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
           <div className="grid grid-cols-20 grid-rows-10 w-full h-full">
              {Array.from({ length: 200 }).map((_, i) => (
                <div key={i} className="border border-cyan-500/10" />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
