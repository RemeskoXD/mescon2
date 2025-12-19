import React from 'react';
import { Bot, Lock, Cpu, Activity, Database } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionDiv = motion.div as any;

const ComingSoonAI: React.FC = () => {
  return (
    <div className="relative py-32 bg-black overflow-hidden border-t border-gray-900" id="ai-section">
      {/* Matrix / Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
           <MotionDiv 
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             className="inline-flex items-center gap-2 px-3 py-1 rounded border border-green-500/30 bg-green-900/10 text-green-400 font-mono text-xs mb-4"
           >
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             SYSTEM_STATUS: PROTOTYPE
           </MotionDiv>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
             PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">NEXUS</span>
           </h2>
           <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
             Autonomous AI Business Consultant • Version 0.9 Alpha
           </p>
        </div>

        {/* The Locked Interface */}
        <div className="relative max-w-4xl mx-auto">
           {/* Glow Effect */}
           <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full"></div>

           <MotionDiv 
             initial={{ y: 50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             className="relative bg-[#050505] border border-gray-800 rounded-lg overflow-hidden shadow-2xl"
           >
              {/* HUD Header */}
              <div className="h-10 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-4">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                 </div>
                 <div className="font-mono text-[10px] text-gray-500">ENCRYPTED_CONNECTION // SECURE</div>
              </div>

              {/* Main Content Area (Blurred) */}
              <div className="relative h-[400px] bg-black p-6 font-mono text-sm grid grid-cols-4 gap-4 opacity-30 blur-sm pointer-events-none select-none">
                 <div className="col-span-1 border border-gray-800 p-4 rounded text-green-500/50">
                    <div className="mb-4 flex items-center gap-2"><Cpu size={14}/> PROCESSING</div>
                    <div className="space-y-2">
                       <div className="h-1 bg-green-900/50 w-full"></div>
                       <div className="h-1 bg-green-900/50 w-3/4"></div>
                       <div className="h-1 bg-green-900/50 w-1/2"></div>
                    </div>
                 </div>
                 <div className="col-span-3 border border-gray-800 p-4 rounded text-blue-500/50">
                    <div className="mb-4 flex items-center gap-2"><Activity size={14}/> MARKET ANALYSIS</div>
                    <div className="h-32 bg-gradient-to-t from-blue-900/20 to-transparent w-full flex items-end gap-1">
                       {[...Array(20)].map((_, i) => (
                          <div key={i} className="flex-1 bg-blue-800/40" style={{height: `${Math.random() * 100}%`}}></div>
                       ))}
                    </div>
                 </div>
                 <div className="col-span-4 border border-gray-800 p-4 rounded flex items-center gap-4">
                    <Bot className="text-gray-600" />
                    <div className="h-2 w-full bg-gray-900 rounded"></div>
                 </div>
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                 <MotionDiv 
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-6"
                 >
                    <Lock className="w-8 h-8 text-white" />
                 </MotionDiv>
                 
                 <h3 className="text-2xl font-bold text-white mb-2">ACCESS DENIED</h3>
                 <p className="text-gray-400 mb-8">This module is currently in closed beta testing.</p>

                 <div className="flex items-center gap-8 text-xs font-mono text-gray-500">
                    <div className="flex flex-col items-center gap-1">
                       <Database size={16} />
                       <span>TRAINING DATA</span>
                    </div>
                    <div className="h-8 w-px bg-gray-800"></div>
                    <div className="flex flex-col items-center gap-1">
                       <Cpu size={16} />
                       <span>NEURAL NET</span>
                    </div>
                 </div>
              </div>
           </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonAI;