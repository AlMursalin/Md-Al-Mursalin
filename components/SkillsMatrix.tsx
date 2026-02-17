
import React, { useState } from 'react';

const SKILLS = [
  // Category: Offensive & Defensive Security
  { name: 'Red Team Ops & Penetration Testing', level: 96, category: 'Security & Ops' },
  { name: 'Cryptographic Protocol Implementation', level: 94, category: 'Security & Ops' },
  { name: 'Malware Forensics & Reverse Engineering', level: 92, category: 'Security & Ops' },
  { name: 'Cloud Security Architecture (AWS/Azure)', level: 90, category: 'Security & Ops' },
  { name: 'Network Defense & SOC Operations', level: 95, category: 'Security & Ops' },
  { name: 'Cisco IT Essentials / Hardware Security', level: 98, category: 'Security & Ops' },
  
  // Category: Software Engineering & Architecture
  { name: 'Enterprise Design Patterns & SOLID', level: 95, category: 'Engineering' },
  { name: 'Java (Swing/Activation) & C# / .NET', level: 94, category: 'Engineering' },
  { name: 'Distributed Systems & Microservices', level: 91, category: 'Engineering' },
  { name: 'Advanced Data Structures & Algorithms', level: 96, category: 'Engineering' },
  { name: 'Memory Complexity & Performance Optimization', level: 90, category: 'Engineering' },
  { name: 'Python, C++, & C# System Programming', level: 93, category: 'Engineering' },

  // Category: Full-Stack Digital Forge
  { name: 'React / Next.js / TypeScript Mastery', level: 98, category: 'Web Mastery' },
  { name: 'Scalable REST / GraphQL / gRPC APIs', level: 94, category: 'Web Mastery' },
  { name: 'Oracle SQL & Relational DBMS Normalization', level: 95, category: 'Web Mastery' },
  { name: 'DevSecOps & CI/CD Pipeline Automation', level: 92, category: 'Web Mastery' },
  { name: 'Real-time WebSocket Infrastructure', level: 96, category: 'Web Mastery' },
  { name: 'Web Security (OWASP Top 10 / OAuth 2.1)', level: 97, category: 'Web Mastery' },
];

const SkillCard: React.FC<{ category: string, skills: typeof SKILLS }> = ({ category, skills }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -15, y: x * 15 });
  };

  return (
    <div 
      className={`glass-panel p-10 rounded-[2.5rem] border-2 transition-all duration-700 ease-out three-d-card group bg-black/60 shadow-2xl ${
        isHovered 
          ? 'border-cyan-400/80 shadow-[0_0_100px_rgba(0,243,255,0.25)] z-50' 
          : 'border-cyan-500/10 z-10'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setRotation({ x: 0, y: 0 });
        setIsHovered(false);
      }}
      style={{ 
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.12 : 1})`,
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border 0.5s ease, box-shadow 0.5s ease',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="mb-10 flex items-center justify-between" style={{ transform: 'translateZ(40px)' }}>
        <h3 className="mono text-cyan-400 font-black text-xl uppercase tracking-[0.2em] border-l-6 border-cyan-500 pl-6 py-1 leading-tight cyan-glow">
          {category}
        </h3>
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:rotate-[360deg] transition-transform duration-1000">
          <div className="w-5 h-5 bg-cyan-400 rounded-sm animate-pulse shadow-[0_0_15px_#00f3ff]" />
        </div>
      </div>
      
      <div className="space-y-7" style={{ transform: 'translateZ(30px)' }}>
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-3 group/skill">
            <div className="flex justify-between mono text-[11px] font-black uppercase text-gray-400 tracking-widest group-hover/skill:text-cyan-400 transition-colors">
              <span className="truncate mr-2">{skill.name}</span>
              <span className="text-cyan-500 font-black shrink-0">{skill.level}%</span>
            </div>
            <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-cyan-900/60 p-[1px] shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-cyan-950 via-cyan-400 to-cyan-950 shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left" 
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Futuristic scanning light effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/40 blur-sm animate-[scan_3s_linear_infinite]" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none rounded-[2.5rem]" />
      
      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const SkillsMatrix: React.FC = () => {
  const categories = ['Security & Ops', 'Engineering', 'Web Mastery'];

  return (
    <div className="space-y-16 py-12 relative">
      <div className="flex items-center space-x-6" style={{ transform: 'translateZ(50px)' }}>
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
          Cyber_<span className="text-cyan-500">Arsenal</span>
        </h2>
        <div className="h-[3px] flex-grow bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent"></div>
        <div className="mono text-xs text-cyan-500/50 tracking-widest uppercase font-black">Expert_Deployment_v5.0</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 xl:gap-14 relative z-10">
        {categories.map((cat) => (
          <SkillCard 
            key={cat} 
            category={cat.replace('& Ops', '& Defense').replace('Web Mastery', 'Digital Forge')} 
            skills={SKILLS.filter(s => s.category === cat)} 
          />
        ))}
      </div>
    </div>
  );
};
