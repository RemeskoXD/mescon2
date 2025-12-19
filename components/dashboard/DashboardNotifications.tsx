import React from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, Trash2, CheckCircle, Award, Star } from 'lucide-react';
import { Notification } from '../../types';

interface DashboardNotificationsProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onClearAll: () => void;
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({ notifications, onMarkAsRead, onDelete, onClearAll }) => {
    // Sort: Date descending (newest first)
    const sorted = [...notifications].sort((a,b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const getIcon = (type: string) => {
        switch(type) {
            case 'level_up': return <Award size={20}/>;
            case 'success': return <CheckCircle size={20}/>;
            case 'error': return <XCircle size={20}/>;
            case 'warning': return <AlertTriangle size={20}/>;
            default: return <Info size={20}/>;
        }
    };

    const getColors = (type: string, read: boolean) => {
        if (read) return 'bg-gray-800/30 text-gray-500 border-gray-800';
        switch(type) {
            case 'level_up': return 'bg-yellow-900/20 text-yellow-500 border-yellow-500/30';
            case 'success': return 'bg-green-900/20 text-green-500 border-green-500/30';
            case 'error': return 'bg-red-900/20 text-red-500 border-red-500/30';
            case 'warning': return 'bg-orange-900/20 text-orange-500 border-orange-500/30';
            default: return 'bg-blue-900/20 text-blue-500 border-blue-500/30';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Upozornění</h2>
                    <p className="text-gray-400 text-sm">Zůstaňte v obraze o svém pokroku.</p>
                </div>
                {notifications.length > 0 && (
                    <button onClick={onClearAll} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-400 transition">
                        <Trash2 size={14}/> Smazat vše
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {sorted.length === 0 && (
                    <div className="text-center py-24 text-gray-600 bg-[#0B0F19] rounded-[2.5rem] border border-gray-800">
                        <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-700">
                            <Bell size={32}/>
                        </div>
                        <p className="font-bold">Žádná nová upozornění</p>
                        <p className="text-xs mt-1">Až se něco stane, dáme vám vědět.</p>
                    </div>
                )}

                {sorted.map(notif => (
                    <div 
                        key={notif.id} 
                        className={`p-5 rounded-2xl border transition-all cursor-pointer group relative ${
                            notif.read ? 'bg-[#0B0F19]/50 border-gray-800/50 opacity-60' : 'bg-gray-900/80 border-gray-700 shadow-xl'
                        }`}
                        onClick={() => !notif.read && onMarkAsRead(notif.id)}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-0.5 p-2.5 rounded-xl border shrink-0 transition-colors ${getColors(notif.type, notif.read)}`}>
                                {getIcon(notif.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className={`font-bold text-sm truncate ${notif.read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</h4>
                                    <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap pt-1">{new Date(notif.createdAt).toLocaleDateString('cs-CZ')} {new Date(notif.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className={`text-xs mt-1 leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-400'}`}>{notif.message}</p>
                                {notif.link && (
                                    <a href={notif.link} className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-3 inline-block hover:text-blue-400 transition">Zobrazit detail &rarr;</a>
                                )}
                            </div>

                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }} 
                                className="text-gray-700 hover:text-red-500 transition p-1.5 opacity-0 group-hover:opacity-100"
                                title="Smazat"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                        
                        {!notif.read && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardNotifications;