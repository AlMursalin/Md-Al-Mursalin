
import React, { useState } from 'react';
import { 
  X, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MessageCircle, 
  Briefcase, 
  Globe,
  Github,
  ArrowUpRight,
  ShieldCheck,
  Send,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

type ContactView = 'GRID' | 'FORM';

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [view, setView] = useState<ContactView>('GRID');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("ENCRYPTION_COMPLETE: Message transmitted to secure vault.");
      setIsSubmitting(false);
      onBack();
    }, 1500);
  };

  const contactNodes = [
    { name: 'WhatsApp', icon: <MessageCircle size={20} />, url: 'https://wa.me/yournumber', label: 'CHAT' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://www.linkedin.com/in/md-al-mursalin-3b6bb334b', label: 'NETWORK' },
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com/AlMursalin', label: 'SOURCE' },
    { name: 'Fiverr', icon: <Briefcase size={20} />, url: 'https://fiverr.com/yourprofile', label: 'SERVICES' },
    { name: 'Upwork', icon: <Globe size={20} />, url: 'https://upwork.com/yourprofile', label: 'SERVICES' },
    { name: 'Email', icon: <Mail size={20} />, url: 'mailto:mdalmursalin123@gmail.com', label: 'DIRECT' },
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://www.facebook.com/al.mursalin12/', label: 'SOCIAL' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://www.instagram.com/mursalin.al/', label: 'SOCIAL' },
  ];

  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-black/20 backdrop-blur-md">
      {/* Back Button - Fixed Position Relative to Viewport */}
      <button 
        onClick={onBack}
        className="fixed top-24 left-6 md:left-12 flex items-center gap-3 mono text-[10px] font-black text-cyan-500 hover:text-white transition-all group uppercase tracking-[0.3em] z-[120] bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-cyan-500/20 shadow-xl"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Terminal
      </button>

      {/* Main Message Box Card - Perfectly Centered via Flex Parent */}
      <div className="w-full max-w-[500px] bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_0_100px_rgba(0,243,255,0.2)] relative transition-all duration-500 ease-out border border-white/20 animate-in zoom-in-95 fade-in duration-700">
        
        {/* Navigation Control */}
        <div className="absolute top-10 right-10 flex items-center gap-2">
          {view === 'FORM' && (
             <button 
               onClick={() => setView('GRID')}
               className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all border border-slate-100"
               title="Back to Nodes"
             >
               <ChevronLeft size={20} strokeWidth={2.5} />
             </button>
           )}
          <button 
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-red-500 transition-all border border-slate-100"
            title="Terminate Protocol"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {view === 'GRID' ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-blue-50 rounded-2xl shadow-inner">
                  <ShieldCheck size={28} className="text-blue-600" />
               </div>
               <span className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] mono">Secure Communication Uplink</span>
            </div>

            <div className="mb-10">
              <h2 className="text-[38px] font-black text-[#111827] tracking-tighter leading-none mb-4 uppercase">GET IN TOUCH</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Choose a secure gateway below to initiate a connection with the operator node.
              </p>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {contactNodes.map((node) => (
                <a 
                  key={node.name}
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-6 border-2 border-slate-50 rounded-3xl bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                      {node.icon}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[14px] font-black text-slate-900 mb-1">{node.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">{node.label}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-100 group-hover:text-blue-600 transition-colors" />
                </a>
              ))}
            </div>

            {/* Form Trigger */}
            <button 
              onClick={() => setView('FORM')}
              className="w-full py-6 bg-black text-white font-black text-sm text-center rounded-3xl hover:bg-slate-900 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group uppercase tracking-[0.2em]"
            >
              <Mail size={20} className="group-hover:translate-x-1 transition-transform" />
              Transmit Secure Message
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-6 duration-500 ease-out">
            {/* Form View Header */}
            <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-emerald-50 rounded-2xl shadow-inner">
                  <Mail size={28} className="text-emerald-600" />
               </div>
               <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.2em] mono">Direct Message Protocol</span>
            </div>

            <div className="mb-10">
              <h2 className="text-[38px] font-black text-[#111827] tracking-tighter leading-none mb-4 uppercase">MESSAGE BOX</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Transmission of data payloads is monitored for integrity. Provide clear parameters.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <input 
                  type="email"
                  required
                  placeholder="SOURCE_EMAIL: name@host.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-7 py-5 border-2 border-slate-50 rounded-3xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium placeholder:text-slate-300 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1">
                <input 
                  type="text"
                  required
                  placeholder="SUBJECT: Query Type"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-7 py-5 border-2 border-slate-50 rounded-3xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium placeholder:text-slate-300 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1">
                <textarea 
                  required
                  placeholder="DATA_PAYLOAD: Your detailed message..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-7 py-5 border-2 border-slate-50 rounded-3xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium placeholder:text-slate-300 resize-none bg-slate-50/50"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-black text-white font-black text-sm text-center rounded-3xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Execute Transmission
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Persistent Footer */}
        <button 
          onClick={onBack}
          className="w-full text-center text-[10px] font-black text-slate-300 hover:text-slate-800 transition-colors uppercase tracking-[0.5em] mt-12 pt-6 border-t border-slate-50"
        >
          — Protocol Disconnect —
        </button>
      </div>
    </div>
  );
};
