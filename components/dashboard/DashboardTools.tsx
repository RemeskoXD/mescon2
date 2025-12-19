import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, Trash2, BarChart3, TrendingUp, Calendar, Filter, X, Check, Activity, Target, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import { User, Transaction, Habit } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface DashboardToolsProps {
    user: User;
    onUpdate: (u: User) => void;
    notify: any;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(amount);
};

const MONTH_NAMES = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

const DashboardTools: React.FC<DashboardToolsProps> = ({ user, onUpdate, notify }) => {
    const [activeTool, setActiveTool] = useState<'finance' | 'habits'>('finance');
    const [isProcessing, setIsProcessing] = useState(false);

    // --- FINANCE STATE ---
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [category, setCategory] = useState('Business');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(currentMonth);
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

    // --- HABIT STATE ---
    const [newHabitName, setNewHabitName] = useState('');

    // --- FINANCE LOGIC ---
    const records = useMemo(() => user.financialRecords || [], [user.financialRecords]);

    const availableYears = useMemo(() => {
        const years = new Set([currentYear]);
        records.forEach(r => years.add(new Date(r.date).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [records, currentYear]);

    const handleAddTransaction = async () => {
        if(!amount || isProcessing) return;
        const val = parseInt(amount);
        if(isNaN(val)) return;

        setIsProcessing(true);
        const newTx: Transaction = {
            id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            date,
            amount: val,
            type,
            category,
            note
        };

        const updatedRecords = [...records, newTx].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        try {
            await onUpdate({ ...user, financialRecords: updatedRecords });
            setAmount('');
            setNote('');
            notify('success', 'Uloženo', 'Transakce byla přidána.');
        } catch (e) {
            notify('error', 'Chyba', 'Nepodařilo se uložit transakci.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if(isProcessing) return;
        setIsProcessing(true);
        
        const updatedRecords = records.filter(r => r.id !== id);
        
        try {
            await onUpdate({ ...user, financialRecords: updatedRecords });
            notify('info', 'Smazáno', 'Záznam byl odstraněn.');
        } catch (e) {
            notify('error', 'Chyba', 'Nepodařilo se smazat záznam.');
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const d = new Date(r.date);
            const matchYear = d.getFullYear() === selectedYear;
            const matchMonth = selectedMonth === 'all' || d.getMonth() === selectedMonth;
            const matchType = filterType === 'all' || r.type === filterType;
            return matchYear && matchMonth && matchType;
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [records, selectedYear, selectedMonth, filterType]);

    const income = filteredRecords.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
    const expenses = filteredRecords.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);

    // --- HABIT LOGIC ---
    const userHabits = useMemo(() => user.habits || [], [user.habits]);

    const handleAddHabit = async () => {
        if (!newHabitName.trim() || isProcessing) return;
        
        setIsProcessing(true);
        const newHabit: Habit = {
            id: `h-${Date.now()}`,
            name: newHabitName.trim(),
            created: new Date().toISOString(),
            completedDates: []
        };
        
        const updatedHabits = [...userHabits, newHabit];
        
        try {
            await onUpdate({ ...user, habits: updatedHabits });
            setNewHabitName('');
            notify('success', 'Vytvořeno', 'Nový návyk přidán.');
        } catch (e) {
            notify('error', 'Chyba', 'Návyk se nepodařilo vytvořit.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteHabit = async (id: string) => {
        if (isProcessing) return;
        setIsProcessing(true);
        
        const updatedHabits = userHabits.filter(h => h.id !== id);
        
        try {
            await onUpdate({ ...user, habits: updatedHabits });
            notify('info', 'Smazáno', 'Návyk byl odstraněn.');
        } catch (e) {
            notify('error', 'Chyba', 'Návyk se nepodařilo smazat.');
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleHabitDate = async (habitId: string, dateStr: string) => {
        if (isProcessing) return;
        
        const habit = userHabits.find(h => h.id === habitId);
        if (!habit) return;

        let newDates = [...habit.completedDates];
        if (newDates.includes(dateStr)) {
            newDates = newDates.filter(d => d !== dateStr);
        } else {
            newDates.push(dateStr);
        }

        const updatedHabits = userHabits.map(h => h.id === habitId ? { ...h, completedDates: newDates } : h);
        
        try {
            await onUpdate({ ...user, habits: updatedHabits });
        } catch (e) {
            notify('error', 'Chyba', 'Změnu se nepodařilo uložit.');
        }
    };

    const last7Days = useMemo(() => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }, []);

    const calculateStreak = (habit: Habit) => {
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let checkDate = new Date();
        if (!habit.completedDates.includes(today)) {
             if (!habit.completedDates.includes(yesterday)) return 0;
             checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (habit.completedDates.includes(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Nástroje</h2>
                    <p className="text-gray-400 text-sm">Aplikace pro vaši finanční a osobní disciplínu.</p>
                </div>
                <div className="flex bg-[#0B0F19] rounded-2xl p-1.5 border border-gray-800 shadow-xl">
                    <button 
                        onClick={() => setActiveTool('finance')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 ${activeTool === 'finance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
                    >
                        <BarChart3 size={18}/> FINANCE
                    </button>
                    <button 
                        onClick={() => setActiveTool('habits')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 ${activeTool === 'habits' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Activity size={18}/> NÁVYKY
                    </button>
                </div>
            </div>

            {/* --- FINANCE TOOL --- */}
            {activeTool === 'finance' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Add Transaction Card */}
                        <div className="bg-[#0B0F19] border border-gray-800 p-6 rounded-3xl h-fit shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={80}/></div>
                            <h3 className="font-black text-white mb-6 flex items-center gap-2 uppercase tracking-wider text-sm"><Plus size={18} className="text-blue-500"/> Nový Záznam</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="label">Typ</label>
                                        <select value={type} onChange={e => setType(e.target.value as any)} className="input bg-black border-gray-800">
                                            <option value="income">Příjem</option>
                                            <option value="expense">Výdaj</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="label">Datum</label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input bg-black border-gray-800"/>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="label">Částka (Kč)</label>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input bg-black border-gray-800 text-lg font-bold" placeholder="0"/>
                                </div>
                                <div className="space-y-1">
                                    <label className="label">Kategorie</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="input bg-black border-gray-800">
                                        <option>Business</option>
                                        <option>Marketing</option>
                                        <option>Software</option>
                                        <option>Osobní</option>
                                        <option>Cestování</option>
                                        <option>Jiné</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="label">Poznámka</label>
                                    <input type="text" value={note} onChange={e => setNote(e.target.value)} className="input bg-black border-gray-800" placeholder="Volitelné..."/>
                                </div>
                                <button 
                                    onClick={handleAddTransaction} 
                                    disabled={isProcessing || !amount}
                                    className={`w-full py-4 rounded-2xl font-black text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${type === 'income' ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}
                                >
                                    {isProcessing ? <Loader2 size={20} className="animate-spin"/> : 'ULOŽIT ZÁZNAM'}
                                </button>
                            </div>
                        </div>

                        {/* Summary & History */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0B0F19] border border-gray-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Příjmy</p>
                                        <p className="text-2xl font-black text-green-400">{formatCurrency(income)}</p>
                                    </div>
                                    <div className="p-3 bg-green-900/20 rounded-2xl text-green-500"><ArrowUpRight size={24}/></div>
                                </div>
                                <div className="bg-[#0B0F19] border border-gray-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Výdaje</p>
                                        <p className="text-2xl font-black text-red-400">{formatCurrency(expenses)}</p>
                                    </div>
                                    <div className="p-3 bg-red-900/20 rounded-2xl text-red-500"><ArrowDownRight size={24}/></div>
                                </div>
                            </div>

                            {/* History Table */}
                            <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl h-[450px]">
                                <div className="p-5 bg-gray-900/50 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <span className="font-black text-white text-sm uppercase tracking-widest">Historie transakcí</span>
                                    <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-gray-800">
                                        <select 
                                            value={selectedMonth} 
                                            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                                            className="bg-transparent text-white text-xs font-bold p-1 px-2 focus:outline-none"
                                        >
                                            <option value="all">Celý rok</option>
                                            {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-x-auto custom-scrollbar">
                                    {filteredRecords.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-600 p-10 text-center">
                                            <Filter size={48} className="mb-4 opacity-10"/>
                                            <p className="text-sm font-bold">Žádné záznamy pro tento měsíc.</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-sm text-left text-gray-400">
                                            <thead className="bg-gray-950 text-[10px] uppercase font-black tracking-widest text-gray-500 sticky top-0 z-10">
                                                <tr>
                                                    <th className="p-4">Datum</th>
                                                    <th className="p-4">Kategorie</th>
                                                    <th className="p-4 text-right">Částka</th>
                                                    <th className="p-4 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/50">
                                                {filteredRecords.map(r => (
                                                    <tr key={r.id} className="hover:bg-blue-900/5 transition group">
                                                        <td className="p-4 whitespace-nowrap font-mono text-xs">{new Date(r.date).toLocaleDateString('cs-CZ')}</td>
                                                        <td className="p-4">
                                                            <div className="font-bold text-white text-xs">{r.category}</div>
                                                            <div className="text-[10px] text-gray-600 truncate max-w-[120px]">{r.note || 'Bez poznámky'}</div>
                                                        </td>
                                                        <td className={`p-4 text-right font-black ${r.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                                            {r.type === 'income' ? '+' : '-'}{r.amount.toLocaleString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleDeleteTransaction(r.id)} 
                                                                disabled={isProcessing}
                                                                className="text-gray-700 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-lg"
                                                            >
                                                                <Trash2 size={16}/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HABIT TRACKER --- */}
            {activeTool === 'habits' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/10 border border-purple-500/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={120}/></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-3 uppercase tracking-tighter">
                                <Target size={32} className="text-purple-400"/> TRACKER NÁVYKŮ
                            </h3>
                            <p className="text-purple-200 text-sm mt-2 max-w-md">
                                Budování návyků je základem dlouhodobého úspěchu. Označte splněné úkoly každý den.
                            </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto relative z-10">
                            <input 
                                value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                placeholder="Název nového návyku..."
                                className="bg-black border border-purple-500/40 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 flex-1 md:w-72 font-bold placeholder:text-gray-700"
                                onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                            />
                            <button 
                                onClick={handleAddHabit} 
                                disabled={isProcessing || !newHabitName.trim()}
                                className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl transition shadow-lg shadow-purple-900/40 disabled:opacity-50"
                            >
                                <Plus size={24} strokeWidth={3}/>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0B0F19] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-12 bg-gray-900/50 p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800">
                            <div className="col-span-5 md:col-span-4">Návyk</div>
                            <div className="col-span-7 md:col-span-8 flex justify-between px-2">
                                {last7Days.map((dateStr) => (
                                    <div key={dateStr} className="text-center w-10">
                                        <div className="mb-1 text-white">{new Date(dateStr).getDate()}.</div>
                                        <div className="opacity-40">{['Ne','Po','Út','St','Čt','Pá','So'][new Date(dateStr).getDay()]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="divide-y divide-gray-800/50">
                            {userHabits.length === 0 ? (
                                <div className="p-20 text-center text-gray-600">
                                    <Activity size={64} className="mx-auto mb-4 opacity-5"/>
                                    <p className="font-bold">Zatím nesledujete žádné návyky.</p>
                                    <p className="text-xs mt-1">Začněte vytvořením prvního nahoře.</p>
                                </div>
                            ) : (
                                userHabits.map(habit => {
                                    const streak = calculateStreak(habit);
                                    return (
                                        <div key={habit.id} className="grid grid-cols-12 p-6 items-center hover:bg-purple-900/5 transition group">
                                            <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                                <button 
                                                    onClick={() => handleDeleteHabit(habit.id)} 
                                                    disabled={isProcessing}
                                                    className="p-2 bg-gray-900 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                                <div className="overflow-hidden">
                                                    <div className="font-black text-white text-sm truncate uppercase tracking-tight">{habit.name}</div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="text-[10px] font-black text-orange-500 font-mono bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">{streak} DNÍ STREAK</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-7 md:col-span-8 flex justify-between px-2">
                                                {last7Days.map(dateStr => {
                                                    const isDone = habit.completedDates.includes(dateStr);
                                                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                                                    return (
                                                        <button 
                                                            key={dateStr}
                                                            onClick={() => toggleHabitDate(habit.id, dateStr)}
                                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all transform active:scale-90 ${
                                                                isDone 
                                                                ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                                                                : (isToday ? 'bg-black border-purple-500/40 text-purple-500 hover:border-purple-400' : 'bg-black border-gray-800 text-gray-800 hover:border-gray-700')
                                                            }`}
                                                        >
                                                            {isDone ? <Check size={20} strokeWidth={4}/> : <Plus size={16} className="opacity-20"/>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Global Processing Loader */}
            <AnimatePresence>
                {isProcessing && (
                    <MotionDiv 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/20 pointer-events-auto"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardTools;
