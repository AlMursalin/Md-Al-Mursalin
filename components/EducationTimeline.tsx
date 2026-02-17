
import React, { useState } from 'react';

const EducationCard: React.FC<{ item: any, index: number }> = ({ item, index }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -10, y: x * 10 });
  };

  return (
    <div 
      className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-16 last:mb-0`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-cyan-500 bg-black text-cyan-500 shadow-[0_0_25px_rgba(0,243,255,0.5)] z-20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 transition-transform duration-500">
        <span className="mono text-lg font-black">{index + 1}</span>
      </div>
      
      <div 
        className="w-[calc(100%-5rem)] md:w-[calc(50%-4rem)] glass-panel p-10 rounded-[2.5rem] border-2 border-cyan-900/40 hover:border-cyan-400/60 transition-all duration-500 bg-black/40 three-d-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotation({ x: 0, y: 0 })}
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        <div className="flex items-center justify-between mb-4" style={{ transform: 'translateZ(20px)' }}>
          <span className="mono text-xs text-cyan-400 font-black tracking-widest bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/20">{item.period}</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2 leading-tight" style={{ transform: 'translateZ(30px)' }}>{item.degree}</h3>
        <p className="mono text-sm text-cyan-500/80 font-bold mb-6 uppercase tracking-widest" style={{ transform: 'translateZ(15px)' }}>{item.institution}</p>
        <p className="text-gray-400 leading-relaxed font-medium" style={{ transform: 'translateZ(10px)' }}>{item.details}</p>
        
        <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
           <div className="mono text-8xl font-black select-none">{index + 1}</div>
        </div>
      </div>
    </div>
  );
};

export const EducationTimeline: React.FC = () => {
  const history = [
    {
      period: "2023 - PRESENT",
      degree: "BSc in Computer Science Engineering",
      institution: "American International University-Bangladesh (AIUB)",
      details: "Major in Cyber Security. Specialist in Software Engineering and Web Development. Actively pursuing advanced studies in Network Defense, Ethical Hacking, and building secure, high-performance web applications."
    },
    {
      period: "2020 - 2022",
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Adamjee Cantonment College",
      details: "Science Background. Achieved GPA 5.00. Specialized in Physics, Mathematics, and ICT, building a strong foundation for a career in technology and security."
    },
    {
      period: "2010 - 2020",
      degree: "Secondary School Certificate (SSC)",
      institution: "Adamjee Cantonment Public School",
      details: "Science Background. Achieved GPA 5.00 in SSC (2020). Also completed JSC and PSC from this institution, maintaining a consistent record of academic excellence throughout early education."
    }
  ];

  return (
    <div className="space-y-20 py-12">
      <div className="flex items-center space-x-6" style={{ transform: 'translateZ(50px)' }}>
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
          Academic_<span className="text-cyan-500">Records</span>
        </h2>
        <div className="h-[3px] flex-grow bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent"></div>
        <div className="mono text-xs text-cyan-500/50 tracking-widest uppercase font-black">Database_Access_Level_0</div>
      </div>

      <div className="relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-cyan-500/40 before:to-transparent">
        {history.map((item, idx) => (
          <EducationCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
};
