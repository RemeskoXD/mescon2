import React, { useState, useEffect, useRef } from 'react';
import { Book, Plus, Search, Trash2, Save, Folder, FileText, Clock, ChevronRight, Highlighter, Type, Palette } from 'lucide-react';
import { User, Course, PersonalNote } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardNotesProps {
    user: User;
    courses: Course[];
    onUpdateProfile: (u: User) => void;
    notify: any;
}

const DashboardNotes: React.FC<DashboardNotesProps> = ({ user, courses, onUpdateProfile, notify }) => {
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editorTitle, setEditorTitle] = useState('');
    const [activeSection, setActiveSection] = useState<'personal' | 'courses'>('personal');
    
    const editorRef = useRef<HTMLDivElement>(null);

    // Load active note into editor
    useEffect(() => {
        if (!activeNoteId) {
            setEditorTitle('');
            if (editorRef.current) editorRef.current.innerHTML = '';
            return;
        }

        if (activeNoteId.startsWith('lesson-')) {
            // It's a lesson note
            const lessonId = activeNoteId.replace('lesson-', '');
            let foundTitle = 'Neznámá lekce';
            let content = user.lessonNotes?.[lessonId] || '';

            // Find title
            courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
                if (l.id === lessonId) foundTitle = l.title;
            })));

            setEditorTitle(foundTitle);
            if (editorRef.current) editorRef.current.innerHTML = content;
        } else {
            // It's a personal note
            const note = user.personalNotes?.find(n => n.id === activeNoteId);
            if (note) {
                setEditorTitle(note.title);
                if (editorRef.current) editorRef.current.innerHTML = note.content;
            }
        }
    }, [activeNoteId, courses, user.lessonNotes, user.personalNotes]);

    // Save Logic
    const handleSave = () => {
        if (!activeNoteId || !editorRef.current) return;
        
        const content = editorRef.current.innerHTML;

        if (activeNoteId.startsWith('lesson-')) {
            const lessonId = activeNoteId.replace('lesson-', '');
            const updatedLessonNotes = { ...user.lessonNotes, [lessonId]: content };
            onUpdateProfile({ ...user, lessonNotes: updatedLessonNotes });
        } else {
            const updatedPersonalNotes = (user.personalNotes || []).map(n => 
                n.id === activeNoteId 
                ? { ...n, title: editorTitle, content: content, updatedAt: new Date().toISOString() } 
                : n
            );
            onUpdateProfile({ ...user, personalNotes: updatedPersonalNotes });
        }
        notify('success', 'Uloženo', 'Poznámka byla uložena.');
    };

    const handleCreateNote = () => {
        const newNote: PersonalNote = {
            id: `note-${Date.now()}`,
            title: 'Nová poznámka',
            content: 'Začněte psát...',
            updatedAt: new Date().toISOString()
        };
        const updatedNotes = [...(user.personalNotes || []), newNote];
        onUpdateProfile({ ...user, personalNotes: updatedNotes });
        setActiveSection('personal');
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (id: string) => {
        if (!window.confirm('Opravdu smazat tuto poznámku?')) return;
        
        if (id.startsWith('lesson-')) {
            // For lesson notes, we just clear the content, effectively "deleting" the note but keeping the structure if user writes again
            const lessonId = id.replace('lesson-', '');
            const updatedLessonNotes = { ...user.lessonNotes };
            delete updatedLessonNotes[lessonId];
            onUpdateProfile({ ...user, lessonNotes: updatedLessonNotes });
        } else {
            const updatedNotes = (user.personalNotes || []).filter(n => n.id !== id);
            onUpdateProfile({ ...user, personalNotes: updatedNotes });
        }
        
        if (activeNoteId === id) setActiveNoteId(null);
        notify('info', 'Smazáno', 'Poznámka odstraněna.');
    };

    const applyCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if(editorRef.current) editorRef.current.focus();
    };

    // Filter Logic
    const filteredPersonal = (user.personalNotes || []).filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Group Lesson Notes by Course
    const courseNotesTree: { courseTitle: string, notes: { id: string, title: string }[] }[] = [];
    courses.forEach(course => {
        const notesInCourse: { id: string, title: string }[] = [];
        course.modules.forEach(mod => {
            mod.lessons.forEach(lesson => {
                if (user.lessonNotes && user.lessonNotes[lesson.id]) {
                    if (lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || user.lessonNotes[lesson.id].toLowerCase().includes(searchTerm.toLowerCase())) {
                        notesInCourse.push({ id: `lesson-${lesson.id}`, title: lesson.title });
                    }
                }
            });
        });
        if (notesInCourse.length > 0) {
            courseNotesTree.push({ courseTitle: course.title, notes: notesInCourse });
        }
    });

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
            {/* SIDEBAR LIST */}
            <div className="w-80 bg-[#0B0F19] border border-gray-800 rounded-2xl flex flex-col overflow-hidden hidden md:flex">
                <div className="p-4 border-b border-gray-800 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-white flex items-center gap-2"><Book size={18}/> Znalosti</h2>
                        <button onClick={handleCreateNote} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"><Plus size={18}/></button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14}/>
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Hledat v poznámkách..."
                            className="w-full bg-black border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex bg-gray-900 rounded-lg p-1">
                        <button onClick={() => setActiveSection('personal')} className={`flex-1 py-1.5 text-xs font-bold rounded transition ${activeSection === 'personal' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}>Osobní</button>
                        <button onClick={() => setActiveSection('courses')} className={`flex-1 py-1.5 text-xs font-bold rounded transition ${activeSection === 'courses' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}>Z Kurzů</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {activeSection === 'personal' && (
                        <>
                            {filteredPersonal.length === 0 && <div className="text-center p-8 text-gray-500 text-xs">Žádné osobní poznámky.</div>}
                            {filteredPersonal.map(note => (
                                <div 
                                    key={note.id}
                                    onClick={() => setActiveNoteId(note.id)}
                                    className={`p-3 rounded-xl cursor-pointer border transition group relative ${activeNoteId === note.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-transparent border-transparent hover:bg-gray-900'}`}
                                >
                                    <h4 className={`font-bold text-sm mb-1 truncate ${activeNoteId === note.id ? 'text-blue-400' : 'text-gray-300'}`}>{note.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                        <Clock size={10}/> {new Date(note.updatedAt).toLocaleDateString()}
                                    </div>
                                    <button 
                                        onClick={(e) => {e.stopPropagation(); handleDeleteNote(note.id)}} 
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            ))}
                        </>
                    )}

                    {activeSection === 'courses' && (
                        <>
                            {courseNotesTree.length === 0 && <div className="text-center p-8 text-gray-500 text-xs">Žádné poznámky z kurzů.</div>}
                            {courseNotesTree.map((group, idx) => (
                                <div key={idx} className="mb-2">
                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <Folder size={12}/> {group.courseTitle}
                                    </div>
                                    <div className="space-y-1 ml-2 border-l border-gray-800 pl-2">
                                        {group.notes.map(note => (
                                            <div 
                                                key={note.id}
                                                onClick={() => setActiveNoteId(note.id)}
                                                className={`p-2 rounded-lg cursor-pointer text-sm transition flex items-center gap-2 ${activeNoteId === note.id ? 'text-blue-400 bg-blue-900/10' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                                            >
                                                <FileText size={12}/> <span className="truncate">{note.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* MAIN EDITOR */}
            <div className="flex-1 bg-[#0B0F19] border border-gray-800 rounded-2xl flex flex-col overflow-hidden relative">
                {activeNoteId ? (
                    <>
                        <div className="h-16 border-b border-gray-800 bg-gray-900/50 px-6 flex items-center justify-between">
                            <input 
                                value={editorTitle}
                                onChange={e => setEditorTitle(e.target.value)}
                                className="bg-transparent border-none text-xl font-bold text-white focus:outline-none w-full placeholder:text-gray-600"
                                placeholder="Název poznámky..."
                                disabled={activeNoteId.startsWith('lesson-')} // Lesson notes inherit title from lesson
                            />
                            <button onClick={handleSave} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-green-900/20">
                                <Save size={16}/> Uložit
                            </button>
                        </div>
                        
                        {/* Toolbar */}
                        <div className="px-4 py-2 border-b border-gray-800 flex gap-2 overflow-x-auto bg-gray-900/30">
                            <button onClick={() => applyCommand('bold')} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Tučně"><span className="font-bold">B</span></button>
                            <button onClick={() => applyCommand('italic')} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Kurzíva"><span className="italic">I</span></button>
                            <button onClick={() => applyCommand('underline')} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Podtržené"><span className="underline">U</span></button>
                            <div className="w-px bg-gray-700 mx-2"></div>
                            <button onClick={() => applyCommand('hiliteColor', 'yellow')} className="p-2 hover:bg-gray-800 rounded text-yellow-500" title="Zvýraznit"><Highlighter size={16}/></button>
                            <button onClick={() => applyCommand('foreColor', '#3b82f6')} className="p-2 hover:bg-gray-800 rounded text-blue-500" title="Modrá"><Palette size={16}/></button>
                            <button onClick={() => applyCommand('foreColor', '#ef4444')} className="p-2 hover:bg-gray-800 rounded text-red-500" title="Červená"><Palette size={16}/></button>
                            <div className="w-px bg-gray-700 mx-2"></div>
                            <button onClick={() => applyCommand('formatBlock', 'H3')} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white text-xs font-bold">H1</button>
                            <button onClick={() => applyCommand('insertUnorderedList')} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white text-xs font-bold">List</button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#050505]">
                            <div 
                                ref={editorRef}
                                className="w-full h-full bg-transparent border-none text-gray-300 focus:outline-none resize-none leading-relaxed text-sm outline-none"
                                contentEditable
                                suppressContentEditableWarning
                                style={{ minHeight: '100%' }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                        <Book size={64} className="mb-4 opacity-20"/>
                        <p>Vyberte poznámku nebo vytvořte novou.</p>
                        <button onClick={handleCreateNote} className="mt-4 text-blue-500 hover:underline text-sm font-bold">Vytvořit novou poznámku</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardNotes;