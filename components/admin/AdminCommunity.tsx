import React, { useState } from 'react';
import { MessageCircle, Hash, Plus, Trash2, Megaphone, Trophy, Zap, DollarSign, Code, Save, X, Search, Filter, Ban, Hourglass, User as UserIcon, Users, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Channel, Message, User } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminCommunityProps {
    channels: Channel[];
    messages: Message[];
    allUsers: User[];
    onSaveChannel: (channel: Channel) => void;
    onDeleteChannel: (id: string) => void;
    onDeleteMessage: (msgId: string) => void;
    onMuteUser: (userId: string, duration: number | 'forever') => void;
    onUpdateUser: (user: User) => void;
    notify: (type: any, title: string, message: string) => void;
}

const AdminCommunity: React.FC<AdminCommunityProps> = ({ channels, messages, allUsers, onSaveChannel, onDeleteChannel, onDeleteMessage, onMuteUser, onUpdateUser, notify }) => {
    const [activeTab, setActiveTab] = useState<'channels' | 'moderation' | 'members'>('channels');
    const [newChannel, setNewChannel] = useState<Partial<Channel>>({ name: '', icon: 'hash', minRole: 'student' });
    const [msgSearch, setMsgSearch] = useState('');
    const [memberSearch, setMemberSearch] = useState('');

    const handleAddChannel = () => {
        if (!newChannel.name) return notify('error', 'Chyba', 'Název kanálu je povinný.');
        
        const channel: Channel = {
            id: newChannel.name.toLowerCase().replace(/\s+/g, '-'),
            name: newChannel.name,
            icon: newChannel.icon as any,
            minRole: newChannel.minRole as any,
            description: newChannel.description
        };

        if (channels.some(c => c.id === channel.id)) return notify('error', 'Chyba', 'Kanál s tímto ID již existuje.');

        onSaveChannel(channel);
        setNewChannel({ name: '', icon: 'hash', minRole: 'student' });
    };

    const handleDeleteChannel = (id: string) => {
        if (id === 'general') return notify('warning', 'Nelze smazat', 'Kanál General nelze smazat.');
        if (window.confirm('Opravdu smazat tento kanál?')) {
            onDeleteChannel(id);
        }
    };

    const filteredMessages = messages.filter(m => 
        m.content.toLowerCase().includes(msgSearch.toLowerCase()) || 
        m.senderName.toLowerCase().includes(msgSearch.toLowerCase())
    ).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const filteredMembers = allUsers.filter(u => 
        (u.name && u.name.toLowerCase().includes(memberSearch.toLowerCase())) ||
        (u.email.toLowerCase().includes(memberSearch.toLowerCase()))
    );

    const handleDeleteMsg = (id: string) => {
        if (window.confirm('Smazat tuto zprávu?')) {
            onDeleteMessage(id);
            notify('info', 'Smazáno', 'Zpráva byla odstraněna.');
        }
    };

    const handleQuickMute = (userId: string) => {
        if(window.confirm('Ztlumit uživatele na 24 hodin?')) {
            onMuteUser(userId, 24);
        }
    };

    const handleUnmute = (user: User) => {
        onUpdateUser({ ...user, mutedUntil: undefined });
        notify('success', 'Odblokováno', 'Uživatel může opět psát.');
    };

    const handleQuickBan = (userId: string) => {
        const user = allUsers.find(u => u.id === userId);
        if (user && window.confirm(`Opravdu ZABLOKOVAT uživatele ${user.name}?`)) {
            onUpdateUser({...user, isBanned: true});
            notify('success', 'Banned', 'Uživatel byl zablokován.');
        }
    };

    const handleUnban = (user: User) => {
        if (window.confirm(`Odblokovat uživatele ${user.name}?`)) {
            onUpdateUser({...user, isBanned: false});
            notify('success', 'Unbanned', 'Uživatel byl odblokován.');
        }
    };

    const getUserStatus = (u: User) => {
        if (u.isBanned) return { label: 'BANNED', color: 'text-red-500 bg-red-900/20 border-red-500/50', icon: <Ban size={12}/> };
        
        if (u.mutedUntil && new Date(u.mutedUntil) > new Date()) {
            return { label: 'MUTED', color: 'text-yellow-500 bg-yellow-900/20 border-yellow-500/50', icon: <Hourglass size={12}/> };
        }

        const lastLogin = new Date(u.lastLogin).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - lastLogin) / 1000 / 60;

        if (diffMinutes < 15) return { label: 'ONLINE', color: 'text-green-500 bg-green-900/20 border-green-500/50', icon: <Wifi size={12}/> };
        
        return { label: 'OFFLINE', color: 'text-gray-500 bg-gray-800 border-gray-700', icon: <WifiOff size={12}/> };
    };

    const renderIcon = (iconName: string) => {
        switch(iconName) {
            case 'trophy': return <Trophy size={18}/>;
            case 'megaphone': return <Megaphone size={18}/>;
            case 'message': return <MessageCircle size={18}/>;
            case 'zap': return <Zap size={18}/>;
            case 'dollar': return <DollarSign size={18}/>;
            case 'code': return <Code size={18}/>;
            default: return <Hash size={18}/>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Správa Komunity</h2>
                    <p className="text-gray-400 text-sm">Kanály, moderace chatu a správa členů.</p>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button onClick={() => setActiveTab('channels')} className={`px-4 py-2 text-xs font-bold uppercase rounded transition flex items-center gap-2 ${activeTab === 'channels' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                        <Hash size={14}/> Kanály
                    </button>
                    <button onClick={() => setActiveTab('members')} className={`px-4 py-2 text-xs font-bold uppercase rounded transition flex items-center gap-2 ${activeTab === 'members' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                        <Users size={14}/> Členové
                    </button>
                    <button onClick={() => setActiveTab('moderation')} className={`px-4 py-2 text-xs font-bold uppercase rounded transition flex items-center gap-2 ${activeTab === 'moderation' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                        <Filter size={14}/> Moderace Zpráv
                    </button>
                </div>
            </div>

            {/* --- TAB: CHANNELS --- */}
            {activeTab === 'channels' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Plus size={18}/> Přidat Kanál</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Název Kanálu</label>
                                <input 
                                    value={newChannel.name} 
                                    onChange={e => setNewChannel({...newChannel, name: e.target.value})} 
                                    className="input" 
                                    placeholder="Např. Krypto News"
                                />
                            </div>
                            <div>
                                <label className="label">Ikona</label>
                                <select value={newChannel.icon} onChange={e => setNewChannel({...newChannel, icon: e.target.value as any})} className="input">
                                    <option value="hash">Hash (#)</option>
                                    <option value="trophy">Trophy</option>
                                    <option value="megaphone">Megaphone</option>
                                    <option value="message">Message</option>
                                    <option value="zap">Zap</option>
                                    <option value="dollar">Dollar</option>
                                    <option value="code">Code</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Minimální Role</label>
                                <select value={newChannel.minRole} onChange={e => setNewChannel({...newChannel, minRole: e.target.value as any})} className="input">
                                    <option value="student">Student (Všichni)</option>
                                    <option value="premium">Premium</option>
                                    <option value="vip">VIP</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button onClick={handleAddChannel} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition shadow-lg shadow-blue-900/20">Vytvořit</button>
                        </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                        {channels.map(channel => (
                            <div key={channel.id} className="bg-[#0B0F19] border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:border-gray-700 transition">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-900 rounded-lg text-gray-400">
                                        {renderIcon(channel.icon)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">#{channel.id}</h4>
                                        <p className="text-gray-500 text-xs">{channel.name} • Min: {channel.minRole}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteChannel(channel.id)} 
                                    disabled={channel.id === 'general'}
                                    className={`p-2 rounded-lg transition ${channel.id === 'general' ? 'text-gray-700 cursor-not-allowed' : 'bg-gray-900 text-gray-500 hover:bg-red-900/20 hover:text-red-500'}`}
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- TAB: MEMBERS --- */}
            {activeTab === 'members' && (
                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                            <input 
                                value={memberSearch}
                                onChange={e => setMemberSearch(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                placeholder="Hledat uživatele..."
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900 text-xs uppercase font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="p-4">Uživatel</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Stav (Status)</th>
                                    <th className="p-4 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredMembers.map(user => {
                                    const status = getUserStatus(user);
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-800/30 transition">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-white overflow-hidden">
                                                        {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover"/> : user.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{user.name || 'Anonym'}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    user.role === 'admin' ? 'bg-red-900/30 text-red-400' :
                                                    user.role === 'vip' ? 'bg-yellow-900/30 text-yellow-400' :
                                                    user.role === 'premium' ? 'bg-purple-900/30 text-purple-400' :
                                                    'bg-blue-900/30 text-blue-400'
                                                }`}>{user.role}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}>
                                                    {status.icon} {status.label}
                                                </span>
                                                {status.label === 'MUTED' && user.mutedUntil && (
                                                    <div className="text-[10px] text-gray-500 mt-1">
                                                        Do: {new Date(user.mutedUntil).toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {status.label === 'MUTED' ? (
                                                        <button onClick={() => handleUnmute(user)} className="p-2 bg-green-900/20 hover:bg-green-900/40 text-green-500 rounded-lg transition" title="Zrušit Mute">
                                                            <CheckCircle size={14}/>
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleQuickMute(user.id)} className="p-2 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 rounded-lg transition" title="Ztlumit 24h">
                                                            <Hourglass size={14}/>
                                                        </button>
                                                    )}
                                                    
                                                    {user.isBanned ? (
                                                        <button onClick={() => handleUnban(user)} className="p-2 bg-green-900/20 hover:bg-green-900/40 text-green-500 rounded-lg transition" title="Odblokovat">
                                                            <CheckCircle size={14}/>
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleQuickBan(user.id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg transition" title="BAN">
                                                            <Ban size={14}/>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB: MODERATION (MESSAGES) --- */}
            {activeTab === 'moderation' && (
                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                            <input 
                                value={msgSearch}
                                onChange={e => setMsgSearch(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                placeholder="Hledat ve zprávách..."
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900 text-xs uppercase font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="p-4">Uživatel</th>
                                    <th className="p-4">Obsah</th>
                                    <th className="p-4">Kanál</th>
                                    <th className="p-4">Čas</th>
                                    <th className="p-4 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredMessages.map(msg => (
                                    <tr key={msg.id} className="hover:bg-gray-800/30 transition group">
                                        <td className="p-4 font-bold text-white flex items-center gap-2">
                                            {msg.senderName}
                                        </td>
                                        <td className="p-4 max-w-md truncate text-gray-300" title={msg.content}>{msg.content}</td>
                                        <td className="p-4 text-xs uppercase text-blue-400">{msg.channelId || (msg.recipientId ? 'DM' : 'Unknown')}</td>
                                        <td className="p-4 text-xs font-mono">{new Date(msg.timestamp).toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => handleQuickMute(msg.senderId)} className="p-2 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 rounded-lg transition" title="Ztlumit 24h">
                                                    <Hourglass size={14}/>
                                                </button>
                                                <button onClick={() => handleQuickBan(msg.senderId)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg transition" title="BAN">
                                                    <Ban size={14}/>
                                                </button>
                                                <button onClick={() => handleDeleteMsg(msg.id)} className="p-2 bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 rounded-lg transition" title="Smazat zprávu">
                                                    <Trash2 size={14}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMessages.length === 0 && <div className="p-8 text-center text-gray-500">Žádné zprávy nenalezeny.</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCommunity;