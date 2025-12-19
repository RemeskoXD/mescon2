import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, Zap, Crown, User as UserIcon } from 'lucide-react';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBuy: (planName: string, price: number) => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onBuy }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('premium');

    if (!isOpen) return null;

    // Pricing Config
    const PRICING = {
        basic: {
            monthly: 990,
            yearly: 9480, // Ekvivalent 790/měs
            features: ['Přístup ke kurzům', 'Pracovní materiály', 'Základní komunita']
        },
        premium: {
            monthly: null, // Premium only yearly
            yearly: 9480, // Price matches Basic yearly in this example logic, or adjust as needed. 
                          // Prompt said "Premium 1rok price_..." and "Basic 1rok price..." 
                          // Usually Premium is more expensive. 
                          // Let's assume Premium Yearly is more, e.g. 14990 or keeping 9480 if it's a specific deal.
                          // Based on previous files, Premium was ~9480/yr. Let's stick to valid displays.
            features: ['Vše z Basic', 'Mentoring hovory', 'VIP Support', 'Certifikáty']
        }
    };

    const getPrice = (tier: 'basic' | 'premium') => {
        if (tier === 'basic') {
            return billingCycle === 'monthly' ? PRICING.basic.monthly : PRICING.basic.yearly;
        }
        return PRICING.premium.yearly; // Premium is always yearly
    };

    const handleBuyClick = () => {
        if (selectedTier === 'basic') {
            if (billingCycle === 'monthly') {
                onBuy('BASIC_MONTHLY', PRICING.basic.monthly);
            } else {
                onBuy('BASIC_YEARLY', PRICING.basic.yearly);
            }
        } else {
            // Premium is always yearly based on prompt
            onBuy('PREMIUM_YEARLY', PRICING.premium.yearly);
        }
    };

    return (
        <AnimatePresence>
            <MotionDiv 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                onClick={onClose}
            >
                <MotionDiv 
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-[#0B0F19] w-full max-w-4xl rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(37,99,235,0.1)] overflow-hidden flex flex-col md:flex-row"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-20"><X size={24}/></button>

                    {/* Left Side: Pitch */}
                    <div className="md:w-5/12 bg-gray-900/50 p-8 flex flex-col justify-center border-r border-gray-800">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                            <Lock size={32} className="text-blue-500"/>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">Odemkněte svůj potenciál</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Pro přístup k tomuto obsahu potřebujete aktivní členství. Vyberte si plán a začněte studovat ještě dnes.
                        </p>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Check size={16} className="text-green-500"/> <span>Neomezený přístup ke kurzům</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Check size={16} className="text-green-500"/> <span>Komunita a networking</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Check size={16} className="text-green-500"/> <span>Pravidelné aktualizace</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Selection */}
                    <div className="md:w-7/12 p-8 flex flex-col">
                        
                        {/* Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-900 p-1 rounded-xl flex border border-gray-800">
                                <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${billingCycle === 'monthly' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Měsíčně
                                </button>
                                <button 
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Ročně <span className="text-[10px] bg-white/20 px-1.5 rounded">-20%</span>
                                </button>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {/* BASIC PLAN */}
                            <div 
                                onClick={() => setSelectedTier('basic')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${selectedTier === 'basic' ? 'border-blue-500 bg-blue-900/10' : 'border-gray-800 hover:border-gray-600'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white flex items-center gap-2"><UserIcon size={16}/> Basic</span>
                                    {selectedTier === 'basic' && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                                </div>
                                <div className="text-2xl font-black text-white mb-1">
                                    {billingCycle === 'monthly' ? '990 Kč' : '9 480 Kč'}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold">
                                    {billingCycle === 'monthly' ? '/ měsíc' : '/ rok'}
                                </div>
                            </div>

                            {/* PREMIUM PLAN */}
                            <div 
                                onClick={() => { setSelectedTier('premium'); setBillingCycle('yearly'); }}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${selectedTier === 'premium' ? 'border-yellow-500 bg-yellow-900/10' : 'border-gray-800 hover:border-gray-600'}`}
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Doporučeno</div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white flex items-center gap-2"><Crown size={16} className="text-yellow-500"/> Premium</span>
                                    {selectedTier === 'premium' && <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>}
                                </div>
                                <div className="text-2xl font-black text-white mb-1">
                                    9 480 Kč
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase font-bold">
                                    / rok (pouze roční)
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={handleBuyClick}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                                    selectedTier === 'premium' 
                                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500' 
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                                }`}
                            >
                                <Zap size={20} fill="currentColor"/> 
                                {selectedTier === 'basic' ? 'Aktivovat Basic' : 'Aktivovat Premium'}
                            </button>
                            <p className="text-[10px] text-gray-500 mt-4 text-center">
                                Platba probíhá zabezpečeně přes Stripe. Lze kdykoliv zrušit.
                            </p>
                        </div>

                    </div>
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};

export default PaywallModal;