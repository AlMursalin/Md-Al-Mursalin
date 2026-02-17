
import React, { useState } from 'react';
import { ExternalLink, Database, ShieldAlert, Cpu, HeartPulse, Lock, Layout, Code, Network, BrainCircuit } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  semester: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, semester, description, tags, icon }) => {
  const [displayText, setDisplayText] = useState(title);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -15, y: x * 15 });
  };

  const handleMouseEnter = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(title.split("").map((_, index) => {
        if (index < iterations) return title[index];
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      }).join(""));
      
      if (iterations >= title.length) clearInterval(interval);
      iterations += 1/3;
    }, 30);
  };

  const handleMouseLeave = () => {
    setDisplayText(title);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="glass-panel p-8 rounded-[2.5rem] border border-cyan-900/50 hover:border-cyan-400/50 transition-all group relative overflow-hidden three-d-card bg-black/40"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0)`,
      }}
    >
      <div className="absolute top-6 right-8 flex flex-col items-end">
        <span className="mono text-[10px] text-cyan-500 font-black uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
          {semester}
        </span>
        <ExternalLink size={16} className="text-cyan-400/40 group-hover:text-cyan-400 transition-colors" />
      </div>
      
      <div className="mb-6 p-4 bg-cyan-900/20 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.1)] border border-cyan-500/10">
        {icon}
      </div>

      <h3 className="mono text-xl font-bold mb-3 uppercase tracking-tighter text-cyan-400 min-h-[3rem] z-10 relative">
        {displayText}
      </h3>
      
      <p className="text-gray-400 mb-6 leading-relaxed text-xs z-10 relative font-medium opacity-80 group-hover:opacity-100 transition-opacity">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 z-10 relative">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-1 rounded-lg bg-cyan-950/20 border border-cyan-900/40 text-[9px] mono text-cyan-500/80 uppercase font-black">
            #{tag}
          </span>
        ))}
      </div>

      {/* Background ID accent */}
      <div className="absolute -bottom-4 -left-4 mono text-6xl font-black text-cyan-500/5 select-none pointer-events-none group-hover:text-cyan-500/10 transition-colors">
        {semester.split(' ')[1]}
      </div>
    </div>
  );
};

export const ProjectsGrid: React.FC = () => {
  const projects = [
    {
      title: "Core Logic Foundations",
      semester: "PHASE 01",
      description: "Implemented complex structural algorithms in C++ as part of Intro to CS & Programming Language 1. Focus on pointers and memory management.",
      tags: ["C++", "Algorithms", "Foundation"],
      icon: <Code className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Secure Java Manager",
      semester: "PHASE 02",
      description: "Developed using Java Swing for OOP1. Integrated Gmail API for encrypted notifications and secure local storage models.",
      tags: ["Java", "Swing", "Security"],
      icon: <Lock className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "UML Architecture Lab",
      semester: "PHASE 03",
      description: "Data Structures & Object Oriented Analysis (OOAD). Modeling complex enterprise systems using UML and standard design patterns.",
      tags: ["UML", "Design Patterns", "DS"],
      icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Oracle DBMS Schema",
      semester: "PHASE 04",
      description: "Comprehensive relational database design in Oracle SQL. Implementation of 3NF/BCNF normalization and complex stored procedures.",
      tags: ["Oracle", "SQL", "DBMS"],
      icon: <Database className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Auto-Luminescence IoT",
      semester: "PHASE 05",
      description: "Operating Systems & Software Engineering lab. An automated light-dark system with optimized power cycling logic.",
      tags: ["IoT", "Software Eng", "OS"],
      icon: <Cpu className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Telemedicine Full-Stack",
      semester: "PHASE 06",
      description: "Web Technologies project. Online consultation system with real-time chat, appointment logs, and encrypted patient data records.",
      tags: ["Web Tech", "Full-Stack", "React"],
      icon: <HeartPulse className="w-8 h-8 text-cyan-400" />
    },
    {
      title: ".NET Enterprise Node",
      semester: "PHASE 07",
      description: "Major in Cyber Security focus. Ongoing enterprise project using C# and .NET Framework for secure management scaling.",
      tags: [".NET", "C#", "Security Major"],
      icon: <Layout className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Cyber Defense Capstone",
      semester: "PHASE 08",
      description: "Final Thesis/Capstone focus on Network Defensive Operations, CISCO standards, and implementing high-integrity secure systems.",
      tags: ["Cyber Security", "Cisco", "Thesis"],
      icon: <ShieldAlert className="w-8 h-8 text-cyan-400" />
    }
  ];

  return (
    <div className="space-y-16 py-12">
      <div className="flex flex-col md:flex-row md:items-center gap-6" style={{ transform: 'translateZ(50px)' }}>
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
          Academic_<span className="text-cyan-500">Labs</span>
        </h2>
        <div className="h-[3px] flex-grow bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent"></div>
        <div className="mono text-xs text-cyan-500/50 tracking-widest uppercase font-black">AIUB_CURRICULUM_V1.0</div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        {projects.map((p, idx) => (
          <ProjectCard key={idx} {...p} />
        ))}
      </div>

      {/* Curriculum Disclaimer */}
      <div className="mt-8 flex items-center justify-center gap-4 text-cyan-500/40 mono text-[10px] uppercase tracking-[0.4em] font-black italic">
        <Network size={14} />
        Synchronized with AIUB FST (BSc in CSE) Course Records
        <Network size={14} />
      </div>
    </div>
  );
};
