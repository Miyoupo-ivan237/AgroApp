import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, ArrowRight, ShieldCheck, Globe, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'FARMER') navigate('/dashboard/farmer');
            else navigate('/dashboard/buyer');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-outfit overflow-hidden">
            {/* Elegant Header */}
            <header className="p-8 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-2">
                    <div className="bg-agro-green text-white p-2 rounded-lg shadow-lg">
                        <Sprout size={24} />
                    </div>
                    <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">AgroConnect CM</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <span className="hover:text-agro-green cursor-pointer transition-colors">How it works</span>
                    <span className="hover:text-agro-green cursor-pointer transition-colors">Safety</span>
                    {user ? (
                        <button 
                            onClick={() => {
                                if (user.role === 'ADMIN') navigate('/admin');
                                else if (user.role === 'FARMER') navigate('/dashboard/farmer');
                                else navigate('/dashboard/buyer');

                            }}
                            className="bg-agro-green text-white px-6 py-2.5 rounded-xl hover:bg-agro-light-green transition-all shadow-lg active:scale-95"
                        >
                            Dashboard
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-agro-green transition-all shadow-lg active:scale-95"
                        >
                            Sign In
                        </button>
                    )}
                </div>

            </header>

            {/* Main Choice Section */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 gap-8 relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-agro-green/5 rounded-full blur-[120px] -z-10"></div>
                
                {/* Farmer Path */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={() => navigate('/login?role=FARMER')}
                    className="group w-full max-w-xl bg-white rounded-[3rem] p-10 border-2 border-transparent hover:border-agro-green/30 shadow-2xl shadow-slate-900/5 cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-agro-green/5 rounded-bl-[5rem] group-hover:bg-agro-green/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="bg-agro-green w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-agro-green/20 group-hover:rotate-6 transition-transform">
                            <Sprout size={32} />
                        </div>
                        <span className="text-agro-green font-black text-xs uppercase tracking-widest mb-2 block">For Producers</span>
                        <h2 className="text-5xl font-black text-slate-900 leading-none tracking-tighter mb-6">I am a <br/><span className="text-agro-green italic">Farmer.</span></h2>
                        <p className="text-slate-500 text-lg font-bold leading-relaxed mb-10 opacity-70">
                            List your harvest, use AI to scan plant diseases, track your crop calendar, and get paid via MoMo.
                        </p>
                        <div className="flex items-center gap-4 text-agro-green font-black uppercase tracking-widest text-sm">
                            Enter Farmer Portal <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </motion.div>

                {/* Buyer Path */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onClick={() => navigate('/login?role=BUYER')}
                    className="group w-full max-w-xl bg-slate-900 rounded-[3rem] p-10 border-2 border-transparent hover:border-agro-yellow/30 shadow-2xl shadow-slate-900/40 cursor-pointer transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden text-white"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] group-hover:bg-white/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="bg-agro-yellow w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-agro-yellow/30 group-hover:rotate-6 transition-transform">
                            <ShoppingBag size={32} />
                        </div>
                        <span className="text-agro-yellow font-black text-xs uppercase tracking-widest mb-2 block">For Consumers</span>
                        <h2 className="text-5xl font-black text-white leading-none tracking-tighter mb-6">I am a <br/><span className="text-agro-yellow italic">Buyer.</span></h2>
                        <p className="text-slate-300 text-lg font-bold leading-relaxed mb-10 opacity-70">
                            Access fresh products direct from Cameroon's soil, track local delivery, and pay securely with MoMo.
                        </p>
                        <div className="flex items-center gap-4 text-agro-yellow font-black uppercase tracking-widest text-sm">
                            Enter Marketplace <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer / Trust signals */}
            <footer className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 font-bold text-slate-500 text-xs uppercase tracking-widest">
                        <ShieldCheck size={16} /> Verified Farmers
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-500 text-xs uppercase tracking-widest">
                        <Globe size={16} /> Made in Cameroon
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-500 text-xs uppercase tracking-widest">
                        <Star size={16} /> Premium Service
                    </div>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">© 2026 AgroConnect</p>
            </footer>
        </div>
    );
}
