import React, { useState } from 'react';
import { Users, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star, Loader2, ExternalLink, Video } from 'lucide-react';
import { Mentor, Booking, User } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardMentoringProps {
    mentors: Mentor[];
    bookings: Booking[];
    user: User;
    onBookMentor: (mentorId: string, date: string, note: string) => void;
    notify: any;
}

const DashboardMentoring: React.FC<DashboardMentoringProps> = ({ mentors, bookings, user, onBookMentor, notify }) => {
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingNote, setBookingNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const myBookings = bookings.filter(b => b.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const usedFreeSlots = myBookings.filter(b => {
        const d = new Date(b.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && b.status !== 'rejected';
    }).length;

    let freeLimit = 0;
    if (user.role === 'premium') freeLimit = 1;
    if (user.role === 'vip') freeLimit = 20;
    const remainingFree = Math.max(0, freeLimit - usedFreeSlots);

    const handleBook = async () => {
        if(!selectedMentor || !bookingDate || !bookingTime) {
            notify('error', 'Chyba', 'Vyplňte datum a čas.');
            return;
        }
        const dateObj = new Date(`${bookingDate}T${bookingTime}`);
        if(dateObj < new Date()) return notify('error', 'Chyba', 'Nelze rezervovat v minulosti.');
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onBookMentor(selectedMentor.id, dateObj.toISOString(), bookingNote);
        setIsSubmitting(false);
        setSelectedMentor(null);
        setBookingNote('');
        setBookingDate('');
        setBookingTime('');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">Mentoring 1:1</h2>
                    <p className="text-gray-400 text-sm">Rezervujte si konzultace s experty.</p>
                </div>
            </div>

            <div className="bg-[#0B0F19] border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-white text-sm">Měsíční limit</h4>
                    <p className="text-xs text-gray-500">Využito: {usedFreeSlots} / {freeLimit > 0 ? freeLimit : '∞'}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-bold ${remainingFree > 0 ? 'bg-green-900/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {remainingFree > 0 ? `${remainingFree}x ZDARMA` : 'Placené'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map(mentor => (
                    <div key={mentor.id} className={`bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition flex flex-col ${!mentor.isAvailable ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        <div className="h-48 bg-gray-900 relative overflow-hidden">
                            <img src={mentor.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                            {!mentor.isAvailable && <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"><span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xs">Obsazeno</span></div>}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-xl text-white">{mentor.name}</h3>
                            <p className="text-blue-400 text-xs font-bold uppercase mb-3">{mentor.role}</p>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">{mentor.bio}</p>
                            <button onClick={() => mentor.isAvailable && setSelectedMentor(mentor)} disabled={!mentor.isAvailable} className={`w-full py-3 rounded-xl font-bold text-sm transition ${mentor.isAvailable ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>Rezervovat</button>
                        </div>
                    </div>
                ))}
            </div>

            {myBookings.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-lg font-bold text-white mb-4">Moje Rezervace</h3>
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900/50 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4">Datum</th>
                                    <th className="p-4">Mentor</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {myBookings.map(booking => {
                                    const mentor = mentors.find(m => m.id === booking.mentorId);
                                    const isApproved = booking.status === 'approved';
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-800/30 transition">
                                            <td className="p-4 font-mono text-white whitespace-nowrap">
                                                {new Date(booking.date).toLocaleDateString()} {new Date(booking.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                            </td>
                                            <td className="p-4 font-bold">{mentor?.name || 'Neznámý'}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isApproved ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {isApproved && booking.meetingLink && (
                                                    <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition animate-pulse">
                                                        <Video size={14}/> Připojit se
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {selectedMentor && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-md rounded-3xl border border-gray-800 shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6">Rezervace s: {selectedMentor.name}</h3>
                            <div className="space-y-4">
                                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="input"/>
                                <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="input"/>
                                <textarea value={bookingNote} onChange={e => setBookingNote(e.target.value)} placeholder="Téma..." className="input h-24 resize-none"/>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setSelectedMentor(null)} className="flex-1 py-3 text-gray-400 font-bold hover:text-white transition">Zrušit</button>
                                <button onClick={handleBook} disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : 'Rezervovat'}
                                </button>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardMentoring;