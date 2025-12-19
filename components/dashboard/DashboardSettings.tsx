import React, { useState } from 'react';
import { User, Mail, Phone, Save, User as UserIcon, Shield, Lock, CreditCard, Briefcase, Plus, X, Image as ImageIcon, Check, ExternalLink, Award } from 'lucide-react';
import { User as UserType } from '../../types';
import CheckoutModal from '../CheckoutModal';
import { db } from '../../firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

interface DashboardSettingsProps {
    user: UserType;
    onUpdateProfile: (u: UserType) => void;
    notify: any;
    onLogout: () => void;
    onNavigate: (tab: string) => void; // Added for redirection
}

const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Zoey'
];

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ user, onUpdateProfile, notify, onLogout, onNavigate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        isPublicProfile: user.isPublicProfile
    });
    const [skills, setSkills] = useState<string[]>(user.skills || []);
    const [interests, setInterests] = useState<string[]>(user.interests || []);
    const [skillInput, setSkillInput] = useState('');
    const [interestInput, setInterestInput] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLoadingPortal, setIsLoadingPortal] = useState(false);

    const handleSave = () => {
        onUpdateProfile({
            ...user,
            ...formData,
            skills,
            interests
        });
        notify('success', 'Uloženo', 'Váš profil byl aktualizován.');
    };

    const handleAddSkill = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') return;
        if (!skillInput.trim()) return;
        if (skills.includes(skillInput.trim())) return;
        setSkills([...skills, skillInput.trim()]);
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleAddInterest = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') return;
        if (!interestInput.trim()) return;
        if (interests.includes(interestInput.trim())) return;
        setInterests([...interests, interestInput.trim()]);
        setInterestInput('');
    };

    const removeInterest = (int: string) => {
        setInterests(interests.filter(i => i !== int));
    };

    const handleUpgradeSuccess = () => {
        // Stripe handles actual role update via webhook/extension listener
        // This is optimistic feedback
        notify('success', 'Zpracovávám', 'Přesměrování na Stripe...');
    };

    const handleManageSubscription = async () => {
        setIsLoadingPortal(true);
        try {
            const docRef = await addDoc(collection(db, 'customers', user.id, 'portal_sessions'), {
                returnUrl: window.location.origin
            });

            const unsubscribe = onSnapshot(docRef, (snap) => {
                const data = snap.data();
                if (data?.url) {
                    window.location.assign(data.url);
                }
                if (data?.error) {
                    console.error(data.error);
                    notify('error', 'Chyba', 'Nepodařilo se načíst portál.');
                    setIsLoadingPortal(false);
                }
            });

        } catch (error) {
            console.error(error);
            notify('error', 'Chyba', 'Nastala chyba při komunikaci se Stripe.');
            setIsLoadingPortal(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Nastavení Profilu</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Public Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 text-center">
                        <div className="w-32 h-32 mx-auto bg-gray-900 rounded-full border-4 border-gray-800 overflow-hidden mb-4 relative group">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-bold">
                                    {user.name?.charAt(0) || user.email.charAt(0)}
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-blue-400 text-xs uppercase font-bold tracking-wider mb-4">{user.role}</p>
                        
                        <div className="bg-black/40 rounded-xl p-3 border border-gray-800 text-left space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Level</span>
                                <span className="text-yellow-500 font-bold">{user.level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">XP</span>
                                <span className="text-white font-mono">{user.xp.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Člen od</span>
                                <span className="text-gray-400">{new Date(user.joinDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Certificates Button */}
                        <button 
                            onClick={() => onNavigate('certificates')}
                            className="w-full mt-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border border-gray-700"
                        >
                            <Award size={14} className="text-yellow-500"/> Moje Certifikáty
                        </button>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Personal Info */}
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <UserIcon size={20} className="text-blue-500"/> Osobní Údaje
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Profilová Fotografie</label>
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">Vyberte si z galerie nebo vložte vlastní URL:</p>
                                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                        {PRESET_AVATARS.map((url, index) => (
                                            <button 
                                                key={index}
                                                onClick={() => setFormData({...formData, avatarUrl: url})}
                                                className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border-2 transition ${formData.avatarUrl === url ? 'border-blue-500 scale-110' : 'border-gray-800 hover:border-gray-600'}`}
                                            >
                                                <img src={url} className="w-full h-full object-cover" alt="Avatar"/>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-black border border-gray-700 rounded-xl px-3 py-2">
                                    <ImageIcon size={16} className="text-gray-500"/>
                                    <input 
                                        value={formData.avatarUrl} 
                                        onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                                        className="bg-transparent border-none outline-none text-xs text-white flex-1 placeholder:text-gray-600"
                                        placeholder="Nebo vložte vlastní URL obrázku (https://...)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Jméno</label>
                                    <input 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">Telefon</label>
                                    <input 
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="input"
                                        placeholder="+420 777 888 999"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Email (nelze změnit)</label>
                                <div className="input bg-gray-900/50 text-gray-500 cursor-not-allowed flex items-center gap-2">
                                    <Mail size={14}/> {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="label">Bio (O mně)</label>
                                <textarea 
                                    value={formData.bio} 
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                    className="input h-24 resize-none"
                                    placeholder="Napište něco o sobě..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Networking & Skills */}
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-green-500"/> Networking Profil
                        </h3>
                        
                        <div className="space-y-6">
                            {/* Skills */}
                            <div>
                                <label className="label">Moje Dovednosti (Co nabízím)</label>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        className="input flex-1"
                                        placeholder="Např. Marketing, Copywriting..."
                                    />
                                    <button onClick={() => handleAddSkill()} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white"><Plus size={18}/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-green-900/20 text-green-400 border border-green-500/30 rounded-lg text-sm flex items-center gap-2">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="hover:text-white"><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Looking For */}
                            <div>
                                <label className="label">Co hledám / Potřebuji</label>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        value={interestInput}
                                        onChange={e => setInterestInput(e.target.value)}
                                        onKeyDown={handleAddInterest}
                                        className="input flex-1"
                                        placeholder="Např. Spoluzakladatel, Grafik..."
                                    />
                                    <button onClick={() => handleAddInterest()} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white"><Plus size={18}/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map(int => (
                                        <span key={int} className="px-3 py-1 bg-blue-900/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm flex items-center gap-2">
                                            {int}
                                            <button onClick={() => removeInterest(int)} className="hover:text-white"><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Settings */}
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-yellow-500"/> Soukromí
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-white">Veřejný profil</p>
                                <p className="text-xs text-gray-500">Umožní ostatním vás najít v adresáři a žebříčku.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isPublicProfile} 
                                    onChange={e => setFormData({...formData, isPublicProfile: e.target.checked})} 
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Plan Info */}
                    <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-purple-500"/> Členství
                        </h3>
                        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                            <div>
                                <p className="text-sm text-gray-400">Aktuální plán</p>
                                <p className="text-xl font-black text-white uppercase">{user.role}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Expirace</p>
                                <p className="text-sm font-bold text-white">
                                    {user.planExpires ? new Date(user.planExpires).toLocaleDateString() : 'Doživotní / Neaktivní'}
                                </p>
                            </div>
                        </div>
                        
                        {/* UPGRADE BUTTONS */}
                        {user.role === 'student' && (
                            <button 
                                onClick={() => setIsCheckoutOpen(true)}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition"
                            >
                                Upgrade na PREMIUM
                            </button>
                        )}
                        {user.role === 'premium' && (
                            <button 
                                onClick={() => setIsCheckoutOpen(true)}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-yellow-600 text-white font-bold rounded-xl hover:shadow-lg transition"
                            >
                                Upgrade na VIP
                            </button>
                        )}

                        {/* MANAGE SUBSCRIPTION (PORTAL) */}
                        {(user.role === 'premium' || user.role === 'vip' || user.role === 'student') && user.planExpires && (
                            <button 
                                onClick={handleManageSubscription}
                                disabled={isLoadingPortal}
                                className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition flex items-center justify-center gap-2"
                            >
                                {isLoadingPortal ? 'Načítám...' : <><ExternalLink size={16}/> Spravovat předplatné (Stripe)</>}
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={onLogout} className="px-6 py-3 border border-red-900/50 text-red-500 hover:bg-red-900/20 rounded-xl font-bold transition flex items-center gap-2">
                            <Lock size={18}/> Odhlásit se
                        </button>
                        <button onClick={handleSave} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                            <Save size={18}/> Uložit Změny
                        </button>
                    </div>

                </div>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={handleUpgradeSuccess}
                planName={user.role === 'student' ? 'PREMIUM' : 'VIP'}
                price={user.role === 'student' ? 990 : 2490}
                user={user}
            />
        </div>
    );
};

export default DashboardSettings;