import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Star, X, Gift } from 'lucide-react';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface LootBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemName: string;
    onRewardRevealed: () => void;
    rewardDetails?: { type: string, value: string, icon: any }; // New Prop
}

const LootBoxModal: React.FC<LootBoxModalProps> = ({ isOpen, onClose, itemName, onRewardRevealed, rewardDetails }) => {
    const [step, setStep] = useState<'idle' | 'shaking' | 'opening' | 'revealed'>('idle');
    const [localReward, setLocalReward] = useState<{type: string, value: string, icon: any} | null>(null);

    useEffect(() => {
        if (isOpen) {
            setStep('idle');
            // If reward details passed, use them. Otherwise default fallback (should ideally always be passed now)
            if (rewardDetails) {
                setLocalReward(rewardDetails);
            } else {
                setLocalReward({ type: 'item', value: 'Neznámá odměna', icon: <Gift size={40}/> });
            }
        }
    }, [isOpen, rewardDetails]);

    const handleOpen = () => {
        if (step !== 'idle') return;
        setStep('shaking');
        setTimeout(() => {
            setStep('opening');
            setTimeout(() => {
                setStep('revealed');
                onRewardRevealed(); // Trigger database update
            }, 500);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <MotionDiv 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-sm"
            >
                {/* Confetti Background when revealed */}
                {step === 'revealed' && (
                    <div className="absolute inset-0 -m-20 overflow-hidden pointer-events-none">
                        {[...Array(30)].map((_, i) => (
                            <MotionDiv
                                key={i}
                                initial={{ y: 0, x: 0, opacity: 1 }}
                                animate={{ 
                                    y: (Math.random() - 0.5) * 400, 
                                    x: (Math.random() - 0.5) * 400, 
                                    opacity: 0 
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-500 rounded-full"
                            />
                        ))}
                    </div>
                )}

                <div className="bg-[#0B0F19] rounded-3xl border border-gray-800 p-8 text-center shadow-2xl relative overflow-hidden">
                    {/* Glow behind box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full"></div>

                    {step !== 'revealed' ? (
                        <div className="cursor-pointer" onClick={handleOpen}>
                            <MotionDiv
                                animate={step === 'shaking' ? { 
                                    x: [-5, 5, -5, 5, 0], 
                                    rotate: [-5, 5, -5, 5, 0],
                                    scale: [1, 1.1, 1, 1.1, 1]
                                } : { y: [0, -10, 0] }}
                                transition={step === 'shaking' ? { duration: 0.5, repeat: 2 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/10 relative z-10"
                            >
                                <Package size={64} className="text-white"/>
                                <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                            </MotionDiv>
                            <h3 className="text-xl font-bold text-white mb-2">{itemName}</h3>
                            <p className="text-sm text-gray-400">
                                {step === 'idle' ? 'Klikni pro otevření!' : 'Otevírám...'}
                            </p>
                        </div>
                    ) : (
                        <MotionDiv 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <div className="w-32 h-32 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                {localReward?.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Gratulujeme!</h3>
                            <p className="text-gray-400 mb-6">Získal jsi:</p>
                            <div className="text-3xl font-bold text-yellow-500 mb-8">{localReward?.value}</div>
                            
                            <button 
                                onClick={onClose}
                                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition"
                            >
                                Uložit do inventáře
                            </button>
                        </MotionDiv>
                    )}
                </div>
            </MotionDiv>
        </div>
    );
};

export default LootBoxModal;