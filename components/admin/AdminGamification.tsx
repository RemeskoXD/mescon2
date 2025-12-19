import React, { useState } from 'react';
import { Gem, Zap, Star, Plus, Edit, Trash2, Save, X, ShoppingBag, Gift, ArrowUp } from 'lucide-react';
import { Artifact, Challenge, LevelRequirement } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminGamificationProps {
  artifacts: Artifact[];
  challenges: Challenge[];
  levelRequirements: LevelRequirement[];
  onSaveArtifact: (item: Artifact) => void;
  onDeleteArtifact: (id: string) => void;
  onSaveChallenge: (item: Challenge) => void;
  onDeleteChallenge: (id: string) => void;
  onUpdateLevels: (items: LevelRequirement[]) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminGamification: React.FC<AdminGamificationProps> = ({ 
    artifacts, challenges, levelRequirements, 
    onSaveArtifact, onDeleteArtifact, onSaveChallenge, onDeleteChallenge, onUpdateLevels, notify 
}) => {
  const [activeTab, setActiveTab] = useState<'artifacts' | 'challenges' | 'levels'>('artifacts');
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [localLevels, setLocalLevels] = useState(levelRequirements);

  const handleSaveArtifact = () => {
      if(!editingArtifact || !editingArtifact.name) return;
      onSaveArtifact(editingArtifact);
      setEditingArtifact(null);
  };
  const handleDeleteArtifact = (id: string) => {
      if(window.confirm('Smazat předmět?')) onDeleteArtifact(id);
  };

  const handleSaveChallenge = () => {
      if(!editingChallenge || !editingChallenge.title) return;
      onSaveChallenge(editingChallenge);
      setEditingChallenge(null);
  };
  const handleDeleteChallenge = (id: string) => {
      if(window.confirm('Smazat výzvu?')) onDeleteChallenge(id);
  };

  const handleLevelChange = (idx: number, field: keyof LevelRequirement, value: any) => {
      const newLevels = [...localLevels];
      newLevels[idx] = { ...newLevels[idx], [field]: value };
      setLocalLevels(newLevels);
  };
  const saveLevels = () => {
      onUpdateLevels(localLevels);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Gamifikace</h2>
                <p className="text-gray-400 text-sm">Spravujte obchod, výzvy a levelovací systém.</p>
            </div>
            <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
                <button onClick={() => setActiveTab('artifacts')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'artifacts' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Předměty</button>
                <button onClick={() => setActiveTab('challenges')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'challenges' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Výzvy</button>
                <button onClick={() => setActiveTab('levels')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'levels' ? 'bg-yellow-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Levely</button>
            </div>
        </div>

        {activeTab === 'artifacts' && (
            <div>
                <button onClick={() => setEditingArtifact({id: `a-${Date.now()}`, name: '', description: '', image: '📦', rarity: 'common', type: 'consumable', price: 100, quantity: 0})} className="w-full py-3 mb-6 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-500 transition flex items-center justify-center gap-2">
                    <Plus size={18}/> Přidat Předmět do Obchodu
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {artifacts.map(item => (
                        <div key={item.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 relative group hover:border-purple-500/30 transition">
                            <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded bg-gray-800 uppercase text-gray-400">{item.rarity}</div>
                            <div className="text-4xl mb-4">{item.image}</div>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <p className="text-xs text-gray-400 mb-4 h-8 overflow-hidden">{item.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <span className="font-mono text-yellow-500 font-bold">{item.price} XP</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingArtifact(item)} className="p-1.5 hover:bg-gray-800 rounded text-gray-400"><Edit size={14}/></button>
                                    <button onClick={() => handleDeleteArtifact(item.id)} className="p-1.5 hover:bg-gray-800 rounded text-red-500"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'challenges' && (
            <div>
                <button onClick={() => setEditingChallenge({id: `c-${Date.now()}`, title: '', description: '', type: 'daily', targetCount: 1, rewardXP: 100})} className="w-full py-3 mb-6 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2">
                    <Plus size={18}/> Přidat Denní/Týdenní Výzvu
                </button>
                <div className="space-y-4">
                    {challenges.map(challenge => (
                        <div key={challenge.id} className="bg-[#0B0F19] border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${challenge.type === 'daily' ? 'bg-blue-900/20 text-blue-400' : 'bg-purple-900/20 text-purple-400'}`}>
                                    <Zap size={20}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{challenge.title}</h3>
                                    <p className="text-xs text-gray-400">{challenge.description} (Cíl: {challenge.targetCount}x)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className="block text-xs text-gray-500 uppercase">Odměna</span>
                                    <span className="font-bold text-yellow-500">+{challenge.rewardXP} XP</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingChallenge(challenge)} className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg text-gray-400 hover:text-white transition"><Edit size={16}/></button>
                                    <button onClick={() => handleDeleteChallenge(challenge.id)} className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg text-gray-400 hover:text-white transition"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'levels' && (
            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-lg">Konfigurace Levelů</h3>
                    <button onClick={saveLevels} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-lg">Uložit Levely</button>
                </div>
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar space-y-2">
                    {localLevels.map((lvl, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-2 hover:bg-gray-900 rounded border border-transparent hover:border-gray-800 transition">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-white border border-gray-700">{lvl.level}</div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold block">Titul</label>
                                    <input value={lvl.title} onChange={e => handleLevelChange(idx, 'title', e.target.value)} className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-sm text-white"/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold block">XP Potřeba</label>
                                    <input type="number" value={lvl.xpRequired} onChange={e => handleLevelChange(idx, 'xpRequired', parseInt(e.target.value))} className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-sm text-yellow-500 font-mono"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <AnimatePresence>
            {editingArtifact && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv className="bg-[#0B0F19] w-full max-w-md rounded-2xl border border-gray-800 p-6 space-y-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-white">Editor Předmětu</h3>
                        <input value={editingArtifact.name} onChange={e => setEditingArtifact({...editingArtifact, name: e.target.value})} placeholder="Název" className="input"/>
                        <textarea value={editingArtifact.description} onChange={e => setEditingArtifact({...editingArtifact, description: e.target.value})} placeholder="Popis" className="input h-20"/>
                        <div className="flex gap-2">
                            <input value={editingArtifact.image} onChange={e => setEditingArtifact({...editingArtifact, image: e.target.value})} placeholder="Emoji / URL" className="input w-1/3"/>
                            <input type="number" value={editingArtifact.price} onChange={e => setEditingArtifact({...editingArtifact, price: parseInt(e.target.value)})} placeholder="Cena XP" className="input flex-1"/>
                        </div>
                        <select value={editingArtifact.rarity} onChange={e => setEditingArtifact({...editingArtifact, rarity: e.target.value as any})} className="input">
                            <option value="common">Common</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">Legendary</option>
                        </select>
                        <select value={editingArtifact.effectType} onChange={e => setEditingArtifact({...editingArtifact, effectType: e.target.value as any})} className="input">
                            <option value="xp_boost">XP Boost</option>
                            <option value="loot_box">Loot Box</option>
                            <option value="none">Žádný efekt (Badge/Ticket)</option>
                        </select>
                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={() => setEditingArtifact(null)} className="btn-secondary">Zrušit</button>
                            <button onClick={handleSaveArtifact} className="btn-primary bg-purple-600 hover:bg-purple-500">Uložit</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}

            {editingChallenge && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv className="bg-[#0B0F19] w-full max-w-md rounded-2xl border border-gray-800 p-6 space-y-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-white">Editor Výzvy</h3>
                        <input value={editingChallenge.title} onChange={e => setEditingChallenge({...editingChallenge, title: e.target.value})} placeholder="Název výzvy" className="input"/>
                        <textarea value={editingChallenge.description} onChange={e => setEditingChallenge({...editingChallenge, description: e.target.value})} placeholder="Popis" className="input h-20"/>
                        <div className="flex gap-2">
                            <select value={editingChallenge.type} onChange={e => setEditingChallenge({...editingChallenge, type: e.target.value as any})} className="input flex-1">
                                <option value="daily">Denní</option>
                                <option value="weekly">Týdenní</option>
                            </select>
                            <input type="number" value={editingChallenge.targetCount} onChange={e => setEditingChallenge({...editingChallenge, targetCount: parseInt(e.target.value)})} placeholder="Cíl (počet)" className="input flex-1"/>
                        </div>
                        <input type="number" value={editingChallenge.rewardXP} onChange={e => setEditingChallenge({...editingChallenge, rewardXP: parseInt(e.target.value)})} placeholder="Odměna XP" className="input"/>
                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={() => setEditingChallenge(null)} className="btn-secondary">Zrušit</button>
                            <button onClick={handleSaveChallenge} className="btn-primary bg-blue-600 hover:bg-blue-500">Uložit</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminGamification;