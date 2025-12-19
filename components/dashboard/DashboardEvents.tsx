
import React from 'react';
import { Calendar, Clock, MapPin, Users, Video, Lock, CheckCircle, ExternalLink, Ticket, Hourglass } from 'lucide-react';
import { CalendarEvent, User } from '../../types';

interface DashboardEventsProps {
    events: CalendarEvent[];
    user: User;
    onRegister: (eventId: string, userId: string) => void;
}

const DashboardEvents: React.FC<DashboardEventsProps> = ({ events, user, onRegister }) => {
    
    const sortedEvents = [...events].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcoming = sortedEvents.filter(e => new Date(e.date) > new Date());
    const past = sortedEvents.filter(e => new Date(e.date) <= new Date()).reverse();

    const handleRegisterClick = (event: CalendarEvent) => {
        const freeAccess = hasFreeAccess(event);
        
        // Handle External Links
        if (freeAccess && event.freeRegistrationLink) {
            window.open(event.freeRegistrationLink, '_blank');
            return;
        }
        if (!freeAccess && event.registrationLink) {
            window.open(event.registrationLink, '_blank');
            return;
        }

        // Standard Internal Logic
        if(window.confirm("Chcete se přihlásit na tuto akci? Vaše registrace bude muset být schválena administrátorem.")) {
            onRegister(event.id, user.id);
        }
    };

    const hasFreeAccess = (event: CalendarEvent) => {
        if (user.role === 'admin') return true;
        if (user.role === 'vip' && event.isFreeForVip) return true;
        if (user.role === 'premium' && event.isFreeForPremium) return true;
        if (event.price === 0) return true;
        return false;
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white">Kalendář Akcí</h2>

            {upcoming.length === 0 && <div className="p-8 text-center text-gray-500 bg-[#0B0F19] rounded-2xl border border-gray-800">Žádné nadcházející akce.</div>}

            <div className="grid grid-cols-1 gap-6">
                {upcoming.map(event => {
                    const isRegistered = event.registeredUserIds?.includes(user.id);
                    const isApproved = event.approvedUserIds?.includes(user.id);
                    const isFull = event.maxAttendees && event.registeredUserIds.length >= event.maxAttendees;
                    const freeAccess = hasFreeAccess(event);
                    
                    return (
                        <div key={event.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-blue-500/30 transition shadow-lg relative overflow-hidden group">
                            {/* Date Badge */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-900 rounded-xl w-24 h-24 border border-gray-800 group-hover:border-blue-500/50 transition">
                                <span className="text-xs text-gray-500 uppercase font-bold">{new Date(event.date).toLocaleDateString('cs-CZ', {month: 'short'})}</span>
                                <span className="text-3xl font-bold text-white">{new Date(event.date).getDate()}</span>
                                <span className="text-xs text-blue-400">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${event.type === 'webinar' ? 'bg-purple-900/20 border-purple-500/30 text-purple-400' : 'bg-blue-900/20 border-blue-500/30 text-blue-400'}`}>{event.type}</span>
                                    {isApproved ? (
                                        <span className="text-xs font-bold text-green-500 flex items-center gap-1 bg-green-900/10 px-2 py-0.5 rounded border border-green-500/30"><CheckCircle size={12}/> Schváleno</span>
                                    ) : isRegistered ? (
                                        <span className="text-xs font-bold text-yellow-500 flex items-center gap-1 bg-yellow-900/10 px-2 py-0.5 rounded border border-yellow-500/30"><Hourglass size={12}/> Čeká na schválení</span>
                                    ) : null}
                                    {!isRegistered && isFull && <span className="text-xs font-bold text-red-500 flex items-center gap-1">Obsazeno</span>}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 max-w-2xl">{event.description}</p>
                                
                                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
                                    <span className="flex items-center gap-2"><Clock size={14}/> {event.xpReward ? `+${event.xpReward} XP` : 'Info v detailu'}</span>
                                    {event.type === 'webinar' ? <span className="flex items-center gap-2"><Video size={14}/> Online</span> : <span className="flex items-center gap-2"><MapPin size={14}/> Live Event</span>}
                                    <span className="flex items-center gap-2"><Users size={14}/> {event.registeredUserIds?.length || 0} / {event.maxAttendees || '∞'}</span>
                                    {!freeAccess && !isRegistered && <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px]">Cena: {event.price} Kč</span>}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-end gap-3 min-w-[150px]">
                                {isApproved ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        {event.link ? (
                                            <a href={event.link} target="_blank" rel="noreferrer" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                                                <ExternalLink size={16}/> Vstoupit
                                            </a>
                                        ) : (
                                            <div className="w-full py-3 bg-green-900/20 text-green-500 border border-green-500/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                                <CheckCircle size={16}/> Máš místo!
                                            </div>
                                        )}
                                    </div>
                                ) : isRegistered ? (
                                    <div className="w-full py-3 bg-gray-800 text-gray-400 border border-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 opacity-50 cursor-default">
                                        <Hourglass size={16}/> Čekání na schválení
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleRegisterClick(event)}
                                        disabled={isFull}
                                        className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                                            isFull 
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                                            : freeAccess ? 'bg-white text-black hover:bg-gray-200' : 'bg-yellow-600 text-black hover:bg-yellow-500'
                                        }`}
                                    >
                                        {isFull ? 'Plně obsazeno' : freeAccess ? (
                                            <>
                                                {event.freeRegistrationLink ? 'Registrovat zdarma' : 'Registrovat zdarma'} 
                                                {event.freeRegistrationLink ? <ExternalLink size={16}/> : <Ticket size={16}/>}
                                            </>
                                        ) : (
                                            <>
                                                {event.registrationLink ? 'Koupit vstupenku' : 'Koupit vstupenku'} 
                                                {event.registrationLink ? <ExternalLink size={16}/> : <Ticket size={16}/>}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {past.length > 0 && (
                <div className="pt-12 border-t border-gray-900">
                    <h3 className="text-lg font-bold text-gray-500 mb-6">Proběhlé Akce</h3>
                    <div className="space-y-4 opacity-60">
                        {past.map(event => (
                            <div key={event.id} className="flex items-center gap-6 p-4 rounded-xl border border-gray-800 bg-gray-900/20">
                                <div className="text-gray-500 font-mono text-xs w-24">{new Date(event.date).toLocaleDateString()}</div>
                                <div className="font-bold text-gray-400 flex-1">{event.title}</div>
                                <div className="text-xs text-gray-600 uppercase">{event.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardEvents;
