import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Phone, Lock, User, Briefcase, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../services/api';
import premiumHero from '../assets/premium-hero.png';

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rawRole = queryParams.get('role')?.toUpperCase();
    const initialRole = ['FARMER', 'BUYER'].includes(rawRole) ? rawRole : 'BUYER';

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        password: '',
        role: initialRole
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const validateForm = () => {
        if (formData.full_name.trim().length < 3) {
            setError('Please enter your full name (at least 3 characters).');
            return false;
        }
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            setError('Please enter a valid phone number (at least 7 digits).');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.post('auth/register', formData);
            setStep(2); // Success state
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] shadow-premium bg-white">
                
                {/* Visual Side */}
                <div className="hidden lg:block relative bg-agro-green overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <img 
                            src={premiumHero} 
                            alt="Agriculture" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-agro-green via-agro-green/80 to-transparent"></div>
                    
                    <div className="relative h-full flex flex-col justify-between p-12 text-white">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-12 h-12 glass flex items-center justify-center rounded-2xl shadow-glow text-white">
                                <Sprout size={28} />
                            </div>
                            <span className="text-2xl font-bold tracking-tighter uppercase font-outfit">AgroConnect CM</span>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h2 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl heading-serif leading-tight"
                            >
                                Your Future <br/>Starts in <br/>the Soil.
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-agro-sand/80 max-w-sm leading-relaxed"
                            >
                                Join thousands of farmers and buyers transforming the agricultural landscape of Cameroon.
                            </motion.p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Direct Market Access",
                                "Secure Mobile Payments",
                                "Expert Agronomist Support"
                            ].map((text, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-agro-sand/90"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-agro-light-green" />
                                    </div>
                                    <span className="font-medium">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-md w-full mx-auto"
                            >
                                <div className="mb-10 text-center lg:text-left">
                                    <h1 className="text-4xl heading-serif text-slate-900 mb-3 leading-tight">Create Account</h1>
                                    <p className="text-slate-500 font-medium tracking-tight">Choose your role and start your journey.</p>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-semibold shadow-sm"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                            <AlertCircle size={20} />
                                        </div>
                                        <p className="flex-1">{error}</p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-all duration-300">
                                                <User size={20} />
                                            </span>
                                            <input 
                                                type="text" 
                                                placeholder="Jean Dupont" 
                                                required
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                                className="premium-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-all duration-300">
                                                <Phone size={20} />
                                            </span>
                                            <input 
                                                type="tel" 
                                                placeholder="+237 671 ..." 
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="premium-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-all duration-300">
                                                <Lock size={20} />
                                            </span>
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="••••••••" 
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                className="premium-input"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-agro-green transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">I am a...</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'FARMER', label: 'Farmer', icon: Sprout },
                                                { id: 'BUYER', label: 'Buyer', icon: Briefcase }
                                            ].map((role) => (
                                                <button 
                                                    key={role.id}
                                                    type="button" 
                                                    onClick={() => setFormData({...formData, role: role.id})}
                                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-bold group ${formData.role === role.id ? 'border-agro-green bg-agro-green/5 text-agro-green shadow-glow' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    <role.icon size={24} className={`transition-transform duration-300 ${formData.role === role.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                                                    <span className="text-xs uppercase tracking-widest">{role.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="premium-button mt-6"
                                    >
                                        {loading ? (
                                            <motion.div 
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                        ) : (
                                            <>Create Account <ArrowRight size={20} /></>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-10 text-center">
                                    <p className="text-slate-500 font-medium">
                                        Already have an account? 
                                        <Link to={`/login?role=${formData.role}`} className="ml-2 text-agro-green font-bold hover:text-agro-light-green transition-colors underline-offset-4 hover:underline">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8"
                            >
                                <div className="relative mx-auto w-32 h-32">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 bg-agro-green/10 rounded-full"
                                    />
                                    <div className="relative w-full h-full flex items-center justify-center text-agro-green">
                                        <CheckCircle2 size={64} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-4xl heading-serif text-slate-900 mb-4">Registration Successful!</h2>
                                    <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">Your agricultural journey begins now. Redirecting you to login...</p>
                                </div>
                                <motion.div 
                                    className="h-1.5 bg-agro-green/20 rounded-full mx-auto w-32 overflow-hidden"
                                >
                                    <motion.div 
                                        className="h-full bg-agro-green"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "0%" }}
                                        transition={{ duration: 2.5 }}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

