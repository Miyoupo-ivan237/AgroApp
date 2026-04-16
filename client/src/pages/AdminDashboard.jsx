import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, ShoppingBag, Truck, BarChart3, 
    ShieldCheck, AlertCircle, Settings, LogOut,
    ArrowUpRight, ArrowDownRight, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingVerifications: 2,
        activeOrders: 0,
        platformRevenue: 0
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [recentActivies, setRecentActivities] = useState([]);

    const [users, setUsers] = useState([
        { id: 1, name: "Ibrahim Ndam", role: "FARMER", location: "Bafoussam", status: "VERIFIED" },
        { id: 2, name: "Marie Ngo", role: "FARMER", location: "Douala", status: "PENDING" },
        { id: 3, name: "John Tabi", role: "BUYER", location: "Yaoundé", status: "VERIFIED" },
        { id: 4, name: "Sali Bello", role: "FARMER", location: "Garoua", status: "PENDING" }
    ]);

    const [pendingRequests, setPendingRequests] = useState([
        { id: 1, userName: "Marie Ngo", type: "Farm Verification", date: "2026-03-18" },
        { id: 2, userName: "Sali Bello", type: "ID Verification", date: "2026-03-17" }
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('admin/stats');
                if (res.data.stats) {
                    setStats({
                        totalUsers: res.data.stats.totalUsers,
                        pendingVerifications: res.data.stats.pendingVerifications,
                        activeOrders: res.data.stats.totalOrders,
                        platformRevenue: res.data.stats.platformRevenue
                    });
                }
                if (res.data.recentUsers) {
                    setRecentActivities(res.data.recentUsers);
                }
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
                if (err.response?.status === 403 || err.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
            }
        };
        fetchStats();
    }, [logout, navigate]);

    const handleApprove = (id) => {
        const req = pendingRequests.find(r => r.id === id);
        setUsers(users.map(u => u.name === req.userName ? { ...u, status: 'VERIFIED' } : u));
        setPendingRequests(pendingRequests.filter(r => r.id !== id));
    };


    if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 font-outfit p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-12 bg-white/5 border border-white/10 rounded-[3rem] max-w-md backdrop-blur-xl"
                >
                    <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Access Restricted</h2>
                    <p className="text-slate-400 font-bold mb-10 leading-relaxed">This terminal is restricted to authorized personnel only. Your access attempt has been logged.</p>
                    <div className="space-y-4">
                        <button onClick={() => navigate('/')} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:scale-[1.02] transition-all">Return to Landing</button>
                        <button onClick={() => { logout(); navigate('/login'); }} className="w-full py-4 bg-red-500/10 text-red-400 rounded-2xl font-black border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-sm">Force Log Out</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#f8fafc] flex font-outfit relative overflow-hidden">
            {/* Mobile Header (Fixed) */}
            <header className="lg:hidden absolute top-0 left-0 right-0 h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-40">
                <div className="flex items-center gap-3">
                    <div className="bg-agro-green p-2 rounded-xl text-white">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="font-black tracking-tighter text-slate-900">ADMIN HUB</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-red-500 hover:bg-red-50 capitalize font-bold text-xs flex items-center gap-2">
                        <LogOut size={18} /> Exit
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-100 rounded-xl text-slate-600">
                        {isMobileMenuOpen ? <AlertCircle size={24} /> : <BarChart3 size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="lg:hidden fixed inset-0 bg-slate-900 z-50 p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-white font-black text-2xl tracking-tighter italic">ADMIN HUB</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white opacity-50"><ShieldCheck size={32}/></button>
                        </div>
                        <nav className="space-y-4 flex-1">
                            <AdminSidebarLink icon={<BarChart3 />} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }} />
                            <AdminSidebarLink icon={<Users />} label="Users" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }} />
                            <AdminSidebarLink icon={<ShieldCheck />} label="Verifications" active={activeTab === 'verifications'} onClick={() => { setActiveTab('verifications'); setIsMobileMenuOpen(false); }} />
                        </nav>
                        <button 
                            onClick={() => { logout(); navigate('/login'); }} 
                            className="mt-auto flex items-center justify-center gap-3 w-full py-5 rounded-3xl bg-red-500 text-white font-black shadow-2xl shadow-red-500/30"
                        >
                            <LogOut size={24} /> DISCONNECT
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Admin Sidebar */}
            <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col border-r border-white/5">
                <div className="p-8 pb-6 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-agro-green p-2 rounded-xl shadow-lg shadow-agro-green/20">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-xl font-black tracking-tighter uppercase italic">ADMIN HUB</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-4">
                    <nav className="space-y-1">
                        <AdminSidebarLink icon={<BarChart3 size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <AdminSidebarLink icon={<Users size={20}/>} label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                        <AdminSidebarLink icon={<Users size={20}/>} label="Verifications" active={activeTab === 'verifications'} onClick={() => setActiveTab('verifications')} />
                        <AdminSidebarLink icon={<ShoppingBag size={20}/>} label="Crops & Orders" active={activeTab === 'crops'} onClick={() => setActiveTab('crops')} />
                        <AdminSidebarLink icon={<Truck size={20}/>} label="Logistics" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
                    </nav>

                </div>
                
                <div className="mt-auto p-8 pt-6 flex-shrink-0 border-t border-white/5">
                    <button 
                        onClick={() => { logout(); navigate('/login'); }} 
                        className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm active:scale-95 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Exit Dashboard
                    </button>
                </div>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto pt-24 lg:pt-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <span className="text-agro-green font-bold text-sm uppercase tracking-widest border-l-4 border-agro-yellow pl-3 mb-2 block tracking-[0.2em]">GOD MODE ACTIVATED</span>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none pt-2 uppercase">
                            {activeTab}
                        </h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                    <StatCard label="Total Users" value={stats.totalUsers} trend="+12%" icon={<Users/>} />
                    <StatCard label="Pending Verif." value={stats.pendingVerifications} trend="-5%" icon={<AlertCircle/>} neutral />
                    <StatCard label="Active Orders" value={stats.activeOrders} trend="+24%" icon={<ShoppingBag/>} />
                    <StatCard label="Platform Gain (10%)" value={`${stats.platformRevenue.toLocaleString()} CFA`} trend="+10%" icon={<BarChart3/>} />
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        <div className="xl:col-span-2 glass-card p-10">
                            <h3 className="text-2xl font-black mb-8">Recent Ecosystem Activity</h3>
                            <div className="space-y-6">
                                {recentActivies.map((u, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-4 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full ${u.role === 'FARMER' ? 'bg-agro-green/10 text-agro-green' : 'bg-agro-orange/10 text-agro-orange'} flex items-center justify-center font-bold`}>{u.full_name?.[0]}</div>
                                            <div>
                                                <p className="font-bold text-slate-800">{u.full_name} <span className="text-[10px] uppercase tracking-widest text-slate-400">({u.role})</span></p>
                                                <p className="text-xs text-slate-400 italic">Joined on {new Date(u.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveTab('users')} className="text-xs font-black uppercase tracking-widest text-agro-green hover:underline">Manage User</button>
                                    </div>
                                ))}
                                {recentActivies.length === 0 && (
                                    <div className="py-20 text-center opacity-30 italic font-bold">No recent activities on the platform yet.</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="glass-card p-10 bg-slate-900 text-white">
                            <h3 className="text-2xl font-black mb-6">Security Hub</h3>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-6">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Admins</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-agro-green rounded-full animate-pulse"></div>
                                    <span className="font-bold">You (Super Admin)</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-8">Role-based access is active. System logs are being analyzed for performance optimization.</p>
                            <button className="w-full py-4 bg-agro-green text-white rounded-2xl font-black shadow-xl shadow-agro-green/20 hover:scale-[1.02] transition-all">Download Audit</button>
                        </div>
                    </div>
                )}

                {activeTab === 'verifications' && (
                    <div className="glass-card p-10">
                        <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
                            <ShieldCheck className="text-agro-green" /> Verification Decision Center
                        </h3>
                        {pendingRequests.length === 0 ? (
                            <div className="py-20 text-center opacity-50">
                                <ShieldCheck size={64} className="mx-auto mb-4" />
                                <p className="font-bold">No pending verification requests.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {pendingRequests.map(req => (
                                    <div key={req.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                <Users className="text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black">{req.userName}</h4>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{req.type} · Requested {req.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => handleApprove(req.id)} className="bg-agro-green text-white px-8 py-4 rounded-xl font-black text-sm shadow-lg shadow-agro-green/20 hover:scale-105 transition-transform active:scale-95">APPROVE</button>
                                            <button className="bg-red-500 text-white px-8 py-4 rounded-xl font-black text-sm shadow-lg shadow-red-500/20 hover:scale-105 transition-transform active:scale-95 text-opacity-80">REJECT</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card p-10 overflow-hidden">
                        <h3 className="text-2xl font-black mb-8">Ecosystem Directory</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 italic text-slate-400 text-xs font-black uppercase tracking-widest">
                                        <th className="pb-6 px-4">User</th>
                                        <th className="pb-6 px-4">Role</th>
                                        <th className="pb-6 px-4">Location</th>
                                        <th className="pb-6 px-4">KYC Status</th>
                                        <th className="pb-6 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map(u => (
                                        <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6 px-4 font-bold text-slate-900">{u.name}</td>
                                            <td className="py-6 px-4">
                                                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${u.role === 'FARMER' ? 'bg-agro-green/10 text-agro-green' : 'bg-blue-50 text-blue-500'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-6 px-4 font-bold text-slate-500">{u.location}</td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${u.status === 'VERIFIED' ? 'bg-agro-green' : 'bg-agro-orange'}`}></div>
                                                    <span className="font-bold text-sm">{u.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <button className="text-agro-green hover:underline font-black text-xs uppercase tracking-widest">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

        </div>
    );
}

function AdminSidebarLink({ icon, label, active = false, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-sm transition-all group w-full text-left ${active ? 'bg-agro-green text-white shadow-xl shadow-agro-green/30' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
            <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-agro-green'} transition-colors`}>{icon}</div>
            {label}
        </button>
    );
}


function StatCard({ label, value, trend, icon, neutral = false }) {
    return (
        <div className="glass-card p-8 group">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-agro-green group-hover:text-white transition-all duration-500">{icon}</div>
                <div className={`flex items-center text-xs font-black px-2 py-1 rounded-lg ${neutral ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-agro-green'}`}>
                    {trend.startsWith('+') ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                    {trend}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    );
}
