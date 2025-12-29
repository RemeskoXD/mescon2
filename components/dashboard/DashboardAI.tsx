
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Lock, Cpu, Database, Activity, ShieldAlert, Timer, Send, User as UserIcon, Trash2, Shield, Zap, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, SystemSettings } from '../../types';
import { GoogleGenAI } from "@google/genai";

// Fix types for framer motion
const MotionDiv = motion.div as any;

interface DashboardAIProps {
    user: User;
    settings?: SystemSettings;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: string;
}

const DEFAULT_AI_INSTRUCTION = `Jsi Nexus, autonomní AI mentor v Mescon Academy. 
Tvým úkolem je pomáhat studentům s jejich byznysem, marketingem a mindsetem. 
Buď profesionální, inspirativní a mírně futuristický (cyberpunk/AI vibe). 
Máš hluboké znalosti v prodeji (High-ticket sales), budování značky, e-commerce a automatizaci. 
Vždy se snaž dávat praktické rady, které student může hned použít.
Oslovuj uživatele jménem, pokud ho znáš.`;

const DashboardAI: React.FC<DashboardAIProps> = ({ user, settings }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const aiEnabled = settings?.aiEnabled ?? false;
    const systemInstruction = settings?.aiSystemInstruction || DEFAULT_AI_INSTRUCTION;

    // Persist chat history in session storage
    useEffect(() => {
        const saved = sessionStorage.getItem(`nexus_chat_${user.id}`);
        if (saved) {
            setMessages(JSON.parse(saved));
        } else if (aiEnabled) {
            // Initial greeting
            setMessages([{
                role: 'model',
                text: `Zdravím, ${user.name || 'Studente'}. Systém Nexus inicializován. Jsem připraven akcelerovat tvůj byznys. Na čem dnes budeme pracovat?`,
                timestamp: new Date().toISOString()
            }]);
        }
    }, [aiEnabled, user.id, user.name]);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(`nexus_chat_${user.id}`, JSON.stringify(messages));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, user.id]);

    const handleSend = async () => {
        if (!inputText.trim() || isTyping) return;

        const userMsg: ChatMessage = {
            role: 'user',
            text: inputText,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInputText('');
        setIsTyping(true);

        try {
            // Initialize Gemini
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Build conversation history for the model
            const history = updatedMessages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // We create a chat session
            const chat = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `${systemInstruction}\n\nKontext uživatele:\nJméno: ${user.name || 'Neznámé'}\nRole: ${user.role}\nLevel: ${user.level}\nXP: ${user.xp}`,
                    temperature: 0.8,
                    topP: 0.95,
                    topK: 40,
                },
                history: history.slice(0, -1) // All messages except the last one which we send now
            });

            const result = await chat.sendMessage({ message: userMsg.text });
            const modelText = result.text;

            if (modelText) {
                setMessages(prev => [...prev, {
                    role: 'model',
                    text: modelText,
                    timestamp: new Date().toISOString()
                }]);
            }

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                text: "Omlouvám se, mé neuronové spoje jsou momentálně přetížené. Zkus to prosím za chvíli. (Chyba spojení)",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Opravdu smazat historii s Nexusem?")) {
            setMessages([{
                role: 'model',
                text: `Historie vymazána. Jsem opět připraven k akci, ${user.name || 'Studente'}.`,
                timestamp: new Date().toISOString()
            }]);
            sessionStorage.removeItem(`nexus_chat_${user.id}`);
        }
    };

    if (!aiEnabled) {
        return (
            <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-[#050505] border border-gray-800 rounded-2xl overflow-hidden animate-fade-in relative p-8">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <MotionDiv 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 max-w-2xl w-full bg-[#0a0a0a] border border-green-900/30 rounded-3xl p-10 text-center shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>

                    <div className="flex justify-center mb-8 relative">
                        <div className="w-24 h-24 bg-green-900/10 rounded-2xl border border-green-500/30 flex items-center justify-center relative overflow-hidden">
                            <Bot size={48} className="text-green-500 relative z-10"/>
                            <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded border border-yellow-400 shadow-lg">BETA</div>
                    </div>

                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">NEXUS</span></h2>
                    <p className="text-green-500/60 font-mono text-xs uppercase tracking-[0.2em] mb-8">Autonomous Business Intelligence</p>

                    <div className="bg-black/50 border border-gray-800 rounded-xl p-6 text-left space-y-4 mb-8">
                        <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-gray-800 pb-2">
                            <span>SYSTEM_STATUS</span>
                            <span className="text-yellow-500 animate-pulse">● MAINTENANCE_REQUIRED</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3"><Database size={14} className="text-blue-500"/><div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[45%]"></div></div></div>
                            <div className="flex items-center gap-3"><Cpu size={14} className="text-purple-500"/><div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[20%]"></div></div></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                        <Lock size={14}/>
                        <span>Modul je momentálně uzamčen administrátorem.</span>
                    </div>

                    <button disabled className="px-8 py-3 bg-gray-800 border border-gray-700 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center gap-2 mx-auto">
                        <Timer size={16}/> Očekávané spuštění: Q4 2024
                    </button>
                </MotionDiv>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-[#050505] border border-gray-800 rounded-2xl overflow-hidden animate-fade-in relative shadow-2xl">
            {/* Header */}
            <div className="h-16 border-b border-gray-800 bg-[#0a0a0a] px-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-900/20 rounded-xl border border-green-500/30 flex items-center justify-center">
                        <Bot size={24} className="text-green-500"/>
                    </div>
                    <div>
                        <h3 className="font-black text-white text-sm tracking-widest uppercase">Nexus AI Mentor</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-green-500/80 font-mono uppercase tracking-widest">System Online // v3.1.2</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={clearChat} className="p-2 text-gray-600 hover:text-red-400 transition" title="Smazat historii">
                        <Trash2 size={18}/>
                    </button>
                    <div className="h-6 w-px bg-gray-800 hidden md:block"></div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-900/10 border border-green-900/30 rounded-lg">
                        <Zap size={12} className="text-yellow-500" fill="currentColor"/>
                        <span className="text-[10px] font-black text-green-400 uppercase">Flash-Preview Engine</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_-20%,rgba(0,255,100,0.05),transparent_60%)]">
                {messages.map((msg, idx) => {
                    const isModel = msg.role === 'model';
                    return (
                        <MotionDiv 
                            key={idx}
                            initial={{ opacity: 0, x: isModel ? -10 : 10, y: 5 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            className={`flex gap-4 ${isModel ? 'justify-start' : 'justify-end flex-row-reverse'}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${isModel ? 'bg-green-900/20 border-green-500/30 text-green-500' : 'bg-blue-900/20 border-blue-500/30 text-blue-400'}`}>
                                {isModel ? <Bot size={18}/> : <UserIcon size={18}/>}
                            </div>
                            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                                isModel 
                                ? 'bg-[#0a0a0a] border border-gray-800 text-gray-200 rounded-tl-none' 
                                : 'bg-blue-600 text-white rounded-tr-none'
                            }`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                <div className={`text-[10px] mt-2 opacity-40 font-mono ${isModel ? 'text-left' : 'text-right'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </MotionDiv>
                    );
                })}
                {isTyping && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-green-900/20 border border-green-500/30 flex items-center justify-center text-green-500">
                            <Bot size={18}/>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                        </div>
                    </MotionDiv>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0a] border-t border-gray-800 relative z-10">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            className="w-full bg-black border border-gray-700 rounded-xl py-4 pl-6 pr-12 text-white focus:outline-none focus:border-green-500 transition shadow-inner font-medium placeholder:text-gray-700"
                            placeholder="Zadejte dotaz pro Nexus AI..."
                            disabled={isTyping}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             {isTyping ? <Loader2 size={20} className="text-green-500 animate-spin"/> : <Sparkles size={16} className="text-green-900"/>}
                        </div>
                    </div>
                    <button 
                        onClick={handleSend}
                        disabled={isTyping || !inputText.trim()}
                        className="p-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition shadow-lg shadow-green-900/20 transform active:scale-95"
                    >
                        <Send size={24}/>
                    </button>
                </div>
                <div className="max-w-4xl mx-auto flex justify-between items-center mt-3 px-2">
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">Quantum Core Encrypted // No Data Leakage</p>
                    <div className="flex gap-4">
                        <span className="text-[10px] text-gray-600 font-bold uppercase cursor-help hover:text-green-500 transition">Market Analysis</span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase cursor-help hover:text-green-500 transition">Sales Scenarios</span>
                    </div>
                </div>
            </div>

            {/* Decorative Matrix Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.01)_1px,transparent_1px)] bg-[size:20px:20px] pointer-events-none opacity-20"></div>
        </div>
    );
};

export default DashboardAI;
