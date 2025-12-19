
import React from 'react';
import { Star, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionDiv = motion.div as any;

const experts = [
  {
    name: "Vašek Gabriel",
    role: "Sales & Marketing Expert",
    description: "Specialista na prodejní strategie a digitální marketing s 8+ lety zkušeností. Zakladatel Mescon Academy.",
    image: "https://web2.itnahodinu.cz/image/IMG-20250908-WA0025.jpg",
    tags: ["Sales Funnels", "High-Ticket Sales", "Strategy"]
  },
  {
    name: "Ludvík Remešek",
    role: "Social Media & Brand Expert",
    description: "Guru sociálních sítí a tvorby virálního obsahu. Pomohl klientům získat miliony zhlédnutí organicky.",
    image: "https://web2.itnahodinu.cz/image/IMG-20250920-WA0041.jpg",
    tags: ["Viral Content", "Personal Brand", "Instagram"]
  },
  {
    name: "Vašek Rajchart",
    role: "Mindset & Performance Coach",
    description: "Expert na psychologii výkonu a odstraňování mentálních bloků, které brání v podnikání.",
    image: "https://web2.itnahodinu.cz/image/9.webp",
    tags: ["Mindset", "Produktivita", "Leadership"]
  },
  {
    name: "David Černý",
    role: "E-commerce Specialist",
    description: "Expert na budování ziskových e-shopů a dropshipping strategií s obratem přes 10M+ ročně.",
    image: "https://web2.itnahodinu.cz/image/8.webp",
    tags: ["E-commerce", "Dropshipping", "Shopify"]
  },
  {
    name: "Tomáš Veselý",
    role: "Automation Architect",
    description: "Specialista na AI automatizaci a systémové procesy, které šetří stovky hodin práce měsíčně.",
    image: "https://web2.itnahodinu.cz/image/6.webp",
    tags: ["AI", "Automation", "Systems"]
  },
  {
    name: "Jakub Král",
    role: "Investment Lead",
    description: "Portfolio manažer se zaměřením na kryptoměny a diverzifikaci aktiv pro dlouhodobý růst.",
    image: "https://web2.itnahodinu.cz/image/4.webp",
    tags: ["Crypto", "Investing", "Wealth"]
  },
];

const Team: React.FC = () => {
  return (
    <div className="py-32 bg-[#020617]" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">
            TÝM <span className="text-blue-500">BUSINESS EXPERTŮ</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Naši experti vás provedou světem online podnikání s praktickými zkušenostmi a ověřenými strategiemi.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <MotionDiv 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden h-[500px] cursor-pointer bg-gray-900 border border-gray-800"
            >
              {/* Image with B&W to Color effect */}
              <img 
                src={expert.image} 
                alt={expert.name} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-90 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="mb-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {expert.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-900/50">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{expert.name}</h3>
                <p className="text-blue-400 font-bold text-xs mb-3 uppercase tracking-wider group-hover:text-white transition-colors">{expert.role}</p>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed border-t border-gray-700 pt-3 opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3">
                    {expert.description}
                </p>
                
                <div className="flex gap-2 items-center">
                   <div className="flex">
                     {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-yellow-500 fill-yellow-500" />)}
                   </div>
                   <span className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-2">Mescon Expert</span>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
