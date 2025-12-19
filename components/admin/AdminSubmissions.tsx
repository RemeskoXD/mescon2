import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Check, X, ExternalLink, Clock, User, Gift } from 'lucide-react';
import { BonusTask, BonusSubmission, User as UserType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminSubmissionsProps {
  bonusTasks: BonusTask[];
  submissions: BonusSubmission[];
  allUsers: UserType[];
  onUpdateTask: (task: BonusTask) => void;
  onDeleteTask: (id: string) => void;
  onReviewSubmission: (id: string, status: 'approved' | 'rejected') => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminSubmissions: React.FC<AdminSubmissionsProps> = ({ 
    bonusTasks, submissions, allUsers, 
    onUpdateTask, onDeleteTask, onReviewSubmission, notify 
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'reviews'>('reviews');
  const [editingTask, setEditingTask] = useState<BonusTask | null>(null);

  const handleSaveTask = () => {
      if(!editingTask || !editingTask.title) return;
      onUpdateTask(editingTask);
      setEditingTask(null);
  };
  const handleDeleteTask = (id: string) => {
      if(window.confirm('Smazat úkol?')) onDeleteTask(id);
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const getUserName = (uid: string) => {
      const u = allUsers.find(user => user.id === uid);
      return u ? (u.name || u.email) : 'Neznámý uživatel';
  };
  const getTaskTitle = (tid: string) => bonusTasks.find(t => t.id === tid)?.title || 'Neznámý úkol';

  const handleReview = (id: string, status: 'approved' | 'rejected') => {
      onReviewSubmission(id, status);
      notify(status === 'approved' ? 'success' : 'info', status === 'approved' ? 'Schváleno' : 'Zamítnuto', 'Status odevzdání aktualizován.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Úkoly a Review</h2>
                <p className="text-gray-400 text-sm">Zadávejte speciální úkoly a kontrolujte práci studentů.</p>
            </div>
            <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
                <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                    Review {pendingSubmissions.length > 0 && <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[10px]">{pendingSubmissions.length}</span>}
                </button>
                <button onClick={() => setActiveTab('tasks')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'tasks' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Správa Úkolů</button>
            </div>
        </div>

        {activeTab === 'reviews' && (
            <div className="space-y-4">
                {pendingSubmissions.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-[#0B0F19] rounded-2xl border border-gray-800">
                        <CheckSquare size={48} className="mx-auto mb-4 opacity-20"/>
                        <p>Vše hotovo! Žádné čekající úkoly k revizi.</p>
                    </div>
                ) : (
                    pendingSubmissions.map(sub => (
                        <div key={sub.id} className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-blue-500/30 transition shadow-lg">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size={12}/> {new Date(sub.submittedAt).toLocaleString()}
                                    <span className="text-gray-700">|</span>
                                    <User size={12}/> {getUserName(sub.userId)}
                                </div>
                                <h3 className="text-lg font-bold text-white">{getTaskTitle(sub.taskId)}</h3>
                                <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-sm text-gray-300 font-mono break-all">
                                    {sub.content.startsWith('http') ? (
                                        <a href={sub.content} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                            <ExternalLink size={14}/> Otevřít odkaz
                                        </a>
                                    ) : sub.content}
                                </div>
                            </div>
                            <div className="flex flex-row md:flex-col justify-center gap-2">
                                <button onClick={() => handleReview(sub.id, 'approved')} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg flex items-center gap-2 text-sm transition">
                                    <Check size={16}/> Schválit
                                </button>
                                <button onClick={() => handleReview(sub.id, 'rejected')} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-2 text-sm transition">
                                    <X size={16}/> Zamítnout
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {activeTab === 'tasks' && (
            <div>
                <button onClick={() => setEditingTask({id: `t-${Date.now()}`, title: '', description: '', rewardXP: 500, proofType: 'text'})} className="w-full py-3 mb-6 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2">
                    <Plus size={18}/> Vytvořit Nový Úkol
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bonusTasks.map(task => (
                        <div key={task.id} className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 relative group hover:border-gray-700 transition">
                            <button onClick={() => handleDeleteTask(task.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500"><Trash2 size={16}/></button>
                            <h3 className="font-bold text-white mb-2 pr-8">{task.title}</h3>
                            <p className="text-sm text-gray-400 mb-4 h-10 overflow-hidden line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-800">
                                <span className="bg-gray-800 px-2 py-1 rounded text-gray-400 uppercase font-bold">{task.proofType}</span>
                                <span className="text-yellow-500 font-bold flex items-center gap-1"><Gift size={14}/> {task.rewardXP} XP</span>
                            </div>
                            <button onClick={() => setEditingTask(task)} className="w-full mt-4 py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg text-sm font-bold transition">Upravit</button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <AnimatePresence>
            {editingTask && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv className="bg-[#0B0F19] w-full max-w-md rounded-2xl border border-gray-800 p-6 space-y-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-white">Editor Úkolu</h3>
                        <input value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} placeholder="Název úkolu" className="input"/>
                        <textarea value={editingTask.description} onChange={e => setEditingTask({...editingTask, description: e.target.value})} placeholder="Zadání úkolu..." className="input h-24"/>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Typ Důkazu</label>
                                <select value={editingTask.proofType} onChange={e => setEditingTask({...editingTask, proofType: e.target.value as any})} className="input">
                                    <option value="text">Text / Odpověď</option>
                                    <option value="link">Odkaz (URL)</option>
                                    <option value="image">Obrázek (URL)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Odměna XP</label>
                                <input type="number" value={editingTask.rewardXP} onChange={e => setEditingTask({...editingTask, rewardXP: parseInt(e.target.value)})} className="input"/>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={() => setEditingTask(null)} className="btn-secondary">Zrušit</button>
                            <button onClick={handleSaveTask} className="btn-primary bg-blue-600 hover:bg-blue-500">Uložit</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminSubmissions;