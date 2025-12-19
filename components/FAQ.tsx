import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionDiv = motion.div as any;

const faqs = [
  {
    question: "Co všechno získám při zakoupení přístupu?",
    answer: "Získáte kompletní přístup ke všem video kurzům (Sales, Marketing, Mindset), přístup do uzavřené komunity, pravidelné livestreamy s mentory a možnost získat certifikace."
  },
  {
    question: "Jaké strategie se u vás naučím?",
    answer: "Zaměřujeme se na moderní online byznys modely: SMMA (Social Media Marketing Agency), High-Ticket Sales, budování osobní značky a e-commerce strategie. Vše je postaveno na praxi, ne na teorii."
  },
  {
    question: "V čem jste jiný než ostatní kurzy?",
    answer: "Nejsme jen kurz, jsme ekosystém. Kromě informací vám dáváme komunitu, gamifikovaný systém progrese (levely, XP), nástroje a přímou podporu od lidí, kteří tyto byznysy reálně vedou."
  },
  {
    question: "Jak funguje 14denní garance vrácení peněz?",
    answer: "Pokud zjistíte, že akademie není pro vás, stačí nám napsat do 14 dnů od nákupu na podporu a my vám bez otázek vrátíme celou částku."
  },
  {
    question: "Když si od vás koupím MasterClass teď, budu mít přístup i k nadcházejícím aktualizacím?",
    answer: "Ano! V rámci aktivního členství máte vždy přístup k nejnovějším verzím kurzů a všem nově přidaným materiálům."
  },
  {
      question: "Jak mám zjistit, zda je trading pro mě?",
      answer: "V akademii se primárně zaměřujeme na marketing a sales, nikoliv na trading. Nicméně principy money-managementu a psychologie, které učíme, jsou aplikovatelné i v investování."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-32 bg-[#020617] border-t border-gray-900" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white mb-4 uppercase">Často Kladené <span className="text-blue-500">Otázky</span></h2>
          <p className="text-gray-400">Vše, co potřebujete vědět před vstupem.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <MotionDiv 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`bg-[#0B0F19] border ${openIndex === index ? 'border-blue-500/30' : 'border-gray-800'} rounded-lg overflow-hidden transition-all duration-300`}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-900/50 transition"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-bold text-sm md:text-base ${openIndex === index ? 'text-white' : 'text-gray-300'}`}>
                  {faq.question}
                </span>
                <span className={`ml-4 ${openIndex === index ? 'text-blue-500' : 'text-gray-500'}`}>
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 mt-2">
                      {faq.answer}
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper components for icons not imported directly in the snippet above
const ChevronDown = ({size}: {size:number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
const ChevronUp = ({size}: {size:number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
);

export default FAQ;