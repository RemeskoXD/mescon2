
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Save, X, Users, DollarSign, Lock, Globe, Check, XCircle, User, ExternalLink, ShoppingCart, Ticket as TicketIcon } from 'lucide-react';
import { CalendarEvent, User as UserType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminCalendarProps {
  events: CalendarEvent[];
  allUsers: UserType[];
  onSaveEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onApproveRegistration: (eventId: string, userId: string) => void;
  onRejectRegistration: (eventId: string, userId: string) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ events, allUsers, onSaveEvent, onDeleteEvent, onApproveRegistration, onRejectRegistration, notify }) => {
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [managingRegistrations, setManagingRegistrations] = useState<CalendarEvent | null>(null);

  const handleCreateEvent = () => {
      const newEvent: CalendarEvent = {
          id: `evt-${Date.now()}`,
          title: '',
          description: '',
          date: new Date().toISOString(),
          type: 'webinar',
          registeredUserIds: [],
          approvedUserIds: [],
          maxAttendees: 50,
          price: 0,
          isFreeForVip: true,
          isFreeForPremium: true
      };
      setEditingEvent(newEvent);
  };

  const handleSaveEvent = () => {
      if (!editingEvent || !editingEvent.title) {
          notify('error', 'Chyba', 'Název události je povinný.');
          return;
      }
      onSaveEvent(editingEvent);
      setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
      if(window.confirm('Opravdu smazat tuto událost?')) {
          onDeleteEvent(id);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Kalendář Akcí</h2>
                <p className="text-gray-400 text-sm">Plánujte webináře, workshopy a setkání.</p>
            </div>
            <button onClick={handleCreateEvent} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center gap-2 transition shadow-lg shadow-blue-900/20">
                <Plus size={18}/> Nová Akce
            </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {events.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(event => {
                const isPast = new Date(event.date) < new Date();
                const pendingCount = (event.registeredUserIds || []).filter(uid => !(event.approvedUserIds || []).includes(uid)).length;

                return (
                    <div key={event.id} className={`bg-[#0B0F19] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-gray-700 transition ${isPast ? 'opacity-60' : ''}`}>
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-900 rounded-xl w-24 h-24 border border-gray-800 group-hover:border-blue-500/50 transition">
                            <span className="text-xs text-gray-500 uppercase font-bold">{new Date(event.date).toLocaleDateString('cs-CZ', {month: 'short'})}</span>
                            <span className="text-3xl font-bold text-white">{new Date(event.date).getDate()}</span>
                            <span className="text-xs text-blue-400">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${event.type === 'webinar' ? 'bg-purple-900/20 border-purple-500/30 text-purple-400' : 'bg-blue-900/20 border-blue-500/30 text-blue-400'}`}>{event.type}</span>
                                {event.price && event.price > 0 ? <span className="text-xs font-bold text-yellow-500 flex items-center gap-1"><DollarSign size={10}/> {event.price} Kč</span> : <span className="text-xs font-bold text-green-500">ZDARMA</span>}
                                {pendingCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{pendingCount} k vyřízení</span>}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Users size={14}/> {event.registeredUserIds.length} / {event.maxAttendees || '∞'}</span>
                                {event.isFreeForVip && <span className="flex items-center gap-1 text-yellow-500"><Lock size={12}/> VIP Zdarma</span>}
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-center gap-2">
                            <button onClick={() => setManagingRegistrations(event)} className="p-2 bg-gray-900 hover:bg-gray-800 text-blue-400 rounded-lg transition border border-gray-800" title="Spravovat studenty">
                                <Users size={16}/>
                            </button>
                            <button onClick={() => setEditingEvent(event)} className="p-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition"><Edit size={16}/></button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="p-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition"><Trash2 size={16}/></button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* MODAL: Manage Registrations */}
        <AnimatePresence>
            {managingRegistrations && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv className="bg-[#0B0F19] w-full max-w-2xl rounded-3xl border border-gray-800 shadow-2xl p-8 flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Studenti na akci</h3>
                                <p className="text-xs text-gray-500">{managingRegistrations.title}</p>
                            </div>
                            <button onClick={() => setManagingRegistrations(null)}><X className="text-gray-500 hover:text-white"/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                            {managingRegistrations.registeredUserIds.length === 0 ? (
                                <div className="text-center py-10 text-gray-600">Zatím se nikdo nepřihlásil.</div>
                            ) : (
                                managingRegistrations.registeredUserIds.map(uid => {
                                    const student = allUsers.find(u => u.id === uid);
                                    const isApproved = managingRegistrations.approvedUserIds.includes(uid);
                                    return (
                                        <div key={uid} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white overflow-hidden">
                                                    {student?.avatarUrl ? <img src={student.avatarUrl} className="w-full h-full object-cover"/> : (student?.name?.charAt(0) || student?.email.charAt(0) || '?')}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{student?.name || student?.email || 'Neznámý'}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase">{student?.role} • Lvl {student?.level}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!isApproved ? (
                                                    <button 
                                                        onClick={() => onApproveRegistration(managingRegistrations.id, uid)}
                                                        className="p-2 bg-green-900/20 text-green-500 hover:bg-green-600 hover:text-white rounded-lg transition border border-green-900/30"
                                                        title="Schválit"
                                                    >
                                                        <Check size={16}/>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-green-500 bg-green-900/10 px-2 py-1 rounded border border-green-900/20 flex items-center gap-1">
                                                        <Check size={10}/> SCHVÁLENO
                                                    </span>
                                                )}
                                                <button 
                                                    onClick={() => onRejectRegistration(managingRegistrations.id, uid)}
                                                    className="p-2 bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition border border-red-900/30"
                                                    title="Odmítnout / Smazat"
                                                >
                                                    <XCircle size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>

        {/* MODAL: Edit Event */}
        <AnimatePresence>
            {editingEvent && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-2xl rounded-3xl border border-gray-800 shadow-2xl p-8 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                            <h3 className="text-xl font-bold text-white">Editor Události</h3>
                            <button onClick={() => setEditingEvent(null)}><X className="text-gray-500 hover:text-white"/></button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="label">Název Akce</label>
                                    <input value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="input text-lg font-bold"/>
                                </div>
                                <div className="col-span-2">
                                    <label className="label">Popis</label>
                                    <textarea value={editingEvent.description} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="input h-24"/>
                                </div>
                                <div>
                                    <label className="label">Datum a Čas</label>
                                    <input type="datetime-local" value={editingEvent.date.substring(0, 16)} onChange={e => setEditingEvent({...editingEvent, date: new Date(e.target.value).toISOString()})} className="input"/>
                                </div>
                                <div>
                                    <label className="label">Typ</label>
                                    <select value={editingEvent.type} onChange={e => setEditingEvent({...editingEvent, type: e.target.value as any})} className="input">
                                        <option value="webinar">Webinář (Online)</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="meetup">Meetup (Offline)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Odkaz pro vstup (Zoom/Místo)</label>
                                    <input value={editingEvent.link || ''} onChange={e => setEditingEvent({...editingEvent, link: e.target.value})} className="input" placeholder="https://zoom.us/..."/>
                                    <p className="text-[10px] text-gray-500 mt-1">Zobrazí se pouze schváleným účastníkům.</p>
                                </div>
                                <div>
                                    <label className="label">Kapacita</label>
                                    <input type="number" value={editingEvent.maxAttendees || 50} onChange={e => setEditingEvent({...editingEvent, maxAttendees: parseInt(e.target.value)})} className="input"/>
                                </div>
                                <div>
                                    <label className="label">XP Odměna za účast</label>
                                    <input type="number" value={editingEvent.xpReward || 0} onChange={e => setEditingEvent({...editingEvent, xpReward: parseInt(e.target.value)})} className="input"/>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><DollarSign size={18}/> Ceny a Externí Registrace</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Cena pro Basic (Kč)</label>
                                        <input type="number" value={editingEvent.price || 0} onChange={e => setEditingEvent({...editingEvent, price: parseInt(e.target.value)})} className="input font-mono"/>
                                        <p className="text-[10px] text-gray-500 mt-1">0 = Zdarma pro všechny</p>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-900 p-2 rounded border border-gray-800">
                                            <input type="checkbox" checked={editingEvent.isFreeForPremium} onChange={e => setEditingEvent({...editingEvent, isFreeForPremium: e.target.checked})} className="accent-blue-500"/>
                                            <span className="text-sm font-bold text-purple-400">Zdarma pro Premium</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer bg-gray-900 p-2 rounded border border-gray-800">
                                            <input type="checkbox" checked={editingEvent.isFreeForVip} onChange={e => setEditingEvent({...editingEvent, isFreeForVip: e.target.checked})} className="accent-blue-500"/>
                                            <span className="text-sm font-bold text-yellow-500">Zdarma pro VIP</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="label flex items-center gap-2"><ShoppingCart size={14} className="text-blue-400"/> Externí odkaz pro Nákup Vstupenky</label>
                                        <input value={editingEvent.registrationLink || ''} onChange={e => setEditingEvent({...editingEvent, registrationLink: e.target.value})} className="input text-xs" placeholder="https://vstupenky.cz/..."/>
                                        <p className="text-[10px] text-gray-500 mt-1">Pokud je vyplněn, tlačítko 'Koupit vstupenku' povede sem.</p>
                                    </div>
                                    <div>
                                        <label className="label flex items-center gap-2"><TicketIcon size={14} className="text-green-400"/> Externí odkaz pro Registraci Zdarma</label>
                                        <input value={editingEvent.freeRegistrationLink || ''} onChange={e => setEditingEvent({...editingEvent, freeRegistrationLink: e.target.value})} className="input text-xs" placeholder="https://registrace.cz/zdarma/..."/>
                                        <p className="text-[10px] text-gray-500 mt-1">Pokud je vyplněn, tlačítko 'Registrovat zdarma' povede sem (pro VIP/Premium).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-800 mt-auto">
                            <button onClick={() => setEditingEvent(null)} className="px-4 py-2 text-gray-400 hover:text-white font-bold">Zrušit</button>
                            <button onClick={handleSaveEvent} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold shadow-lg">Uložit Akci</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminCalendar;
