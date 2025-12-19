import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, ShieldCheck, Loader2, CreditCard, AlertTriangle, Zap, Coffee } from 'lucide-react';
import { db } from '../firebase';
import { addDoc, collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { User } from '../types';

const MotionDiv = motion.div as any;

// DŮLEŽITÉ: Zde vložte své LIVE Price IDs ze Stripe Dashboardu
const STRIPE_PRICES = {
    BASIC_MONTHLY: "price_1SCINJLeLiqqLf4Tp48HqYq7", 
    BASIC_YEARLY: "price_1SCJuCLeLiqqLf4ToI1OBxNX",  
    PREMIUM_YEARLY: "price_1SC6KHLeLiqqLf4TgtP9I24B", 
    TRIAL: "price_1SeiBNLeLiqqLf4TFxgis7xy"          
};

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    planName: string;
    price: number;
    user?: User;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess, planName, price, user }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSimulationFallback, setShowSimulationFallback] = useState(false);

    useEffect(() => {
        if(isOpen) {
            setLoading(false);
            setError('');
            setShowSimulationFallback(false);
        }
    }, [isOpen]);

    // Pokud platba visí moc dlouho, nabídneme simulaci (užitečné pro dev/preview)
    useEffect(() => {
        let timer: any;
        if (loading) {
            timer = setTimeout(() => setShowSimulationFallback(true), 6000);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const getPriceId = () => {
        if (planName === 'TRIAL') return STRIPE_PRICES.TRIAL;
        if (planName === 'BASIC_MONTHLY') return STRIPE_PRICES.BASIC_MONTHLY;
        if (planName === 'BASIC_YEARLY') return STRIPE_PRICES.BASIC_YEARLY;
        if (planName === 'PREMIUM_YEARLY' || planName === 'PREMIUM') return STRIPE_PRICES.PREMIUM_YEARLY;
        return STRIPE_PRICES.BASIC_YEARLY;
    };

    const handleStripeCheckout = async () => {
        if (!user) {
            setError("Pro dokončení nákupu se musíte přihlásit.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const priceId = getPriceId();
            const mode = planName === 'TRIAL' ? 'payment' : 'subscription';
            
            // 1. Vytvoření dokumentu v checkout_sessions (Firebase Extension logic)
            const checkoutSessionRef = await addDoc(collection(db, "customers", user.id, "checkout_sessions"), {
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
                mode: mode, 
                allow_promotion_codes: true,
            });

            // 2. Poslouchání změn
            onSnapshot(checkoutSessionRef, (snap) => {
                const data = snap.data();
                if (data?.error) {
                    setError(`Stripe Chyba: ${data.error.message}`);
                    setLoading(false);
                }
                if (data?.url) {
                    if (data.url.includes("checkout.stripe.com")) {
                        window.location.assign(data.url);
                    }
                }
            });

        } catch (err: any) {
            console.error("Checkout Error:", err);
            setError("Chyba při komunikaci s platebním serverem.");
            setLoading(false);
        }
    };

    // Funkce pro simulaci úspěšné platby (jen pro testovací účely v preview)
    const handleSimulatePayment = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const newRole = planName.includes('PREMIUM') ? 'premium' : 'student';
            const expDate = new Date();
            expDate.setFullYear(expDate.getFullYear() + 1);
            
            await updateDoc(doc(db, "users", user.id), {
                role: newRole,
                planExpires: expDate.toISOString()
            });
            
            setLoading(false);
            onSuccess();
            onClose();
            window.location.reload(); // Obnovit pro aplikování změn
        } catch (e) {
            setError("Simulace selhala.");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const displayPlanName = () => {
        if (planName === 'TRIAL') return 'Aktivace Trial';
        if (planName.includes('BASIC')) return 'Basic Program';
        if (planName.includes('PREMIUM')) return 'Premium Program';
        return planName;
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <MotionDiv 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0B0F19] w-full max-w-md rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative"
            >
                <div className="bg-gray-900/50 p-6 border-b border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-green-500"/>
                        <span className="font-bold text-white text-sm">Zabezpečená platba</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition"><X size={20}/></button>
                </div>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/50">
                        <CreditCard size={32} className="text-blue-500"/>
                    </div>

                    <h2 className="text-2xl font-black text-white mb-2">{displayPlanName()}</h2>
                    <p className="text-gray-400 text-sm mb-8">Okamžitý přístup k elitnímu vzdělání a uzavřené komunitě.</p>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Celkem k úhradě:</span>
                        <span className="text-xl font-bold text-white">{price.toLocaleString()} Kč</span>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg flex items-start gap-2 text-red-400 text-xs text-left mb-6">
                            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5"/>
                            <div><p className="font-bold">Chyba</p><p>{error}</p></div>
                        </div>
                    )}

                    <button 
                        onClick={handleStripeCheckout}
                        disabled={loading}
                        className="w-full py-4 bg-[#635BFF] hover:bg-[#534be0] rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18}/> Připojuji bránu...</> : <>Zaplatit kartou <Lock size={16}/></>}
                    </button>
                    
                    <AnimatePresence>
                        {showSimulationFallback && (
                            <MotionDiv initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mt-4 pt-4 border-t border-gray-800">
                                <p className="text-[10px] text-gray-500 mb-3 italic">Stripe brána se nehlásí? Můžete platbu simulovat.</p>
                                <button 
                                    onClick={handleSimulatePayment}
                                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                >
                                    <Coffee size={14}/> Simulovat Úspěšnou Platbu (Dev)
                                </button>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                    
                    <p className="text-[10px] text-gray-600 mt-6 uppercase tracking-widest font-bold">Powered by Stripe & Mescon Systems</p>
                </div>
            </MotionDiv>
        </div>
    );
};

export default CheckoutModal;