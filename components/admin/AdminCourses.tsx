import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Layers, FileText, Video, Brain, CheckCircle, Clock, MoreVertical, PlayCircle, Eye, AlertCircle, Users, BarChart, Paperclip, ClipboardList, Link as LinkIcon, Download } from 'lucide-react';
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
  };

  const deleteModule = (moduleId: string) => {
      if (!currentCourse) return;
      if (!window.confirm('Smazat modul a všechny jeho lekce?')) return;
      setCurrentCourse({ ...currentCourse, modules: currentCourse.modules.filter(m => m.id !== moduleId) });
      if (activeModuleId === moduleId) setActiveModuleId(null);
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
                <h2 className="text-2xl font-bold text-white">Správa Kurzů</h2>
                <p className="text-gray-400 text-sm">Vytvářejte a spravujte vzdělávací obsah.</p>
            </div>
            <button onClick={handleCreateCourse} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center gap-2 transition shadow-lg shadow-blue-900/20">
                <Plus size={18}/> Nový Kurz
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => {
                const stats = getCourseStats(course.id);
                return (
                    <div key={course.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition shadow-xl">
                        <div className="h-40 bg-gray-900 relative overflow-hidden">
                            <img src={course.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition duration-500"/>
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold uppercase border border-white/10">{course.level}</div>
                            {!course.published && <div className="absolute top-2 left-2 bg-yellow-600/90 px-2 py-1 rounded text-xs font-bold text-white uppercase flex items-center gap-1"><Eye size={12}/> Koncept</div>}
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-white text-lg mb-1 truncate">{course.title}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                <span className="flex items-center gap-1"><Layers size={12}/> {course.modules.length} modulů</span>
                                <span className="flex items-center gap-1"><Clock size={12}/> {course.totalDuration} min</span>
                            </div>
                            
                            {/* --- STATS SECTION START --- */}
                            <div className="grid grid-cols-2 gap-2 mb-4 bg-black/20 p-2 rounded-lg border border-gray-800/50">
                                <div className="text-center p-2 rounded bg-green-900/10 border border-green-900/30">
                                    <div className="text-lg font-bold text-green-500">{stats.completed}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-center gap-1"><CheckCircle size={10}/> Dokončeno</div>
                                </div>
                                <div className="text-center p-2 rounded bg-blue-900/10 border border-blue-900/30">
                                    <div className="text-lg font-bold text-blue-500">{stats.inProgress}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-center gap-1"><BookOpen size={10}/> Studuje</div>
                                </div>
                            </div>
                            {/* --- STATS SECTION END --- */}

                            <div className="flex gap-2">
                                <button onClick={() => handleEditCourse(course)} className="flex-1 py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2">
                                    <Edit size={14}/> Upravit
                                </button>
                                <button onClick={() => handleDeleteCourse(course.id)} className="px-3 py-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition">
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
                <MotionDiv initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[60] bg-[#050000] flex flex-col">
                    <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0F0505] shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsBuilderOpen(false)} className="hover:text-red-500 transition"><X/></button>
                            <div className="overflow-hidden">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                                    {currentCourse.title || 'Nový Kurz'}
                                    <span className={`text-xs px-2 py-0.5 rounded border ${currentCourse.published ? 'bg-green-900 text-green-400 border-green-500/30' : 'bg-yellow-900 text-yellow-400 border-yellow-500/30'}`}>
                                        {currentCourse.published ? 'PUBLIKOVÁNO' : 'KONCEPT'}
                                    </span>
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer mr-4 hidden md:flex">
                                <span className="text-sm text-gray-400">Publikovat</span>
                                <input type="checkbox" checked={currentCourse.published} onChange={e => setCurrentCourse({...currentCourse, published: e.target.checked})} className="accent-blue-500 w-5 h-5"/>
                            </label>
                            <button onClick={handleSaveCourse} className="px-4 md:px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold flex items-center gap-2 shadow-lg shadow-green-900/20">
                                <Save size={18}/> <span className="hidden md:inline">Uložit Kurz</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Sidebar: Course Details & Structure */}
                        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-800 bg-[#0B0F19] flex flex-col overflow-y-auto custom-scrollbar h-[40vh] md:h-full">
                            <div className="p-4 space-y-4 border-b border-gray-800">
                                <div><label className="label">Název Kurzu</label><input value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} className="input"/></div>
                                <div><label className="label">Popis</label><textarea value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} className="input h-20 text-xs"/></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="label">Level</label><select value={currentCourse.level} onChange={e => setCurrentCourse({...currentCourse, level: e.target.value as any})} className="input"><option value="student">Student</option><option value="premium">Premium</option><option value="vip">VIP</option></select></div>
                                    <div><label className="label">Odměna XP</label><input type="number" value={currentCourse.xpReward} onChange={e => setCurrentCourse({...currentCourse, xpReward: parseInt(e.target.value)})} className="input"/></div>
                                </div>
                                <div><label className="label">Obrázek URL</label><input value={currentCourse.image} onChange={e => setCurrentCourse({...currentCourse, image: e.target.value})} className="input text-xs"/></div>
                                
                                {/* Publish Checkbox for Mobile */}
                                <label className="flex items-center gap-2 cursor-pointer md:hidden pt-2">
                                    <input type="checkbox" checked={currentCourse.published} onChange={e => setCurrentCourse({...currentCourse, published: e.target.checked})} className="accent-blue-500 w-5 h-5"/>
                                    <span className="text-sm text-white font-bold">Publikovat kurz</span>
                                </label>
                            </div>

                            <div className="p-2 flex-1 space-y-2">
                                {currentCourse.modules.map((mod, mIdx) => (
                                    <div key={mod.id} className={`border rounded-lg overflow-hidden transition ${activeModuleId === mod.id ? 'border-blue-500 bg-blue-900/10' : 'border-gray-800 bg-gray-900/30'}`}>
                                        <div onClick={() => setActiveModuleId(mod.id)} className="p-3 font-bold text-sm cursor-pointer flex justify-between items-center hover:bg-gray-800">
                                            <span className="truncate flex-1">{mIdx + 1}. {mod.title}</span>
                                            <div className="flex gap-1">
                                                <button onClick={(e) => {e.stopPropagation(); deleteModule(mod.id)}} className="p-1 hover:text-red-500"><Trash2 size={12}/></button>
                                                <button onClick={(e) => {e.stopPropagation(); addLesson(mod.id)}} className="p-1 hover:text-blue-500"><Plus size={12}/></button>
                                            </div>
                                        </div>
                                        {activeModuleId === mod.id && (
                                            <div className="p-2 bg-black/50 space-y-1 border-t border-gray-800">
                                                <input value={mod.title} onChange={e => setCurrentCourse({...currentCourse, modules: currentCourse.modules.map(m => m.id === mod.id ? {...m, title: e.target.value} : m)})} className="input text-xs mb-2 bg-gray-900 border-gray-700"/>
                                                {mod.lessons.map((l, lIdx) => (
                                                    <div key={l.id} onClick={(e) => {e.stopPropagation(); setActiveLessonId(l.id);}} className={`p-2 pl-3 text-xs rounded cursor-pointer flex items-center justify-between group ${activeLessonId === l.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                                                        <div className="flex items-center gap-2 truncate">
                                                            {l.type === 'video' ? <Video size={10}/> : l.type === 'quiz' ? <Brain size={10}/> : l.type === 'assignment' ? <ClipboardList size={10}/> : <FileText size={10}/>}
                                                            <span className="truncate">{lIdx + 1}. {l.title}</span>
                                                        </div>
                                                        <button onClick={(e) => {e.stopPropagation(); deleteLesson(mod.id, l.id)}} className="opacity-0 group-hover:opacity-100 hover:text-red-300"><Trash2 size={10}/></button>
                                                    </div>
                                                ))}
                                                {mod.lessons.length === 0 && <div className="text-[10px] text-gray-600 text-center p-2">Žádné lekce</div>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button onClick={addModule} className="w-full py-3 border border-dashed border-gray-700 text-gray-500 text-xs rounded hover:border-blue-500 hover:text-blue-500 transition">+ Přidat Modul</button>
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 bg-[#050000] p-4 md:p-8 overflow-y-auto h-[60vh] md:h-full">
                            {activeModuleId && activeLessonId ? (
                                (() => {
                                    const module = currentCourse.modules.find(m => m.id === activeModuleId);
                                    const lesson = module?.lessons.find(l => l.id === activeLessonId);
                                    if(!lesson) return <div className="text-gray-500">Lekce nenalezena.</div>;
                                    
                                    return (
                                        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-800 gap-4">
                                                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                                                    {lesson.type === 'video' ? <Video className="text-blue-500"/> : lesson.type === 'quiz' ? <Brain className="text-purple-500"/> : lesson.type === 'assignment' ? <ClipboardList className="text-orange-500"/> : <FileText className="text-green-500"/>}
                                                    Editor Lekce
                                                </h3>
                                                <label className="flex items-center gap-2 cursor-pointer bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
                                                    <input type="checkbox" checked={lesson.isMandatory} onChange={e => updateLesson({isMandatory: e.target.checked})} className="accent-blue-500"/>
                                                    <span className="text-sm font-bold text-gray-400">Povinná lekce</span>
                                                </label>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="label">Název Lekce</label>
                                                    <input value={lesson.title} onChange={e => updateLesson({title: e.target.value})} className="input text-lg font-bold"/>
                                                </div>
                                                <div>
                                                    <label className="label">Délka (min)</label>
                                                    <input type="number" value={lesson.duration} onChange={e => updateLesson({duration: parseInt(e.target.value)})} className="input"/>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="label">Typ Obsahu</label>
                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                    {(['video', 'text', 'quiz', 'assignment'] as const).map(t => (
                                                        <button key={t} onClick={() => updateLesson({type: t})} className={`px-4 md:px-6 py-3 rounded-xl border font-bold flex items-center gap-2 transition whitespace-nowrap ${lesson.type === t ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20' : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800'}`}>
                                                            {t === 'video' ? <Video size={16}/> : t === 'quiz' ? <Brain size={16}/> : t === 'assignment' ? <ClipboardList size={16}/> : <FileText size={16}/>}
                                                            {t.toUpperCase()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* CONTENT EDITOR BASED ON TYPE */}
                                            
                                            {/* VIDEO */}
                                            {lesson.type === 'video' && (
                                                <div className="bg-gray-900/30 p-4 md:p-6 rounded-xl border border-gray-800">
                                                    <label className="label flex items-center gap-2"><PlayCircle size={14}/> Video URL (Embed / YouTube / Vimeo)</label>
                                                    <input value={lesson.content} onChange={e => updateLesson({content: e.target.value})} className="input font-mono text-blue-400" placeholder="https://www.youtube.com/embed/..."/>
                                                    <div className="mt-4 aspect-video bg-black rounded-lg border border-gray-800 flex items-center justify-center text-gray-600">
                                                        {lesson.content ? <iframe src={lesson.content} className="w-full h-full" frameBorder="0"/> : 'Náhled videa'}
                                                    </div>
                                                </div>
                                            )}

                                            {/* TEXT */}
                                            {lesson.type === 'text' && (
                                                <div className="bg-gray-900/30 p-4 md:p-6 rounded-xl border border-gray-800">
                                                    <label className="label">Obsah (Markdown podporován)</label>
                                                    <textarea value={lesson.content} onChange={e => updateLesson({content: e.target.value})} className="input h-96 font-mono text-sm leading-relaxed" placeholder="# Nadpis lekce..."/>
                                                </div>
                                            )}

                                            {/* ASSIGNMENT */}
                                            {lesson.type === 'assignment' && (
                                                <div className="bg-gray-900/30 p-4 md:p-6 rounded-xl border border-gray-800">
                                                    <div className="flex items-center gap-2 mb-4 text-orange-400">
                                                        <ClipboardList size={20}/>
                                                        <h4 className="font-bold">Zadání Úkolu</h4>
                                                    </div>
                                                    <label className="label">Instrukce pro studenta</label>
                                                    <textarea 
                                                        value={lesson.content} 
                                                        onChange={e => updateLesson({content: e.target.value})} 
                                                        className="input h-64 font-mono text-sm leading-relaxed mb-4" 
                                                        placeholder="Popište, co má student udělat (např. 'Nahrajte odkaz na vaše portfolio...')"
                                                    />
                                                    <p className="text-xs text-gray-500">Student bude muset vložit textovou odpověď nebo odkaz, aby lekci splnil.</p>
                                                </div>
                                            )}

                                            {/* QUIZ */}
                                            {lesson.type === 'quiz' && (
                                                <div className="bg-gray-900/30 p-4 md:p-6 rounded-xl border border-gray-800 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <label className="label mb-0">Otázky v kvízu</label>
                                                        <button 
                                                            onClick={() => updateLesson({questions: [...(lesson.questions || []), {id: `q-${Date.now()}`, question: 'Nová otázka', options: ['A', 'B'], correctOptionIndex: 0}]})}
                                                            className="text-xs bg-purple-600 px-3 py-1.5 rounded font-bold hover:bg-purple-500"
                                                        >
                                                            + Přidat Otázku
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {(lesson.questions || []).map((q, qIdx) => (
                                                            <div key={q.id} className="bg-black border border-gray-800 p-4 rounded-xl">
                                                                <div className="flex justify-between mb-2">
                                                                    <span className="text-xs text-purple-400 font-bold">OTÁZKA {qIdx + 1}</span>
                                                                    <button onClick={() => {
                                                                        const newQs = [...(lesson.questions || [])];
                                                                        newQs.splice(qIdx, 1);
                                                                        updateLesson({questions: newQs});
                                                                    }} className="text-red-500 hover:text-red-400"><Trash2 size={14}/></button>
                                                                </div>
                                                                <input 
                                                                    value={q.question} 
                                                                    onChange={e => {
                                                                        const newQs = [...(lesson.questions || [])];
                                                                        newQs[qIdx].question = e.target.value;
                                                                        updateLesson({questions: newQs});
                                                                    }} 
                                                                    className="input mb-3 bg-gray-900 border-gray-700" 
                                                                    placeholder="Znění otázky..."
                                                                />
                                                                <div className="space-y-2">
                                                                    {q.options.map((opt, oIdx) => (
                                                                        <div key={oIdx} className="flex items-center gap-2">
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
                                                                                className="flex-1 input py-1.5 text-sm bg-gray-900 border-gray-700"
                                                                            />
                                                                            <button onClick={() => {
                                                                                 const newQs = [...(lesson.questions || [])];
                                                                                 newQs[qIdx].options.splice(oIdx, 1);
                                                                                 updateLesson({questions: newQs});
                                                                            }} className="text-gray-600 hover:text-red-500"><X size={14}/></button>
                                                                        </div>
                                                                    ))}
                                                                    <button onClick={() => {
                                                                        const newQs = [...(lesson.questions || [])];
                                                                        newQs[qIdx].options.push(`Možnost ${newQs[qIdx].options.length + 1}`);
                                                                        updateLesson({questions: newQs});
                                                                    }} className="text-xs text-blue-400 hover:underline ml-6">+ Přidat možnost</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* ATTACHMENTS SECTION (Shared across all types) */}
                                            <div className="bg-gray-900/30 p-4 md:p-6 rounded-xl border border-gray-800">
                                                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Paperclip size={18}/> Přílohy & Dokumenty</h4>
                                                
                                                <div className="space-y-2 mb-4">
                                                    {(lesson.attachments || []).map((att, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-black border border-gray-700 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <FileText size={16} className="text-blue-400"/>
                                                                <span className="text-sm font-medium">{att.name}</span>
                                                                <span className="text-xs text-gray-500 truncate max-w-[150px]">{att.url}</span>
                                                            </div>
                                                            <button onClick={() => removeAttachment(idx)} className="text-gray-500 hover:text-red-500 transition"><Trash2 size={14}/></button>
                                                        </div>
                                                    ))}
                                                    {(lesson.attachments || []).length === 0 && <p className="text-xs text-gray-500 italic">Žádné přílohy.</p>}
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input value={newAttachmentName} onChange={e => setNewAttachmentName(e.target.value)} placeholder="Název souboru" className="input flex-1 text-sm"/>
                                                    <input value={newAttachmentUrl} onChange={e => setNewAttachmentUrl(e.target.value)} placeholder="URL (Google Drive, Dropbox...)" className="input flex-[2] text-sm"/>
                                                    <button onClick={addAttachment} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm font-bold flex items-center gap-2">
                                                        <Plus size={14}/> Přidat
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <Layers size={48} className="mb-4 opacity-20"/>
                                    <p className="text-center">Vyberte lekci v levém panelu pro editaci.</p>
                                    <p className="text-xs mt-2 text-center">Nebo přidejte novou sekci a lekci.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminCourses;