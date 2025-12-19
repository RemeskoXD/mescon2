import React, { useState } from 'react';
import { MessageSquare, Plus, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { SupportTicket, User } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardSupportProps {
    tickets: SupportTicket[];
    user: User;
    onCreateTicket: (subject: string) => void;
    onReplyTicket: (ticketId: string, message: string) => void;
    notify: any;
}

const DashboardSupport: React.FC<DashboardSupportProps> = ({ tickets, user, onCreateTicket, onReplyTicket, notify }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const myTickets = tickets.filter(t => t.userId === user.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const selectedTicket = myTickets.find(t => t.id === selectedTicketId);

    const handleCreate = () => {
        if(!newSubject.trim()) return notify('error', 'Chyba', 'Předmět je povinný.');
        onCreateTicket(newSubject);
        setNewSubject('');
        setIsCreateOpen(false);
    };

    const handleReply = () => {
        if(!selectedTicketId || !replyText.trim()) return;
        onReplyTicket(selectedTicketId, replyText);
        setReplyText('');
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
            {/* TICKET LIST */}
            <div className={`w-full md:w-1/3 bg-[#0B0F19] border border-gray-800 rounded-2xl flex flex-col overflow-hidden ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                    <h2 className="font-bold text-white">Moje Tickety</h2>
                    <button onClick={() => setIsCreateOpen(true)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"><Plus size={18}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {myTickets.length === 0 && (
                        <div className="text-center p-8 text-gray-500 text-xs">
                            Nemáte žádné otevřené tickety. <br/> Potřebujete pomoci?
                        </div>
                    )}
                    {myTickets.map(ticket => (
                        <div 
                            key={ticket.id}
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className={`p-4 rounded-xl cursor-pointer border transition ${selectedTicketId === ticket.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-900/30 border-gray-800 hover:bg-gray-800'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                    ticket.status === 'open' ? 'bg-green-900/30 text-green-400' :
                                    ticket.status === 'closed' ? 'bg-gray-800 text-gray-500' : 'bg-yellow-900/30 text-yellow-400'
                                }`}>{ticket.status}</span>
                                <span className="text-[10px] text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-bold text-sm text-white mb-1 truncate">{ticket.subject}</h4>
                            <p className="text-xs text-gray-500 truncate">
                                {ticket.messages[ticket.messages.length - 1]?.text || 'Bez zpráv'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAIL / CHAT */}
            <div className={`flex-1 bg-[#0B0F19] border border-gray-800 rounded-2xl flex flex-col overflow-hidden relative ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                {selectedTicket ? (
                    <>
                        <div className="h-16 border-b border-gray-800 bg-gray-900/50 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedTicketId(null)} className="md:hidden text-gray-400 hover:text-white mr-2">Zpět</button>
                                <div>
                                    <h3 className="font-bold text-white">{selectedTicket.subject}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        ID: {selectedTicket.id} 
                                        {selectedTicket.status === 'closed' && <span className="flex items-center gap-1 text-green-500 ml-2"><CheckCircle size={10}/> Vyřešeno</span>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20 flex flex-col-reverse">
                            {/* Reverse mapping for chat feeling (newest at bottom visually, but messages stored chronologically) */}
                            {[...selectedTicket.messages].reverse().map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-300 rounded-bl-none'}`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                        <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.sender === 'user' ? 'Já' : 'Podpora'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="text-center text-xs text-gray-600 my-4">Začátek konverzace</div>
                        </div>

                        {selectedTicket.status !== 'closed' ? (
                            <div className="p-4 bg-gray-900 border-t border-gray-800">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleReply()}
                                        className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:border-blue-500 outline-none"
                                        placeholder="Napište zprávu..."
                                    />
                                    <button onClick={handleReply} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-white transition">
                                        <Send size={18}/>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-900 border-t border-gray-800 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                                <AlertCircle size={16}/> Ticket je uzavřen. Pro další dotazy vytvořte nový.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare size={48} className="mb-4 opacity-20"/>
                        <p>Vyberte ticket pro zobrazení detailů.</p>
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {isCreateOpen && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Nový Požadavek</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase font-bold text-gray-500 mb-1 block">Předmět / Problém</label>
                                    <input 
                                        value={newSubject}
                                        onChange={e => setNewSubject(e.target.value)}
                                        placeholder="Např. Problém s platbou..."
                                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-gray-400">
                                    Popište svůj problém stručně. Detailní popis můžete přidat do chatu po vytvoření ticketu.
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-gray-400 font-bold hover:text-white transition">Zrušit</button>
                                <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition">Vytvořit</button>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardSupport;