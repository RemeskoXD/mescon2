import React, { useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, Search, Clock, Send, User, AlertCircle, Trash2 } from 'lucide-react';
import { SupportTicket } from '../../types';
import { motion } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface AdminSupportProps {
  tickets: SupportTicket[];
  onReplyTicket: (id: string, message: string) => void;
  onCloseTicket: (id: string) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminSupport: React.FC<AdminSupportProps> = ({ tickets, onReplyTicket, onCloseTicket, notify }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('open'); // open, closed, all

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const filteredTickets = tickets.filter(t => {
      if (filter === 'open') return t.status === 'open' || t.status === 'pending';
      if (filter === 'closed') return t.status === 'closed';
      return true;
  }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSend = () => {
      if(!selectedTicketId || !replyText.trim()) return;
      onReplyTicket(selectedTicketId, replyText); // Calls Firestore handler in App.tsx
      setReplyText('');
      notify('success', 'Odesláno', 'Odpověď uložena do databáze.');
  };

  const handleClose = () => {
      if(!selectedTicketId) return;
      onCloseTicket(selectedTicketId); // Calls Firestore handler
      notify('success', 'Uzavřeno', 'Ticket označen jako vyřešený.');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
        {/* Ticket List */}
        <div className="w-1/3 bg-[#0B0F19] border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gray-900/50">
                <h2 className="font-bold text-white mb-4">Support Desk</h2>
                <div className="flex gap-2 mb-2">
                    <button onClick={() => setFilter('open')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${filter === 'open' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}>Otevřené</button>
                    <button onClick={() => setFilter('closed')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${filter === 'closed' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}>Vyřešené</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {filteredTickets.length === 0 && <div className="text-center p-8 text-gray-500 text-xs">Žádné tickety.</div>}
                {filteredTickets.map(ticket => (
                    <div 
                        key={ticket.id} 
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`p-4 rounded-xl cursor-pointer border transition ${selectedTicketId === ticket.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-900/30 border-gray-800 hover:bg-gray-800'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ticket.priority === 'high' ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{ticket.priority}</span>
                            <span className="text-[10px] text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className={`font-bold text-sm mb-1 truncate ${ticket.status === 'closed' ? 'text-gray-500 line-through' : 'text-white'}`}>{ticket.subject}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User size={12}/> {ticket.userEmail}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Ticket Detail / Chat */}
        <div className="flex-1 bg-[#0B0F19] border border-gray-800 rounded-2xl flex flex-col overflow-hidden relative">
            {selectedTicket ? (
                <>
                    <div className="h-16 border-b border-gray-800 bg-gray-900/50 px-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2">
                                {selectedTicket.subject}
                                {selectedTicket.status === 'closed' && <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/30">VYŘEŠENO</span>}
                            </h3>
                            <p className="text-xs text-gray-500">Uživatel: {selectedTicket.userEmail}</p>
                        </div>
                        {selectedTicket.status !== 'closed' && (
                            <button onClick={handleClose} className="px-4 py-2 bg-gray-800 hover:bg-green-600 hover:text-white text-gray-400 rounded-lg text-xs font-bold transition flex items-center gap-2">
                                <CheckCircle size={14}/> Vyřešit
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                        {selectedTicket.messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'support' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-300 rounded-bl-none'}`}>
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'support' ? 'text-right' : 'text-left'}`}>
                                        {msg.sender === 'support' ? 'Support Team' : selectedTicket.userEmail} • {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedTicket.status !== 'closed' ? (
                        <div className="p-4 bg-gray-900 border-t border-gray-800">
                            <div className="relative">
                                <textarea 
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                    className="w-full bg-black border border-gray-700 rounded-xl p-4 pr-12 text-sm text-white focus:border-blue-500 outline-none resize-none h-24"
                                    placeholder="Napište odpověď uživateli..."
                                />
                                <button onClick={handleSend} className="absolute bottom-4 right-4 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition">
                                    <Send size={18}/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-900 border-t border-gray-800 text-center text-sm text-gray-500">
                            Tento ticket je uzavřen.
                        </div>
                    )}
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <MessageSquare size={48} className="mb-4 opacity-20"/>
                    <p>Vyberte ticket ze seznamu.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AdminSupport;