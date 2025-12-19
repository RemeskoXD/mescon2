
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Ticket, ArrowRight, Zap, CheckCircle, ShieldCheck } from 'lucide-react';
import { SystemSettings } from '../types';

const MotionDiv = motion.div as any;

interface LandingTicketSectionProps {
    settings: SystemSettings;
    onDefaultBuy: () => void;
}

const LandingTicketSection: React.FC<LandingTicketSectionProps> = ({ settings, onDefaultBuy }) => {
    
    const handleBuyClick = () => {
        if (settings.landingTicketLink) {
            window.open(settings.landingTicketLink, '_blank');
        } else {
            onDefaultBuy();
        }
    };

    const handleFreeClick = () => {
        if (settings.landingFreeLink) {
            window.open(settings.landingFreeLink, '_blank');
        }
    };

    return (
        <section className="py-24 relative overflow-hidden bg-black" id="buy-ticket">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-gradient-to-br from-blue-950/40 to-black border border-blue-500/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    {/* Visual accent */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap size={200} className="text-blue-500"/>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                                <Zap size={14} fill="currentColor"/> Poslední volná místa
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                                VAŠE CESTA <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 underline decoration-blue-500/30">ZAČÍNÁ DNES</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                                Získejte okamžitý přístup k elitnímu vzdělání, ověřeným strategiím a komunitě, která vás nenechá stagnovat.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleBuyClick}
                                    className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg shadow-blue-900/40 transition transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                                >
                                    <ShoppingCart size={22}/> KOUPIT VSTUPENKU
                                </button>
                                
                                {settings.landingFreeLink && (
                                    <button 
                                        onClick={handleFreeClick}
                                        className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black rounded-2xl transition flex items-center justify-center gap-3 text-lg"
                                    >
                                        <Ticket size={22} className="text-blue-400"/> REGISTROVAT ZDARMA
                                    </button>
                                )}
                            </div>

                            <div className="mt-10 flex flex-wrap gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Okamžitý přístup</div>
                                <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> 14-denní garance</div>
                                <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500"/> Secure payment</div>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            {/* Visual Card Representation */}
                            <MotionDiv 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-[#05080f] border border-gray-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(37,99,235,0.1)] relative"
                            >
                                <div className="h-48 bg-blue-600/20 rounded-2xl border border-blue-500/20 flex items-center justify-center mb-6">
                                    <ShoppingCart size={64} className="text-blue-500 opacity-50"/>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                                    <div className="h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-between px-4">
                                        <span className="text-blue-400 font-black">PLATNÁ VSTUPENKA</span>
                                        <CheckCircle size={16} className="text-green-500"/>
                                    </div>
                                </div>
                                
                                {/* Floating Element */}
                                <div className="absolute -top-6 -right-6 bg-yellow-500 text-black font-black p-4 rounded-2xl shadow-xl transform rotate-12">
                                    TOP VOLBA
                                </div>
                            </MotionDiv>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingTicketSection;
