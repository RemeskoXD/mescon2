
import React, { useState } from 'react';
import { Zap, CheckCircle, Clock, Gift, Send, Lock, CheckSquare, Loader2, XCircle } from 'lucide-react';
import { Challenge, BonusTask, User, BonusSubmission } from '../../types';

interface DashboardChallengesProps {
    challenges: Challenge[];
    bonusTasks: BonusTask[];
    submissions: BonusSubmission[];
    user: User;
    onChallengeAction: (id: string) => void;
    onSubmitTask: (taskId: string, userId: string, content: string) => void;
    onClaimReward?: (submissionId: string, rewardXP: number) => void;
    notify: any;
}

const DashboardChallenges: React.FC<DashboardChallengesProps> = ({ challenges, bonusTasks, submissions, user, onChallengeAction, onSubmitTask, onClaimReward, notify }) => {
    const [activeTab, setActiveTab] = useState<'system' | 'bonus'>('system');
    const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});

    const handleBonusSubmit = (taskId: string) => {
        const content = taskInputs[taskId];
        if(!content) return notify('error', 'Chyba', 'Vyplňte prosím obsah úkolu.');
        onSubmitTask(taskId, user.id, content);
        setTaskInputs(prev => { const newState = {...prev}; delete newState[taskId]; return newState; });
    };

    const handleClaim = (subId: string, xp: number) => {
        if(onClaimReward) {
            onClaimReward(subId, xp);
            notify('success', 'Odměna', `Získali jste ${xp} XP!`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Výzvy & Úkoly</h2>
                    <p className="text-gray-400 text-sm">Plňte úkoly a získávejte extra XP.</p>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button onClick={() => setActiveTab('system')} className={`px-4 py-2 text-xs font-bold uppercase rounded transition ${activeTab === 'system' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>Denní / Týdenní</button>
                    <button onClick={() => setActiveTab('bonus')} className={`px-4 py-2 text-xs font-bold uppercase rounded transition ${activeTab === 'bonus' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>Bonusové</button>
                </div>
            </div>

            {activeTab === 'system' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map(challenge => {
                        const progress = user.activeChallenges?.find(c => c.challengeId === challenge.id);
                        const current = progress?.currentCount || 0;
                        const isCompleted = progress?.completed;
                        const percent = Math.min(100, (current / challenge.targetCount) * 100);

                        return (
                            <div key={challenge.id} className={`p-6 rounded-2xl border relative overflow-hidden transition group ${isCompleted ? 'bg-green-900/10 border-green-500/30' : 'bg-[#0B0F19] border-gray-800'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                        <Zap size={24} fill={isCompleted ? "currentColor" : "none"}/>
                                    </div>
                                    <span className="text-xs font-bold uppercase bg-gray-900 px-2 py-1 rounded text-gray-500">{challenge.type}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
                                <p className="text-sm text-gray-400 mb-6">{challenge.description}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-500">
                                        <span>Progres</span>
                                        <span>{current} / {challenge.targetCount}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${percent}%`}}></div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <span className="text-yellow-500 font-bold flex items-center gap-1"><Gift size={14}/> +{challenge.rewardXP} XP</span>
                                    {isCompleted ? (
                                        <span className="text-green-500 font-bold text-xs flex items-center gap-1"><CheckCircle size={14}/> Splněno</span>
                                    ) : (
                                        <button onClick={() => onChallengeAction(challenge.id)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold text-white transition border border-gray-700">Započítat +1</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'bonus' && (
                <div className="space-y-4">
                    {bonusTasks.map(task => {
                        const mySubmission = submissions.find(s => s.taskId === task.id && s.userId === user.id);
                        const isPending = mySubmission?.status === 'pending';
                        const isApproved = mySubmission?.status === 'approved';
                        const isRejected = mySubmission?.status === 'rejected';
                        const isClaimed = mySubmission?.status === 'claimed';
                        const isLocked = isPending || isApproved || isClaimed;

                        return (
                            <div key={task.id} className={`bg-[#0B0F19] border rounded-2xl p-6 transition ${isLocked ? 'opacity-80 border-gray-800' : 'border-gray-800 hover:border-purple-500/30'}`}>
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-purple-900/20 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-purple-500/20">Bonusová Mise</span>
                                            <span className="text-yellow-500 font-bold text-xs flex items-center gap-1"><Gift size={12}/> +{task.rewardXP} XP</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{task.description}</p>
                                        
                                        {mySubmission && (
                                            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl mb-4">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Tvoje Odpověď:</p>
                                                <p className="text-sm text-gray-300 italic">"{mySubmission.content}"</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            {isPending && <span className="text-yellow-500 text-sm font-bold flex items-center gap-2 bg-yellow-900/10 px-3 py-1 rounded-lg border border-yellow-500/20"><Loader2 size={16} className="animate-spin"/> Čeká na schválení</span>}
                                            {isRejected && <span className="text-red-500 text-sm font-bold flex items-center gap-2 bg-red-900/10 px-3 py-1 rounded-lg border border-red-500/20"><XCircle size={16}/> Zamítnuto - zkusit znovu</span>}
                                            {(isApproved || isClaimed) && <span className="text-green-500 text-sm font-bold flex items-center gap-2 bg-green-900/10 px-3 py-1 rounded-lg border border-green-500/20"><CheckCircle size={16}/> Splněno</span>}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/3 bg-black/50 p-4 rounded-xl border border-gray-800 flex flex-col justify-center">
                                        {isApproved ? (
                                            <div className="text-center">
                                                <p className="text-green-400 font-bold text-sm mb-3">Úkol byl schválen!</p>
                                                <button 
                                                    onClick={() => handleClaim(mySubmission.id, task.rewardXP)}
                                                    className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-black rounded-xl shadow-lg shadow-yellow-900/20 animate-pulse flex items-center justify-center gap-2"
                                                >
                                                    <Gift size={20}/> VYZVEDNOUT {task.rewardXP} XP
                                                </button>
                                            </div>
                                        ) : isClaimed ? (
                                            <div className="text-center text-gray-500">
                                                <CheckCircle size={40} className="mx-auto mb-2 opacity-50"/>
                                                <p className="text-sm">Odměna vyzvednuta</p>
                                            </div>
                                        ) : !isLocked || isRejected ? (
                                            <>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Důkaz o splnění ({task.proofType})</label>
                                                <textarea 
                                                    value={taskInputs[task.id] || ''}
                                                    onChange={e => setTaskInputs(prev => ({...prev, [task.id]: e.target.value}))}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none h-24 resize-none mb-3"
                                                    placeholder={task.proofType === 'link' ? 'https://...' : 'Tvůj text...'}
                                                />
                                                <button onClick={() => handleBonusSubmit(task.id)} className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-white text-xs flex items-center justify-center gap-2 transition">
                                                    <Send size={14}/> Odeslat ke kontrole
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center text-gray-600 italic text-xs">Už nemůžeš odeslat znovu.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DashboardChallenges;
