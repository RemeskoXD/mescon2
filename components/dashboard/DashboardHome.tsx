
import React, { useState, useMemo } from 'react';
import { Trophy, Calendar, Zap, BookOpen, BarChart2, MessageCircle, FileText, Flame, Book, ArrowRight, ShieldCheck, Gift, CheckCircle, Crown, Star } from 'lucide-react';
import { User, LevelRequirement, CalendarEvent } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface DashboardHomeProps {
    user: User;
    nextLevel: LevelRequirement | undefined;
    events: CalendarEvent[];
    onNavigate: (tab: string) => void;
    onStartCheckout?: (plan: string, price: number) => void;
    onClaimDaily?: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(amount);
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ user, nextLevel, events, onNavigate, onStartCheckout, onClaimDaily }) => {
    const nextEvent = events.filter(e => new Date(e.date) > new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    const today = new Date().toDateString();
    const lastClaimDate = user.lastDailyClaim ? new Date(user.lastDailyClaim).toDateString() : null;
    const claimedToday = lastClaimDate === today;
    
    const [flameClicks, setFlameClicks] = useState(0);
    const [showSecretGame, setShowSecretGame] = useState(false);
    const [secretScore, setSecretScore] = useState(0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyIncome = user.financialRecords?.filter(r => r.type === 'income' && new Date(r.date).getMonth() === currentMonth && new Date(r.date).getFullYear() === currentYear).reduce((acc, r) => acc + r.amount, 0) || 0;
    const totalProfit = user.financialRecords?.reduce((acc, r) => acc + (r.type === 'income' ? r.amount : -r.amount), 0) || 0;

    const streak = user.loginStreak || 0; 

    const progressData = useMemo(() => {
        if (!nextLevel) return { percent: 100, needed: 0 };
        
        // XP potřebné pro současný level - odhadneme z nextLevel formule: i=0 -> 0, i=1 -> 1000...
        // Pokud je uživatel level 1, start je 0. Pokud level 2, start je 1000 atd.
        // Pro přesnost bychom potřebovali celou tabulku, ale zkusíme to aproximovat:
        const currentLevelStartXP = user.level > 1 ? Math.floor(1000 * Math.pow(user.level - 1, 1.4)) : 0;
        const targetXP = nextLevel.xpRequired;
        
        const range = targetXP - currentLevelStartXP;
        const earnedInRange = (user.xp || 0) - currentLevelStartXP;
        
        const percent = Math.max(0, Math.min(100, (earnedInRange / range) * 100));
        return { percent, needed: targetXP - (user.xp || 0) };
    }, [user.xp, user.level, nextLevel]);

    const handleClaim = () => {
        if (onClaimDaily && !claimedToday) {
            onClaimDaily();
        }
    };

    const handleFlameClick = () => {
        const newClicks = flameClicks + 1;
        setFlameClicks(newClicks);
        if (newClicks === 5) {
            setShowSecretGame(true);
            setFlameClicks(0);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative pb-10">
            <AnimatePresence>
                {showSecretGame && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center cursor-crosshair" onClick={() => { setSecretScore(s => s+1); }}>
                        <div className="text-center pointer-events-none">
                            <h2 className="text-4xl font-black text-red-500 animate-pulse mb-4">SECRET CLICKER</h2>
                            <p className="text-white text-2xl">Skóre: {secretScore}</p>
                            <p className="text-gray-500 text-sm mt-8">Klikni kamkoliv pro skóre. ESC pro konec.</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setShowSecretGame(false); setSecretScore(0); }} className="absolute top-4 right-4 text-white p-4 border rounded-full hover:bg-white hover:text-black">Zavřít</button>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy size={120} /></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-white">Vítej zpět, {user.name || 'Studente'}! 👋</h2>
                            
                            <div className="flex items-center gap-2">
                                <div 
                                    className="flex items-center gap-1 bg-orange-900/40 border border-orange-500/50 px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition select-none" 
                                    title="Klikni 5x pro tajemství..."
                                    onClick={handleFlameClick}
                                >
                                    <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse"/>
                                    <span className="text-sm font-bold text-orange-200">{streak} dní</span>
                                </div>
                                {!claimedToday ? (
                                    <button 
                                        onClick={handleClaim}
                                        className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold transition shadow-lg shadow-yellow-900/20 animate-bounce-short"
                                    >
                                        <Gift size={12}/> Vyzvednout 100 XP
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1 bg-gray-800 text-gray-400 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold cursor-default">
                                        <CheckCircle size={12}/> Odměna vybrána
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-blue-200 mb-6 max-w-lg">
                            Pokračujte v dominanci. Každý splněný úkol vás posouvá blíž k vrcholu.
                        </p>
                        
                        {nextLevel && (
                            <div className="bg-gray-900/60 p-4 rounded-xl border border-blue-500/20 max-w-md backdrop-blur-sm shadow-inner">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">LEVEL {user.level}</span>
                                    <span className="text-xs font-mono text-gray-400">{(user.xp || 0).toLocaleString()} / {nextLevel.xpRequired.toLocaleString()} XP</span>
                                </div>
                                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                                    <MotionDiv 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressData.percent}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    ></MotionDiv>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Hodnost: <span className="text-white">{user.role.toUpperCase()}</span></p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Další: <span className="text-blue-400">{nextLevel.title}</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700 backdrop-blur-md">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Měsíční Příjem</p>
                            <p className="text-2xl font-bold text-green-400">{formatCurrency(monthlyIncome)}</p>
                        </div>
                        <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700 backdrop-blur-md">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Celkový Zisk</p>
                            <p className="text-xl font-bold text-white">{formatCurrency(totalProfit)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {user.role === 'nope' && onStartCheckout && (
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/50 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-500 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        <Zap size={150} fill="currentColor" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase mb-3 border border-orange-500/30">
                                <ShieldCheck size={12}/> Exkluzivní Nabídka
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Zkuste Premium na 7 dní za 20 Kč</h3>
                            <p className="text-gray-300 max-w-lg text-sm leading-relaxed">
                                Nejste si jistí? Odemkněte si kompletní přístup do akademie na týden za symbolickou cenu.
                            </p>
                        </div>
                        <button 
                            onClick={() => onStartCheckout('TRIAL', 20)}
                            className="whitespace-nowrap px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Aktivovat za 20 Kč <ArrowRight size={18}/>
                        </button>
                    </div>
                </div>
            )}

            {user.dashboardMessage && user.dashboardMessage.active && (
                <div className="bg-[#0B0F19] border-l-4 border-blue-500 rounded-r-xl p-6 shadow-lg relative overflow-hidden">
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="p-3 bg-blue-900/20 rounded-full text-blue-400"><MessageCircle size={24}/></div>
                        <div>
                            <h3 className="font-bold text-lg text-white mb-2">Zpráva od vedení</h3>
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{user.dashboardMessage.text}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2"><Calendar size={20} className="text-purple-500"/> Nejbližší Akce</h3>
                    </div>
                    {nextEvent ? (
                        <div>
                            <div className="text-2xl font-bold text-white mb-1">{new Date(nextEvent.date).getDate()}. {new Date(nextEvent.date).toLocaleDateString('cs-CZ', {month:'long'})}</div>
                            <div className="text-sm text-gray-400 mb-4">{nextEvent.title}</div>
                            <button onClick={() => onNavigate('events')} className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-bold text-white transition">Zobrazit Kalendář</button>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">Žádné nadcházející akce.</div>
                    )}
                </div>

                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-500"/> Rychlé Akce</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onNavigate('courses')} className="p-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-left border border-gray-800 transition group">
                            <BookOpen size={20} className="text-blue-500 mb-2 group-hover:scale-110 transition"/>
                            <div className="text-xs text-gray-400 font-bold uppercase">Pokračovat</div>
                            <div className="font-bold text-white text-sm">V Kurzu</div>
                        </button>
                        <button onClick={() => onNavigate('tools')} className="p-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-left border border-gray-800 transition group">
                            <BarChart2 size={20} className="text-green-500 mb-2 group-hover:scale-110 transition"/>
                            <div className="text-xs text-gray-400 font-bold uppercase">Přidat</div>
                            <div className="font-bold text-white text-sm">Příjem</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
