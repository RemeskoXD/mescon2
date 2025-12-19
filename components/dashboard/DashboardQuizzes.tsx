import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Clock } from 'lucide-react';
import { Quiz, User } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardQuizzesProps {
    quizzes: Quiz[];
    user: User;
    onQuizComplete: (quizId: string, score: number, passed: boolean) => void;
    notify: any;
}

const DashboardQuizzes: React.FC<DashboardQuizzesProps> = ({ quizzes, user, onQuizComplete, notify }) => {
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [showResults, setShowResults] = useState(false);

    const handleStart = (quiz: Quiz) => {
        setActiveQuiz(quiz);
        setCurrentQuestionIdx(0);
        setAnswers({});
        setShowResults(false);
    };

    const handleAnswer = (optionIdx: number) => {
        if(!activeQuiz) return;
        setAnswers(prev => ({...prev, [activeQuiz.questions[currentQuestionIdx].id]: optionIdx}));
    };

    const handleNext = () => {
        if(!activeQuiz) return;
        if(currentQuestionIdx < activeQuiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        if(!activeQuiz) return;
        let correctCount = 0;
        activeQuiz.questions.forEach(q => {
            if(answers[q.id] === q.correctOptionIndex) correctCount++;
        });
        const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
        const passed = score >= activeQuiz.passingScore;
        
        setShowResults(true);
        onQuizComplete(activeQuiz.id, score, passed);
        if(passed) notify('success', 'Gratulujeme!', `Splnil jsi kvíz na ${score}%.`);
        else notify('error', 'Nevyšlo to', `Skóre ${score}% nestačí. Zkus to znovu.`);
    };

    // Calculate score for display
    const getScore = () => {
        if(!activeQuiz) return { score: 0, passed: false, correct: 0 };
        let correctCount = 0;
        activeQuiz.questions.forEach(q => {
            if(answers[q.id] === q.correctOptionIndex) correctCount++;
        });
        const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
        return { score, passed: score >= activeQuiz.passingScore, correct: correctCount };
    };

    const filteredQuizzes = quizzes.filter(q => q.published);

    return (
        <div className="space-y-6 animate-fade-in relative">
            <h2 className="text-2xl font-bold text-white mb-6">Kvízy a Testy</h2>

            {/* QUIZ LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredQuizzes.map(quiz => {
                    const history = user.quizHistory?.find(h => h.quizId === quiz.id);
                    const bestScore = history ? history.score : null;
                    const isPassed = history?.passed;

                    return (
                        <div key={quiz.id} className={`bg-[#0B0F19] border rounded-2xl overflow-hidden group hover:border-purple-500/30 transition shadow-lg flex flex-col ${isPassed ? 'border-green-500/30' : 'border-gray-800'}`}>
                            <div className="h-32 bg-gray-900 relative overflow-hidden">
                                <img src={quiz.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500"/>
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold uppercase border border-white/10">{quiz.level}</div>
                                {isPassed && (
                                    <div className="absolute inset-0 bg-green-900/60 flex flex-col items-center justify-center backdrop-blur-sm">
                                        <CheckCircle size={40} className="text-white mb-2"/>
                                        <span className="text-white font-bold uppercase text-xs tracking-wider">Splněno</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-white text-lg mb-2 truncate">{quiz.title}</h3>
                                <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-1">{quiz.description}</p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-4 border-t border-gray-800">
                                    <span className="flex items-center gap-1"><Brain size={12}/> {quiz.questions.length} otázek</span>
                                    {isPassed ? (
                                        <span className="text-green-500 font-bold">{bestScore}%</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-yellow-500 font-bold">+{quiz.xpReward} XP</span>
                                    )}
                                </div>

                                <button 
                                    onClick={() => handleStart(quiz)}
                                    className={`w-full py-2 rounded-lg font-bold text-sm transition ${isPassed ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                                >
                                    {isPassed ? 'Opakovat Test' : 'Spustit Test'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* QUIZ PLAYER OVERLAY */}
            <AnimatePresence>
                {activeQuiz && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-[#0B0F19] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Close Button */}
                            <button onClick={() => setActiveQuiz(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XCircle size={24}/></button>

                            {/* Header */}
                            <div className="p-6 border-b border-gray-800 bg-gray-900/30">
                                <h3 className="text-xl font-bold text-white">{activeQuiz.title}</h3>
                                {!showResults && (
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 transition-all duration-300" style={{width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`}}></div>
                                        </div>
                                        <span className="text-xs font-mono text-purple-400">{currentQuestionIdx + 1} / {activeQuiz.questions.length}</span>
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-8 min-h-[300px] flex flex-col">
                                {!showResults ? (
                                    <>
                                        <h4 className="text-lg font-medium text-white mb-6">{activeQuiz.questions[currentQuestionIdx].question}</h4>
                                        <div className="space-y-3 flex-1">
                                            {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => handleAnswer(idx)}
                                                    className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-3 ${
                                                        answers[activeQuiz.questions[currentQuestionIdx].id] === idx 
                                                        ? 'bg-purple-900/30 border-purple-500 text-white' 
                                                        : 'bg-black border-gray-800 text-gray-400 hover:bg-gray-900'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[activeQuiz.questions[currentQuestionIdx].id] === idx ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-600'}`}>
                                                        {answers[activeQuiz.questions[currentQuestionIdx].id] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                    </div>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button 
                                                onClick={handleNext} 
                                                disabled={answers[activeQuiz.questions[currentQuestionIdx].id] === undefined}
                                                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center gap-2 transition"
                                            >
                                                {currentQuestionIdx === activeQuiz.questions.length - 1 ? 'Dokončit' : 'Další'} <ArrowRight size={18}/>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center h-full py-8">
                                        {getScore().passed ? (
                                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-500 text-green-500 animate-bounce-short"><Trophy size={40}/></div>
                                        ) : (
                                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-red-500 text-red-500"><XCircle size={40}/></div>
                                        )}
                                        
                                        <h2 className="text-3xl font-black text-white mb-2">{getScore().score}%</h2>
                                        <p className={`text-lg font-bold mb-6 ${getScore().passed ? 'text-green-400' : 'text-red-400'}`}>
                                            {getScore().passed ? 'Skvělá práce! Test splněn.' : 'Bohužel, to nestačilo.'}
                                        </p>
                                        
                                        <div className="flex gap-4 text-sm text-gray-400 mb-8">
                                            <span>Správně: {getScore().correct} / {activeQuiz.questions.length}</span>
                                            <span>•</span>
                                            <span>Potřeba: {activeQuiz.passingScore}%</span>
                                        </div>

                                        <div className="flex gap-3">
                                            <button onClick={() => setActiveQuiz(null)} className="px-6 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-white font-bold transition">Zavřít</button>
                                            {!getScore().passed && (
                                                <button onClick={() => handleStart(activeQuiz)} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition flex items-center gap-2">
                                                    <RotateCcw size={16}/> Zkusit znovu
                                                </button>
                                            )}
                                        </div>
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

export default DashboardQuizzes;