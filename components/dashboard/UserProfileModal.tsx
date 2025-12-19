import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Award, Calendar, Zap, MessageCircle } from 'lucide-react';
import { User } from '../../types';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface UserProfileModalProps {
    viewingUserId: string | null;
    allUsers: User[];
    currentUser: User;
    onClose: () => void;
    onMessage?: (userId: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ viewingUserId, allUsers, currentUser, onClose, onMessage }) => {
    if (!viewingUserId) return null;

    const targetUser = allUsers.find(u => u.id === viewingUserId);
    const isMe = viewingUserId === currentUser.id;
    
    // Privacy check
    const isPublic = targetUser?.isPublicProfile || isMe || currentUser.role === 'admin';

    if (!targetUser) return null;

    return (
        <AnimatePresence>
            <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
                <MotionDiv 
                    initial={{scale:0.9, opacity:0, y: 20}} 
                    animate={{scale:1, opacity:1, y:0}} 
                    className="bg-[#0B0F19] w-full max-w-md rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-900 to-purple-900 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition z-10"><X size={20}/></button>
                    </div>

                    {/* Avatar & Basic Info */}
                    <div className="px-8 relative -mt-16 text-center">
                        <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#0B0F19] bg-gray-900 overflow-hidden shadow-xl mb-4">
                            {targetUser.avatarUrl ? (
                                <img src={targetUser.avatarUrl} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600">
                                    {targetUser.name?.charAt(0) || targetUser.email.charAt(0)}
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                            {targetUser.name || 'Neznámý Uživatel'}
                            {targetUser.role === 'admin' && <Shield size={18} className="text-red-500" fill="currentColor"/>}
                            {targetUser.role === 'vip' && <Shield size={18} className="text-yellow-500" fill="currentColor"/>}
                        </h2>
                        <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-6">{targetUser.role}</p>

                        {!isMe && onMessage && (
                            <button 
                                onClick={() => onMessage(targetUser.id)}
                                className="mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-bold text-sm transition flex items-center gap-2 mx-auto shadow-lg shadow-blue-900/30"
                            >
                                <MessageCircle size={16}/> Napsat zprávu
                            </button>
                        )}

                        {!isPublic ? (
                            <div className="py-12 text-gray-500 flex flex-col items-center">
                                <Shield size={48} className="mb-4 opacity-20"/>
                                <p>Tento profil je soukromý.</p>
                            </div>
                        ) : (
                            <div className="space-y-8 pb-8">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                        <div className="text-yellow-500 font-bold text-lg">{targetUser.level}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Level</div>
                                    </div>
                                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                        <div className="text-white font-bold text-lg font-mono">{targetUser.xp > 1000 ? `${(targetUser.xp/1000).toFixed(1)}k` : targetUser.xp}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">XP</div>
                                    </div>
                                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                                        <div className="text-blue-400 font-bold text-lg">{new Date(targetUser.joinDate).getFullYear()}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">Člen od</div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {targetUser.bio && (
                                    <div className="text-sm text-gray-400 leading-relaxed italic bg-black/20 p-4 rounded-xl border border-gray-800/50">
                                        "{targetUser.bio}"
                                    </div>
                                )}

                                {/* Skills */}
                                {targetUser.skills && targetUser.skills.length > 0 && (
                                    <div className="text-left">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                            <Zap size={14}/> Dovednosti
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {targetUser.skills.map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-900/10 text-green-400 border border-green-900/30 rounded text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Certificates */}
                                {targetUser.certificates && targetUser.certificates.length > 0 && (
                                    <div className="text-left">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <Award size={14}/> Získané Certifikáty ({targetUser.certificates.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {targetUser.certificates.slice(0, 3).map(cert => (
                                                <div key={cert.id} className="bg-gray-900 p-3 rounded-lg border border-gray-800 flex items-center gap-3">
                                                    <div className="p-2 bg-yellow-900/20 rounded text-yellow-500"><Award size={16}/></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold text-white truncate">{cert.courseName}</div>
                                                        <div className="text-[10px] text-gray-500">{cert.issueDate}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {targetUser.certificates.length > 3 && (
                                                <div className="text-center text-xs text-gray-500 pt-1">
                                                    + {targetUser.certificates.length - 3} dalších
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {isMe && (
                                    <div className="text-xs text-gray-600">
                                        Toto je náhled vašeho veřejného profilu. Upravit ho můžete v Nastavení.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};

export default UserProfileModal;