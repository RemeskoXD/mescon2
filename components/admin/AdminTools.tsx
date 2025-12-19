
import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { User, Transaction } from '../../types';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminToolsProps {
    allUsers: User[];
}

const MONTH_NAMES = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(amount);
};

const AdminTools: React.FC<AdminToolsProps> = ({ allUsers }) => {
    const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const allRecords = useMemo(() => {
        const records: Transaction[] = [];
        allUsers.forEach(user => {
            if (user.financialRecords) {
                records.push(...user.financialRecords);
            }
        });
        return records;
    }, [allUsers]);

    const filteredData = useMemo(() => {
        return allRecords.filter(r => {
            const d = new Date(r.date);
            if (viewMode === 'year') return d.getFullYear() === selectedYear;
            return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
        });
    }, [allRecords, viewMode, selectedYear, selectedMonth]);

    const summary = useMemo(() => {
        const income = filteredData.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
        const expense = filteredData.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
        return { income, expense, profit: income - expense };
    }, [filteredData]);

    const graphData = useMemo(() => {
        if (viewMode === 'year') {
            return MONTH_NAMES.map((name, i) => {
                const monthData = filteredData.filter(r => new Date(r.date).getMonth() === i);
                const income = monthData.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
                const expense = monthData.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
                return { label: name.substring(0, 3), income, expense };
            });
        } else {
            const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayData = filteredData.filter(r => new Date(r.date).getDate() === day);
                const income = dayData.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
                const expense = dayData.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
                return { label: `${day}.`, income, expense };
            });
        }
    }, [filteredData, viewMode, selectedYear, selectedMonth]);

    const maxVal = Math.max(...graphData.map(d => Math.max(d.income, d.expense)), 1000);

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="text-blue-500"/> Globální Finance
                    </h2>
                    <p className="text-gray-400 text-sm">Celková analytika akademie.</p>
                </div>
                <div className="flex bg-[#0B0F19] border border-gray-800 p-1.5 rounded-2xl w-full sm:w-auto">
                    <button onClick={() => setViewMode('year')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black transition ${viewMode === 'year' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>ROČNÍ</button>
                    <button onClick={() => setViewMode('month')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black transition ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>MĚSÍČNÍ</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-[#0B0F19] border border-gray-800 p-6 rounded-3xl"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Příjmy</p><p className="text-2xl font-black text-green-400">{formatCurrency(summary.income)}</p></div>
                <div className="bg-[#0B0F19] border border-gray-800 p-6 rounded-3xl"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Výdaje</p><p className="text-2xl font-black text-red-400">{formatCurrency(summary.expense)}</p></div>
                <div className="bg-[#0B0F19] border border-gray-800 p-6 rounded-3xl"><p className="text-[10px] font-black text-gray-500 uppercase mb-1">Čistý Zisk</p><p className={`text-2xl font-black ${summary.profit >= 0 ? 'text-blue-400' : 'text-orange-500'}`}>{formatCurrency(summary.profit)}</p></div>
            </div>

            <div className="bg-[#0B0F19] border border-gray-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-3">
                        <Activity size={18} className="text-blue-400"/> {viewMode === 'year' ? `ROK ${selectedYear}` : `${MONTH_NAMES[selectedMonth]} ${selectedYear}`}
                    </h3>
                    <div className="flex items-center gap-2">
                        {viewMode === 'month' && (
                            <div className="flex items-center bg-black/40 border border-gray-800 rounded-xl p-1">
                                <button onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)} className="p-2 hover:text-blue-400 transition"><ChevronLeft size={16}/></button>
                                <span className="text-[10px] font-black w-20 text-center">{MONTH_NAMES[selectedMonth]}</span>
                                <button onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)} className="p-2 hover:text-blue-400 transition"><ChevronRight size={16}/></button>
                            </div>
                        )}
                        <div className="flex items-center bg-black/40 border border-gray-800 rounded-xl p-1">
                            <button onClick={() => setSelectedYear(prev => prev - 1)} className="p-2 hover:text-blue-400 transition"><ChevronLeft size={16}/></button>
                            <span className="text-[10px] font-black w-14 text-center">{selectedYear}</span>
                            <button onClick={() => setSelectedYear(prev => prev + 1)} className="p-2 hover:text-blue-400 transition"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full flex items-end gap-1 md:gap-3 relative overflow-x-auto custom-scrollbar pb-8">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 px-4"><div className="w-full border-t border-white"></div><div className="w-full border-t border-white"></div><div className="w-full border-t border-white"></div><div className="w-full border-t border-white"></div></div>
                    {graphData.map((data, idx) => (
                        <div key={idx} className="flex-1 min-w-[30px] md:min-w-0 flex flex-col items-center group h-full justify-end">
                            <div className="flex gap-0.5 w-full items-end h-full">
                                <MotionDiv initial={{ height: 0 }} animate={{ height: `${(data.income / maxVal) * 100}%` }} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]"/>
                                <MotionDiv initial={{ height: 0 }} animate={{ height: `${(data.expense / maxVal) * 100}%` }} className="flex-1 bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]"/>
                            </div>
                            <span className="text-[8px] md:text-[10px] text-gray-600 font-black mt-4 uppercase truncate w-full text-center">{data.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTools;
