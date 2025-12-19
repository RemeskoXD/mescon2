import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X } from 'lucide-react';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface LevelUpModalProps {
    level: number;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
    // Auto-close after 5 seconds if not interacted with? Maybe better to let user close it to enjoy the moment.
    
    return (
        <AnimatePresence>
            <MotionDiv 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            >
                {/* Confetti / Particle Effects Background (Simulated with simple dots for now) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <MotionDiv
                            key={i}
                            initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
                            animate={{ y: window.innerHeight + 100, rotate: 360 }}
                            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: "linear" }}
                            className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                            style={{ left: 0 }} // x controlled by initial
                        />
                    ))}
                </div>

                <MotionDiv 
                    initial={{ scale: 0.5, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative bg-[#0B0F19] w-full max-w-sm rounded-3xl border-2 border-yellow-500/50 p-8 text-center shadow-[0_0_100px_rgba(234,179,8,0.3)]"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-[#0B0F19]">
                            <Trophy size={48} className="text-white drop-shadow-md" />
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <MotionDiv 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 uppercase tracking-tighter">
                                LEVEL UP!
                            </h2>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Dosáhl jsi nové úrovně</p>
                        </MotionDiv>

                        <div className="py-6">
                            <div className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                                {level}
                            </div>
                        </div>

                        <div className="flex justify-center gap-1">
                            {[1,2,3].map(i => (
                                <Star key={i} className="text-yellow-500 fill-yellow-500 animate-pulse" size={24} />
                            ))}
                        </div>

                        <p className="text-gray-400 text-sm">
                            Tvá cesta pokračuje. Odemkl jsi nové možnosti a respekt komunity.
                        </p>

                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105 mt-4"
                        >
                            Pokračovat v dominanci
                        </button>
                    </div>
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};

export default LevelUpModal;