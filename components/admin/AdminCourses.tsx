
import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Layers, FileText, Video, Brain, CheckCircle, Clock, MoreVertical, PlayCircle, Eye, AlertCircle, Users, BarChart, Paperclip, ClipboardList, Link as LinkIcon, Download, ChevronRight, Settings } from 'lucide-react';
import { Course, User, CourseModule, Lesson, QuizQuestion, LessonAttachment } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminCoursesProps {
  courses: Course[];
  allUsers: User[];
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminCourses: React.FC<AdminCoursesProps> = ({ courses, allUsers, onSaveCourse, onDeleteCourse, notify }) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  
  // Builder State
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  const getCourseStats = (courseId: string) => {
      let completed = 0;
      let inProgress = 0;
      allUsers.forEach(u => {
          const prog = u.courseProgress?.find(p => p.courseId === courseId);
          if (prog) {
              if (prog.isCompleted) completed++;
              else inProgress++;
          }
      });
      return { completed, inProgress };
  };

  const handleCreateCourse = () => {
      const newCourse: Course = { 
          id: `c-${Date.now()}`, 
          title: 'Nový Kurz', 
          description: '', 
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', 
          level: 'premium', 
          author: 'Mescon Academy', 
          totalDuration: 0, 
          published: false, 
          xpReward: 500,
          learningPoints: [],
          modules: [] 
      };
      setCurrentCourse(newCourse); 
      setIsBuilderOpen(true);
      setActiveModuleId(null);
      setActiveLessonId(null);
  };

  const handleEditCourse = (course: Course) => {
      setCurrentCourse(JSON.parse(JSON.stringify(course))); 
      setIsBuilderOpen(true);
      if (course.modules.length > 0) {
          setActiveModuleId(course.modules[0].id);
          if (course.modules[0].lessons.length > 0) {
              setActiveLessonId(course.modules[0].lessons[0].id);
          }
      }
  };

  const handleDeleteCourse = (id: string) => {
      if(window.confirm('Opravdu smazat tento kurz? Akce je nevratná.')) {
          onDeleteCourse(id);
      }
  };

  const handleSaveCourse = () => {
      if (!currentCourse) return;
      const totalDuration = currentCourse.modules.reduce((acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.duration, 0), 0);
      const courseToSave = { ...currentCourse, totalDuration };
      onSaveCourse(courseToSave);
      setIsBuilderOpen(false); 
      setCurrentCourse(null); 
  };

  const addModule = () => {
      if (!currentCourse) return;
      const newModule: CourseModule = { id: `m-${Date.now()}`, title: 'Nová Sekce', lessons: [] };
      setCurrentCourse({ ...currentCourse, modules: [...currentCourse.modules, newModule] });
      setActiveModuleId(newModule.id);
  };

  const deleteModule = (moduleId: string) => {
      if (!currentCourse) return;
      if (!window.confirm('Smazat modul a všechny jeho lekce?')) return;
      setCurrentCourse({ ...currentCourse, modules: currentCourse.modules.filter(m => m.id !== moduleId) });
      if (activeModuleId === moduleId) {
          setActiveModuleId(null);
          setActiveLessonId(null);
      }
  };

  const addLesson = (moduleId: string) => {
      if (!currentCourse) return;
      const newLesson: Lesson = { id: `l-${Date.now()}`, title: 'Nová Lekce', type: 'video', content: '', duration: 10, isMandatory: true, questions: [], attachments: [] };
      setCurrentCourse({ ...currentCourse, modules: currentCourse.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m) });
      setActiveModuleId(moduleId);
      setActiveLessonId(newLesson.id);
  };

  const updateLesson = (updates: Partial<Lesson>) => {
      if (!currentCourse || !activeModuleId || !activeLessonId) return;
      setCurrentCourse({
          ...currentCourse,
          modules: currentCourse.modules.map(m => m.id === activeModuleId ? {
              ...m,
              lessons: m.lessons.map(l => l.id === activeLessonId ? { ...l, ...updates } : l)
          } : m)
      });
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
      if (!currentCourse) return;
      if (!window.confirm('Smazat lekci?')) return;
      setCurrentCourse({
          ...currentCourse,
          modules: currentCourse.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m)
      });
      if (activeLessonId === lessonId) setActiveLessonId(null);
  };

  const addAttachment = () => {
      if (!newAttachmentName || !newAttachmentUrl || !currentCourse || !activeModuleId || !activeLessonId) return;
      const module = currentCourse.modules.find(m => m.id === activeModuleId);
      const lesson = module?.lessons.find(l => l.id === activeLessonId);
      if (!lesson) return;

      const newAtt: LessonAttachment = { name: newAttachmentName, url: newAttachmentUrl, type: 'file' };
      updateLesson({ attachments: [...(lesson.attachments || []), newAtt] });
      setNewAttachmentName('');
      setNewAttachmentUrl('');
  };

  const removeAttachment = (idx: number) => {
      if (!currentCourse || !activeModuleId || !activeLessonId) return;
      const module = currentCourse.modules.find(m => m.id === activeModuleId);
      const lesson = module?.lessons.find(l => l.id === activeLessonId);
      if (!lesson || !lesson.attachments) return;

      const newAtts = [...lesson.attachments];
      newAtts.splice(idx, 1);
      updateLesson({ attachments: newAtts });
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Správa <span className="text-blue-500">Kurzů</span></h2>
                <p className="text-gray-400 text-sm">Vytvářejte vzdělávací impérium.</p>
            </div>
            <button onClick={handleCreateCourse} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-white flex items-center gap-2 transition shadow-lg shadow-blue-900/40">
                <Plus size={20}/> NOVÝ KURZ
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => {
                const stats = getCourseStats(course.id);
                return (
                    <div key={course.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition shadow-xl flex flex-col">
                        <div className="h-40 bg-gray-900 relative overflow-hidden">
                            <img src={course.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-500"/>
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black uppercase border border-white/10 text-white tracking-widest">{course.level}</div>
                            {!course.published && <div className="absolute top-2 left-2 bg-yellow-600/90 px-2 py-1 rounded text-[10px] font-black text-white uppercase flex items-center gap-1"><Eye size={12}/> Koncept</div>}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-lg mb-1 truncate">{course.title}</h3>
                            <div className="flex items-center gap-4 text-[10px] uppercase font-black text-gray-500 mb-4">
                                <span className="flex items-center gap-1"><Layers size={12}/> {course.modules.length} moduly</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {course.totalDuration} min</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-4 bg-black/20 p-2 rounded-xl border border-gray-800/50">
                                <div className="text-center p-2 rounded bg-green-900/10 border border-green-900/30">
                                    <div className="text-lg font-bold text-green-500">{stats.completed}</div>
                                    <div className="text-[9px] text-gray-500 uppercase font-black">Hotovo</div>
                                </div>
                                <div className="text-center p-2 rounded bg-blue-900/10 border border-blue-900/30">
                                    <div className="text-lg font-bold text-blue-500">{stats.inProgress}</div>
                                    <div className="text-[9px] text-gray-500 uppercase font-black">Studuje</div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => handleEditCourse(course)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-xs transition flex items-center justify-center gap-2">
                                    <Edit size={14}/> EDITOVAT
                                </button>
                                <button onClick={() => handleDeleteCourse(course.id)} className="px-3 py-2 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition border border-gray-700">
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        <AnimatePresence>
            {isBuilderOpen && currentCourse && (
                <MotionDiv 
                    initial={{ opacity: 0, scale: 1.1 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 1.1 }} 
                    className="fixed inset-0 z-[200] bg-[#020617] flex flex-col"
                >
                    {/* STUDIO HEADER */}
                    <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0B0F19] shrink-0 z-[210] shadow-2xl">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => {
                                    if(window.confirm('Opravdu zavřít bez uložení?')) {
                                        setIsBuilderOpen(false);
                                        setCurrentCourse(null);
                                    }
                                }} 
                                className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg text-gray-400 hover:text-white transition"
                            >
                                <X size={20}/>
                            </button>
                            <div className="h-8 w-px bg-gray-800 hidden md:block"></div>
                            <div className="overflow-hidden">
                                <h2 className="text-lg font-black text-white flex items-center gap-3 truncate uppercase tracking-tighter">
                                    <span className="text-blue-500">LMS STUDIO</span> 
                                    <span className="text-gray-600">/</span>
                                    {currentCourse.title || 'Nový Kurz'}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black tracking-widest ${currentCourse.published ? 'bg-green-900 text-green-400 border-green-500/30' : 'bg-yellow-900 text-yellow-400 border-yellow-500/30'}`}>
                                        {currentCourse.published ? 'PUBLIKOVÁNO' : 'KONCEPT'}
                                    </span>
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-3 cursor-pointer bg-black/40 px-4 py-2 rounded-xl border border-gray-800 hidden md:flex">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Viditelnost</span>
                                <input type="checkbox" checked={currentCourse.published} onChange={e => setCurrentCourse({...currentCourse, published: e.target.checked})} className="accent-blue-500 w-5 h-5"/>
                                <span className="text-xs font-bold text-white">{currentCourse.published ? 'Veřejný' : 'Skrytý'}</span>
                            </label>
                            <button onClick={handleSaveCourse} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-green-900/30 transition-transform active:scale-95">
                                <Save size={18}/> ULOŽIT KURZ
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#020617]">
                        {/* LEFT SIDEBAR: COURSE CONTENT TREE */}
                        <div className="w-full md:w-80 bg-[#0B0F19] border-r border-gray-800 flex flex-col overflow-y-auto custom-scrollbar h-[35vh] md:h-full shrink-0">
                            {/* Course Global Settings Trigger */}
                            <div className="p-4 border-b border-gray-800 bg-gray-900/30">
                                <button 
                                    onClick={() => {setActiveModuleId(null); setActiveLessonId(null);}}
                                    className={`w-full p-3 rounded-xl border flex items-center gap-3 transition font-black text-xs uppercase tracking-wider ${!activeModuleId ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-black/50 border-gray-800 text-gray-500 hover:border-gray-600'}`}
                                >
                                    <Settings size={16}/> Nastavení kurzu
                                </button>
                            </div>

                            <div className="p-3 flex-1 space-y-2">
                                {currentCourse.modules.map((mod, mIdx) => (
                                    <div key={mod.id} className={`rounded-xl overflow-hidden transition border ${activeModuleId === mod.id ? 'border-blue-500/50 bg-blue-900/5' : 'border-gray-800/50 bg-black/20'}`}>
                                        <div 
                                            onClick={() => setActiveModuleId(mod.id)} 
                                            className={`p-3 font-bold text-xs uppercase cursor-pointer flex justify-between items-center transition ${activeModuleId === mod.id ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800/30'}`}
                                        >
                                            <span className="truncate flex-1 tracking-tighter">{mIdx + 1}. {mod.title}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={(e) => {e.stopPropagation(); deleteModule(mod.id)}} className="p-1 hover:text-red-500"><Trash2 size={12}/></button>
                                            </div>
                                        </div>
                                        {activeModuleId === mod.id && (
                                            <div className="p-2 pt-0 space-y-1">
                                                {mod.lessons.map((l, lIdx) => (
                                                    <div 
                                                        key={l.id} 
                                                        onClick={(e) => {e.stopPropagation(); setActiveLessonId(l.id);}} 
                                                        className={`p-2.5 pl-4 text-[11px] font-bold rounded-lg cursor-pointer flex items-center justify-between group transition border ${activeLessonId === l.id ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-black/40 border-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                                    >
                                                        <div className="flex items-center gap-3 truncate">
                                                            <div className={`p-1 rounded ${activeLessonId === l.id ? 'bg-white/20' : 'bg-gray-800'}`}>
                                                                {l.type === 'video' ? <Video size={12}/> : l.type === 'quiz' ? <Brain size={12}/> : l.type === 'assignment' ? <ClipboardList size={12}/> : <FileText size={12}/>}
                                                            </div>
                                                            <span className="truncate">{lIdx + 1}. {l.title}</span>
                                                        </div>
                                                        <button onClick={(e) => {e.stopPropagation(); deleteLesson(mod.id, l.id)}} className="opacity-0 group-hover:opacity-100 hover:text-red-300"><Trash2 size={12}/></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addLesson(mod.id)} className="w-full py-2 mt-2 border border-dashed border-gray-700 rounded-lg text-[10px] font-black uppercase text-gray-600 hover:border-blue-500 hover:text-blue-500 transition">+ Nová Lekce</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addModule} className="w-full py-3 border border-dashed border-blue-900/30 bg-blue-900/5 text-blue-500/50 text-[11px] font-black uppercase rounded-xl hover:border-blue-500 hover:text-blue-500 transition">+ Přidat Nový Modul</button>
                            </div>
                        </div>

                        {/* CENTER PANEL: EDITOR WORKSPACE */}
                        <div className="flex-1 overflow-y-auto h-[65vh] md:h-full bg-black/40 relative">
                            {/* Content based on selection */}
                            {!activeModuleId && !activeLessonId ? (
                                /* COURSE GLOBAL SETTINGS */
                                <div className="max-w-3xl mx-auto w-full p-6 md:p-12 space-y-10 animate-fade-in pb-20">
                                    <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
                                        <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/30 shadow-2xl">
                                            <Settings size={32}/>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Základní <span className="text-blue-500">Info</span></h3>
                                            <p className="text-gray-500 text-sm">Zadejte hlavní parametry vašeho kurzu.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="label">Název kurzu</label>
                                                <input value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} className="input text-lg font-bold" placeholder="Např. Sales Masterclass 2024"/>
                                            </div>
                                            <div>
                                                <label className="label">Odměna (XP)</label>
                                                <input type="number" value={currentCourse.xpReward} onChange={e => setCurrentCourse({...currentCourse, xpReward: parseInt(e.target.value)})} className="input text-yellow-500 font-bold"/>
                                                <p className="text-[10px] text-gray-600 mt-1 uppercase font-black">Student získá po 100% dokončení.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="label">Potřebný Level</label>
                                                <select value={currentCourse.level} onChange={e => setCurrentCourse({...currentCourse, level: e.target.value as any})} className="input font-bold">
                                                    <option value="student">Student (Free)</option>
                                                    <option value="premium">Premium</option>
                                                    <option value="vip">VIP</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label">Autor</label>
                                                <input value={currentCourse.author} onChange={e => setCurrentCourse({...currentCourse, author: e.target.value})} className="input" placeholder="Jméno mentora"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="label">Popis kurzu</label>
                                            <textarea value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} className="input h-32 leading-relaxed" placeholder="Stručné shrnutí obsahu..."/>
                                        </div>
                                        <div>
                                            <label className="label">URL Náhledového obrázku</label>
                                            <input value={currentCourse.image} onChange={e => setCurrentCourse({...currentCourse, image: e.target.value})} className="input text-xs font-mono text-blue-400"/>
                                            <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-black">
                                                <img src={currentCourse.image} className="w-full h-full object-cover opacity-50"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeLessonId ? (
                                /* LESSON EDITOR */
                                (() => {
                                    const module = currentCourse.modules.find(m => m.id === activeModuleId);
                                    const lesson = module?.lessons.find(l => l.id === activeLessonId);
                                    if(!lesson) return <div className="text-gray-500 p-12 text-center">Lekce nenalezena.</div>;
                                    
                                    return (
                                        <div className="max-w-4xl mx-auto w-full p-6 md:p-12 space-y-10 animate-fade-in pb-20">
                                            {/* LESSON HEADER */}
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-gray-800 gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-4 rounded-2xl border ${lesson.type === 'video' ? 'bg-blue-900/20 text-blue-500 border-blue-500/30' : 'bg-gray-900/50 text-gray-500 border-gray-800'}`}>
                                                        {lesson.type === 'video' ? <Video size={28}/> : lesson.type === 'quiz' ? <Brain size={28}/> : lesson.type === 'assignment' ? <ClipboardList size={28}/> : <FileText size={28}/>}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Editor <span className="text-blue-500">Lekce</span></h3>
                                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Typ: {lesson.type} • ID: {lesson.id}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800 shadow-xl">
                                                    <button onClick={() => updateLesson({type: 'video'})} className={`p-2.5 rounded-lg transition ${lesson.type === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-800'}`} title="Video"><Video size={16}/></button>
                                                    <button onClick={() => updateLesson({type: 'text'})} className={`p-2.5 rounded-lg transition ${lesson.type === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-800'}`} title="Text"><FileText size={16}/></button>
                                                    <button onClick={() => updateLesson({type: 'quiz'})} className={`p-2.5 rounded-lg transition ${lesson.type === 'quiz' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-800'}`} title="Kvíz"><Brain size={16}/></button>
                                                    <button onClick={() => updateLesson({type: 'assignment'})} className={`p-2.5 rounded-lg transition ${lesson.type === 'assignment' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-800'}`} title="Úkol"><ClipboardList size={16}/></button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="col-span-3">
                                                    <label className="label">Název lekce</label>
                                                    <input value={lesson.title} onChange={e => updateLesson({title: e.target.value})} className="input text-lg font-bold" placeholder="Úvod do problematiky..."/>
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="label">Minutáž</label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14}/>
                                                        <input type="number" value={lesson.duration} onChange={e => updateLesson({duration: parseInt(e.target.value)})} className="input pl-10 font-bold"/>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CONTENT WORKSPACE BY TYPE */}
                                            {lesson.type === 'video' && (
                                                <div className="bg-[#0B0F19] border border-gray-800 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-2xl">
                                                    <div className="flex items-center gap-3 text-blue-400">
                                                        <PlayCircle size={20}/>
                                                        <h4 className="font-black text-sm uppercase tracking-widest">Video Stream</h4>
                                                    </div>
                                                    <input value={lesson.content} onChange={e => updateLesson({content: e.target.value})} className="input font-mono text-blue-400 text-xs bg-black" placeholder="Vložte link: https://www.youtube.com/embed/..."/>
                                                    <div className="aspect-video bg-black rounded-2xl border border-gray-800 flex items-center justify-center text-gray-700 shadow-inner overflow-hidden">
                                                        {lesson.content ? <iframe src={lesson.content} className="w-full h-full" frameBorder="0"/> : <div className="text-center"><Video size={48} className="mx-auto mb-2 opacity-10"/><p className="text-xs uppercase font-black opacity-20">Zde se zobrazí náhled videa</p></div>}
                                                    </div>
                                                </div>
                                            )}

                                            {lesson.type === 'text' && (
                                                <div className="bg-[#0B0F19] border border-gray-800 rounded-[2rem] p-6 md:p-8 space-y-4 shadow-2xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3 text-green-400">
                                                            <FileText size={20}/>
                                                            <h4 className="font-black text-sm uppercase tracking-widest">Studijní text</h4>
                                                        </div>
                                                        <span className="text-[10px] text-gray-600 font-black uppercase">Podporuje Markdown</span>
                                                    </div>
                                                    <textarea value={lesson.content} onChange={e => updateLesson({content: e.target.value})} className="input h-[400px] font-mono text-sm leading-relaxed bg-black border-gray-800 focus:border-green-500" placeholder="# Nadpis kapitoly..."/>
                                                </div>
                                            )}

                                            {lesson.type === 'assignment' && (
                                                <div className="bg-[#0B0F19] border border-gray-800 rounded-[2rem] p-6 md:p-8 space-y-4 shadow-2xl">
                                                    <div className="flex items-center gap-3 text-orange-400 mb-2">
                                                        <ClipboardList size={20}/>
                                                        <h4 className="font-black text-sm uppercase tracking-widest">Zadání praktického úkolu</h4>
                                                    </div>
                                                    <textarea 
                                                        value={lesson.content} 
                                                        onChange={e => updateLesson({content: e.target.value})} 
                                                        className="input h-48 leading-relaxed bg-black border-gray-800 focus:border-orange-500" 
                                                        placeholder="Popište, co přesně má student vypracovat a nahrát jako odpověď..."
                                                    />
                                                </div>
                                            )}

                                            {lesson.type === 'quiz' && (
                                                <div className="bg-[#0B0F19] border border-gray-800 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-2xl">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex items-center gap-3 text-purple-400">
                                                            <Brain size={20}/>
                                                            <h4 className="font-black text-sm uppercase tracking-widest">Kvízové otázky</h4>
                                                        </div>
                                                        <button 
                                                            onClick={() => updateLesson({questions: [...(lesson.questions || []), {id: `q-${Date.now()}`, question: 'Nová otázka', options: ['Ano', 'Ne'], correctOptionIndex: 0}]})}
                                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-[10px] font-black uppercase transition shadow-lg shadow-purple-900/40"
                                                        >
                                                            + Přidat otázku
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {(lesson.questions || []).map((q, qIdx) => (
                                                            <div key={q.id} className="bg-black/50 border border-gray-800 p-5 rounded-2xl">
                                                                <div className="flex justify-between mb-4">
                                                                    <span className="text-[10px] text-gray-500 font-black uppercase">Otázka č. {qIdx + 1}</span>
                                                                    <button onClick={() => {
                                                                        const newQs = [...(lesson.questions || [])];
                                                                        newQs.splice(qIdx, 1);
                                                                        updateLesson({questions: newQs});
                                                                    }} className="text-red-500/50 hover:text-red-500 transition"><Trash2 size={16}/></button>
                                                                </div>
                                                                <input 
                                                                    value={q.question} 
                                                                    onChange={e => {
                                                                        const newQs = [...(lesson.questions || [])];
                                                                        newQs[qIdx].question = e.target.value;
                                                                        updateLesson({questions: newQs});
                                                                    }} 
                                                                    className="input mb-4 bg-black" 
                                                                    placeholder="Znění otázky..."
                                                                />
                                                                <div className="space-y-2">
                                                                    {q.options.map((opt, oIdx) => (
                                                                        <div key={oIdx} className="flex items-center gap-3">
                                                                            <input 
                                                                                type="radio" 
                                                                                name={`correct-${q.id}`} 
                                                                                checked={q.correctOptionIndex === oIdx} 
                                                                                onChange={() => {
                                                                                    const newQs = [...(lesson.questions || [])];
                                                                                    newQs[qIdx].correctOptionIndex = oIdx;
                                                                                    updateLesson({questions: newQs});
                                                                                }}
                                                                                className="accent-green-500 w-4 h-4 shrink-0"
                                                                            />
                                                                            <input 
                                                                                value={opt}
                                                                                onChange={e => {
                                                                                    const newQs = [...(lesson.questions || [])];
                                                                                    newQs[qIdx].options[oIdx] = e.target.value;
                                                                                    updateLesson({questions: newQs});
                                                                                }}
                                                                                className="flex-1 input py-1.5 text-xs bg-black"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <button onClick={() => {
                                                                        const newQs = [...(lesson.questions || [])];
                                                                        newQs[qIdx].options.push(`Další možnost`);
                                                                        updateLesson({questions: newQs});
                                                                    }} className="text-[10px] font-black text-blue-500 uppercase hover:text-blue-400 mt-2">+ Přidat možnost</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* COMMON: ATTACHMENTS */}
                                            <div className="bg-[#0B0F19] border border-gray-800 rounded-[2rem] p-6 md:p-8 space-y-4 shadow-2xl">
                                                <h4 className="font-black text-sm uppercase tracking-widest text-gray-300 flex items-center gap-2"><Paperclip size={18}/> Soubory a přílohy k lekci</h4>
                                                
                                                <div className="space-y-2 mb-6">
                                                    {(lesson.attachments || []).map((att, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-xl">
                                                            <div className="flex items-center gap-3">
                                                                <FileText size={16} className="text-blue-500"/>
                                                                <span className="text-xs font-bold text-gray-300">{att.name}</span>
                                                            </div>
                                                            <button onClick={() => removeAttachment(idx)} className="text-gray-600 hover:text-red-500 transition"><Trash2 size={14}/></button>
                                                        </div>
                                                    ))}
                                                    {(lesson.attachments || []).length === 0 && <p className="text-[10px] text-gray-600 italic uppercase">Žádné nahrané přílohy.</p>}
                                                </div>

                                                <div className="flex flex-col lg:flex-row gap-3">
                                                    <input value={newAttachmentName} onChange={e => setNewAttachmentName(e.target.value)} placeholder="Název (např. Tahák PDF)" className="input text-xs flex-1"/>
                                                    <input value={newAttachmentUrl} onChange={e => setNewAttachmentUrl(e.target.value)} placeholder="URL link (Disk / Dropbox)" className="input text-xs flex-[2]"/>
                                                    <button onClick={addAttachment} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-black uppercase transition border border-gray-700 flex items-center gap-2">
                                                        <Plus size={16}/> PŘIDAT
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-[#020617]">
                                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800 opacity-20">
                                        <Layers size={48}/>
                                    </div>
                                    <p className="font-black uppercase tracking-widest text-sm text-gray-700">Vyberte sekci v levém panelu</p>
                                    <p className="text-[10px] mt-2 text-gray-800 font-bold uppercase tracking-[0.2em]">Mescon Academy LMS Builder v2.1</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDEBAR: MODULE LIST SETTINGS (Optional / Collapsed by default?) */}
                        {activeModuleId && !activeLessonId && (
                            <div className="w-full md:w-80 bg-[#0B0F19] border-l border-gray-800 p-6 flex flex-col animate-fade-in shrink-0 overflow-y-auto">
                                <h3 className="font-black text-sm uppercase tracking-widest text-white mb-6 flex items-center gap-2"><Layers size={18} className="text-blue-500"/> Nastavení sekce</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="label">Název sekce</label>
                                        <input 
                                            value={currentCourse.modules.find(m => m.id === activeModuleId)?.title || ''} 
                                            onChange={e => setCurrentCourse({...currentCourse, modules: currentCourse.modules.map(m => m.id === activeModuleId ? {...m, title: e.target.value} : m)})} 
                                            className="input font-bold"
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-gray-800">
                                        <button 
                                            onClick={() => deleteModule(activeModuleId)}
                                            className="w-full py-3 bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase transition border border-red-900/30 flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16}/> Smazat Celou Sekci
                                        </button>
                                        <p className="text-[9px] text-gray-600 mt-2 italic text-center">Akce smaže i všechny lekce uvnitř.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminCourses;
