import React, { useState } from 'react';
import { Check, Star, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface PricingProps {
  onLoginClick: (plan: string, price: number) => void;
}

const Pricing: React.FC<PricingProps> = ({ onLoginClick }) => {
  const [isYearly, setIsYearly] = useState(true);

  const basicFeatures = [
    "Přístup ke všem video kurzům",
    "Přístup do veřejné komunity",
    "Pracovní sešity a PDF materiály",
    "Základní e-mailová podpora"
  ];

  const premiumFeatures = [
    "Vše co obsahuje BASIC",
    "Pravidelné LIVE cally s mentory",
    "Privátní 'Deal Room' networking",
    "Osobní 1:1 audit vašeho projektu",
    "Databáze ověřených kontaktů",
    "Certifikát o absolvování",
    "Přednostní VIP podpora 24/7"
  ];

  return (
    <div className="py-32 relative overflow-hidden bg-[#020617]" id="pricing">
      {/* Background glow behind pricing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-blue-900/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-blue-900/30 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-800">
               Investice do vaší budoucnosti
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              PLÁNY A <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">CENÍK</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
               Zvolte si plán, který vám vyhovuje.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-bold ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Měsíčně</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-14 h-8 bg-gray-800 rounded-full relative p-1 transition-colors hover:bg-gray-700 border border-gray-600"
              >
                <div className={`w-6 h-6 bg-blue-500 rounded-full shadow-md transition-transform duration-300 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-bold ${isYearly ? 'text-white' : 'text-gray-500'}`}>
                Ročně <span className="text-green-500 text-xs ml-1">(-20%)</span>
              </span>
            </div>
          </MotionDiv>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* BASIC PLAN */}
          <MotionDiv 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="relative bg-[#0B0F19] rounded-3xl p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 flex flex-col"
          >
             <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">BASIC</h3>
                <p className="text-gray-400 text-sm">Pro začínající studenty.</p>
             </div>
             
             <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{isYearly ? '790 Kč' : '990 Kč'}</span>
                    <span className="text-gray-500 text-sm"> / měs.</span>
                </div>
                {isYearly && <p className="text-xs text-green-500 mt-2 font-bold">Fakturováno ročně 9 480 Kč</p>}
                {!isYearly && <p className="text-xs text-gray-500 mt-2">Fakturováno měsíčně</p>}
             </div>

             <div className="h-px w-full bg-gray-800 mb-8"></div>

             <ul className="space-y-4 mb-8 flex-1">
                {basicFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start opacity-50">
                    <X className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 text-sm line-through">Osobní mentoring</span>
                </li>
             </ul>

             <MotionButton
               onClick={() => onLoginClick(isYearly ? 'BASIC_YEARLY' : 'BASIC_MONTHLY', isYearly ? 9480 : 990)}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition border border-gray-700"
             >
               Vybrat Basic
             </MotionButton>
          </MotionDiv>

          {/* PREMIUM PLAN */}
          <MotionDiv 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="relative bg-[#0f172a] rounded-3xl p-8 border border-blue-500/30 flex flex-col shadow-[0_0_50px_rgba(37,99,235,0.15)] group"
          >
             {/* Gradient Border Animation */}
             <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/20 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
             
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
               <Zap size={12} fill="currentColor" />
               Doporučeno
             </div>

             <div className="mb-4 mt-2">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">PREMIUM</h3>
                <p className="text-gray-400 text-sm">Pro ty, kteří to myslí vážně.</p>
             </div>
             
             <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">790 Kč</span>
                    <span className="text-gray-500 text-sm"> / měs.</span>
                </div>
                <p className="text-xs text-blue-400 mt-2 font-bold">Fakturováno ročně 9 480 Kč</p>
                <p className="text-xs text-gray-500 mt-1 italic">Tento tarif lze zakoupit pouze ročně.</p>
             </div>

             <div className="h-px w-full bg-gradient-to-r from-blue-900 to-transparent mb-8"></div>

             <ul className="space-y-4 mb-8 flex-1">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="h-3 w-3 text-blue-400" />
                    </div>
                    <span className="text-white text-sm font-medium">{feature}</span>
                  </li>
                ))}
             </ul>

             <MotionButton
               onClick={() => onLoginClick('PREMIUM_YEARLY', 9480)}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition relative overflow-hidden"
             >
               <span className="relative z-10">Vstoupit do Akademie</span>
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             </MotionButton>
             
             <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
               <Star size={12} className="text-yellow-500" fill="currentColor"/> 
               Zvolilo 90% úspěšných studentů
             </p>
          </MotionDiv>

        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-gray-900 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-60">
           <div>
             <h4 className="font-bold text-white text-lg">200+</h4>
             <p className="text-xs text-gray-500 uppercase tracking-wider">Aktivních členů</p>
           </div>
           <div>
             <h4 className="font-bold text-white text-lg">4.9/5</h4>
             <p className="text-xs text-gray-500 uppercase tracking-wider">Hodnocení spokojenosti</p>
           </div>
           <div>
             <h4 className="font-bold text-white text-lg">12+</h4>
             <p className="text-xs text-gray-500 uppercase tracking-wider">Expert programů</p>
           </div>
           <div>
             <h4 className="font-bold text-white text-lg">24/7</h4>
             <p className="text-xs text-gray-500 uppercase tracking-wider">Podpora komunity</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;