import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Sprout, ShoppingBag, ArrowRight, ShieldCheck, Globe, Star, 
    Phone, Lock, User, Eye, EyeOff, AlertCircle, Leaf, Truck, CreditCard 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Landing() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    
    // Auth Box State
    const [role, setRole] = useState('FARMER'); // FARMER | BUYER
    const [authMode, setAuthMode] = useState('LOGIN'); // LOGIN | REGISTER
    
    // Form State
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'FARMER') navigate('/dashboard/farmer');
            else navigate('/dashboard/buyer');
        }
    }, [user, navigate]);

    

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (authMode === 'LOGIN') {
                const res = await api.post('auth/login', { phone, password });
                login(res.data.user, res.data.token);
                
                const userRole = res.data.user.role?.toUpperCase();
                if (userRole === 'ADMIN') navigate('/admin');
                else if (userRole === 'FARMER') navigate('/dashboard/farmer');
                else navigate('/dashboard/buyer');
            } else {
                if (fullName.trim().length < 3) throw new Error('Please enter your full name (at least 3 characters).');
                const phoneDigits = phone.replace(/\D/g, '');
                if (phoneDigits.length < 7) throw new Error('Please enter a valid phone number (at least 7 digits).');
                if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
                
                await api.post('auth/register', { full_name: fullName, phone, password, role });
                
                // Auto-login after successful registration
                const res = await api.post('auth/login', { phone, password });
                login(res.data.user, res.data.token);
                
                const userRole = res.data.user.role?.toUpperCase();
                if (userRole === 'ADMIN') navigate('/admin');
                else if (userRole === 'FARMER') navigate('/dashboard/farmer');
                else navigate('/dashboard/buyer');
            }
        } catch (err) {
            console.error("Auth failed:", err);
            const serverError = err.response?.data?.error;
            setError(serverError || err.message || 'Connection failed. Please verify your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-outfit overflow-x-hidden scroll-smooth selection:bg-agro-green/20 selection:text-agro-green">
            {/* Header */}
            <header className="p-6 md:px-12 flex justify-between items-center bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-agro-green text-white p-2.5 rounded-xl shadow-lg shadow-agro-green/30">
                        <Sprout size={24} />
                    </div>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase relative">
                        AgroConnect <span className="text-agro-green">CM</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <a href="#how-it-works" className="hover:text-agro-green transition-all hover:scale-105 active:scale-95">How it works</a>
                    <a href="#safety" className="hover:text-agro-green transition-all hover:scale-105 active:scale-95">Safety</a>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-16 relative">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-0 -translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-agro-green/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-1/3 right-0 translate-x-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-agro-yellow/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

                {/* Left Side: Value Prop */}
                <div className="flex-1 space-y-8 text-center lg:text-left mt-8 lg:mt-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 text-agro-green font-bold text-xs uppercase tracking-widest"
                    >
                        <Star size={16} /> Empowering Local Agriculture
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 }} 
                        className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter"
                    >
                        Soil to <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-agro-light-green">Shelf.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.2 }} 
                        className="text-lg md:text-xl font-bold text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0"
                    >
                        Join the digital revolution. Whether you're a farmer listing your harvest or a buyer looking for fresh local products, AgroConnect makes it secure, fast, and entirely seamless.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 relative w-full max-w-xl aspect-[16/9] border-8 border-white group"
                    >
                        <img 
                            src="/cameroon_agriculture.png" 
                            alt="Agriculture in Cameroon" 
                            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute bottom-6 left-8 z-30">
                            <h3 className="text-white font-black text-2xl tracking-tighter drop-shadow-md">Cameroonian Agriculture</h3>
                            <p className="text-white/80 font-black text-[10px] tracking-widest uppercase mt-1 drop-shadow-sm">Modern & Sustainable</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Interactive Auth Box */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.3 }} 
                    className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-900/10 relative overflow-hidden group border border-white hover:border-slate-100 transition-colors"
                >
                    {/* Top gradient highlight */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-agro-green via-agro-light-green to-agro-yellow"></div>
                    
                    {/* Animated corner decorative blob */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full blur-2xl group-hover:bg-agro-green/10 transition-colors duration-700"></div>

                    {/* Role Selector Tabs (Farmer/Buyer) */}
                    <div className="flex bg-slate-50 p-2 rounded-2xl mb-8 relative border border-slate-100 shadow-inner">
                        <div className={`absolute top-2 bottom-2 w-[calc(50%-8px)] ${role === 'FARMER' ? 'bg-agro-green shadow-agro-green/30' : 'bg-slate-900 shadow-slate-900/30'} rounded-xl shadow-lg transition-all duration-400 ease-out ${role === 'BUYER' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'}`}></div>
                        
                        <button type="button" onClick={() => setRole('FARMER')} className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-300 ${role === 'FARMER' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Sprout size={16} /> Farmer
                        </button>
                        <button type="button" onClick={() => setRole('BUYER')} className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-300 ${role === 'BUYER' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                            <ShoppingBag size={16} /> Buyer
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">
                            {authMode === 'LOGIN' ? 'Welcome Back' : 'Get Started'}
                        </h2>
                        <p className="text-slate-500 font-bold text-sm">
                            {authMode === 'LOGIN' ? 'Enter your credentials to access your portal.' : 'Create your account to join the ecosystem.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="leading-tight">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {authMode === 'REGISTER' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-colors"><User size={20} /></span>
                                    <input type="text" placeholder="Jean Dupont" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-agro-green focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-400" />
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-colors"><Phone size={20} /></span>
                                <input type="tel" placeholder="+237 6xx ..." required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-agro-green focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                {authMode === 'LOGIN' && <button type="button" onClick={() => alert("Password reset via Support: support@agroconnect.cm")} className="text-[10px] font-black uppercase tracking-widest text-agro-green hover:underline">Forgot?</button>}
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-colors"><Lock size={20} /></span>
                                <input type={showPassword ? "text" : "password"} placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-bold text-slate-800 focus:outline-none focus:border-agro-green focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-400" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-agro-green transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] mt-4 ${role === 'FARMER' ? 'bg-agro-green hover:bg-agro-light-green shadow-agro-green/30' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30'}`}
                        >
                            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <>{authMode === 'LOGIN' ? 'Sign In Securely' : 'Complete Registration'} <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-slate-100 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-300">OR</div>
                        
                        <p className="text-slate-500 font-bold text-sm">
                            {authMode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
                            <button type="button" onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className={`ml-2 font-black uppercase text-xs tracking-widest hover:underline underline-offset-4 transition-colors ${role === 'FARMER' ? 'text-agro-green' : 'text-slate-900'}`}>
                                {authMode === 'LOGIN' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-agro-green/5 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-16 lg:mb-24">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest mb-6">
                            <Leaf size={16} /> The Workflow
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">How It Works</h2>
                        <p className="text-slate-500 font-bold text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            A seamless, three-step process connecting local producers with consumers through a simple and robust ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (hidden on mobile) */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500 group">
                            <div className="w-16 h-16 bg-agro-green rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-agro-green/30 group-hover:rotate-6 transition-transform">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. List or Browse</h3>
                            <p className="text-slate-500 font-bold leading-relaxed">Farmers easily list their harvest details, while buyers browse fresh local produce verified by agronomic standards.</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500 group">
                            <div className="w-16 h-16 bg-agro-yellow rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-agro-yellow/30 group-hover:-rotate-6 transition-transform">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Seamless Payments</h3>
                            <p className="text-slate-500 font-bold leading-relaxed">Secure integrations with MTN MoMo ensure payments are instantaneous, fully localized, and highly trustworthy.</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500 group">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-slate-900/30 group-hover:rotate-6 transition-transform">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Track & Receive</h3>
                            <p className="text-slate-500 font-bold leading-relaxed">Monitor delivery status in real-time and ensure ordered goods arrive fresh, right from the farm to the destination.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety Section */}
            <section id="safety" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-agro-green/20 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-agro-yellow font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                            <ShieldCheck size={16} /> Enterprise Grade Security
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter">
                            Trust embedded in <br /><span className="text-agro-yellow italic relative inline-block after:content-[''] after:absolute after:w-full after:h-2 after:bg-agro-yellow/30 after:bottom-2 after:left-0 after:-z-10">every transaction.</span>
                        </h2>
                        <ul className="space-y-6 pt-4">
                            {[
                                'Verified farmers and agronomist-checked produce', 
                                'End-to-end encrypted mobile money processing', 
                                'Transparent and rapid dispute resolution protocol'
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-4 text-slate-300 font-bold text-lg">
                                    <div className="w-8 h-8 rounded-full bg-agro-green/20 flex items-center justify-center text-agro-green shrink-0 mt-0.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-agro-green" />
                                    </div>
                                    <span className="leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex-1 w-full bg-slate-800/50 border border-slate-700 rounded-[3rem] p-10 md:p-12 backdrop-blur-xl shadow-2xl">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-20 h-20 bg-slate-700/50 rounded-3xl flex items-center justify-center border border-slate-600">
                                <ShieldCheck size={40} className="text-agro-yellow" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black tracking-tight mb-2">Secure by Design</h4>
                                <p className="text-slate-400 font-bold text-sm">Your agricultural data is never compromised.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <span>Platform Encryption</span>
                                    <span className="text-agro-green">100%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-agro-green w-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <span>Transaction Security</span>
                                    <span className="text-agro-yellow">Optimal</span>
                                </div>
                                <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-agro-yellow w-[95%] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-agro-green/10 rounded-full flex items-center justify-center text-agro-green">
                                        <Lock size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-300 leading-tight">ISO 27001 Compliant Infrastructure & Data Policies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-950 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-agro-green/5 rounded-full blur-[100px] -z-10"></div>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <Sprout size={24} className="text-agro-green" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter uppercase">
                            AgroConnect <span className="text-agro-green">CM</span>
                        </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-black text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Globe size={16} /> Made in Cameroon</span>
                        <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Star size={16} /> Premium Service</span>
                        <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ShieldCheck size={16} /> Trusted Partners</span>
                    </div>
                    
                    <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">&copy; 2026 AgroConnect</p>
                </div>
            </footer>
        </div>
    );
}
