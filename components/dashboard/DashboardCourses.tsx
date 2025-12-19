import React, { useState, useEffect } from 'react';
import { Search, Lock, Clock, Gem, ArrowRight, PlayCircle, FileText, CheckCircle, Brain, RefreshCw, Save, StickyNote, Menu, X, ChevronRight, Paperclip, Download, ExternalLink, ClipboardList, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, User } from '../../types';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardCoursesProps {
    courses: Course[];
    user: User;
    onStart: (courseId: string, lessonId: string) => void;
    notify: any;
    onUpdateProfile?: (u: User) => void; // Added for saving notes
}

const DashboardCourses: React.FC<DashboardCoursesProps> = ({ courses, user, onStart, notify, onUpdateProfile }) => {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [search, setSearch] = useState('');
    
    // --- COURSE PLAYER STATE ---
    const [currentModuleId, setCurrentModuleId] = useState<string>('');
    const [currentLessonId, setCurrentLessonId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'content' | 'notes'>('content');
    const [noteContent, setNoteContent] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Nav State
    
    // Quiz State within Course
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);

    // Assignment State
    const [assignmentText, setAssignmentText] = useState('');

    // Sync note content when lesson changes
    useEffect(() => {
        if (currentLessonId && user.lessonNotes) {
            setNoteContent(user.lessonNotes[currentLessonId] || '');
        } else {
            setNoteContent('');
        }
        setActiveTab('content'); // Reset to content tab on lesson change
        setIsMobileMenuOpen(false); // Close mobile menu on lesson change
        
        // Reset Assignment Input if lesson changes
        setAssignmentText('');
        
        // Reset quiz state
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizPassed(false);

    }, [currentLessonId, user.lessonNotes]);

    const handleSaveNote = () => {
        if (!onUpdateProfile) return;
        const updatedNotes = { ...user.lessonNotes, [currentLessonId]: noteContent };
        onUpdateProfile({ ...user, lessonNotes: updatedNotes });
        notify('success', 'Uloženo', 'Poznámka byla uložena.');
    };

    // Helper to check access
    const hasAccess = (course: Course) => {
        if (!user || !user.role) return false;
        if (user.role === 'admin') return true;
        if (course.level === 'student') return true;
        if (course.level === 'premium' && (user.role === 'premium' || user.role === 'vip')) return true;
        if (course.level === 'vip' && user.role === 'vip') return true;
        return false;
    };

    const getProgress = (courseId: string) => user.courseProgress?.find(p => p.courseId === courseId);

    const filteredCourses = courses.filter(c => 
        c.published && (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
    );

    const handleOpenCourse = (course: Course) => {
        if (!hasAccess(course)) {
            notify('error', 'Zamčeno', `Tento kurz vyžaduje úroveň ${course.level.toUpperCase()}.`);
            return;
        }
        
        setSelectedCourse(course);
        const progress = getProgress(course.id);
        
        // Find first lesson or last played
        if (progress?.lastPlayedLessonId) {
            setCurrentLessonId(progress.lastPlayedLessonId);
            const mod = course.modules.find(m => m.lessons.some(l => l.id === progress.lastPlayedLessonId));
            if (mod) setCurrentModuleId(mod.id);
        } else if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
            setCurrentModuleId(course.modules[0].id);
            setCurrentLessonId(course.modules[0].lessons[0].id);
        }
    };

    const handleLessonChange = (moduleId: string, lessonId: string) => {
        setCurrentModuleId(moduleId);
        setCurrentLessonId(lessonId);
    };

    const submitLessonQuiz = (lesson: any) => {
        if (!lesson.questions) return;
        let correct = 0;
        lesson.questions.forEach((q: any) => {
            if (quizAnswers[q.id] === q.correctOptionIndex) correct++;
        });
        const score = (correct / lesson.questions.length) * 100;
        const passed = score >= 70; // 70% pass rate for course quizzes
        
        setQuizSubmitted(true);
        setQuizPassed(passed);
        
        if (passed) {
            onStart(selectedCourse!.id, lesson.id);
            notify('success', 'Kvíz splněn', `Skóre: ${Math.round(score)}%. Lekce dokončena.`);
        } else {
            notify('error', 'Kvíz nesplněn', `Skóre: ${Math.round(score)}%. Zkuste to znovu.`);
        }
    };

    const submitAssignment = (lessonId: string) => {
        if (!assignmentText.trim()) return notify('error', 'Chyba', 'Vyplňte odpověď.');
        // In a real app, save to DB. Here we simulate success and mark lesson complete.
        // We could also use onUpdateProfile to save assignment submission if added to user type.
        onStart(selectedCourse!.id, lessonId);
        notify('success', 'Odesláno', 'Úkol byl úspěšně odevzdán.');
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* If NO course selected -> Catalog */}
            {!selectedCourse && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Katalog Kurzů</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                            <input 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Hledat kurz..."
                                className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.map(course => {
                            const access = hasAccess(course);
                            const prog = getProgress(course.id);
                            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                            const percent = prog && totalLessons > 0 ? Math.round(((prog.completedLessonIds || []).length / totalLessons) * 100) : 0;

                            return (
                                <div key={course.id} className={`group bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition shadow-lg flex flex-col ${!access ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                    <div className="h-40 bg-gray-900 relative overflow-hidden">
                                        <img src={course.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
                                        <div className="absolute top-2 right-2">
                                            {access ? (
                                                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">ODEMČENO</span>
                                            ) : (
                                                <span className="bg-gray-800 text-gray-400 border border-gray-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><Lock size={10}/> {course.level.toUpperCase()}</span>
                                            )}
                                        </div>
                                        {percent > 0 && (
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                                <div className="h-full bg-blue-500" style={{width: `${percent}%`}}></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">{course.title}</h3>
                                        <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">{course.description}</p>
                                        
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-4 border-t border-gray-800">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {course.totalDuration} min</span>
                                            <span className="flex items-center gap-1 text-yellow-500"><Gem size={12}/> +{course.xpReward} XP</span>
                                        </div>

                                        <button 
                                            onClick={() => handleOpenCourse(course)}
                                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${access ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {access ? (percent > 0 ? (percent === 100 ? 'Opakovat Kurz' : 'Pokračovat') : 'Začít Kurz') : 'Zamčeno'}
                                            {access && <ArrowRight size={16}/>}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* PLAYER VIEW */}
            <AnimatePresence>
                {selectedCourse && (
                    <MotionDiv initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-[#020617] flex flex-col">
                        {/* Header */}
                        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0B0F19] relative z-20">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition"><ArrowRight className="rotate-180"/></button>
                                <div>
                                    <h3 className="font-bold text-white text-sm md:text-base hidden md:block">{selectedCourse.title}</h3>
                                    <h3 className="font-bold text-white text-sm md:hidden truncate max-w-[150px]">{selectedCourse.title}</h3>
                                    {currentLessonId && <p className="text-xs text-blue-400 truncate max-w-[200px]">
                                        {selectedCourse.modules.find(m => m.id === currentModuleId)?.lessons.find(l => l.id === currentLessonId)?.title}
                                    </p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Progress</p>
                                    <p className="text-sm font-bold text-white">
                                        {(getProgress(selectedCourse.id)?.completedLessonIds || []).length} / {selectedCourse.modules.reduce((acc,m)=>acc+m.lessons.length,0)}
                                    </p>
                                </div>
                                {/* Mobile Menu Toggle */}
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 bg-gray-800 rounded-lg text-white"
                                >
                                    {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden relative">
                            {/* Sidebar Modules (Desktop: always visible, Mobile: conditional) */}
                            <div className={`
                                fixed inset-y-0 right-0 w-80 bg-[#0B0F19] border-l border-gray-800 z-30 transform transition-transform duration-300 md:relative md:inset-auto md:w-80 md:border-l-0 md:border-r md:transform-none md:flex flex-col flex-shrink-0
                                ${isMobileMenuOpen ? 'translate-x-0 pt-16' : 'translate-x-full md:translate-x-0'}
                            `}>
                                <div className="h-full overflow-y-auto custom-scrollbar flex flex-col">
                                    {selectedCourse.modules.map((mod, i) => (
                                        <div key={mod.id} className="border-b border-gray-800/50">
                                            <div className="p-4 bg-gray-900/50 font-bold text-xs text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                                                Sekce {i + 1}: {mod.title}
                                            </div>
                                            <div>
                                                {mod.lessons.map((lesson, j) => {
                                                    const isCompleted = (getProgress(selectedCourse.id)?.completedLessonIds || []).includes(lesson.id);
                                                    const isActive = currentLessonId === lesson.id;
                                                    return (
                                                        <button 
                                                            key={lesson.id}
                                                            onClick={() => handleLessonChange(mod.id, lesson.id)}
                                                            className={`w-full text-left p-4 text-sm flex items-start gap-3 transition ${isActive ? 'bg-blue-900/20 border-r-2 border-blue-500' : 'hover:bg-gray-900'}`}
                                                        >
                                                            <div className={`mt-0.5 ${isCompleted ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-gray-600'}`}>
                                                                {isCompleted ? <CheckCircle size={16}/> : (lesson.type === 'video' ? <PlayCircle size={16}/> : lesson.type === 'quiz' ? <Brain size={16}/> : lesson.type === 'assignment' ? <ClipboardList size={16}/> : <FileText size={16}/>)}
                                                            </div>
                                                            <span className={isActive ? 'text-white font-medium' : 'text-gray-400'}>{lesson.title}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Sidebar Overlay */}
                            {isMobileMenuOpen && (
                                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
                            )}

                            {/* Main Content */}
                            <div className="flex-1 bg-black flex flex-col overflow-y-auto custom-scrollbar w-full">
                                {currentLessonId ? (() => {
                                    const lesson = selectedCourse.modules.find(m => m.id === currentModuleId)?.lessons.find(l => l.id === currentLessonId);
                                    if (!lesson) return null;
                                    const isCompleted = (getProgress(selectedCourse.id)?.completedLessonIds || []).includes(lesson.id);

                                    return (
                                        <div className="max-w-4xl mx-auto w-full p-4 md:p-12 space-y-6 md:space-y-8 pb-20">
                                            
                                            {/* Video Player */}
                                            {lesson.type === 'video' && (
                                                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                                                    <iframe src={lesson.content} className="w-full h-full" allowFullScreen frameBorder="0" />
                                                </div>
                                            )}

                                            {/* TABS: Content vs Notes */}
                                            <div className="flex border-b border-gray-800">
                                                <button 
                                                    onClick={() => setActiveTab('content')} 
                                                    className={`px-6 py-3 font-bold text-sm transition border-b-2 ${activeTab === 'content' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    Obsah Lekce
                                                </button>
                                                <button 
                                                    onClick={() => setActiveTab('notes')} 
                                                    className={`px-6 py-3 font-bold text-sm transition border-b-2 flex items-center gap-2 ${activeTab === 'notes' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    <StickyNote size={14}/> Moje Poznámky
                                                </button>
                                            </div>

                                            {/* Content Tab */}
                                            {activeTab === 'content' && (
                                                <>
                                                    {/* --- ATTACHMENTS --- */}
                                                    {lesson.attachments && lesson.attachments.length > 0 && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {lesson.attachments.map((att, idx) => (
                                                                <a 
                                                                    key={idx}
                                                                    href={att.url} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/50 transition group"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400 group-hover:text-white transition"><Paperclip size={18}/></div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-white">{att.name}</p>
                                                                            <p className="text-[10px] text-gray-500">Příloha ke stažení</p>
                                                                        </div>
                                                                    </div>
                                                                    <Download size={16} className="text-gray-600 group-hover:text-white transition"/>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* --- QUIZ --- */}
                                                    {lesson.type === 'quiz' && lesson.questions && (
                                                        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 md:p-8">
                                                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                                                                <Brain className="text-purple-500" size={24}/>
                                                                <h3 className="text-xl font-bold text-white">Ověření Znalostí</h3>
                                                            </div>
                                                            
                                                            {quizSubmitted && quizPassed ? (
                                                                <div className="text-center py-8">
                                                                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
                                                                    <h4 className="text-2xl font-bold text-white mb-2">Skvělá práce!</h4>
                                                                    <p className="text-gray-400">Kvíz jste úspěšně splnili.</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-6">
                                                                    {lesson.questions.map((q: any, idx: number) => (
                                                                        <div key={q.id}>
                                                                            <p className="font-bold text-white mb-3">{idx + 1}. {q.question}</p>
                                                                            <div className="space-y-2">
                                                                                {q.options.map((opt: string, optIdx: number) => (
                                                                                    <label key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${quizAnswers[q.id] === optIdx ? 'bg-purple-900/20 border-purple-500' : 'bg-black border-gray-800 hover:border-gray-600'}`}>
                                                                                        <input 
                                                                                            type="radio" 
                                                                                            name={q.id} 
                                                                                            checked={quizAnswers[q.id] === optIdx} 
                                                                                            onChange={() => setQuizAnswers({...quizAnswers, [q.id]: optIdx})}
                                                                                            className="accent-purple-500 w-4 h-4"
                                                                                            disabled={quizSubmitted && quizPassed}
                                                                                        />
                                                                                        <span className="text-sm text-gray-300">{opt}</span>
                                                                                    </label>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    
                                                                    <div className="pt-4 border-t border-gray-800 flex justify-end">
                                                                        {quizSubmitted && !quizPassed && (
                                                                            <div className="flex items-center gap-2 text-red-400 mr-4 text-sm font-bold">
                                                                                <RefreshCw size={14}/> Zkuste to znovu
                                                                            </div>
                                                                        )}
                                                                        <button 
                                                                            onClick={() => submitLessonQuiz(lesson)}
                                                                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                                                                        >
                                                                            Vyhodnotit Kvíz
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* --- ASSIGNMENT --- */}
                                                    {lesson.type === 'assignment' && (
                                                        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 md:p-8">
                                                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                                                                <ClipboardList className="text-orange-500" size={24}/>
                                                                <h3 className="text-xl font-bold text-white">Praktický Úkol</h3>
                                                            </div>
                                                            
                                                            <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800 mb-6">
                                                                <h4 className="text-sm font-bold text-gray-300 mb-2 uppercase">Zadání:</h4>
                                                                <p className="text-white whitespace-pre-wrap leading-relaxed">{lesson.content}</p>
                                                            </div>

                                                            {isCompleted ? (
                                                                <div className="text-center py-6 bg-green-900/10 border border-green-500/30 rounded-xl">
                                                                    <CheckCircle size={48} className="text-green-500 mx-auto mb-2"/>
                                                                    <p className="text-green-400 font-bold">Úkol odevzdán</p>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <label className="label">Vaše odpověď / Odkaz na vypracování</label>
                                                                    <textarea 
                                                                        value={assignmentText}
                                                                        onChange={e => setAssignmentText(e.target.value)}
                                                                        className="input h-32 resize-none mb-4"
                                                                        placeholder="Zde vložte text nebo odkaz..."
                                                                    />
                                                                    <div className="flex justify-end">
                                                                        <button 
                                                                            onClick={() => submitAssignment(lesson.id)}
                                                                            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition flex items-center gap-2"
                                                                        >
                                                                            <Send size={16}/> Odevzdat Úkol
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* --- TEXT / VIDEO CONTENT --- */}
                                                    {lesson.type !== 'quiz' && lesson.type !== 'assignment' && (
                                                        <div className="prose prose-invert max-w-none">
                                                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{lesson.title}</h1>
                                                            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                                {lesson.type === 'text' ? lesson.content : lesson.type === 'video' ? 'Sledujte video pozorně a dělejte si poznámky.' : null}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {/* Notes Tab */}
                                            {activeTab === 'notes' && (
                                                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                                                    <label className="text-sm text-gray-400 block mb-2">Vaše soukromé poznámky k této lekci:</label>
                                                    <textarea 
                                                        value={noteContent}
                                                        onChange={e => setNoteContent(e.target.value)}
                                                        className="w-full h-64 bg-black border border-gray-700 rounded-xl p-4 text-white resize-none focus:border-blue-500 outline-none"
                                                        placeholder="Začněte psát..."
                                                    />
                                                    <div className="flex justify-end mt-4">
                                                        <button onClick={handleSaveNote} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold text-sm flex items-center gap-2">
                                                            <Save size={16}/> Uložit Poznámky
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Button */}
                                            {activeTab === 'content' && (
                                                <div className="flex justify-end pt-8 border-t border-gray-800">
                                                    {/* Assignment/Quiz completion handled by their specific buttons above */}
                                                    {lesson.type !== 'quiz' && lesson.type !== 'assignment' && (
                                                        <button 
                                                            onClick={() => {
                                                                onStart(selectedCourse.id, lesson.id);
                                                            }}
                                                            className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition ${isCompleted ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                                        >
                                                            {isCompleted ? 'Dokončeno' : 'Dokončit Lekci'}
                                                            <CheckCircle size={18}/>
                                                        </button>
                                                    )}
                                                    
                                                    {/* State Display for interactive types */}
                                                    {(lesson.type === 'quiz' || lesson.type === 'assignment') && isCompleted && (
                                                        <button disabled className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 cursor-default">
                                                            Splněno <CheckCircle size={18}/>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })() : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">Vyberte lekci.</div>
                                )}
                            </div>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardCourses;