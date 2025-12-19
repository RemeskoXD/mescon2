import React from 'react';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;
const MotionButton = motion.button as any;

interface HeroProps {
  onLoginClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden" id="home">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-600/20 to-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{animationDuration: '4s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="z-10">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Přijímáme nové studenty pro rok 2024
            </MotionDiv>

            <MotionH1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8"
            >
              OVLÁDNĚTE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">DIGITÁLNÍ ÉRU</span>
            </MotionH1>

            <MotionP 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg"
            >
              Zapomeňte na průměrnost. Mescon Academy je elitní ekosystém, který vám předá know-how k vybudování, škálování a automatizaci vašeho online impéria.
            </MotionP>
            
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <MotionButton
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              >
                Chci Změnit Život
                <ArrowRight className="ml-2 w-5 h-5" />
              </MotionButton>
              <MotionButton
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5 fill-white" />
                Jak to funguje
              </MotionButton>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center gap-6 text-sm text-gray-400 font-medium"
            >
               <div className="flex items-center gap-2">
                 <CheckCircle className="text-green-500 w-5 h-5" /> Ověřené strategie
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle className="text-green-500 w-5 h-5" /> 200+ Studentů
               </div>
            </MotionDiv>
          </div>

          {/* Right Image Composition */}
          <MotionDiv 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-[700px] flex items-center justify-center perspective-1000"
          >
             {/* Main Card */}
             <MotionDiv 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-20 w-full max-w-md bg-gray-900 rounded-2xl p-2 border border-gray-700 shadow-2xl"
             >
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Founders" 
                  className="rounded-xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Floating Elements */}
                <MotionDiv 
                   animate={{ y: [0, 15, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute -right-8 top-20 bg-[#020617]/90 backdrop-blur-xl p-4 rounded-xl border border-gray-700 shadow-xl flex items-center gap-4"
                >
                   <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                     <span className="text-green-500 text-xl font-bold">$$</span>
                   </div>
                   <div>
                     <p className="text-xs text-gray-400">Měsíční příjem</p>
                     <p className="text-lg font-bold text-white">+ 245,000 Kč</p>
                   </div>
                </MotionDiv>

                <MotionDiv 
                   animate={{ y: [0, -15, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                   className="absolute -left-8 bottom-20 bg-[#020617]/90 backdrop-blur-xl p-4 rounded-xl border border-gray-700 shadow-xl"
                >
                   <div className="flex items-center gap-3 mb-2">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900"></div>
                        ))}
                     </div>
                     <span className="text-white font-bold text-sm">+12 nových</span>
                   </div>
                   <p className="text-xs text-green-400 font-bold">Komunita roste 🚀</p>
                </MotionDiv>
             </MotionDiv>
             
             {/* Decorative Background for Image */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-[100px] -z-10 rounded-full"></div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default Hero;