
import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Mail, Shield, Gem, Crown, MoreHorizontal, X, Save, Calendar, MessageSquare, DollarSign, Phone, CheckCircle, AlertTriangle, Briefcase, Ban, Hourglass, Bell, Send, BookOpen, FileText, Clock, Activity, ChevronsUp, ChevronsDown, Eye, LogIn } from 'lucide-react';
import { User, UserRole, DashboardMessage, Notification, Course, AdminNote } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminUsersProps {
  allUsers: User[];
  courses: Course[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onMuteUser: (userId: string, duration: number | 'forever') => void;
  onImpersonate: (userId: string) => void; 
  notify: (type: any, title: string, message: string) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ allUsers, courses, onUpdateUser, onDeleteUser, onMuteUser, onImpersonate, notify }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [mutingUser, setMutingUser] = useState<User | null>(null); 
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const handleEditClick = (user: User) => {
      setEditingUser(user);
      setEditForm({
          name: user.name || '',
          email: user.email,
          role: user.role,
          level: user.level,
          xp: user.xp,
          phone: user.phone || '',
          bio: user.bio || '',
          financialProfit: user.financialProfit || 0,
          planExpires: user.planExpires ? user.planExpires.split('T')[0] : '',
          dashboardMessageText: user.dashboardMessage?.text || '',
          dashboardMessageActive: user.dashboardMessage?.active || false,
          skillsInput: user.skills ? user.skills.join(', ') : '',
          interestsInput: user.interests ? user.interests.join(', ') : ''
      });
  };

  const handleSave = () => {
      if (!editingUser || !editForm) return;
      const safeDashboardMessage: DashboardMessage = {
          text: editForm.dashboardMessageText,
          active: editForm.dashboardMessageActive,
      };
      if (editingUser.dashboardMessage?.imageUrl) safeDashboardMessage.imageUrl = editingUser.dashboardMessage.imageUrl;
      if (editingUser.dashboardMessage?.pdfUrl) safeDashboardMessage.pdfUrl = editingUser.dashboardMessage.pdfUrl;
      const skills = editForm.skillsInput.split(',').map((s:string) => s.trim()).filter(Boolean);
      const interests = editForm.interestsInput.split(',').map((s:string) => s.trim()).filter(Boolean);
      const updatedUser: User = {
          ...editingUser,
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          level: editForm.level,
          xp: editForm.xp,
          phone: editForm.phone,
          bio: editForm.bio,
          financialProfit: editForm.financialProfit,
          planExpires: editForm.planExpires ? new Date(editForm.planExpires).toISOString() : undefined,
          dashboardMessage: safeDashboardMessage,
          skills: skills,
          interests: interests
      };
      if (!editForm.planExpires) delete updatedUser.planExpires;
      onUpdateUser(updatedUser);
      setEditingUser(null);
      notify('success', 'Uloženo', 'Uživatel byl aktualizován.');
  };

  const handleModifyExpiration = (days: number) => {
      if (!editForm) return;
      let currentExp = editForm.planExpires ? new Date(editForm.planExpires) : new Date();
      currentExp.setDate(currentExp.getDate() + days);
      setEditForm({
          ...editForm,
          planExpires: currentExp.toISOString().split('T')[0]
      });
  };

  const handleMuteSubmit = (duration: number | 'forever') => {
      if (mutingUser) {
          onMuteUser(mutingUser.id, duration);
          setMutingUser(null);
          notify('success', 'Hotovo', `Uživatel ztlumen.`);
      }
  };

  const handleToggleBan = (user: User) => {
      const newStatus = !user.isBanned;
      if(window.confirm(newStatus ? 'Opravdu zablokovat (BAN) tohoto uživatele?' : 'Opravdu odblokovat uživatele?')) {
          onUpdateUser({ ...user, isBanned: newStatus });
          notify(newStatus ? 'warning' : 'success', 'Status změněn', newStatus ? 'Uživatel zablokován' : 'Uživatel odblokován');
      }
  };

  const confirmDelete = () => {
      if (userToDelete) {
          onDeleteUser(userToDelete.id);
          setUserToDelete(null);
      }
  };

  const filteredUsers = allUsers.filter(u => {
      const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Správa Uživatelů</h2>
                <p className="text-gray-400 text-sm">Celkem {allUsers.length} registrovaných</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Hledat..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    />
                </div>
                <select 
                    value={roleFilter} 
                    onChange={e => setRoleFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="all">Všechny role</option>
                    <option value="nope">NOPE</option>
                    <option value="student">Student</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </div>

        <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-gray-400 min-w-[800px]">
                    <thead className="bg-gray-900/80 text-xs uppercase font-bold tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-5">Uživatel</th>
                            <th className="p-5">Role & Level</th>
                            <th className="p-5">Status</th>
                            <th className="p-5">Expirace</th>
                            <th className="p-5 text-right">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filteredUsers.map(user => {
                            const isMuted = user.mutedUntil && new Date(user.mutedUntil) > new Date();
                            const isExpired = user.planExpires && new Date(user.planExpires) < new Date();
                            return (
                                <tr 
                                    key={user.id} 
                                    className={`hover:bg-gray-800/30 transition ${user.isBanned ? 'opacity-50 grayscale' : ''}`}
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${user.role === 'admin' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                                {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover"/> : (user.name?.charAt(0) || user.email.charAt(0))}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.name || 'Bezejmenný'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                                user.role === 'admin' ? 'bg-red-900/30 text-red-400 border-red-900/50' :
                                                user.role === 'vip' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50' :
                                                user.role === 'premium' ? 'bg-purple-900/30 text-purple-400 border-purple-900/50' :
                                                'bg-blue-900/30 text-blue-400 border-blue-900/50'
                                            }`}>
                                                {user.role}
                                            </span>
                                            <span className="text-xs">Lvl {user.level} • {user.xp} XP</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-xs">
                                        {user.isBanned ? (
                                            <span className="text-red-500 font-bold flex items-center gap-1"><Ban size={12}/> BANNED</span>
                                        ) : isMuted ? (
                                            <span className="text-yellow-500 font-bold flex items-center gap-1"><Hourglass size={12}/> MUTED</span>
                                        ) : (
                                            <span className="text-green-500 flex items-center gap-1"><CheckCircle size={12}/> Aktivní</span>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        {user.planExpires ? (
                                            <span className={isExpired ? 'text-red-500 font-bold' : 'text-white'}>
                                                {new Date(user.planExpires).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 italic">Lifetime</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onImpersonate(user.id)} className="p-2.5 bg-purple-900/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl transition" title="Login as user"><LogIn size={16}/></button>
                                            <button onClick={() => setMutingUser(user)} className="p-2.5 bg-yellow-900/20 text-yellow-500 hover:bg-yellow-600 hover:text-white rounded-xl transition"><Hourglass size={16}/></button>
                                            <button onClick={() => handleToggleBan(user)} className={`p-2.5 rounded-xl transition ${user.isBanned ? 'bg-green-900/20 text-green-500 hover:bg-green-600' : 'bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white'}`}><Ban size={16}/></button>
                                            <button onClick={() => handleEditClick(user)} className="p-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl transition"><Edit size={16}/></button>
                                            <button onClick={() => setUserToDelete(user)} className="p-2.5 bg-gray-800 text-gray-500 hover:bg-red-600 hover:text-white rounded-xl transition"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        <AnimatePresence>
            {userToDelete && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <MotionDiv initial={{scale:0.9}} animate={{scale:1}} className="bg-[#0B0F19] p-8 rounded-3xl border border-red-900/50 shadow-2xl max-w-sm w-full text-center">
                        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><AlertTriangle size={40}/></div>
                        <h3 className="text-xl font-bold text-white mb-2">Smazat uživatele?</h3>
                        <p className="text-gray-400 mb-6 text-sm">Tato akce je nevratná.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setUserToDelete(null)} className="flex-1 py-3 text-gray-400 bg-gray-800 rounded-xl font-bold">Zrušit</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Smazat</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
            {editingUser && editForm && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <MotionDiv initial={{y: 20}} animate={{y:0}} className="bg-[#0B0F19] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] border border-gray-800 shadow-2xl flex flex-col p-6 md:p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-white">Editace Uživatele</h3>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-800 rounded-full transition"><X/></button>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="label">Jméno</label><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input"/></div>
                                <div><label className="label">Email</label><input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="input"/></div>
                                <div><label className="label">Role</label><select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as any})} className="input"><option value="nope">NOPE</option><option value="student">Student</option><option value="premium">Premium</option><option value="vip">VIP</option><option value="admin">Admin</option></select></div>
                                <div><label className="label">Level</label><input type="number" value={editForm.level} onChange={e => setEditForm({...editForm, level: parseInt(e.target.value)})} className="input"/></div>
                            </div>
                            <div className="bg-black/30 p-6 rounded-2xl border border-gray-800">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Calendar size={18}/> Předplatné</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="date" value={editForm.planExpires} onChange={e => setEditForm({...editForm, planExpires: e.target.value})} className="input"/>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleModifyExpiration(30)} className="flex-1 py-3 bg-gray-800 rounded-xl text-xs font-bold">+30 Dní</button>
                                        <button onClick={() => handleModifyExpiration(365)} className="flex-1 py-3 bg-gray-800 rounded-xl text-xs font-bold">+1 Rok</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-10">
                            <button onClick={() => setEditingUser(null)} className="px-6 py-3 text-gray-400 font-bold">Zrušit</button>
                            <button onClick={handleSave} className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20">Uložit</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
