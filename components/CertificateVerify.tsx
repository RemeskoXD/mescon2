import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, XCircle, CheckCircle, Award, ArrowLeft, Loader2, Calendar, User as UserIcon, BookOpen, Star, ShieldCheck as ShieldIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Certificate } from '../types';

const MotionDiv = motion.div as any;

interface CertificateVerifyProps {
    allUsers: User[];
    onBack: () => void;
}

const CertificateVerify: React.FC<CertificateVerifyProps> = ({ allUsers, onBack }) => {
    const [searchCode, setSearchCode] = useState('');
    const [result, setResult] = useState<{ cert: Certificate, user: User } | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('verify');
        if (code && allUsers.length > 0) {
            setSearchCode(code);
            handleVerify(code);
        }
    }, [allUsers]); 

    const handleVerify = (codeToSearch: string = searchCode) => {
        const cleanCode = codeToSearch.trim();
        if (!cleanCode) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        setTimeout(() => {
            let foundCert: Certificate | null = null;
            let foundUser: User | null = null;

            for (const user of allUsers) {
                if (user.certificates) {
                    const cert = user.certificates.find(c => 
                        c.code.trim().toUpperCase() === cleanCode.toUpperCase() ||
                        c.id.trim().toUpperCase() === cleanCode.toUpperCase()
                    );
                    if (cert) {
                        foundCert = cert;
                        foundUser = user;
                        break;
                    }
                }
            }

            if (foundCert && foundUser) {
                setResult({ cert: foundCert, user: foundUser });
            } else {
                setError('Certifikát s tímto kódem nebyl nalezen. Ujistěte se, že kód zadáváte správně.');
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="p-6 relative z-10 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 font-black text-2xl tracking-tighter cursor-pointer" onClick={onBack}>
                    <span className="text-white">MESCON</span><span className="text-blue-500">ACADEMY</span>
                </div>
                <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Zpět
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                        <ShieldCheck size={16}/> Verification System
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">Ověření <span className="text-blue-500">Pravosti</span></h1>
                </MotionDiv>

                <div className="w-full max-w-lg relative mb-16">
                    <div className="flex bg-gray-900/80 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl p-2 focus-within:border-blue-500 transition-all">
                        <input value={searchCode} onChange={(e) => setSearchCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerify()} placeholder="Vložte ID certifikátu..." className="flex-1 bg-transparent border-none outline-none px-6 text-white font-mono" />
                        <button onClick={() => handleVerify()} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition">
                            {loading ? <Loader2 className="animate-spin" size={24}/> : <Search size={24}/>}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {result && (
                        <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] text-gray-900 relative">
                            {/* Verified Banner */}
                            <div className="bg-green-600 text-white py-3 flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs">
                                <CheckCircle size={18}/> Tento certifikát je platný a ověřený
                            </div>

                            <div className="p-8 md:p-16 relative flex flex-col md:flex-row gap-12 items-center">
                                {/* Left Side: Visual */}
                                <div className="relative">
                                    <div className="w-48 h-48 bg-gray-100 rounded-[2.5rem] border-4 border-gray-50 overflow-hidden shadow-2xl relative z-10">
                                        {result.user.avatarUrl ? <img src={result.user.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-6xl font-black text-gray-300">{result.user.name?.charAt(0)}</div>}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white border-8 border-white shadow-xl z-20">
                                        <ShieldIcon size={24} fill="currentColor"/>
                                    </div>
                                </div>

                                {/* Right Side: Details */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 font-black text-[10px] tracking-widest uppercase mb-2">
                                        <Star size={12} fill="currentColor"/> Elite Program Graduate <Star size={12} fill="currentColor"/>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-blue-900">{result.cert.studentName}</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kurz</p>
                                            <p className="font-bold text-blue-800">{result.cert.courseName}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Datum Vydání</p>
                                            <p className="font-bold">{result.cert.issueDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kód pravosti</p>
                                            <p className="font-mono text-lg font-bold text-blue-600">{result.cert.code}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vydavatel</p>
                                                <p className="text-xs font-bold">Mescon Academy Elite</p>
                                            </div>
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${window.location.origin}?verify=${result.cert.code}`} className="w-16 h-16 mix-blend-multiply opacity-80" alt="QR"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CertificateVerify;