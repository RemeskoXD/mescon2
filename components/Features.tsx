import React from 'react';
import { TrendingUp, Users, MessageCircle, Award, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

const Features: React.FC = () => {
  return (
    <div className="py-32 bg-[#020617] relative z-10" id="mission">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-20">
           <MotionH2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight"
           >
             Arzenál pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Váš Úspěch</span>
           </MotionH2>
           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
             Nedostanete jen "kurz". Získáte komplexní operační systém pro vybudování moderního byznysu.
           </p>
         </div>

         {/* Bento Grid Layout */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Feature 1 - Large */}
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-gradient-to-br from-blue-900/20 to-gray-900 rounded-3xl p-8 border border-gray-800 relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <TrendingUp size={120} />
               </div>
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-900/50">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Praktické Business Strategie</h3>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                      Žádná omáčka. Dostanete přesné step-by-step návody, skripty a šablony, které používáme my pro generování 7-místných obratů.
                    </p>
                  </div>
               </div>
            </MotionDiv>

            {/* Feature 2 - Tall */}
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="md:row-span-2 bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 relative overflow-hidden group flex flex-col"
            >
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-purple-900/50">
                  <Users size={28} />
               </div>
               <h3 className="text-3xl font-bold text-white mb-3">Elitní Komunita</h3>
               <p className="text-gray-400 text-lg leading-relaxed mb-8">
                 Jste průměrem 5 lidí, se kterými trávíte nejvíce času. Zde budete mezi vítězi.
               </p>
               
               {/* Simulated Chat UI */}
               <div className="flex-1 bg-gray-950/50 rounded-xl p-4 space-y-3 border border-gray-800 overflow-hidden relative">
                  <div className="flex gap-3 items-end">
                     <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                     <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none text-xs text-gray-300">
                        Právě jsem uzavřel deal za 50k! 🚀
                     </div>
                  </div>
                  <div className="flex gap-3 items-end flex-row-reverse">
                     <div className="w-8 h-8 rounded-full bg-blue-600"></div>
                     <div className="bg-blue-600/20 p-3 rounded-2xl rounded-br-none text-xs text-blue-200 border border-blue-500/30">
                        Gratulace! Jakou strategii jsi použil?
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
               </div>
            </MotionDiv>

            {/* Feature 3 */}
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 group"
            >
               <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-green-900/50">
                  <ShieldCheck size={28} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Mentoring 1:1</h3>
               <p className="text-gray-400">Přímý přístup k expertům. Vaše otázky nezůstanou bez odpovědi.</p>
            </MotionDiv>

            {/* Feature 4 */}
            <MotionDiv 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               whileHover={{ y: -5 }}
               className="bg-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 group relative"
            >
               <div className="absolute top-4 right-4 bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-500/20">Gamifikace</div>
               <div className="w-14 h-14 bg-yellow-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-yellow-900/50">
                  <Award size={28} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Certifikace</h3>
               <p className="text-gray-400">Oficiální certifikát po dokončení a odměny za dosažené milníky.</p>
            </MotionDiv>
         </div>
       </div>
    </div>
  );
};

export default Features;