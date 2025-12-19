import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Lock, CheckCircle, Loader2, AlertCircle, User as UserIcon, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { auth, db } from '../firebase';
// @ts-ignore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types';

// Fix types for framer motion
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const INITIAL_ARTIFACTS_DB = [
  { id: 'a1', name: 'Lektvar Soustředění', description: 'Zvyšuje zisk XP o 100% (2x) na 2 hodiny.', rarity: 'rare', type: 'consumable', image: '🧪', quantity: 1, effectType: 'xp_boost', effectDuration: 2 },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setIsLoginMode(true);
        setEmail('');
        setPassword('');
        setName('');
        setError('');
        setSuccess(false);
        setUsingFallback(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const createUserData = (uid: string, emailStr: string, nameStr: string): User => ({
      id: uid,
      email: emailStr,
      name: nameStr || emailStr.split('@')[0],
      role: 'nope', 
      level: 1,
      xp: 0,
      isBanned: false,
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loginStreak: 1,
      financialProfit: 0,
      profitHistory: [],
      financialRecords: [], // Initialize correctly
      habits: [], // Initialize correctly
      isPublicProfile: false,
      messages: [],
      notifications: [],
      inventory: INITIAL_ARTIFACTS_DB as any,
      activeChallenges: [],
      certificates: [],
      courseProgress: [],
      lessonNotes: {},
      quizHistory: [],
      adminNotes: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        let user;
        let isNewUser = false;
        let finalUserObject: User | null = null;

        try {
            if (isLoginMode) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
            } else {
                if (password.length < 6) throw new Error('Heslo musí mít alespoň 6 znaků.');
                if (!name) throw new Error('Zadejte prosím své jméno.');
                
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
                await updateProfile(user, { displayName: name });
                isNewUser = true;
            }
            
            const userRef = doc(db, "users", user.uid);
            if (isNewUser) {
                finalUserObject = createUserData(user.uid, user.email!, user.displayName || '');
                await setDoc(userRef, finalUserObject);
            } else {
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    await updateDoc(userRef, { lastLogin: new Date().toISOString() });
                    finalUserObject = snap.data() as User;
                } else {
                    finalUserObject = createUserData(user.uid, user.email!, user.displayName || '');
                    await setDoc(userRef, finalUserObject);
                }
            }

        } catch (authErr: any) {
            const errorCode = authErr.code;
            if (errorCode === 'auth/operation-not-allowed' || errorCode === 'auth/admin-restricted-operation') {
                setUsingFallback(true);
                const mockUid = 'mock_' + email.replace(/[^a-zA-Z0-9]/g, '') + '_' + Date.now();
                finalUserObject = createUserData(mockUid, email, name || email.split('@')[0]);
                try {
                    await setDoc(doc(db, "users", mockUid), finalUserObject);
                } catch (dbErr) { console.error(dbErr); }
                onLogin(finalUserObject);
            } else {
                throw authErr;
            }
        }

        setSuccess(true);
        setTimeout(() => onClose(), 1500);

    } catch (err: any) {
        let msg = 'Nastala chyba.';
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            msg = 'Nesprávný email nebo heslo.';
        } else if (err.code === 'auth/email-already-in-use') {
            msg = 'Tento email je již registrován.';
        } else if (err.message) {
            msg = err.message;
        }
        setError(msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <MotionDiv initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-md bg-[#0B0F19] border border-gray-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)]">
        <div className="p-6 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div><span className="font-bold text-white tracking-wider text-sm">MESCON ACADEMY</span></div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition"><X size={20} /></button>
        </div>
        <div className="p-8">
          {!success ? (
            <>
                <h2 className="text-2xl font-bold text-white mb-2">{isLoginMode ? 'Vítejte zpět' : 'Vytvořit účet'}</h2>
                <p className="text-gray-400 mb-6 text-sm">{isLoginMode ? 'Přihlaste se ke svému účtu.' : 'Staňte se členem elity.'}</p>
                {error && <div className="mb-6 p-3 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-400 text-sm"><AlertCircle size={16} /> {error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLoginMode && (
                      <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vaše Jméno" className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500" required />
                      </div>
                  )}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vas@email.cz" className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Heslo" className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-blue-500" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                  <MotionButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 mt-6">
                    {loading ? <Loader2 className="animate-spin" /> : (isLoginMode ? <>Přihlásit se <ArrowRight size={18} /></> : <>Vytvořit účet <CheckCircle size={18} /></>)}
                  </MotionButton>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">{isLoginMode ? 'Ještě nemáte účet?' : 'Již máte účet?'}<button onClick={() => setIsLoginMode(!isLoginMode)} className="ml-2 text-blue-400 font-bold hover:underline">{isLoginMode ? 'Registrovat se' : 'Přihlásit se'}</button></p>
                </div>
            </>
          ) : (
            <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
                <h2 className="text-2xl font-bold text-white mb-2">Úspěch!</h2>
                <p className="text-gray-400">Vstupuji do akademie...</p>
              </MotionDiv>
          )}
        </div>
      </MotionDiv>
    </div>
  );
};

export default AuthModal;