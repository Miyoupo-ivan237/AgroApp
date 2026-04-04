import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Phone, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import premiumHero from '../assets/premium-hero.png';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'FARMER') navigate('/dashboard/farmer');
            else navigate('/dashboard/buyer');
        }
    }, [user, navigate]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role'); // FARMER or BUYER

    const formatRole = (role) => {
        if (!role) return 'Welcome Back';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() + ' Login';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('auth/login', { phone, password });
            login(res.data.user, res.data.token);
            
            const role = res.data.user.role?.toUpperCase();
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'FARMER') navigate('/dashboard/farmer');
            else navigate('/dashboard/buyer');

        } catch (err) {
            console.error("Login attempt failed:", err);
            const serverError = err.response?.data?.error;
            const status = err.response?.status;
            
            if (status === 404) setError('Phone number not registered. Please create an account first.');
            else if (status === 401) setError('Incorrect password. Please try again or reset it.');
            else if (status === 500) setError(serverError || 'Our servers are hitting a bump. Please try again in a few moments.');
            else setError(serverError || 'Connection failed. Please check your internet or if the server is running.');
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
                            alt="Sustainable Farming" 
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
                                Cultivating <br/>Digital <br/>Prosperity.
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-agro-sand/80 max-w-sm leading-relaxed"
                            >
                                Bridging the gap between the soil and the shelf. Join the digital revolution of Cameroon's agriculture.
                            </motion.p>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-6"
                        >
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-agro-green bg-slate-200 overflow-hidden shadow-lg">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-agro-sand/90">Joined by 10k+ farmers & buyers</p>
                        </motion.div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10 text-center lg:text-left">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agro-green/5 text-agro-green text-sm font-bold mb-6"
                            >
                                <ShieldCheck size={16} /> Secure Portal
                            </motion.div>
                            <h1 className="text-4xl heading-serif text-slate-900 mb-3 leading-tight">
                                {formatRole(selectedRole)}
                            </h1>
                            {!error && <p className="text-slate-500 font-medium tracking-tight">Enter your credentials to access your harvest.</p>}
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-semibold shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                        <AlertCircle size={20} />
                                    </div>
                                    <p className="flex-1">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green group-focus-within:scale-110 transition-all duration-300">
                                        <Phone size={20} />
                                    </span>
                                    <input 
                                        type="tel" 
                                        placeholder="671 234 567" 
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="premium-input"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between items-center group/label">
                                    Password
                                    <button 
                                        type="button"
                                        onClick={() => alert("Password reset is currently only available via Support. Please contact us at support@agroconnect.cm")}
                                        className="text-xs text-agro-green font-bold cursor-pointer hover:underline opacity-60 group-hover/label:opacity-100 transition-opacity"
                                    >
                                        Forgot?
                                    </button>
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green group-focus-within:scale-110 transition-all duration-300">
                                        <Lock size={20} />
                                    </span>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="premium-button mt-4"
                            >
                                {loading ? (
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>Sign In <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center space-y-4">
                            <p className="text-slate-500 font-medium">
                                New to AgroConnect? 
                                <Link 
                                    to={`/register?role=${selectedRole || ''}`} 
                                    className="ml-2 text-agro-green font-bold hover:text-agro-light-green transition-colors underline-offset-4 hover:underline"
                                >
                                    Create Account
                                </Link>
                            </p>
                            <div className="pt-4 border-t border-slate-100">
                                <button 
                                    onClick={() => {
                                        const adminUser = { id: 999, full_name: "System Admin", role: "ADMIN", phone: "600000000" };
                                        login(adminUser, "mock-admin-token");
                                        navigate('/admin');
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-agro-green transition-colors"
                                >
                                    Testing? Click here for Demo Admin Access
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

