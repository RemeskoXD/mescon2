import React, { useState } from 'react';
import { User, SystemSettings } from '../../types';
import { Trophy, Flame, Star, Gift } from 'lucide-react';

interface DashboardLeaderboardProps {
    allUsers: User[];
    currentUser: User;
    onTogglePublic: (val: boolean) => void;
    onViewUser?: (userId: string) => void;
    settings?: SystemSettings; // Added Prop
}

const DashboardLeaderboard: React.FC<DashboardLeaderboardProps> = ({ allUsers, currentUser, onTogglePublic, onViewUser, settings }) => {
    const [leaderboardType, setLeaderboardType] = useState<'xp' | 'streak'>('xp');

    const sortedUsers = allUsers
        .filter(u => u.isPublicProfile)
        .sort((a,b) => {
            if (leaderboardType === 'xp') {
                return b.xp - a.xp;
            } else {
                return (b.loginStreak || 0) - (a.loginStreak || 0);
            }
        })
        .slice(0, 50);

    const myRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Weekly Reward Banner - Dynamic */}
            {settings?.leaderboardBanner?.active && (
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={80}/></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-yellow-600 rounded-xl text-white shadow-lg shadow-yellow-600/20"><Gift size={24}/></div>
                        <div>
                            <h3 className="font-bold text-white">{settings.leaderboardBanner.title}</h3>
                            <p className="text-yellow-200 text-sm">{settings.leaderboardBanner.text}</p>
                        </div>
                    </div>
                    <div className="hidden md:block text-right relative z-10">
                        <div className="text-xs text-gray-400 uppercase font-bold">Zbývá času</div>
                        <div className="text-xl font-mono text-white font-bold">{settings.leaderboardBanner.timer}</div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B0F19] p-6 rounded-2xl border border-gray-800 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Žebříček Nejlepších</h2>
                    <p className="text-gray-400 text-sm">Porovnejte své výsledky s ostatními studenty.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                        <button 
                            onClick={() => setLeaderboardType('xp')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${leaderboardType === 'xp' ? 'bg-yellow-600 text-black shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Trophy size={14}/> Top XP
                        </button>
                        <button 
                            onClick={() => setLeaderboardType('streak')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 ${leaderboardType === 'streak' ? 'bg-orange-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Flame size={14}/> Nejaktivnější
                        </button>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-xl border border-gray-700">
                        <span className="text-sm font-bold text-gray-300">Zobrazit mě</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={currentUser.isPublicProfile} onChange={e => onTogglePublic(e.target.checked)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-900/50 p-4 text-xs font-bold text-gray-500 uppercase border-b border-gray-800">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-7">Student</div>
                    <div className="col-span-2 text-center">Level</div>
                    <div className="col-span-2 text-right">{leaderboardType === 'xp' ? 'XP' : 'Dny v řadě'}</div>
                </div>
                {sortedUsers.map((user, idx) => {
                    const rank = idx + 1;
                    const isMe = user.id === currentUser.id;
                    return (
                        <div 
                            key={user.id} 
                            onClick={() => onViewUser && onViewUser(user.id)}
                            className={`grid grid-cols-12 p-4 items-center hover:bg-gray-900/30 transition border-b border-gray-800/50 cursor-pointer ${isMe ? 'bg-blue-900/10 border-l-4 border-l-blue-500' : ''}`}
                        >
                            <div className="col-span-1 text-center font-bold text-gray-400">
                                {rank === 1 ? <span className="text-2xl">🥇</span> : rank === 2 ? <span className="text-2xl">🥈</span> : rank === 3 ? <span className="text-2xl">🥉</span> : rank}
                            </div>
                            <div className="col-span-7 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-xs text-white border border-gray-700 overflow-hidden">
                                    {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover"/> : user.name?.charAt(0)}
                                </div>
                                <div className={`font-bold text-sm ${isMe ? 'text-blue-400' : 'text-white'}`}>
                                    {user.name || 'Anonym'}
                                    {isMe && <span className="ml-2 text-[10px] bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-200">JA</span>}
                                </div>
                            </div>
                            <div className="col-span-2 text-center">
                                <span className="bg-gray-800 px-2 py-1 rounded text-xs font-bold text-gray-300">{user.level}</span>
                            </div>
                            <div className={`col-span-2 text-right font-mono font-bold ${leaderboardType === 'xp' ? 'text-yellow-500' : 'text-orange-500'}`}>
                                {leaderboardType === 'xp' ? user.xp.toLocaleString() : (user.loginStreak || 0)} {leaderboardType === 'streak' && <Flame size={12} className="inline ml-1"/>}
                            </div>
                        </div>
                    );
                })}
                {sortedUsers.length === 0 && <div className="p-8 text-center text-gray-500">Žebříček je prázdný.</div>}
            </div>
        </div>
    );
};

export default DashboardLeaderboard;