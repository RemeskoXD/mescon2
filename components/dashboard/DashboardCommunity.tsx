import React, { useState, useEffect, useRef } from 'react';
import { Hash, Trophy, Megaphone, MessageCircle, Send, Users, Search, Briefcase, User as UserIcon, MessageSquare, Zap, DollarSign, Code, AlertTriangle, Lock, Ban, Shield, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { User, Message, Channel } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardCommunityProps {
    user: User;
    messages: Message[];
    onSend: (msg: Message) => void;
    onEdit?: (msgId: string, newContent: string) => void; // New prop for editing
    onViewUser?: (userId: string) => void;
    allUsers?: User[]; 
    initialChatUserId?: string | null;
    channels?: Channel[]; 
    notify?: any;
}

const DashboardCommunity: React.FC<DashboardCommunityProps> = ({ user, messages, onSend, onEdit, onViewUser, allUsers = [], initialChatUserId, channels = [], notify }) => {
    // view state: 'chat' | 'directory'
    const [view, setView] = useState<'chat' | 'directory'>('chat');
    // mobileView: 'list' (channel list) | 'room' (actual chat/directory content)
    const [mobileView, setMobileView] = useState<'list' | 'room'>('list');
    
    const [activeChannelId, setActiveChannelId] = useState('general'); 
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    
    // Edit State
    const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mute/Ban Check
    const isBanned = user.isBanned;
    const isMuted = user.mutedUntil && new Date(user.mutedUntil) > new Date();
    const restrictionActive = isBanned || isMuted;

    useEffect(() => {
        if (restrictionActive) {
            setShowRestrictionModal(true);
        }
    }, [restrictionActive]);

    // If initialChatUserId provided, switch to chat with that user
    useEffect(() => {
        if (initialChatUserId) {
            setView('chat');
            setActiveChannelId(initialChatUserId);
            setMobileView('room');
        }
    }, [initialChatUserId]);

    // Fallback channels if none passed
    const defaultChannels = [
        { id: 'general', name: 'Obecný chat', icon: 'hash' },
        { id: 'wins', name: 'Výhry a Úspěchy', icon: 'trophy' },
        { id: 'marketing', name: 'Marketing', icon: 'megaphone' },
        { id: 'offtopic', name: 'Off-topic', icon: 'message' }
    ];
    
    const activeChannelsList = channels.length > 0 ? channels : defaultChannels;

    const getIcon = (iconName: string) => {
        switch(iconName) {
            case 'trophy': return <Trophy size={16}/>;
            case 'megaphone': return <Megaphone size={16}/>;
            case 'message': return <MessageCircle size={16}/>;
            case 'zap': return <Zap size={16}/>;
            case 'dollar': return <DollarSign size={16}/>;
            case 'code': return <Code size={16}/>;
            default: return <Hash size={16}/>;
        }
    };

    // Find users we have a conversation with
    const dmUserIds = Array.from(new Set(
        messages
            .filter(m => (m.senderId === user.id && m.recipientId) || (m.recipientId === user.id))
            .map(m => m.senderId === user.id ? m.recipientId! : m.senderId)
    ));

    if (activeChannelId !== 'general' && !activeChannelsList.find((c: any) => c.id === activeChannelId) && !dmUserIds.includes(activeChannelId)) {
        dmUserIds.unshift(activeChannelId);
    }

    const dmUsers = dmUserIds.map(uid => allUsers.find(u => u.id === uid)).filter(Boolean) as User[];

    // Filter logic
    const isDM = !activeChannelsList.find((c: any) => c.id === activeChannelId);
    
    const filteredMessages = messages.filter(m => {
        if (isDM) {
            return (m.senderId === user.id && m.recipientId === activeChannelId) || 
                   (m.senderId === activeChannelId && m.recipientId === user.id);
        } else {
            return m.channelId === activeChannelId && !m.recipientId;
        }
    });

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [filteredMessages, view, activeChannelId, mobileView]);

    const handleSend = () => {
        if (restrictionActive) return; // Prevent send if restricted
        if (!inputText.trim()) return;

        const msg: Message = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name || user.email,
            content: inputText,
            timestamp: new Date().toISOString(),
            type: 'text',
            likes: []
        };

        if (user.avatarUrl) {
            msg.senderAvatar = user.avatarUrl;
        }

        if (isDM) {
            msg.recipientId = activeChannelId;
        } else {
            msg.channelId = activeChannelId; 
        }

        onSend(msg);
        setInputText('');
    };

    const handleStartChat = (targetUserId: string) => {
        setActiveChannelId(targetUserId);
        setView('chat');
        setMobileView('room');
    };

    const handleChannelSelect = (id: string) => {
        setActiveChannelId(id);
        setMobileView('room');
    };

    const handleStartEdit = (msg: Message) => {
        setEditingMsgId(msg.id);
        setEditText(msg.content);
    };

    const handleCancelEdit = () => {
        setEditingMsgId(null);
        setEditText('');
    };

    const handleSubmitEdit = () => {
        if (!onEdit || !editingMsgId || !editText.trim()) return;
        onEdit(editingMsgId, editText);
        setEditingMsgId(null);
        setEditText('');
    };

    const directoryUsers = allUsers.filter(u => {
        if (!u.isPublicProfile && u.id !== user.id && user.role !== 'admin') return false; 
        const matchesSearch = 
            (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.skills && u.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesSearch;
    });

    const activeChatUser = isDM ? allUsers.find(u => u.id === activeChannelId) : null;
    const currentChannelInfo = activeChannelsList.find((c: any) => c.id === activeChannelId);

    return (
        <div className="flex h-[calc(100vh-140px)] bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden animate-fade-in flex-col md:flex-row relative">
            
            {/* RESTRICTION MODAL */}
            <AnimatePresence>
                {showRestrictionModal && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-[#0F0505] border border-red-900 rounded-2xl p-8 max-w-md text-center shadow-2xl">
                            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
                                {isBanned ? <Ban size={32} className="text-red-500"/> : <Lock size={32} className="text-yellow-500"/>}
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">{isBanned ? 'ÚČET ZABLOKOVÁN' : 'ZTLUMEN (MUTE)'}</h2>
                            <p className="text-gray-400 mb-6">
                                {isBanned 
                                    ? 'Váš účet byl zablokován administrátorem. Nemůžete přispívat do komunity.' 
                                    : `Byli jste dočasně ztlumeni. Nemůžete psát zprávy do ${new Date(user.mutedUntil!).toLocaleString()}.`
                                }
                            </p>
                            <button 
                                onClick={() => setShowRestrictionModal(false)}
                                className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded-xl transition"
                            >
                                Rozumím
                            </button>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>

            {/* Sidebar Navigation - Visible on Desktop OR if mobileView is 'list' */}
            <div className={`
                w-full md:w-64 bg-gray-900 border-r border-gray-800 flex-col flex-shrink-0
                ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}
            `}>
                <div className="p-4 border-b border-gray-800">
                    <div className="flex bg-black/40 p-1 rounded-lg">
                        <button 
                            onClick={() => setView('chat')} 
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-2 ${view === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <MessageCircle size={14}/> Chat
                        </button>
                        <button 
                            onClick={() => setView('directory')} 
                            className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-2 ${view === 'directory' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Users size={14}/> Lidé
                        </button>
                    </div>
                </div>

                {view === 'chat' ? (
                    <div className="p-2 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                        <div>
                            <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Veřejné Kanály</div>
                            <div className="space-y-1">
                                {activeChannelsList.map((c: any) => (
                                    <button 
                                        key={c.id} 
                                        onClick={() => handleChannelSelect(c.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeChannelId === c.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                                    >
                                        {getIcon(c.icon)} {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                                <span>Soukromé Zprávy</span>
                                <span className="bg-gray-800 px-1.5 py-0.5 rounded text-white">{dmUsers.length}</span>
                            </div>
                            <div className="space-y-1">
                                {dmUsers.length === 0 && <div className="px-3 text-xs text-gray-600 italic">Zatím žádné zprávy.</div>}
                                {dmUsers.map(u => (
                                    <button 
                                        key={u.id} 
                                        onClick={() => handleChannelSelect(u.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeChannelId === u.id ? 'bg-blue-900/20 text-white border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                            {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{u.name?.charAt(0)}</div>}
                                        </div>
                                        <span className="truncate">{u.name || 'Uživatel'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14}/>
                            <input 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-blue-500"
                                placeholder="Hledat člena nebo skill..."
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Nalezeno: {directoryUsers.length} členů
                        </p>
                    </div>
                )}
            </div>

            {/* Main Content Area - Visible on Desktop OR if mobileView is 'room' */}
            <div className={`
                flex-1 flex-col overflow-hidden bg-[#0B0F19]
                ${mobileView === 'room' ? 'flex' : 'hidden md:flex'}
            `}>
                
                {view === 'chat' && (
                    <>
                        <div className="h-14 border-b border-gray-800 flex items-center px-4 md:px-6 font-bold text-white bg-gray-900/50 backdrop-blur-md justify-between">
                            <div className="flex items-center gap-2">
                                {/* Mobile Back Button */}
                                <button 
                                    onClick={() => setMobileView('list')}
                                    className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                                >
                                    <ArrowLeft size={20}/>
                                </button>

                                {isDM && activeChatUser ? (
                                    <>
                                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                            {activeChatUser.avatarUrl ? <img src={activeChatUser.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs">{activeChatUser.name?.charAt(0)}</div>}
                                        </div>
                                        <span className="truncate max-w-[150px]">{activeChatUser.name}</span>
                                        <span className="text-xs font-normal text-gray-500 ml-2 hidden sm:inline">{activeChatUser.role}</span>
                                    </>
                                ) : (
                                    <>{getIcon((currentChannelInfo as any)?.icon || 'hash')} {(currentChannelInfo as any)?.name || 'Neznámý kanál'}</>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                            {filteredMessages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <MessageSquare size={48} className="mb-4 opacity-20"/>
                                    <p>{isDM ? 'Začněte konverzaci!' : 'Zatím žádné zprávy v tomto kanálu.'}</p>
                                </div>
                            )}
                            {filteredMessages.map((msg, idx) => {
                                const isMe = msg.senderId === user.id;
                                const senderUser = allUsers.find(u => u.id === msg.senderId);
                                const isAdmin = senderUser?.role === 'admin';
                                const isVip = senderUser?.role === 'vip';
                                const isEditable = isMe && (Date.now() - new Date(msg.timestamp).getTime() < 5 * 60 * 1000); // 5 mins

                                return (
                                    <div key={msg.id} className={`flex gap-3 md:gap-4 group ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <div 
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden border cursor-pointer hover:border-blue-500 transition ${isAdmin ? 'border-red-500' : isVip ? 'border-yellow-500' : 'border-gray-700'}`}
                                            onClick={() => onViewUser && onViewUser(msg.senderId)}
                                        >
                                            {msg.senderAvatar ? <img src={msg.senderAvatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{msg.senderName.charAt(0)}</div>}
                                        </div>
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span 
                                                    className={`font-bold text-xs md:text-sm cursor-pointer hover:underline flex items-center gap-1 ${isAdmin ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : isVip ? 'text-yellow-500' : 'text-white'}`}
                                                    onClick={() => onViewUser && onViewUser(msg.senderId)}
                                                >
                                                    {msg.senderName}
                                                    {isAdmin && <Shield size={10} fill="currentColor"/>}
                                                </span>
                                                <span className="text-[10px] text-gray-500">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                
                                                {/* EDIT BUTTON */}
                                                {isEditable && editingMsgId !== msg.id && (
                                                    <button 
                                                        onClick={() => handleStartEdit(msg)} 
                                                        className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition p-1"
                                                        title="Upravit (do 5 minut)"
                                                    >
                                                        <Edit2 size={10}/>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Message Content or Edit Input */}
                                            {editingMsgId === msg.id ? (
                                                <div className="flex gap-2 items-center w-full">
                                                    <input 
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitEdit()}
                                                        className="flex-1 bg-black border border-blue-500 rounded px-2 py-1 text-sm text-white"
                                                        autoFocus
                                                    />
                                                    <button onClick={handleSubmitEdit} className="text-green-500 hover:text-white"><Check size={16}/></button>
                                                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-white"><X size={16}/></button>
                                                </div>
                                            ) : (
                                                <div className={`px-3 py-2 md:px-4 md:py-2 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : (isAdmin ? 'bg-red-900/20 border border-red-900/50 text-red-100 rounded-tl-none' : 'bg-gray-800 text-gray-300 rounded-tl-none')}`}>
                                                    {msg.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-gray-900 border-t border-gray-800">
                            {restrictionActive ? (
                                <div className="flex items-center justify-center gap-2 p-3 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
                                    <Lock size={16}/>
                                    <span className="text-sm font-bold">Nemůžete psát zprávy (Mute/Ban)</span>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-blue-500"
                                        placeholder={isDM ? `Napsat...` : `Napsat do #${(currentChannelInfo as any)?.name || 'chat'}...`}
                                        disabled={restrictionActive}
                                    />
                                    <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-white transition disabled:opacity-50">
                                        <Send size={18}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {view === 'directory' && (
                    <>
                        {/* Mobile Back Button for Directory View - Logic slightly different if directory is main view on mobile */}
                        <div className="md:hidden p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-2">
                             <button onClick={() => setMobileView('list')} className="text-gray-400 hover:text-white"><ArrowLeft size={20}/></button>
                             <span className="font-bold text-white">Adresář členů</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {directoryUsers.map(member => (
                                    <MotionDiv 
                                        key={member.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => onViewUser && onViewUser(member.id)}
                                        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/30 transition cursor-pointer group flex flex-col h-full"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-14 h-14 rounded-full bg-gray-800 border-2 overflow-hidden flex-shrink-0 ${member.role === 'admin' ? 'border-red-500' : member.role === 'vip' ? 'border-yellow-500' : 'border-gray-700'}`}>
                                                {member.avatarUrl ? <img src={member.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xl">{member.name?.charAt(0)}</div>}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold transition flex items-center gap-1 ${member.role === 'admin' ? 'text-red-500' : 'text-white group-hover:text-blue-400'}`}>
                                                    {member.name || 'Anonym'}
                                                    {member.role === 'admin' && <Shield size={14} fill="currentColor"/>}
                                                </h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    member.role === 'vip' ? 'bg-yellow-900/30 text-yellow-500' : 
                                                    member.role === 'premium' ? 'bg-purple-900/30 text-purple-500' : 
                                                    member.role === 'admin' ? 'bg-red-900/30 text-red-500' : 
                                                    'bg-blue-900/30 text-blue-500'
                                                }`}>{member.role}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            {member.skills && member.skills.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Dovednosti</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {member.skills.slice(0, 4).map(skill => (
                                                            <span key={skill} className="px-2 py-1 bg-green-900/10 text-green-400 border border-green-900/30 rounded text-[10px] font-medium">{skill}</span>
                                                        ))}
                                                        {member.skills.length > 4 && <span className="text-[10px] text-gray-500">+{member.skills.length - 4}</span>}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {member.interests && member.interests.length > 0 && (
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Hledá</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {member.interests.slice(0, 2).map(int => (
                                                            <span key={int} className="px-2 py-1 bg-blue-900/10 text-blue-400 border border-blue-900/30 rounded text-[10px] font-medium">{int}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {!member.skills?.length && !member.interests?.length && (
                                                <p className="text-xs text-gray-600 italic py-2">Uživatel zatím nevyplnil profil.</p>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleStartChat(member.id); }}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1 transition"
                                            >
                                                <MessageCircle size={12}/> Zpráva
                                            </button>
                                            <button className="text-gray-400 hover:text-white transition">Zobrazit Profil &rarr;</button>
                                        </div>
                                    </MotionDiv>
                                ))}
                            </div>
                            {directoryUsers.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                    <Users size={48} className="mb-4 opacity-20"/>
                                    <p>Nikdo nenalezen. Zkuste změnit filtry.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardCommunity;