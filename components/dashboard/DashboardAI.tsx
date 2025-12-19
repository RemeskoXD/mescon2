import React from 'react';
import { Bot, Lock, Cpu, Database, Activity, ShieldAlert, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../../types';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardAIProps {
    user: User;
}

const DashboardAI: React.FC<DashboardAIProps> = ({ user }) => {
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-[#050505] border border-gray-800 rounded-2xl overflow-hidden animate-fade-in relative p-8">
            
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <MotionDiv 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 max-w-2xl w-full bg-[#0a0a0a] border border-green-900/30 rounded-3xl p-10 text-center shadow-2xl overflow-hidden"
            >
                {/* Scanning Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>

                <div className="flex justify-center mb-8 relative">
                    <div className="w-24 h-24 bg-green-900/10 rounded-2xl border border-green-500/30 flex items-center justify-center relative overflow-hidden">
                        <Bot size={48} className="text-green-500 relative z-10"/>
                        {/* Glitch effects */}
                        <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded border border-yellow-400 shadow-lg">
                        BETA
                    </div>
                </div>

                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">NEXUS</span></h2>
                <p className="text-green-500/60 font-mono text-xs uppercase tracking-[0.2em] mb-8">Autonomous Business Intelligence</p>

                <div className="bg-black/50 border border-gray-800 rounded-xl p-6 text-left space-y-4 mb-8 relative">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-gray-800 pb-2">
                        <span>SYSTEM_STATUS</span>
                        <span className="text-yellow-500 animate-pulse">● TRAINING_IN_PROGRESS</span>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Database size={14} className="text-blue-500"/>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs text-gray-300 mb-1">
                                    <span>Ingesting Sales Data...</span>
                                    <span>98%</span>
                                </div>
                                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[98%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Cpu size={14} className="text-purple-500"/>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs text-gray-300 mb-1">
                                    <span>Neural Net Optimization...</span>
                                    <span>74%</span>
                                </div>
                                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[74%] animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldAlert size={14} className="text-red-500"/>
                            <div className="flex-1">
                                <div className="flex justify-between text-xs text-gray-300 mb-1">
                                    <span>Safety Protocols...</span>
                                    <span>PENDING</span>
                                </div>
                                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[15%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                    <Lock size={14}/>
                    <span>Modul je momentálně uzamčen pro veřejnost.</span>
                </div>

                <button disabled className="px-8 py-3 bg-gray-800 border border-gray-700 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center gap-2 mx-auto hover:bg-gray-800 transition">
                    <Timer size={16}/> Očekávané spuštění: Q4 2024
                </button>

            </MotionDiv>
        </div>
    );
};

export default DashboardAI;