import React, { useState } from 'react';
import { Megaphone, Download, Copy, Phone, Filter, Send, CheckCircle, Smartphone } from 'lucide-react';
import { User } from '../../types';

interface AdminCampaignsProps {
    allUsers: User[];
    onSendCampaign: (role: string, subject: string, body: string) => void;
    notify: (type: any, title: string, message: string) => void;
}

const AdminCampaigns: React.FC<AdminCampaignsProps> = ({ allUsers, onSendCampaign, notify }) => {
    // Campaign State
    const [targetRole, setTargetRole] = useState('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // Export State
    const [exportRole, setExportRole] = useState('all');

    // --- Campaign Logic ---
    const handleSend = () => {
        if (!subject || !message) {
            notify('error', 'Chyba', 'Vyplňte předmět a zprávu.');
            return;
        }
        if (window.confirm(`Opravdu odeslat hromadnou zprávu pro ${targetRole === 'all' ? 'všechny' : targetRole}?`)) {
            onSendCampaign(targetRole, subject, message);
            setSubject('');
            setMessage('');
        }
    };

    // --- Export Logic ---
    const getFilteredUsersForExport = () => {
        return allUsers.filter(u => {
            const hasPhone = u.phone && u.phone.trim().length > 0;
            const matchesRole = exportRole === 'all' || u.role === exportRole;
            return hasPhone && matchesRole;
        });
    };

    const usersWithPhones = getFilteredUsersForExport();
    const phoneList = usersWithPhones.map(u => u.phone).join('\n');

    const handleCopyPhones = () => {
        navigator.clipboard.writeText(phoneList);
        notify('success', 'Zkopírováno', `${usersWithPhones.length} čísel zkopírováno do schránky.`);
    };

    const handleDownloadCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," + "Name,Phone,Email,Role\n" + 
            usersWithPhones.map(u => `${u.name || 'Unknown'},${u.phone},${u.email},${u.role}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `phone_export_${exportRole}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify('success', 'Staženo', 'CSV soubor byl vygenerován.');
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Kampaně & Marketing</h2>
                    <p className="text-gray-400 text-sm">Odesílejte notifikace a exportujte kontakty pro SMS marketing.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Phone Export Section */}
                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                        <div className="p-2 bg-green-900/20 rounded-lg text-green-400"><Smartphone size={20}/></div>
                        <div>
                            <h3 className="font-bold text-white">Export Telefonních Čísel</h3>
                            <p className="text-xs text-gray-500">Pro SMS marketing a WhatsApp kampaně.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cílová Skupina</label>
                            <select 
                                value={exportRole} 
                                onChange={e => setExportRole(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-green-500 outline-none"
                            >
                                <option value="all">Všichni uživatelé</option>
                                <option value="student">Pouze Studenti (Free)</option>
                                <option value="premium">Premium Členové</option>
                                <option value="vip">VIP Klienti</option>
                            </select>
                        </div>

                        <div className="bg-black/50 border border-gray-800 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400 font-mono">Nalezeno kontaktů: {usersWithPhones.length}</span>
                                <span className="text-xs text-green-500 font-bold uppercase">{exportRole}</span>
                            </div>
                            <textarea 
                                readOnly
                                value={phoneList}
                                className="w-full h-32 bg-transparent border-none text-xs text-gray-300 font-mono resize-none focus:outline-none custom-scrollbar"
                                placeholder="Žádná čísla k zobrazení..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={handleCopyPhones}
                                disabled={usersWithPhones.length === 0}
                                className="py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Copy size={16}/> Kopírovat
                            </button>
                            <button 
                                onClick={handleDownloadCSV}
                                disabled={usersWithPhones.length === 0}
                                className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                            >
                                <Download size={16}/> Stáhnout CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Notification Blast Section */}
                <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400"><Megaphone size={20}/></div>
                        <div>
                            <h3 className="font-bold text-white">Interní Notifikace</h3>
                            <p className="text-xs text-gray-500">Odeslat zprávu přímo do aplikace.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Příjemci</label>
                            <select 
                                value={targetRole} 
                                onChange={e => setTargetRole(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                            >
                                <option value="all">Všichni</option>
                                <option value="student">Studenti</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Předmět</label>
                            <input 
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                placeholder="Např. Nový kurz dostupný!"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Zpráva</label>
                            <textarea 
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="w-full h-32 bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none"
                                placeholder="Text notifikace..."
                            />
                        </div>

                        <button 
                            onClick={handleSend}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 mt-2"
                        >
                            <Send size={16}/> Odeslat Kampaň
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminCampaigns;