import React, { useState } from 'react';
import { Package, ShoppingBag, Zap, Clock, Shield, Gift, AlertTriangle, Star, Loader2, Check } from 'lucide-react';
import { Artifact, User } from '../../types';
import LootBoxModal from '../LootBoxModal';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface DashboardInventoryProps {
    user: User;
    shopArtifacts: Artifact[]; 
    onUseItem: (itemId: string, reward?: any) => void;
    onBuyItem: (item: Artifact) => void;
    notify: any;
}

const DashboardInventory: React.FC<DashboardInventoryProps> = ({ user, shopArtifacts, onUseItem, onBuyItem, notify }) => {
    const [activeTab, setActiveTab] = useState<'inventory' | 'shop'>('inventory');
    const [activeLootBox, setActiveLootBox] = useState<Artifact | null>(null);
    const [pendingReward, setPendingReward] = useState<{type: 'xp' | 'item', value: string, icon: any, artifact?: Artifact, amount?: number} | undefined>(undefined);
    const [buyingId, setBuyingId] = useState<string | null>(null);

    const handleBuy = async (item: Artifact) => {
        if (user.xp < (item.price || 0)) {
            notify('error', 'Nedostatek XP', 'Pro tento nákup nemáš dostatek zkušeností.');
            return;
        }
        
        setBuyingId(item.id);
        try {
            await onBuyItem(item);
            // Visual delay to feel like a transaction
            setTimeout(() => setBuyingId(null), 800);
        } catch (e) {
            setBuyingId(null);
            notify('error', 'Chyba', 'Nákup se nezdařil. Zkus to prosím znovu.');
        }
    };

    const handleUse = (item: Artifact) => {
        if (item.effectType === 'loot_box') {
            const isXP = Math.random() > 0.5;
            let reward: {type: 'xp' | 'item', value: string, icon: any, artifact?: Artifact, amount?: number};
            
            if (isXP) {
                const amount = Math.floor(Math.random() * 500) + 100;
                reward = { 
                    type: 'xp', 
                    amount,
                    value: `${amount} XP`, 
                    icon: <Star size={40} className="text-yellow-500 fill-yellow-500"/> 
                };
            } else {
                // Get possible items (excluding boxes to avoid infinite loops)
                const items = shopArtifacts.filter(a => a.effectType !== 'loot_box');
                const randomItem = items[Math.floor(Math.random() * items.length)];
                reward = { 
                    type: 'item', 
                    artifact: randomItem,
                    value: randomItem?.name || 'Vzácný předmět', 
                    icon: <div className="text-5xl">{randomItem?.image || '🎁'}</div> 
                };
            }
            setPendingReward(reward);
            setActiveLootBox(item);
        } else {
            onUseItem(item.id);
        }
    };

    const handleLootBoxRevealed = () => {
        if (activeLootBox && pendingReward) {
            // This now passes the reward to the App.tsx handler which updates Firestore
            onUseItem(activeLootBox.id, pendingReward);
            
            setTimeout(() => {
                setActiveLootBox(null);
                setPendingReward(undefined);
            }, 2000);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Inventář & Obchod</h2>
                    <p className="text-gray-400 text-sm">Zde můžeš utratit své těžce vydřené XP body.</p>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                        <Package size={14}/> Batoh
                    </button>
                    <button onClick={() => setActiveTab('shop')} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'shop' ? 'bg-yellow-600 text-black' : 'text-gray-400 hover:text-white'}`}>
                        <ShoppingBag size={14}/> Shop
                    </button>
                </div>
            </div>

            {user.xpBoostUntil && new Date(user.xpBoostUntil) > new Date() && (
                <div className="bg-purple-900/20 border border-purple-500/50 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                    <div className="p-3 bg-purple-600 rounded-lg text-white"><Zap size={24} fill="currentColor"/></div>
                    <div>
                        <h4 className="font-bold text-white text-sm">XP BOOST AKTIVNÍ!</h4>
                        <p className="text-purple-300 text-xs">Získáváš 2x více XP ze všech aktivit.</p>
                    </div>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {user.inventory.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                            <Package size={48} className="mx-auto mb-4 opacity-20"/>
                            <p>Tvůj batoh je zatím prázdný. Vydej se do obchodu!</p>
                        </div>
                    )}
                    {user.inventory.map((item, idx) => (
                        <div key={idx} className="bg-[#0B0F19] border border-gray-800 rounded-xl p-6 relative group hover:border-blue-500/30 transition shadow-xl">
                            <div className="absolute top-2 right-2 text-xs font-bold text-gray-500 bg-black/50 px-2 py-1 rounded">x{item.quantity}</div>
                            <div className="text-5xl mb-4 text-center">{item.image}</div>
                            <h3 className="font-bold text-white text-center mb-1 uppercase tracking-tight">{item.name}</h3>
                            <p className="text-xs text-gray-400 text-center mb-6 min-h-[40px] leading-relaxed">{item.description}</p>
                            <button onClick={() => handleUse(item)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-blue-900/20">POUŽÍT</button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'shop' && (
                <div>
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 mb-8 flex justify-between items-center backdrop-blur-sm">
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Tvůj aktuální zůstatek</span>
                            <span className="text-3xl font-black text-yellow-500 font-mono drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{user.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                            <Star size={32} className="text-yellow-500 fill-yellow-500 animate-pulse"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {shopArtifacts.map(item => {
                            const isBuying = buyingId === item.id;
                            const canAfford = user.xp >= (item.price || 0);
                            return (
                                <div key={item.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 relative flex flex-col hover:border-yellow-600/50 transition-all duration-300 shadow-xl group">
                                    <div className="text-6xl mb-6 text-center transform group-hover:scale-110 transition duration-500">{item.image}</div>
                                    <h3 className="font-bold text-white text-center mb-2 uppercase tracking-tighter text-lg">{item.name}</h3>
                                    <p className="text-xs text-gray-400 text-center mb-6 flex-1 leading-relaxed">{item.description}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-800/50">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Cena</span>
                                            <span className="font-black text-yellow-500 font-mono text-lg">{item.price} XP</span>
                                        </div>
                                        <button 
                                            onClick={() => handleBuy(item)}
                                            disabled={!canAfford || isBuying}
                                            className={`w-full py-3 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 ${
                                                canAfford 
                                                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5' 
                                                : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            {isBuying ? <Loader2 size={18} className="animate-spin"/> : <><ShoppingBag size={18}/> KOUPIT</>}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <LootBoxModal isOpen={!!activeLootBox} onClose={() => { setActiveLootBox(null); setPendingReward(undefined); }} itemName={activeLootBox?.name || 'Mystery Box'} onRewardRevealed={handleLootBoxRevealed} rewardDetails={pendingReward} />
        </div>
    );
};

export default DashboardInventory;