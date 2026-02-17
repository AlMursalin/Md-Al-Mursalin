
import React, { useState, useEffect, useRef } from 'react';
import { Database, Trash2, Edit3, Download, X, Search, Terminal, ShieldAlert, Check, Save, MapPin, Clock, RotateCcw, Image as ImageIcon, Settings, Upload, FileCode, Maximize2, Loader2, Sparkles } from 'lucide-react';
import { Visitor } from '../types.ts';

export const AdminConsole: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [activeView, setActiveView] = useState<'LOGS' | 'SETTINGS'>('LOGS');
  
  // Identity Config States
  const [photoUrl, setPhotoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const loadLogs = () => {
    const data = localStorage.getItem('visitor_logs');
    if (data) setVisitors(JSON.parse(data));
    
    const savedPhoto = localStorage.getItem('operator_photo');
    if (savedPhoto) {
      setPhotoUrl(savedPhoto);
      setLastSynced(new Date().toLocaleTimeString());
    } else {
      setPhotoUrl("https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1000");
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs();
      const interval = setInterval(loadLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Core Baking Logic (Processes image for permanent storage)
  const bakeImage = (imgElement: HTMLImageElement, customZoom?: number, cx?: number, cy?: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed 1000px square for high-quality portal display
    const size = 1000;
    canvas.width = size;
    canvas.height = size;

    const currentZoom = customZoom ?? zoom;
    const currentPosX = cx ?? posX;
    const currentPosY = cy ?? posY;

    const aspect = imgElement.naturalWidth / imgElement.naturalHeight;
    let drawW, drawH;
    
    if (aspect > 1) {
      drawH = size * currentZoom;
      drawW = drawH * aspect;
    } else {
      drawW = size * currentZoom;
      drawH = drawW / aspect;
    }

    const x = (size - drawW) / 2 + (currentPosX * (size / 100));
    const y = (size - drawH) / 2 + (currentPosY * (size / 100));

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(imgElement, x, y, drawW, drawH);

    try {
      const bakedData = canvas.toDataURL('image/jpeg', 0.9);
      localStorage.setItem('operator_photo', bakedData);
      setPhotoUrl(bakedData);
      setLastSynced(new Date().toLocaleTimeString());
      
      // Notify other components (Hero)
      window.dispatchEvent(new CustomEvent('identity_update', { detail: { photo: bakedData } }));
      return true;
    } catch (e) {
      alert("QUOTA_EXCEEDED: Image is too heavy for local storage node. Please use a smaller file.");
      return false;
    }
  };

  const handleManualBake = () => {
    if (!previewImgRef.current) return;
    setIsProcessing(true);
    setTimeout(() => {
      const success = bakeImage(previewImgRef.current!);
      if (success) {
        alert("SYSTEM_SYNC: Biometric alignment committed to core memory.");
      }
      setIsProcessing(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        
        // Pre-load the image to auto-bake a default view
        const img = new Image();
        img.onload = () => {
          setZoom(1);
          setPosX(0);
          setPosY(0);
          bakeImage(img, 1, 0, 0); // Auto-save center crop immediately
          setIsProcessing(false);
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleRestore = () => {
    if (confirm("RESTORE_INITIATED: Restore default database node structure?")) {
      const mockData: Visitor[] = [
        { id: 'node-mock-1', timestamp: new Date().toISOString(), ip: '192.168.1.1', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', duration: '15m 30s', sessionCount: 1, notes: 'Default monitoring baseline.' },
        { id: 'node-mock-2', timestamp: new Date(Date.now() - 3600000).toISOString(), ip: '45.79.102.33', userAgent: 'Mozilla/5.0 (Linux; Android 10)', duration: '1m 12s', sessionCount: 1, notes: 'Suspicious probe detected.' }
      ];
      setVisitors(mockData);
      localStorage.setItem('visitor_logs', JSON.stringify(mockData));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("CONFIRM_DELETION: This record will be permanently purged.")) {
      const updated = visitors.filter(v => v.id !== id);
      setVisitors(updated);
      localStorage.setItem('visitor_logs', JSON.stringify(updated));
    }
  };

  const startEdit = (visitor: Visitor) => {
    setEditingId(visitor.id);
    setEditNotes(visitor.notes || '');
  };

  const saveEdit = (id: string) => {
    const updated = visitors.map(v => v.id === id ? { ...v, notes: editNotes } : v);
    setVisitors(updated);
    localStorage.setItem('visitor_logs', JSON.stringify(updated));
    setEditingId(null);
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(visitors, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `visitor_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredVisitors = visitors.filter(v => 
    v.ip.includes(searchTerm) || 
    v.userAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.notes && v.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="w-full max-w-[95vw] h-full max-h-[90vh] glass-panel border-2 border-cyan-500/30 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_120px_rgba(0,243,255,0.15)]">
        
        {/* Header */}
        <div className="p-8 border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between bg-cyan-950/20 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/40 animate-pulse">
              {activeView === 'LOGS' ? <Database className="text-cyan-400" size={28} /> : <Settings className="text-cyan-400" size={28} />}
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mono">
                Admin_<span className="text-cyan-500">{activeView === 'LOGS' ? 'Node_Monitor' : 'System_Config'}</span>
              </h2>
              <p className="text-[10px] text-cyan-500/60 uppercase tracking-[0.4em] font-black">Operator_Node: MURSALIN_ROOT</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-black/40 border border-cyan-500/20 rounded-2xl p-1.5 mr-4">
               <button 
                onClick={() => setActiveView('LOGS')}
                className={`px-6 py-2.5 rounded-xl mono text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'LOGS' ? 'bg-cyan-500 text-black' : 'text-cyan-500/60 hover:text-cyan-400'}`}
               >
                 Traffic_Logs
               </button>
               <button 
                onClick={() => setActiveView('SETTINGS')}
                className={`px-6 py-2.5 rounded-xl mono text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'SETTINGS' ? 'bg-cyan-500 text-black' : 'text-cyan-500/60 hover:text-cyan-400'}`}
               >
                 Identity_Config
               </button>
            </div>

            {activeView === 'LOGS' && (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/40" size={18} />
                  <input 
                    type="text" 
                    placeholder="QUERY_DATABASE..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/60 border border-cyan-500/20 rounded-full px-12 py-2 text-sm mono text-cyan-400 focus:outline-none focus:border-cyan-500/60 w-64 transition-all"
                  />
                </div>
                <div className="flex bg-black/40 border border-cyan-500/20 rounded-xl p-1">
                  <button onClick={handleRestore} className="p-3 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all" title="Restore Database"><RotateCcw size={20} /></button>
                  <button onClick={downloadData} className="p-3 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all" title="Download Logs"><Download size={20} /></button>
                </div>
              </div>
            )}
            
            <button onClick={onClose} className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl border border-red-500/20 hover:border-red-500/60 transition-all"><X size={24} /></button>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-grow overflow-auto custom-scrollbar bg-black/40">
          {activeView === 'LOGS' ? (
            <div className="p-8 space-y-6">
              {filteredVisitors.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <ShieldAlert size={80} className="text-cyan-500" />
                  <div className="mono font-black uppercase tracking-widest text-xl">Database_Stream_Empty</div>
                </div>
              ) : (
                <div className="space-y-4">
                   {/* Headers */}
                   <div className="grid grid-cols-12 gap-4 px-6 mb-2 mono text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em]">
                      <div className="col-span-2">Inbound_Timestamp</div>
                      <div className="col-span-1">Duration</div>
                      <div className="col-span-2">IP_Address</div>
                      <div className="col-span-3">Hardware_Fingerprint</div>
                      <div className="col-span-3">Admin_Notes</div>
                      <div className="col-span-1 text-right">Ops</div>
                   </div>

                   {/* Rows */}
                   {filteredVisitors.map((v) => (
                      <div key={v.id} className="grid grid-cols-12 gap-4 items-center bg-white/5 border border-white/5 hover:border-cyan-500/30 p-6 rounded-[2rem] transition-all group/row relative overflow-hidden">
                        <div className="col-span-2">
                           <div className="mono text-[11px] text-white font-bold">{new Date(v.timestamp).toLocaleString()}</div>
                           <div className="text-[9px] text-gray-500 mono truncate uppercase tracking-tighter">{v.id}</div>
                        </div>
                        <div className="col-span-1">
                           <div className="flex items-center gap-2 text-green-400 mono text-[10px] font-black">
                              <Clock size={12} className="shrink-0" />{v.duration || '0s'}
                           </div>
                        </div>
                        <div className="col-span-2">
                           <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400 mono text-xs font-black shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                              {v.ip}
                           </span>
                        </div>
                        <div className="col-span-3">
                           <div className="text-[9px] text-gray-500 mono leading-tight line-clamp-2 uppercase italic">
                              {v.userAgent}
                           </div>
                        </div>
                        <div className="col-span-3">
                           {editingId === v.id ? (
                             <div className="flex items-center gap-2">
                               <input 
                                 autoFocus 
                                 value={editNotes} 
                                 onChange={(e) => setEditNotes(e.target.value)} 
                                 className="bg-black/80 border border-cyan-500/40 rounded px-3 py-1 text-[10px] mono text-white w-full" 
                               />
                               <button onClick={() => saveEdit(v.id)} className="text-green-500 hover:scale-110 transition-transform">
                                 <Save size={14} />
                               </button>
                             </div>
                           ) : (
                             <div className="text-[10px] text-cyan-500/60 italic mono truncate px-2 border-l border-cyan-500/20">
                                {v.notes || '---'}
                             </div>
                           )}
                        </div>
                        <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                           <button onClick={() => startEdit(v)} className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                              <Edit3 size={16} />
                           </button>
                           <button onClick={() => handleDelete(v.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-1 bg-cyan-500 scale-y-0 group-hover/row:scale-y-100 transition-transform origin-top" />
                      </div>
                   ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-12 px-8 space-y-12">
               <div className="glass-panel p-12 rounded-[4rem] border border-cyan-500/20 space-y-12 bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-5 bg-cyan-500/10 rounded-[2rem] border border-cyan-500/30">
                          {isProcessing ? <Loader2 size={40} className="text-cyan-400 animate-spin" /> : <ImageIcon size={40} className="text-cyan-400" />}
                      </div>
                      <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mono">Identity_Portal_Control</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                             <p className="text-[9px] text-cyan-500/60 mono font-black uppercase tracking-[0.3em]">LAST_SYNC: {lastSynced || 'NEVER'}</p>
                          </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={triggerFileInput}
                      className="px-8 py-4 bg-white text-black font-black uppercase mono text-xs tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-xl flex items-center gap-3"
                    >
                      <Upload size={18} /> SELECT_NEW_IDENTITY
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </div>

                  <div className="grid lg:grid-cols-[320px_1fr] gap-12 items-center">
                    {/* Live Crop Preview Window */}
                    <div className="relative group">
                       <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                       <div className="relative w-80 h-80 rounded-[3rem] border-4 border-cyan-500/40 overflow-hidden bg-black shadow-2xl">
                          <div className="absolute inset-0 z-10 pointer-events-none border border-white/5 flex items-center justify-center">
                              <div className="w-full h-[1px] bg-cyan-500/30 absolute" />
                              <div className="h-full w-[1px] bg-cyan-500/30 absolute" />
                              <div className="w-56 h-56 border-2 border-dashed border-cyan-500/40 rounded-full absolute" />
                          </div>
                          <img 
                            ref={previewImgRef}
                            src={photoUrl} 
                            className="absolute max-w-none transition-transform duration-75 ease-out"
                            style={{ 
                              transform: `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${zoom})`,
                              top: '50%',
                              left: '50%',
                              width: '100%',
                              height: 'auto'
                            }}
                            alt="Biometric Preview" 
                          />
                          {isProcessing && (
                            <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center flex-col gap-4">
                              <Loader2 size={48} className="text-cyan-500 animate-spin" />
                              <span className="mono text-[10px] text-cyan-500 font-black tracking-widest uppercase">Syncing_Nodes...</span>
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Adjustment Sliders */}
                    <div className="space-y-10">
                       <div className="space-y-6">
                          <div className="space-y-3">
                             <div className="flex justify-between items-center mono text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                                <span>MAGNIFICATION</span>
                                <span className="text-cyan-400">{zoom.toFixed(2)}X</span>
                             </div>
                             <input type="range" min="0.5" max="5" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
                          </div>
                          <div className="space-y-3">
                             <div className="flex justify-between items-center mono text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                                <span>X_AXIS_OFFSET</span>
                                <span className="text-cyan-400">{posX}PX</span>
                             </div>
                             <input type="range" min="-500" max="500" step="1" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full accent-cyan-500" />
                          </div>
                          <div className="space-y-3">
                             <div className="flex justify-between items-center mono text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                                <span>Y_AXIS_OFFSET</span>
                                <span className="text-cyan-400">{posY}PX</span>
                             </div>
                             <input type="range" min="-500" max="500" step="1" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full accent-cyan-500" />
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-5">
                          <button 
                            onClick={handleManualBake}
                            disabled={isProcessing}
                            className="px-10 py-5 bg-cyan-500 text-black font-black uppercase mono text-xs tracking-[0.2em] rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_40px_rgba(0,243,255,0.4)] flex items-center gap-3"
                          >
                            <Sparkles size={20} /> COMMIT_FINAL_ALIGNMENT
                          </button>
                          <button 
                            onClick={() => { setZoom(1); setPosX(0); setPosY(0); }}
                            className="px-8 py-5 border-2 border-cyan-500/20 text-cyan-500/40 hover:text-cyan-400 hover:border-cyan-500/60 rounded-2xl mono text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                          >
                            <RotateCcw size={16} /> RESET_AXIS
                          </button>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="p-10 border-2 border-dashed border-cyan-500/10 rounded-[4rem] text-center space-y-4 bg-cyan-950/10">
                  <Terminal size={32} className="mx-auto text-cyan-500/30" />
                  <p className="mono text-[11px] text-cyan-500/40 uppercase tracking-[0.3em] font-black leading-relaxed max-w-lg mx-auto">
                    The biometric feed is baked into the local storage vault and will persist across all sessions as the master default identity.
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cyan-500/10 bg-black/80 flex justify-between items-center mono text-[10px] uppercase font-black tracking-[0.2em] text-cyan-500/40">
          <div className="flex items-center gap-4">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_12px_#00f3ff]"></span>
            OPS_STATUS: CORE_LINK_ESTABLISHED
          </div>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">LIVE_SESSIONS: {visitors.length}</span>
            <span className="text-gray-800">|</span>
            <span>V8.2.1_STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
