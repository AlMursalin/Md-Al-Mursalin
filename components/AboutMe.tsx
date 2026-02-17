
import React, { useState } from 'react';
import { Fingerprint, Target, Globe } from 'lucide-react';

const AboutCard: React.FC<{ icon: React.ReactNode, title: string, text: string }> = ({ icon, title, text }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: y * -15, y: x * 15 });
  };

  return (
    <div 
      className="glass-panel p-8 rounded-3xl border border-cyan-500/10 transition-all group three-d-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{ 
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0)`,
      }}
    >
      <div className="p-4 bg-cyan-900/10 rounded-2xl w-fit mb-6 group-hover:scale-110 group-hover:bg-cyan-900/20 transition-all shadow-[0_0_20px_rgba(0,243,255,0.05)]">
        {icon}
      </div>
      <h3 className="mono font-bold text-xl mb-4 uppercase text-cyan-400">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export const AboutMe: React.FC = () => {
  return (
    <div className="space-y-12 py-12">
      <div className="flex items-center space-x-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Profile_<span className="text-cyan-500">Overview</span></h2>
        <div className="h-[2px] flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <AboutCard 
          icon={<Fingerprint className="w-10 h-10 text-cyan-500" />}
          title="Identity"
          text="I am Md Al Mursalin, a Computer Science student with a deep interest in Cyber Security. I combine software development with defensive methodologies, specializing in Java, C#, Python, and secure database management."
        />
        <AboutCard 
          icon={<Target className="w-10 h-10 text-cyan-500" />}
          title="Mission"
          text="My mission is to apply team-based software engineering practices to solve complex real-world problems. I focus on the entire SDLC, from requirement analysis to secure deployment and IT maintenance."
        />
        <AboutCard 
          icon={<Globe className="w-10 h-10 text-cyan-500" />}
          title="Philosophy"
          text="I believe in continuous learning. Whether it's mastering time complexity or exploring new Java frameworks like Activation/Swing, I strive to improve my skills through real-world experience and academic excellence."
        />
      </div>
    </div>
  );
};
