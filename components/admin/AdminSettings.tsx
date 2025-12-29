
import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle, Activity, Lock, Globe, Bell, Power, RefreshCw, Server, Trophy, CheckCircle, XCircle, Link as LinkIcon, ShoppingCart, Ticket, Bot, Sparkles } from 'lucide-react';
import { SystemSettings } from '../../types';
import { motion } from 'framer-motion';

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface AdminSettingsProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  onFactoryReset: () => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings, onFactoryReset, notify }) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  
  // State for Factory Reset Button
  const [resetConfirmStep, setResetConfirmStep] = useState(0); // 0 = idle, 1 = confirm

  useEffect(() => {
      let timer: any;
      if (resetConfirmStep === 1) {
          timer = setTimeout(() => setResetConfirmStep(0), 4000); // Reset back to normal after 4s
      }
      return () => clearTimeout(timer);
  }, [resetConfirmStep]);

  const handleChange = (field: keyof SystemSettings, value: any) => {
      setLocalSettings(prev => ({ ...prev, [field]: value }));
      setHasChanges(true);
  };

  const handleLeaderboardChange = (field: string, value: any) => {
      setLocalSettings(prev => ({
          ...prev,
          leaderboardBanner: {
              ...prev.leaderboardBanner,
              [field]: value
          } as any
      }));
      setHasChanges(true);
  };

  const handleSave = () => {
      onUpdateSettings(localSettings);
      setHasChanges(false);
      notify('success', 'Uloženo', 'Systémová nastavení byla aktualizována.');
  };

  const handleResetClick = () => {
      if (resetConfirmStep === 0) {
          setResetConfirmStep(1);
      } else {
          console.log("Factory Reset Triggered from UI");
          onFactoryReset();
          setResetConfirmStep(0);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Nastavení Systému</h2>
                <p className="text-gray-400 text-sm">Globální konfigurace platformy.</p>
            </div>
            {hasChanges && (
                <button onClick={handleSave} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white shadow-lg shadow-green-900/20 flex items-center gap-2 animate-bounce-short">
                    <Save size={18}/> Uložit Změny
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* System Status Card */}
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400"><Server size={20}/></div>
                    <h3 className="font-bold text-white">Stav Systému</h3>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-bold text-white block">Režim Údržby (Maintenance)</label>
                            <p className="text-xs text-gray-500 max-w-[250px]">Pokud je aktivní, studenti se nebudou moci přihlásit. Admini mají stále přístup.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={localSettings.maintenanceMode} onChange={e => handleChange('maintenanceMode', e.target.checked)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-bold text-white block">Povolit Nové Registrace</label>
                            <p className="text-xs text-gray-500 max-w-[250px]">Vypněte, pokud chcete akademii uzavřít pro nové členy.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={localSettings.allowRegistrations} onChange={e => handleChange('allowRegistrations', e.target.checked)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* AI Mentor (Nexus) Configuration */}
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-2 bg-emerald-900/20 rounded-lg text-emerald-400"><Bot size={20}/></div>
                    <h3 className="font-bold text-white">AI Mentor (Nexus)</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-sm text-gray-400 font-bold">Aktivovat AI Modul</span>
                            <p className="text-[10px] text-gray-500">Zpřístupní Gemini chat pro studenty.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={localSettings.aiEnabled} onChange={e => handleChange('aiEnabled', e.target.checked)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block flex items-center gap-2"><Sparkles size={12}/> Systémová Instrukce (Prompt)</label>
                        <textarea 
                            value={localSettings.aiSystemInstruction || ''} 
                            onChange={e => handleChange('aiSystemInstruction', e.target.value)}
                            className="w-full h-32 bg-black border border-gray-700 rounded-xl p-3 text-white text-xs focus:border-emerald-500 outline-none resize-none custom-scrollbar"
                            placeholder="Např. Jsi elitní business mentor..."
                        />
                        <p className="text-[9px] text-gray-600 mt-1 italic">Tato instrukce definuje osobnost a znalosti AI Mentora.</p>
                    </div>
                </div>
            </div>

            {/* Home Page Marketing Links */}
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><LinkIcon size={20}/></div>
                    <h3 className="font-bold text-white">Marketingové Odkazy</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="label flex items-center gap-2"><ShoppingCart size={14} className="text-blue-400"/> Odkaz na nákup vstupenky</label>
                        <input 
                            value={localSettings.landingTicketLink || ''} 
                            onChange={e => handleChange('landingTicketLink', e.target.value)}
                            className="input text-xs"
                            placeholder="https://checkout.stripe.com/..."
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Tento link se použije u hlavního tlačítka na home page.</p>
                    </div>
                    <div>
                        <label className="label flex items-center gap-2"><Ticket size={14} className="text-green-400"/> Odkaz pro registraci zdarma</label>
                        <input 
                            value={localSettings.landingFreeLink || ''} 
                            onChange={e => handleChange('landingFreeLink', e.target.value)}
                            className="input text-xs"
                            placeholder="https://mescon.cz/free-register"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Zobrazí se jako sekundární možnost na home page.</p>
                    </div>
                </div>
            </div>

            {/* Global Announcements */}
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-2 bg-yellow-900/20 rounded-lg text-yellow-400"><Bell size={20}/></div>
                    <h3 className="font-bold text-white">Globální Oznámení</h3>
                </div>
                
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Text Banneru</span>
                        <textarea 
                            value={localSettings.globalBanner} 
                            onChange={e => handleChange('globalBanner', e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-yellow-500 outline-none h-24 resize-none text-sm"
                            placeholder="Např. Zítra proběhne odstávka od 2:00 do 4:00..."
                        />
                    </label>
                </div>
            </div>

            {/* Leaderboard Reward Config */}
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-2 bg-orange-900/20 rounded-lg text-orange-400"><Trophy size={20}/></div>
                    <h3 className="font-bold text-white">Odměny Žebříčku</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400 font-bold">Aktivovat Banner</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={localSettings.leaderboardBanner?.active} onChange={e => handleLeaderboardChange('active', e.target.checked)} className="sr-only peer"/>
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nadpis</label>
                            <input 
                                value={localSettings.leaderboardBanner?.title || ''} 
                                onChange={e => handleLeaderboardChange('title', e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm"
                                placeholder="Týdenní Odměna"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Časovač</label>
                            <input 
                                value={localSettings.leaderboardBanner?.timer || ''} 
                                onChange={e => handleLeaderboardChange('timer', e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm font-mono"
                                placeholder="2d 14h"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* System Info */}
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Activity size={20}/></div>
                    <h3 className="font-bold text-white">Verze Systému</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                        <span className="text-gray-400">Verze Aplikace</span>
                        <span className="font-mono text-white font-bold">{settings.version || '2.0.0'}</span>
                    </div>
                    <div className="pt-2">
                        <input 
                            type="text" 
                            value={localSettings.version} 
                            onChange={e => handleChange('version', e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-500 focus:text-white transition"
                            placeholder="Změnit označení verze..."
                        />
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/30 relative z-10">
                    <div className="p-2 bg-red-900/20 rounded-lg text-red-500"><AlertTriangle size={20}/></div>
                    <h3 className="font-bold text-white">Danger Zone</h3>
                </div>

                <button 
                    onClick={handleResetClick}
                    className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 relative z-50 shadow-lg ${
                        resetConfirmStep === 1 
                        ? 'bg-red-600 text-white animate-pulse shadow-red-900/50' 
                        : 'bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50'
                    }`}
                >
                    {resetConfirmStep === 1 ? (
                        <>⚠️ Opravdu smazat? Klikněte znovu!</>
                    ) : (
                        <><RefreshCw size={18}/> Tovární Reset Databáze</>
                    )}
                </button>
            </div>

        </div>
    </div>
  );
};

export default AdminSettings;
