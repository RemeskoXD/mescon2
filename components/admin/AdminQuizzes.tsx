import React, { useState } from 'react';
import { Brain, Plus, Edit, Trash2, Save, X, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { Quiz, QuizQuestion } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminQuizzesProps {
  quizzes: Quiz[];
  onSaveQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (id: string) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminQuizzes: React.FC<AdminQuizzesProps> = ({ quizzes, onSaveQuiz, onDeleteQuiz, notify }) => {
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleCreateQuiz = () => {
      const newQuiz: Quiz = { 
          id: `q-${Date.now()}`, 
          title: 'Nový Kvíz', 
          description: '', 
          image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800', 
          level: 'student', 
          xpReward: 100, 
          passingScore: 80, 
          questions: [], 
          published: false 
      };
      setEditingQuiz(newQuiz);
  };

  const handleSaveQuiz = () => {
      if (!editingQuiz) return;
      onSaveQuiz(editingQuiz);
      setEditingQuiz(null);
  };

  const handleDeleteQuiz = (id: string) => {
      if(window.confirm('Opravdu smazat tento kvíz?')) {
          onDeleteQuiz(id);
      }
  };

  const addQuestion = () => {
      if (!editingQuiz) return;
      const newQ: QuizQuestion = { id: `qq-${Date.now()}`, question: 'Nová otázka', options: ['Možnost A', 'Možnost B'], correctOptionIndex: 0 };
      setEditingQuiz({...editingQuiz, questions: [...editingQuiz.questions, newQ]});
  };

  const updateQuestion = (idx: number, updates: Partial<QuizQuestion>) => {
      if (!editingQuiz) return;
      const newQuestions = [...editingQuiz.questions];
      newQuestions[idx] = { ...newQuestions[idx], ...updates };
      setEditingQuiz({ ...editingQuiz, questions: newQuestions });
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Správa Kvízů</h2>
                <p className="text-gray-400 text-sm">Testy znalostí a výzvy pro studenty.</p>
            </div>
            <button onClick={handleCreateQuiz} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white flex items-center gap-2 transition shadow-lg shadow-purple-900/20">
                <Plus size={18}/> Nový Kvíz
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quizzes.map(quiz => (
                <div key={quiz.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition shadow-xl flex flex-col">
                    <div className="h-32 bg-gray-900 relative overflow-hidden">
                        <img src={quiz.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500"/>
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold uppercase border border-white/10">{quiz.level}</div>
                        {!quiz.published && <div className="absolute top-2 left-2 bg-yellow-600/90 px-2 py-1 rounded text-xs font-bold text-white uppercase flex items-center gap-1"><Eye size={12}/> Koncept</div>}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-white text-lg mb-2 truncate">{quiz.title}</h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">{quiz.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-4 border-t border-gray-800">
                            <span className="flex items-center gap-1"><Brain size={12}/> {quiz.questions.length} otázek</span>
                            <span className="flex items-center gap-1 text-yellow-500 font-bold">+{quiz.xpReward} XP</span>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setEditingQuiz(quiz)} className="flex-1 py-2 bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2">
                                <Edit size={14}/> Upravit
                            </button>
                            <button onClick={() => handleDeleteQuiz(quiz.id)} className="px-3 py-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition">
                                <Trash2 size={14}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <AnimatePresence>
            {editingQuiz && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0F0505]">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Brain className="text-purple-500"/> Editor Kvízu</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingQuiz(null)} className="px-4 py-2 text-gray-400 hover:text-white">Zrušit</button>
                                <button onClick={handleSaveQuiz} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white shadow-lg shadow-purple-900/20">Uložit Kvíz</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="label">Název Kvízu</label>
                                    <input value={editingQuiz.title} onChange={e => setEditingQuiz({...editingQuiz, title: e.target.value})} className="input text-lg font-bold"/>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="label">Popis</label>
                                    <textarea value={editingQuiz.description} onChange={e => setEditingQuiz({...editingQuiz, description: e.target.value})} className="input h-20"/>
                                </div>
                                <div>
                                    <label className="label">Obrázek URL</label>
                                    <input value={editingQuiz.image} onChange={e => setEditingQuiz({...editingQuiz, image: e.target.value})} className="input"/>
                                </div>
                                <div>
                                    <label className="label">Level Přístupu</label>
                                    <select value={editingQuiz.level} onChange={e => setEditingQuiz({...editingQuiz, level: e.target.value as any})} className="input">
                                        <option value="student">Student</option>
                                        <option value="premium">Premium</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Odměna XP</label>
                                    <input type="number" value={editingQuiz.xpReward} onChange={e => setEditingQuiz({...editingQuiz, xpReward: parseInt(e.target.value)})} className="input"/>
                                </div>
                                <div>
                                    <label className="label">Min. Skóre (%)</label>
                                    <input type="number" value={editingQuiz.passingScore} onChange={e => setEditingQuiz({...editingQuiz, passingScore: parseInt(e.target.value)})} className="input"/>
                                </div>
                                <div className="flex items-center gap-4 pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 hover:border-purple-500 transition">
                                        <input type="checkbox" checked={editingQuiz.published} onChange={e => setEditingQuiz({...editingQuiz, published: e.target.checked})} className="accent-purple-500 w-5 h-5"/>
                                        <span className="font-bold">Publikováno</span>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Otázky ({editingQuiz.questions.length})</h3>
                                    <button onClick={addQuestion} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-bold border border-gray-700 flex items-center gap-2">
                                        <Plus size={16}/> Přidat Otázku
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    {editingQuiz.questions.map((q, qIdx) => (
                                        <div key={q.id} className="bg-gray-900/30 border border-gray-800 p-6 rounded-2xl relative group">
                                            <button 
                                                onClick={() => {
                                                    const newQs = [...editingQuiz.questions];
                                                    newQs.splice(qIdx, 1);
                                                    setEditingQuiz({...editingQuiz, questions: newQs});
                                                }}
                                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                            
                                            <span className="text-xs font-bold text-purple-500 mb-2 block">OTÁZKA {qIdx + 1}</span>
                                            <input 
                                                value={q.question}
                                                onChange={e => updateQuestion(qIdx, {question: e.target.value})}
                                                className="input mb-4 font-bold bg-black"
                                                placeholder="Znění otázky..."
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border transition ${q.correctOptionIndex === oIdx ? 'bg-green-900/20 border-green-500/50' : 'bg-black border-gray-800'}`}>
                                                        <input 
                                                            type="radio" 
                                                            checked={q.correctOptionIndex === oIdx} 
                                                            onChange={() => updateQuestion(qIdx, {correctOptionIndex: oIdx})}
                                                            className="accent-green-500 w-5 h-5"
                                                        />
                                                        <input 
                                                            value={opt}
                                                            onChange={e => {
                                                                const newOpts = [...q.options];
                                                                newOpts[oIdx] = e.target.value;
                                                                updateQuestion(qIdx, {options: newOpts});
                                                            }}
                                                            className="flex-1 bg-transparent border-none outline-none text-sm"
                                                            placeholder={`Možnost ${oIdx + 1}`}
                                                        />
                                                        <button 
                                                            onClick={() => {
                                                                const newOpts = [...q.options];
                                                                newOpts.splice(oIdx, 1);
                                                                updateQuestion(qIdx, {options: newOpts});
                                                            }}
                                                            className="text-gray-600 hover:text-red-500"
                                                        >
                                                            <X size={14}/>
                                                        </button>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => updateQuestion(qIdx, {options: [...q.options, '']})}
                                                    className="p-3 border border-dashed border-gray-700 rounded-xl text-xs text-gray-500 hover:text-white hover:border-gray-500"
                                                >
                                                    + Přidat možnost
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminQuizzes;