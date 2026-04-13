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
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
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
            <div className="max-w-md w-full overflow-hidden rounded-[2.5rem] shadow-premium bg-white">
                

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
                                {isResetMode ? 'Reset Password' : formatRole(selectedRole)}
                            </h1>
                            {!error && !resetSuccess && <p className="text-slate-500 font-medium tracking-tight">
                                {isResetMode ? 'Enter your registered phone number and a new password.' : 'Enter your credentials to access your harvest.'}
                            </p>}
                            {resetSuccess && <p className="text-agro-green font-bold tracking-tight">Your password has been successfully reset! You can now log in.</p>}
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

                        <form onSubmit={isResetMode ? async (e) => {
                            e.preventDefault();
                            setError('');
                            setResetSuccess(false);
                            setLoading(true);
                            try {
                                await api.post('auth/reset-password', { phone, new_password: password });
                                setResetSuccess(true);
                                setIsResetMode(false);
                                setPassword('');
                            } catch (err) {
                                setError(err.response?.data?.error || 'Failed to reset password. Please check your phone number.');
                            } finally {
                                setLoading(false);
                            }
                        } : handleLogin} className="space-y-6">
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
                                    {isResetMode ? 'New Password' : 'Password'}
                                    {!isResetMode && (
                                        <button 
                                            type="button"
                                            onClick={() => setIsResetMode(true)}
                                            className="text-xs text-agro-green font-bold cursor-pointer hover:underline opacity-60 group-hover/label:opacity-100 transition-opacity"
                                        >
                                            Forgot?
                                        </button>
                                    )}
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
                                    <>{isResetMode ? 'Reset Password' : 'Sign In'} <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center space-y-4">
                            <p className="text-slate-500 font-medium">
                                {isResetMode ? "Remember your password?" : "New to AgroConnect?"}
                                {isResetMode ? (
                                    <button 
                                        type="button"
                                        onClick={() => setIsResetMode(false)}
                                        className="ml-2 text-agro-green font-bold hover:text-agro-light-green transition-colors underline-offset-4 hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                ) : (
                                    <Link 
                                        to={`/register?role=${selectedRole || ''}`} 
                                        className="ml-2 text-agro-green font-bold hover:text-agro-light-green transition-colors underline-offset-4 hover:underline"
                                    >
                                        Create Account
                                    </Link>
                                )}
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

