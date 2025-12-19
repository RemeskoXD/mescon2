import React from 'react';
import { Briefcase, Megaphone, Layout, Code, DollarSign, Trophy, Palette, Video, Users, BarChart, Lightbulb, Target, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Course } from '../types';

// Fix: Cast motion components to any to resolve type errors with framer-motion props
const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

interface CoursesComponentProps {
    courses?: Course[];
}

const Courses: React.FC<CoursesComponentProps> = ({ courses = [] }) => {
  
  // Fallback icon logic if course doesn't specify one
  const getIcon = (title: string) => {
      const lower = title.toLowerCase();
      if (lower.includes('sale')) return <Briefcase size={24} />;
      if (lower.includes('social') || lower.includes('media')) return <Megaphone size={24} />;
      if (lower.includes('agency')) return <Layout size={24} />;
      if (lower.includes('web') || lower.includes('code')) return <Code size={24} />;
      if (lower.includes('finance') || lower.includes('invest')) return <DollarSign size={24} />;
      if (lower.includes('leader') || lower.includes('mindset')) return <Trophy size={24} />;
      if (lower.includes('design')) return <Palette size={24} />;
      if (lower.includes('content') || lower.includes('video')) return <Video size={24} />;
      if (lower.includes('network')) return <Users size={24} />;
      if (lower.includes('analy') || lower.includes('data')) return <BarChart size={24} />;
      if (lower.includes('ai') || lower.includes('inno')) return <Lightbulb size={24} />;
      return <BookOpen size={24} />;
  };

  const getColor = (index: number) => {
      const colors = ['blue', 'purple', 'pink', 'cyan', 'green', 'yellow', 'violet', 'red', 'indigo', 'orange', 'teal', 'emerald'];
      return colors[index % colors.length];
  };

  const displayCourses = courses.length > 0 ? courses.filter(c => c.published) : [
      { title: 'Sales Master', description: 'Psychologie prodeje a uzavírání high-ticket klientů.' },
      { title: 'Social Master', description: 'Dominance na sociálních sítích a osobní brand.' },
      { title: 'Agency Impact', description: 'Blueprint pro škálování agentury na 6 cifer.' },
      { title: 'Website Master', description: 'No-code vývoj webů, které prodávají.' }
  ];

  return (
    <div className="bg-[#020617] py-32 relative" id="programs">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <MotionH2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight"
          >
            Mistrovské <span className="text-blue-500">Programy</span>
          </MotionH2>
          <p className="mt-4 text-gray-400">Kompletní ekosystém dovedností pro 21. století.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCourses.map((program, index) => {
            const color = getColor(index);
            return (
                <MotionDiv 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-[#0f172a] rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300"
                >
                <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none`}></div>
                
                <div className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-${color}-400 group-hover:bg-${color}-500 group-hover:text-white transition-colors duration-300 mb-6 shadow-lg`}>
                    {getIcon(program.title)}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{program.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                    {program.description}
                </p>
                
                <div className="mt-6 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full w-0 group-hover:w-full bg-${color}-500 transition-all duration-700 ease-out`}></div>
                </div>
                </MotionDiv>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;