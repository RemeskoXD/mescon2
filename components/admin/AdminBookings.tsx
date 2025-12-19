import React, { useState } from 'react';
import { CalendarCheck, Check, X, Clock, MessageSquare, Star, Search, Filter, MoreHorizontal, User, FileText, Video } from 'lucide-react';
import { Booking, Mentor } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminBookingsProps {
  bookings: Booking[];
  mentors: Mentor[];
  onUpdateBooking: (booking: Booking) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings, mentors, onUpdateBooking, notify }) => {
  const [filter, setFilter] = useState('all'); 
  const [search, setSearch] = useState('');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const getMentorName = (id: string) => mentors.find(m => m.id === id)?.name || 'Neznámý mentor';

  const filteredBookings = bookings.filter(b => {
      const matchesSearch = b.userEmail.toLowerCase().includes(search.toLowerCase()) || (b.note && b.note.toLowerCase().includes(search.toLowerCase()));
      const isPast = new Date(b.date) < new Date();
      
      if (filter === 'past') return matchesSearch && isPast;
      if (filter === 'pending') return matchesSearch && b.status === 'pending' && !isPast;
      if (filter === 'approved') return matchesSearch && b.status === 'approved' && !isPast;
      return matchesSearch;
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusChange = (status: 'approved' | 'rejected') => {
      if(!editingBooking) return;
      const updated = { ...editingBooking, status };
      onUpdateBooking(updated);
      setEditingBooking(null);
  };

  const handleSaveNote = () => {
      if(!editingBooking) return;
      onUpdateBooking(editingBooking);
      setEditingBooking(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Rezervace Mentoringu</h2>
                <p className="text-gray-400 text-sm">Správa požadavků a historie konzultací.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Email, poznámka..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    />
                </div>
                <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="all">Všechny</option>
                    <option value="pending">Čekající</option>
                    <option value="approved">Schválené</option>
                    <option value="past">Proběhlé / Historie</option>
                </select>
            </div>
        </div>

        <div className="bg-[#0B0F19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-900/80 text-xs uppercase font-bold tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4 min-w-[150px]">Datum & Čas</th>
                            <th className="p-4 min-w-[150px]">Student</th>
                            <th className="p-4 min-w-[150px]">Mentor</th>
                            <th className="p-4 min-w-[120px]">Status</th>
                            <th className="p-4 min-w-[200px]">Poznámka</th>
                            <th className="p-4 text-right">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredBookings.map(booking => {
                            const isPast = new Date(booking.date) < new Date();
                            return (
                                <tr key={booking.id} className={`hover:bg-gray-800/30 transition ${isPast ? 'opacity-60' : ''}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-white font-mono">
                                            <Clock size={14} className="text-blue-500 shrink-0"/>
                                            <span className="whitespace-nowrap">
                                                {new Date(booking.date).toLocaleDateString('cs-CZ')} {new Date(booking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        {isPast && <span className="text-[10px] text-gray-500 uppercase font-bold">Proběhlo</span>}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="shrink-0"/> {booking.userEmail}
                                        </div>
                                    </td>
                                    <td className="p-4 text-white font-medium">{getMentorName(booking.mentorId)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                            booking.status === 'approved' ? 'bg-green-900/20 text-green-400 border-green-900/30' : 
                                            booking.status === 'rejected' ? 'bg-red-900/20 text-red-400 border-red-900/30' : 
                                            'bg-yellow-900/20 text-yellow-400 border-yellow-900/30'
                                        }`}>
                                            {booking.status === 'pending' ? 'Čeká na schválení' : booking.status === 'approved' ? 'Schváleno' : 'Zamítnuto'}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-xs truncate text-xs" title={booking.note}>
                                        {booking.note}
                                        {booking.adminNote && <div className="text-blue-400 mt-1 flex items-center gap-1"><FileText size={10}/> Poznámka admina</div>}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setEditingBooking(booking)} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition">
                                            <MoreHorizontal size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {filteredBookings.length === 0 && <div className="p-8 text-center text-gray-500">Žádné rezervace v této kategorii.</div>}
        </div>

        <AnimatePresence>
            {editingBooking && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                            <h3 className="text-xl font-bold text-white">Detail Rezervace</h3>
                            <button onClick={() => setEditingBooking(null)}><X className="text-gray-500 hover:text-white"/></button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Student</span> <span className="text-white font-bold">{editingBooking.userEmail}</span></div>
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Mentor</span> <span className="text-white font-bold">{getMentorName(editingBooking.mentorId)}</span></div>
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Datum</span> <span className="text-white font-mono">{new Date(editingBooking.date).toLocaleString()}</span></div>
                                <div><span className="text-gray-500 block text-xs uppercase mb-1">Status</span> <span className="text-white capitalize">{editingBooking.status}</span></div>
                            </div>

                            <div>
                                <label className="label">Poznámka studenta</label>
                                <div className="p-3 bg-black/50 border border-gray-800 rounded-lg text-sm text-gray-300 italic">
                                    "{editingBooking.note}"
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <label className="label flex items-center gap-2"><Video size={14} className="text-purple-400"/> Odkaz na meeting (Google Meet/Zoom)</label>
                                <input 
                                    type="text"
                                    value={editingBooking.meetingLink || ''} 
                                    onChange={e => setEditingBooking({...editingBooking, meetingLink: e.target.value})} 
                                    className="input text-sm" 
                                    placeholder="https://meet.google.com/..."
                                />
                            </div>

                            <div>
                                <label className="label flex items-center gap-2"><FileText size={14} className="text-blue-400"/> Interní poznámka (Admin/Mentor)</label>
                                <textarea 
                                    value={editingBooking.adminNote || ''} 
                                    onChange={e => setEditingBooking({...editingBooking, adminNote: e.target.value})} 
                                    className="input h-24 text-sm" 
                                    placeholder="Soukromá poznámka k průběhu, hodnocení studenta..."
                                />
                            </div>

                            <div>
                                <label className="label flex items-center gap-2"><Star size={14} className="text-yellow-500"/> Hodnocení studenta (1-5)</label>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map(star => (
                                        <button 
                                            key={star} 
                                            onClick={() => setEditingBooking({...editingBooking, rating: star})}
                                            className={`p-2 rounded-lg border transition ${editingBooking.rating === star ? 'bg-yellow-900/30 border-yellow-500 text-yellow-500' : 'bg-gray-900 border-gray-800 text-gray-600 hover:text-white'}`}
                                        >
                                            {star}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                            <div className="flex gap-2">
                                {editingBooking.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusChange('approved')} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm flex items-center gap-2"><Check size={14}/> Schválit</button>
                                        <button onClick={() => handleStatusChange('rejected')} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm flex items-center gap-2"><X size={14}/> Zamítnout</button>
                                    </>
                                )}
                            </div>
                            <button onClick={handleSaveNote} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold shadow-lg">Uložit Změny</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminBookings;