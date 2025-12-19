import React from 'react';
import { Film, Play, Clock, Lock, Users, Radio } from 'lucide-react';
import { Stream, User } from '../../types';

interface DashboardStreamsProps {
    streams: Stream[];
    user: User;
}

const DashboardStreams: React.FC<DashboardStreamsProps> = ({ streams, user }) => {
    
    const hasAccess = (minRole: string) => {
        if (!user || !user.role) return false;
        const roles = ['student', 'premium', 'vip', 'admin'];
        const userRoleIdx = roles.indexOf(user.role);
        const minRoleIdx = roles.indexOf(minRole);
        return userRoleIdx >= minRoleIdx;
    };

    // Sort by date descending
    const sortedStreams = [...streams].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const liveStream = sortedStreams.find(s => s.status === 'live');
    const pastStreams = sortedStreams.filter(s => s.status !== 'live');

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white">Streamy & Živé Vysílání</h2>

            {/* LIVE SECTION */}
            {liveStream && hasAccess(liveStream.minRole) && (
                <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase animate-pulse z-10">
                        <Radio size={14}/> Právě vysíláme
                    </div>
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden mt-8 shadow-2xl border border-gray-800">
                        <iframe src={liveStream.streamUrl} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-xl font-bold text-white">{liveStream.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{liveStream.description}</p>
                    </div>
                </div>
            )}

            {/* ARCHIVE */}
            <div>
                <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Film size={18}/> Archiv Záznamů</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastStreams.map(stream => {
                        const access = hasAccess(stream.minRole);
                        return (
                            <div key={stream.id} className={`bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition shadow-lg ${!access ? 'opacity-70' : ''}`}>
                                <div className="h-48 bg-gray-900 relative overflow-hidden group">
                                    <img src={stream.thumbnail} className="w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                                    
                                    {access ? (
                                        <a href={stream.streamUrl} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                            <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-xl transform scale-75 group-hover:scale-100 transition">
                                                <Play size={32} className="ml-1 fill-white"/>
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                            <div className="text-center px-4">
                                                <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                                                <span className="text-xs font-bold uppercase text-gray-400 border border-gray-600 px-2 py-1 rounded bg-black/50">Vyžaduje {stream.minRole}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                                        {stream.status === 'upcoming' ? 'PLÁNOVÁNO' : 'ZÁZNAM'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2 font-mono">
                                        <Clock size={10}/> {new Date(stream.date).toLocaleDateString()}
                                        {stream.viewers > 0 && <span className="flex items-center gap-1"><Users size={10}/> {stream.viewers}</span>}
                                    </div>
                                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{stream.title}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">{stream.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardStreams;