import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    PlusCircle, LogOut, Package, LayoutDashboard, 
    BarChart3, Settings, HelpCircle, ArrowRight, 
    Sprout, MapPin, Tag, Weight, CalendarDays, 
    Truck, GraduationCap, Wallet, ShieldAlert,
    ArrowUpRight, Search, AlertCircle, Clock,
    Zap, Plus, Trash2, Upload, Loader2, Shield, Camera,
    Bell, MessageCircle, Star, TrendingUp, CloudSun,
    Warehouse, Users, BarChart, Sparkles, Droplets, AlertTriangle,
    Mic, Lightbulb
} from 'lucide-react';

import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CAMEROON_SEASONAL_DATA, LEARNING_HUB_DATA, MARKET_PRICES, FR_MARKET_PRICES, AI_TIPS, AI_FR_TIPS } from './FarmerAssets';




export default function FarmerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [crops, setCrops] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [showRegisterTransport, setShowRegisterTransport] = useState(false);
    const [transportForm, setTransportForm] = useState({ vehicle_type: '', price_per_trip_fcfa: '', location: '', phone_number: '' });
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('agro_lang') || 'en');
    const [searchQuery, setSearchQuery] = useState('');


    const [cropError, setCropError] = useState('');
    const [aiGuideResult, setAiGuideResult] = useState(null);
    const [aiGuideLoading, setAiGuideLoading] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [showCalendarForm, setShowCalendarForm] = useState(false);
    const [calendarForm, setCalendarForm] = useState({ name: '', plantedDate: '', nextTask: '', taskDate: '' });
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizScore, setQuizScore] = useState(null);
    
    const handleGenerateQuiz = async (cropName) => {
        setQuizLoading(true);
        setActiveQuiz(null);
        setQuizScore(null);
        try {
            const res = await api.post('ai/quiz-gen', { crop_name: cropName, lang: language });
            setActiveQuiz(res.data.quiz);
        } catch (err) {
            console.error("Quiz generation failed", err);
        } finally {
            setQuizLoading(false);
        }
    };
    
    // Wallet State
    const [withdrawForm, setWithdrawForm] = useState({ amount: '', phone: '', method: 'Orange Money' });
    const [balance, setBalance] = useState(250500);
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'Sale', desc: 'White Maize (500kg)', amount: '+125,000', date: '22 Mar, 2026', status: 'Completed' },
        { id: 2, type: 'Withdraw', desc: 'To MoMo (6xxxxx)', amount: '-50,000', date: '21 Mar, 2026', status: 'Pending' },
        { id: 3, type: 'Sale', desc: 'Cassava (200kg)', amount: '+45,000', date: '19 Mar, 2026', status: 'Completed' }
    ]);

    const handleAskAI = async () => {
        if (!searchQuery) return;
        setAiGuideLoading(true);
        try {
            const res = await api.post('ai/guide', { plant_name: searchQuery, lang: language });
            setAiGuideResult(res.data.data);
        } catch (err) {
            console.error("AI Guide error", err);
        } finally {
            setAiGuideLoading(false);
        }
    };

    // Form State for listing crops
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Tubers');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [region, setRegion] = useState('');

    // AI Doctor State
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [diagnosis, setDiagnosis] = useState(null);

    // AI Bag Scan State
    const [bagScanState, setBagScanState] = useState('idle'); // idle, scanning, result
    const [bagResult, setBagResult] = useState(null);

    const handleBagScan = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setBagScanState('scanning');
        setBagResult(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('ai/bag_scan', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBagResult(res.data);
            setBagScanState('result');
        } catch (err) {
            console.error("Bag scan failed", err);
            setBagScanState('idle');
            alert(language === 'en' ? "Bag Scan Failed. Please try a clearer photo." : "Le scan des sacs a échoué. Essayez une photo plus claire.");
        }
    };

    // Calendar State
    const [myCalendar, setMyCalendar] = useState([
        { id: '1', name: 'White Maize', plantedDate: '2026-03-01', stage: 'Early Growth', nextTask: 'Apply Urea', taskDate: '2026-03-20', progress: 15 }
    ]);

    // Weather & Region State
    const [weatherRegion, setWeatherRegion] = useState('West (Bafoussam)');
    const REGIONS = ['West (Bafoussam)', 'Littoral (Douala)', 'Center (Yaoundé)', 'South West (Buea)', 'North (Garoua)'];

    // Storage Hub State
    const [storageFacilities, setStorageFacilities] = useState([
        { id: 1, name: 'Main Warehouse', location: 'Bafoussam Sector 4', capacity: 2000, used: 1200, color: 'border-agro-green', fill: '65%' },
        { id: 2, name: 'Drying Yard', location: 'Direct Exposure Zone', capacity: 2000, used: 400, color: 'border-agro-orange', fill: '20%' }
    ]);
    const [showStorageModal, setShowStorageModal] = useState(false);
    const [storageForm, setStorageForm] = useState({ name: '', location: '', capacity: '' });

    // Community Forum State
    const [forumPosts, setForumPosts] = useState([
        { id: 1, user: 'Farmer Jean', active: '5m ago', topic: 'Pest control for tomatoes', replies: 12, category: 'TIPS' },
        { id: 2, user: 'Agro Marie', active: '1h ago', topic: 'Best MoMo payout time?', replies: 45, category: 'FINANCE' },
        { id: 3, user: 'Chief Albert', active: '2h ago', topic: 'West Region Rainfall patterns', replies: 8, category: 'WEATHER' }
    ]);
    const [showForumModal, setShowForumModal] = useState(false);
    const [forumForm, setForumForm] = useState({ topic: '', category: 'TIPS' });

    useEffect(() => {
        if (user) {
            fetchMyCrops();
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'transport') {
            fetchTransporters();
        }
    }, [activeTab]);

    const fetchMyCrops = async () => {
        try {
            // Pass farmer_id to API for server-side filtering (optimization)
            const res = await api.get(`crops?farmer_id=${user.id}`);
            const data = Array.isArray(res.data) ? res.data : [];
            setCrops(data);
        } catch (err) {
            console.error('Failed to fetch crops', err);
        }
    };

    const fetchTransporters = async () => {
        try {
            const res = await api.get('logistics');
            setTransporters(res.data);
        } catch (err) {
            console.error('Failed to fetch transporters', err);
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newCrop = {
                name,
                category,
                quantity_available_kg: parseFloat(quantity),
                price_per_kg_fcfa: parseFloat(price),
                region_location: region
            };
            await api.post('crops', newCrop);
            fetchMyCrops();
            setName(''); setQuantity(''); setPrice(''); setRegion('');
        } catch (err) {
            console.error('Error adding crop:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setAnalyzing(true);
        setDiagnosis(null);
        
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await api.post('ai/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDiagnosis(res.data);
        } catch (err) {
            console.error('AI Analysis failed', err);
            setDiagnosis({ error: 'Failed to analyze image. Please try again.' });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAddFacility = (e) => {
        e.preventDefault();
        const facility = {
            id: Date.now(),
            name: storageForm.name,
            location: storageForm.location,
            capacity: parseInt(storageForm.capacity),
            used: 0,
            color: 'border-blue-500',
            fill: '0%'
        };
        setStorageFacilities([...storageFacilities, facility]);
        setStorageForm({ name: '', location: '', capacity: '' });
        setShowStorageModal(false);
        alert(language === 'en' ? 'Facility Added Successfully!' : 'Espace ajouté avec succès !');
    };

    const handleAddForumPost = (e) => {
        e.preventDefault();
        const post = {
            id: Date.now(),
            user: user.full_name || 'Me',
            active: 'Just now',
            topic: forumForm.topic,
            replies: 0,
            category: forumForm.category || 'TIPS'
        };
        setForumPosts([post, ...forumPosts]);
        setForumForm({ topic: '', category: 'TIPS' });
        setShowForumModal(false);
        alert(language === 'en' ? 'Posted successfully!' : 'Posté avec succès !');
    };

    const handleDeleteCrop = async (id) => {
        if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this listing?' : 'Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
        try {
            await api.delete(`crops?id=${id}`);
            fetchMyCrops();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRegisterTransport = async (e) => {
        e.preventDefault();
        try {
            await api.post('logistics', transportForm);
            setTransportForm({ vehicle_type: '', price_per_trip_fcfa: '', location: '', phone_number: '' });
            setShowRegisterTransport(false);
            fetchTransporters();
            alert(language === 'en' ? 'Transporter Registered Successfully!' : 'Transporteur enregistré avec succès !');
        } catch (err) {
            console.error('Transport registration failed', err);
        }
    };

    const handleTrackCrop = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now().toString(),
            ...calendarForm,
            progress: 5,
            stage: language === 'en' ? 'Just Planted' : 'Vient d\'être planté'
        };
        setMyCalendar([...myCalendar, newItem]);
        setCalendarForm({ name: '', plantedDate: '', nextTask: '', taskDate: '' });
        setShowCalendarForm(false);
        alert(language === 'en' ? 'New Timeline Added!' : 'Nouveau suivi ajouté !');
    };

    const handleWithdraw = (e) => {
        e.preventDefault();
        const amt = parseFloat(withdrawForm.amount);
        if (amt > balance) {
            alert(language === 'en' ? 'Insufficient Balance!' : 'Solde insuffisant !');
            return;
        }
        if (amt < 500) {
            alert(language === 'en' ? 'Minimum withdrawal is 500 CFA' : 'Le retrait minimum est de 500 CFA');
            return;
        }
        
        setBalance(prev => prev - amt);
        const newTx = {
            id: Date.now(),
            type: 'Withdraw',
            desc: `To ${withdrawForm.method} (${withdrawForm.phone})`,
            amount: `-${amt.toLocaleString()}`,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2026' }),
            status: 'Processing'
        };
        setTransactions([newTx, ...transactions]);
        alert(language === 'en' 
            ? `Withdrawal of ${amt} CFA to ${withdrawForm.phone} via ${withdrawForm.method} initiated!` 
            : `Retrait de ${amt} CFA vers ${withdrawForm.phone} via ${withdrawForm.method} initié !`);
        setWithdrawForm({ amount: '', phone: '', method: 'Orange Money' });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-outfit">
            {/* Extended Professional Sidebar */}
            <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col border-r border-white/5">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-agro-green p-2 rounded-xl shadow-lg shadow-agro-green/20">
                                <Sprout size={24} />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter uppercase italic">AgroConnect</h2>
                        </div>
                        {/* Language Switcher */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button 
                                onClick={() => { setLanguage('en'); localStorage.setItem('agro_lang', 'en'); }}
                                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${language === 'en' ? 'bg-agro-green text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                EN
                            </button>
                            <button 
                                onClick={() => { setLanguage('fr'); localStorage.setItem('agro_lang', 'fr'); }}
                                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${language === 'fr' ? 'bg-agro-green text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                FR
                            </button>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <SidebarLink icon={<LayoutDashboard size={20}/>} label={language === 'en' ? 'Overview' : 'Aperçu'} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <SidebarLink icon={<Tag size={20}/>} label={language === 'en' ? 'Marketplace Hub' : 'Marché Agricole'} active={activeTab === 'market'} onClick={() => setActiveTab('market')} />
                        <SidebarLink icon={<ShieldAlert size={20}/>} label={language === 'en' ? 'IA Plant Doctor' : 'IA Docteur Plante'} active={activeTab === 'doctor'} onClick={() => setActiveTab('doctor')} />
                        <SidebarLink icon={<GraduationCap size={20}/>} label={language === 'en' ? 'Learning Hub' : 'Centre d\'Apprentissage'} active={activeTab === 'learning'} onClick={() => setActiveTab('learning')} />
                        <SidebarLink icon={<CalendarDays size={20}/>} label={language === 'en' ? 'Crop Calendar' : 'Calendrier Culture'} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                        <SidebarLink icon={<CloudSun size={20}/>} label={language === 'en' ? 'Weather & Advisor' : 'Météo & Conseil'} active={activeTab === 'weather'} onClick={() => setActiveTab('weather')} />
                        <SidebarLink icon={<TrendingUp size={20}/>} label={language === 'en' ? 'Price Tracker' : 'Suivi des Prix'} active={activeTab === 'prices'} onClick={() => setActiveTab('prices')} />
                        <SidebarLink icon={<BarChart size={20}/>} label={language === 'en' ? 'AI Bag Scan' : 'Sac Analytique IA'} active={activeTab === 'bag_scan'} onClick={() => setActiveTab('bag_scan')} />
                        <SidebarLink icon={<Warehouse size={20}/>} label={language === 'en' ? 'Storage Hub' : 'Espace Stockage'} active={activeTab === 'storage'} onClick={() => setActiveTab('storage')} />
                        <SidebarLink icon={<Users size={20}/>} label={language === 'en' ? 'Community Forum' : 'Forum Communautaire'} active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
                        <SidebarLink icon={<Truck size={20}/>} label={language === 'en' ? 'Transport & Delivery' : 'Transport & Livraison'} active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} />
                        
                        <div className="pt-8 pb-4">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Finance</p>
                            <SidebarLink icon={<Wallet size={20}/>} label={language === 'en' ? 'MoMo Wallet' : 'Portefeuille MoMo'} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                        </div>
                    </nav>
                </div>
                
                <div className="mt-auto p-8 pt-0">
                    <button 
                        onClick={() => { logout(); navigate('/login'); }} 
                        className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm active:scale-95 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> {language === 'en' ? 'Sign Out' : 'Déconnexion'}
                    </button>
                </div>
            </aside>


            {/* Main Scrollable Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                {/* CIANA / CNI Identity Security Banner */}
                {!user?.is_verified && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border-2 border-white/10 p-10 rounded-[3rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-agro-green/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="flex items-center gap-8 text-white relative z-10">
                            <div className="bg-agro-green p-6 rounded-[2rem] shadow-2xl shadow-agro-green/40 text-white animate-pulse">
                                <ShieldAlert size={36} />
                            </div>
                            <div>
                                <h4 className="font-black text-3xl tracking-tighter uppercase italic">CIANA / CNI Identity Security</h4>
                                <p className="text-sm font-bold opacity-60 max-w-md leading-relaxed mt-2 uppercase tracking-widest text-agro-sand">
                                    {language === 'en' 
                                        ? 'Account restricted. Upload a Photo of your Farm or your National ID (CNI) to enable MoMo payouts & seller alerts.' 
                                        : 'Compte restreint. Téléchargez une Photo de votre Ferme ou votre CNI pour activer les paiements MoMo.'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActiveTab('verification')}
                            className="bg-agro-green text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl active:scale-95 whitespace-nowrap relative z-10 flex items-center gap-4"
                        >
                            {language === 'en' ? 'VERIFY IDENTITY NOW' : 'VÉRIFIER L\'IDENTITÉ'} <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}

                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-agro-green font-bold text-sm uppercase tracking-widest border-l-4 border-agro-yellow pl-3 mb-2 block tracking-[0.2em]">FARMER PORTAL</span>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter capitalize leading-none pt-2">
                             {activeTab.replace('_', ' ')}
                        </h1>
                    </motion.div>

                    {/* Premium Language Switcher */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex bg-white p-2 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-900/5 group"
                    >
                        <button 
                            onClick={() => { setLanguage('en'); localStorage.setItem('agro_lang', 'en'); }}
                            className={`px-8 py-3 text-xs font-black rounded-full transition-all flex items-center gap-2 ${language === 'en' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-agro-green"></span>
                            ENGLISH
                        </button>
                        <button 
                            onClick={() => { setLanguage('fr'); localStorage.setItem('agro_lang', 'fr'); }}
                            className={`px-8 py-3 text-xs font-black rounded-full transition-all flex items-center gap-2 ${language === 'fr' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-agro-yellow"></span>
                            FRANÇAIS
                        </button>
                    </motion.div>
                </header>

                {/* Modular Content Sections */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard icon={<Tag/>} label={language === 'en' ? 'Total Listings' : 'Annonces Totales'} value={crops.length} color="bg-agro-green" />
                                <StatCard icon={<Wallet/>} label={language === 'en' ? 'Pending Payouts' : 'Paiements Attente'} value="0 CFA" color="bg-agro-orange" />
                                <StatCard icon={<Truck/>} label={language === 'en' ? 'Deliveries' : 'Livraisons'} value="0" color="bg-agro-yellow" />
                               <div className="xl:col-span-2 glass-card p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter italic">
                                        <Bell className="text-agro-orange animate-bounce" size={24}/>
                                        {language === 'en' ? 'Buyer Inspection Hub' : 'Centre d\'Inspection'}
                                    </h3>
                                    <span className="bg-agro-orange/10 text-agro-orange px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">Incoming SMS Alerts</span>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { buyer: "Abena Jean", item: "White Corn", status: "NEGOTIATING", location: "Yaoundé", time: "Just now" },
                                        { buyer: "Talla Marie", item: "Organic Tomatoes", status: "INSPECTION REQ", location: "Douala", time: "30m ago" }
                                    ].map((alert, i) => (
                                        <div key={i} className="flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-agro-green/30 transition-all group gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-agro-orange shadow-inner border border-slate-100 group-hover:rotate-6 transition-transform">
                                                    <MessageCircle size={28} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-black text-xl text-slate-800 tracking-tight">{alert.buyer}</p>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${alert.status === 'NEGOTIATING' ? 'bg-blue-100 text-blue-600' : 'bg-agro-orange/10 text-agro-orange'}`}>{alert.status}</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.time} · Wants to inspect {alert.item} in {alert.location}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 w-full md:w-auto">
                                                <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-agro-green transition-all" onClick={() => window.open(`tel:698415093`)}>CALL BUYER</button>
                                                <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-agro-green transition-all" onClick={() => window.alert('SMS Sent to buyer: "Hello, I am ready for inspection. Where should we meet?"')}>SEND SMS</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>


                        </motion.div>
                    )}

                    {activeTab === 'market' && (
                        <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                            <div className="xl:col-span-5">
                                <div className="glass-card p-10">
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><PlusCircle className="text-agro-green"/> List New Harvest</h3>
                                    <form onSubmit={handleAddCrop} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Produce Name</label>
                                            <input type="text" required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Red Peppers" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                            <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold appearance-none cursor-pointer">
                                                <option>Tubers</option><option>Fruits</option><option>Grains</option><option>Vegetables</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Weight size={14}/> Qty (KG)</label>
                                                <input type="number" required value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="500" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">Price/KG</label>
                                                <input type="number" required value={price} onChange={e=>setPrice(e.target.value)} placeholder="300" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><MapPin size={14}/> Region</label>
                                            <input type="text" required value={region} onChange={e=>setRegion(e.target.value)} placeholder="e.g. West Region" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full btn-primary py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50">
                                            {loading ? 'Publishing...' : <><PlusCircle size={20}/> Publish to Market</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="xl:col-span-7">
                                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-slate-200 p-8 h-full">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-2xl font-black text-slate-900">Active Listings</h3>
                                        <div className="text-xs font-black uppercase tracking-widest text-agro-green bg-agro-green/10 px-3 py-1.5 rounded-full">{crops.length} Items Live</div>
                                    </div>
                                    {crops.length === 0 ? <div className="flex flex-col items-center justify-center py-24 text-center"><Package size={64} className="text-slate-200 mb-6" /><p className="font-bold text-slate-400">No active harvest listings found.</p></div> : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <AnimatePresence>
                                                {crops.map((crop, i) => (
                                                    <motion.div 
                                                        key={crop.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-agro-green transition-all group relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-agro-green/5 rounded-bl-full -mr-4 -mt-4 group-hover:bg-agro-green/10 transition-colors"></div>
                                                        
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-agro-green bg-agro-green/10 px-2 py-1 rounded-md mb-2 inline-block italic">
                                                                    {crop.category}
                                                                </span>
                                                                <h4 className="font-black text-xl text-slate-800 tracking-tight">{crop.name}</h4>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-6 mb-4">
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Stock</p>
                                                                <p className="text-lg font-black text-slate-800">{crop.quantity_available_kg} <span className="text-xs">kg</span></p>
                                                            </div>
                                                            <div className="h-8 w-[1px] bg-slate-100"></div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Market Price</p>
                                                                <p className="text-lg font-black text-agro-orange">{crop.price_per_kg_fcfa} <span className="text-xs italic">CFA</span></p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-4">
                                                            <div className="flex items-center text-[10px] font-bold text-slate-400">
                                                                <MapPin size={12} className="mr-1 text-agro-yellow" /> {crop.region_location}
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-agro-green hover:underline">Edit Hub</button>
                                                                <button 
                                                                    onClick={() => handleDeleteCrop(crop.id)}
                                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'doctor' && (

                        <motion.div key="doctor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12 pb-20">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Scanner UI */}
                                <div className="space-y-8">
                                    <div className="glass-card p-10 bg-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-agro-green/5 rounded-full -mr-32 -mt-32"></div>
                                        <h3 className="text-3xl font-black mb-6 flex items-center gap-3"><ShieldAlert className="text-agro-green" size={32}/> {language === 'en' ? 'IA Plant Doctor' : 'IA Docteur Plante'}</h3>
                                        <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                                            {language === 'en' 
                                                ? 'Upload a clear photo of your plant leaves. Our AI will detect diseases and suggest treatments in seconds.' 
                                                : 'Téléchargez une photo claire des feuilles de votre plante. Notre IA détectera les maladies et suggérera des traitements.'}
                                        </p>

                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                capture="environment"
                                                onChange={handleFileSelect}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className={`border-4 border-dashed rounded-[3rem] p-12 text-center transition-all relative overflow-hidden ${previewUrl ? 'border-agro-green bg-agro-green/5' : 'border-slate-100 hover:border-agro-green/30 bg-slate-50'}`}>
                                                {!previewUrl ? (
                                                    <div className="space-y-4">
                                                        <div className="w-20 h-20 bg-agro-green/10 rounded-3xl flex items-center justify-center mx-auto text-agro-green shadow-inner group-hover:scale-110 transition-transform">
                                                            <PlusCircle size={36} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xl font-black text-slate-700">{language === 'en' ? 'Click to Take Photo / Upload' : 'Cliquez pour Photo / Télécharger'}</p>
                                                            <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">{language === 'en' ? 'Use your camera for best results' : 'Utilisez votre caméra'}</p>
                                                        </div>
                                                        <motion.div 
                                                            animate={{ scale: [1, 1.05, 1] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                            className="mt-4 px-8 py-3 bg-agro-green text-white rounded-full font-black text-sm inline-flex items-center gap-2 shadow-xl shadow-agro-green/20"
                                                        >
                                                            <Camera size={18} />
                                                            {language === 'en' ? 'OPEN CAMERA' : 'OUVRIR LA CAMERA'}
                                                        </motion.div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <img src={previewUrl} alt="Preview" className="w-full h-80 object-cover rounded-[2rem] shadow-2xl" />
                                                        {analyzing && (
                                                            <motion.div 
                                                                initial={{ top: '0%' }}
                                                                animate={{ top: '100%' }}
                                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                                className="absolute left-0 w-full h-1 bg-agro-green shadow-[0_0_20px_rgba(76,175,80,0.8)] z-10"
                                                            />
                                                        )}
                                                        <button onClick={(e) => { e.preventDefault(); setPreviewUrl(null); setSelectedFile(null); }} className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform z-30">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleAnalyze}
                                            disabled={!selectedFile || analyzing}
                                            className={`w-full mt-8 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${!selectedFile || analyzing ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-agro-green'}`}
                                        >
                                            {analyzing ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={24} />
                                                    {language === 'en' ? 'ANALYZING...' : 'ANALYSE EN COURS...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Zap size={24} />
                                                    {language === 'en' ? 'START DIAGNOSIS' : 'LANCER LE DIAGNOSTIC'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Results Pane */}
                                <div className="space-y-8">
                                    <AnimatePresence mode="wait">
                                        {diagnosis ? (
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                exit={{ opacity: 0, x: -20 }}
                                                className="glass-card p-10 bg-white border-agro-green/20"
                                            >
                                                <div className="flex items-center justify-between mb-8">
                                                    <h4 className="text-2xl font-black text-slate-900">{language === 'en' ? 'Diagnosis Results' : 'Résultats du Diagnostic'}</h4>
                                                    <div className="bg-agro-green/10 text-agro-green px-4 py-2 rounded-xl font-black text-sm">
                                                        {diagnosis.confidence_score ? `${Math.round(diagnosis.confidence_score * 100)}% Match` : 'Result'}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                                                        <p className="text-xs font-black text-slate-400 uppercase mb-2">{language === 'en' ? 'Detected Issue' : 'Problème Détecté'}</p>
                                                        <h5 className="text-2xl font-black text-agro-orange">{diagnosis.disease || diagnosis.detected_issue || diagnosis.error || 'N/A'}</h5>
                                                    </div>

                                                    <div className="p-6 bg-agro-green/5 rounded-3xl border-2 border-agro-green/10">
                                                        <p className="text-xs font-black text-agro-green uppercase mb-2">{language === 'en' ? 'Recommended Solution' : 'Solution Recommandée'}</p>
                                                        <p className="font-bold text-slate-700 leading-relaxed">{diagnosis.solution || diagnosis.recommended_solution || 'No solution recommended.'}</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                                            <p className="text-xs font-black text-slate-400 uppercase mb-2">{language === 'en' ? 'Treatment Window' : 'Fenêtre de Traitement'}</p>
                                                            <p className="font-black text-slate-800 text-sm">{diagnosis.treatment_window || diagnosis.fertilizer_schedule || 'N/A'}</p>
                                                        </div>
                                                        <div className="p-6 bg-slate-50 rounded-3xl">
                                                            <p className="text-xs font-black text-slate-400 uppercase mb-2">{language === 'en' ? 'Plant Variety' : 'Variété de Plante'}</p>
                                                            <p className="font-black text-slate-800 uppercase text-sm">{diagnosis.crop || 'Unknown'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-10 border-4 border-dashed border-slate-100 rounded-[3rem]">
                                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                                    <Shield size={48} />
                                                </div>
                                                <h4 className="text-xl font-black text-slate-300">{language === 'en' ? 'Waiting for Analysis' : 'En attente d\'analyse'}</h4>
                                                <p className="text-slate-200 font-bold max-w-xs mt-2 italic">
                                                    {language === 'en' 
                                                        ? 'Upload a photo to see the AI magic happen here.' 
                                                        : 'Téléchargez une photo pour voir la magie de l\'IA.'}
                                                </p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}


                    {activeTab === 'transport' && (
                        <motion.div key="transport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{language === 'en' ? 'Transport & Logistics' : 'Transport & Logistique'}</h3>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{transporters.length} {language === 'en' ? 'Transporters live on platform' : 'Transporteurs actifs sur la plateforme'}</p>
                                </div>
                                <button 
                                    onClick={() => setShowRegisterTransport(!showRegisterTransport)}
                                    className="bg-agro-green text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-slate-900 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={16}/> {showRegisterTransport ? 'CANCEL' : (language === 'en' ? 'BECOME A TRANSPORTER' : 'DEVENIR TRANSPORTEUR')}
                                </button>
                            </div>

                            {showRegisterTransport && (
                                <motion.form 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    onSubmit={handleRegisterTransport}
                                    className="glass-card p-10 bg-slate-900 text-white mb-10 overflow-hidden"
                                >
                                    <h4 className="text-xl font-black mb-6 italic">{language === 'en' ? 'List Your Vehicle for Delivery' : 'Inscrire Votre Véhicule'}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Vehicle Type (e.g. Hiace, Truck)' : 'Type de Véhicule (ex: Camion, Moto)'}</label>
                                            <div className="relative">
                                                <input 
                                                    required 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-agro-green transition-all" 
                                                    placeholder="..."
                                                    value={transportForm.vehicle_type}
                                                    onChange={(e) => setTransportForm({...transportForm, vehicle_type: e.target.value})}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                                                    <Truck size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Pricing (CFA Per Trip)' : 'Prix (CFA Par Trajet)'}</label>
                                            <div className="relative">
                                                <input 
                                                    required 
                                                    type="number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-agro-green transition-all" 
                                                    placeholder="5000"
                                                    value={transportForm.price_per_trip_fcfa}
                                                    onChange={(e) => setTransportForm({...transportForm, price_per_trip_fcfa: e.target.value})}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                                                    <Wallet size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Base Location (City/Region)' : 'Ville / Région de base'}</label>
                                            <div className="relative">
                                                <input 
                                                    required 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-agro-green transition-all" 
                                                    placeholder={language === 'en' ? "e.g. Douala / Littoral" : "ex: Yaoundé / Centre"}
                                                    value={transportForm.location}
                                                    onChange={(e) => setTransportForm({...transportForm, location: e.target.value})}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                                                    <MapPin size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Contact Phone (MoMo)' : 'Téléphone (MoMo)'}</label>
                                            <div className="relative">
                                                <input 
                                                    required 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-agro-green transition-all" 
                                                    placeholder="6xx xxx xxx"
                                                    value={transportForm.phone_number}
                                                    onChange={(e) => setTransportForm({...transportForm, phone_number: e.target.value})}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                                                    <MessageCircle size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button type="submit" className="w-full py-5 bg-agro-green text-white rounded-[2rem] font-black shadow-2xl shadow-agro-green/30 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] group">
                                            {language === 'en' ? 'SUBMIT TRANSPORT REGISTRATION' : 'ENREGISTRER LE TRANSPORT'}
                                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>

                                </motion.form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {transporters.length === 0 ? (
                                    <div className="col-span-full py-20 text-center opacity-30">
                                        <Truck size={64} className="mx-auto mb-4" />
                                        <p className="font-bold">No transporters listed yet. Be the first!</p>
                                    </div>
                                ) : transporters.map((t, i) => (
                                    <div key={t.id} className="glass-card p-6 border-2 border-transparent hover:border-agro-green/20 transition-all group">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                                                <Truck size={24} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 tracking-tight uppercase italic">{t.name}</h4>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <p className="text-[10px] font-black text-agro-green uppercase bg-agro-green/5 px-2 py-0.5 rounded inline-block">{t.vehicle_type}</p>
                                                    {t.location && (
                                                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 opacity-70">
                                                            <MapPin size={10}/> {t.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-agro-green/10 transition-colors">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Service Rate' : 'Note/Service'}</p>
                                                <p className="text-sm font-black text-slate-800 flex items-center gap-1"><Star size={10} className="text-agro-yellow" fill="currentColor"/> {t.rating || 5.0}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-agro-green/10 transition-colors">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Base Price' : 'Prix Base'}</p>
                                                <p className="text-sm font-black text-agro-green italic">{t.price_per_trip_fcfa?.toLocaleString()} CFA</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (t.phone) {
                                                    window.open(`tel:${t.phone}`);
                                                } else {
                                                    window.alert(language === 'en' ? 'Contact details coming soon...' : 'Détails de contact bientôt disponibles...');
                                                }
                                            }}
                                            className="w-full py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-slate-900/10"
                                        >
                                            {language === 'en' ? (t.phone ? 'CALL TRANSPORTER' : 'Contact Details') : (t.phone ? 'APPELER' : 'Détails Contact')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'calendar' && (
                        <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 min-h-[600px] border-2 border-transparent">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Left: Seasonal Guide */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="glass-card p-8 bg-white border-agro-green/10">
                                        <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800">
                                            <CalendarDays className="text-agro-green" size={24}/> Planting Guide
                                        </h3>
                                        <div className="space-y-4">
                                            {CAMEROON_SEASONAL_DATA.map((crop, i) => (
                                                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-agro-green/30 transition-all cursor-pointer">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-black text-slate-800">{crop.name}</h4>
                                                        <span className="text-[10px] font-black bg-agro-green/10 text-agro-green px-2 py-1 rounded-md">IDEAL</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 mb-3 italic">Best: {crop.bestPlanted}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {crop.tasks.slice(0, 2).map((t, j) => (
                                                            <span key={j} className="text-[9px] font-black uppercase tracking-tighter bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-100">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-agro-yellow rounded-xl text-slate-900"><Zap size={18}/></div>
                                            <h4 className="font-black text-sm uppercase tracking-widest">Farmer Alert</h4>
                                        </div>
                                        <p className="text-xs font-bold leading-relaxed opacity-70">March is the peak planting season for Tubers in the West and Littoral regions. Ensure your soil is well-tiled.</p>
                                    </div>
                                </div>

                                {/* Right: My Active Timelines */}
                                <div className="lg:col-span-8 space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Active Timelines</h3>
                                            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Tracking {myCalendar.length} Harvest Cycles</p>
                                        </div>
                                        <button 
                                            onClick={() => setShowCalendarForm(!showCalendarForm)}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-agro-green transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            <Plus size={16}/> {showCalendarForm ? 'CANCEL' : (language === 'en' ? 'TRACK NEW CROP' : 'SUIVRE NOUVELLE CULTURE')}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showCalendarForm && (
                                            <motion.form 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                onSubmit={handleTrackCrop}
                                                className="glass-card p-10 bg-white border-2 border-slate-100 overflow-hidden"
                                            >
                                                <h4 className="text-xl font-black mb-8 italic flex items-center gap-3">
                                                    <Sprout className="text-agro-green" /> 
                                                    {language === 'en' ? 'Add New Growing Timeline' : 'Ajouter un nouveau suivi'}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Crop Name' : 'Nom du Produit'}</label>
                                                        <input 
                                                            required 
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-agro-green transition-all" 
                                                            placeholder="e.g. Red Corn / Maize"
                                                            value={calendarForm.name}
                                                            onChange={(e) => setCalendarForm({...calendarForm, name: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Date Planted' : 'Date de Plantation'}</label>
                                                        <input 
                                                            required 
                                                            type="date"
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-agro-green transition-all" 
                                                            value={calendarForm.plantedDate}
                                                            onChange={(e) => setCalendarForm({...calendarForm, plantedDate: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Next Maintenance Task' : 'Prochaine Tâche'}</label>
                                                        <input 
                                                            required 
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-agro-green transition-all" 
                                                            placeholder="e.g. Apply Fertilizer"
                                                            value={calendarForm.nextTask}
                                                            onChange={(e) => setCalendarForm({...calendarForm, nextTask: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Task Date' : 'Date d\'échéance'}</label>
                                                        <input 
                                                            required 
                                                            type="date"
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-agro-green transition-all" 
                                                            value={calendarForm.taskDate}
                                                            onChange={(e) => setCalendarForm({...calendarForm, taskDate: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="w-full btn-primary py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-agro-green/30 hover:scale-[1.02] active:scale-95 transition-all">
                                                    {language === 'en' ? 'START TRACKING' : 'COMMENCER LE SUIVI'}
                                                </button>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>

                                    <div className="grid grid-cols-1 gap-6">
                                        {myCalendar.map((item, i) => (
                                            <div key={i} className="glass-card p-8 bg-white group hover:shadow-2xl transition-all duration-500">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-agro-green/10 rounded-3xl flex items-center justify-center text-agro-green group-hover:scale-110 transition-transform">
                                                            <Sprout size={32} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-2xl font-black text-slate-800 tracking-tighter">{item.name}</h4>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Planted: {item.plantedDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-agro-orange/10 rounded-xl flex items-center justify-center text-agro-orange">
                                                            <Clock size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Action</p>
                                                            <p className="font-black text-slate-800">{item.nextTask} <span className="text-agro-orange opacity-40 italic text-[10px]">({item.taskDate})</span></p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative pt-6">
                                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                                                        <span>Growth Progress</span>
                                                        <span className="text-agro-green">{item.progress}% / Harvest Ready</span>
                                                    </div>
                                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-agro-green to-agro-yellow rounded-full shadow-inner" 
                                                            style={{ width: `${item.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    
                                                    <div className="mt-8 grid grid-cols-4 gap-4">
                                                        {['Preparing', 'Seeding', 'Growing', 'Harvest'].map((step, idx) => (
                                                            <div key={idx} className={`text-center space-y-2 ${idx <= 2 ? 'opacity-100' : 'opacity-20'}`}>
                                                                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-[10px] font-black ${idx <= 2 ? 'bg-agro-green text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                                    {idx + 1}
                                                                </div>
                                                                <p className="text-[10px] font-black uppercase tracking-tighter">{step}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'learning' && (
                        <motion.div key="learning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
                            <div className="glass-card p-12 bg-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-agro-orange/5 rounded-full -mr-32 -mt-32"></div>
                                <div className="relative z-10 max-w-3xl">
                                    <h3 className="text-3xl font-black mb-4 flex items-center gap-3"><Search className="text-agro-orange" size={32}/> {language === 'en' ? 'Agro Knowledge Hub' : 'Centre de Connaissances'}</h3>
                                    <p className="text-lg text-slate-500 font-bold mb-10 opacity-70">
                                        {language === 'en' ? 'Search any crop to see fertilizer requirements, maturation time, and growing best practices.' : 'Recherchez n\'importe quelle culture pour voir les engrais, le temps de maturation et les meilleures pratiques.'}
                                    </p>
                                    
                                    <div className="relative mb-6 flex flex-col md:flex-row gap-4">
                                        <div className="relative flex-1 group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-agro-orange group-focus-within:scale-110 transition-transform">
                                                <Search size={24} />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder={language === 'en' ? "Search 100+ Crops with AI..." : "Rechercher 100+ Cultures..."} 
                                                value={searchQuery}
                                                onChange={e => {
                                                    setSearchQuery(e.target.value);
                                                    if (!e.target.value) setAiGuideResult(null);
                                                }}
                                                onKeyDown={e => e.key === 'Enter' && handleAskAI()}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] pl-16 pr-20 py-6 focus:ring-4 focus:ring-agro-orange/10 transition-all font-black text-xl shadow-inner text-slate-700" 
                                            />
                                            <button className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white rounded-2xl text-slate-300 hover:text-agro-orange transition-colors">
                                                <Mic size={24} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={handleAskAI}
                                            disabled={aiGuideLoading}
                                            className="px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-agro-orange transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {aiGuideLoading ? <Loader2 size={24} className="animate-spin"/> : <Zap size={24}/>}
                                            {language === 'en' ? 'GENERATE AI GUIDE' : 'GÉNÉRER GUIDE IA'}
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
                                        <span className="flex items-center gap-2 mr-2"><Lightbulb size={16} className="text-agro-yellow"/> {language === 'en' ? 'TRENDING:' : 'TENDANCES:'}</span>
                                        {['Maize', 'Cassava', 'Plantain', 'Pepper', 'Cocoa'].map(t => (
                                            <button key={t} onClick={() => { setSearchQuery(t); }} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full hover:bg-white hover:border-agro-orange transition-all">{t}</button>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {aiGuideResult && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden mb-8 border border-white/5"
                                            >
                                                <div className="absolute top-0 right-0 w-80 h-80 bg-agro-orange/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-10">
                                                        <div className="bg-agro-orange p-3 rounded-2xl shadow-lg shadow-agro-orange/20">
                                                            <Zap size={24} />
                                                        </div>
                                                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">{aiGuideResult.title}</h3>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-2 h-2 rounded-full bg-agro-green"></div>
                                                                <p className="text-agro-green font-black text-[10px] uppercase tracking-widest">{language === 'en' ? 'Optimal Planting' : 'Plantation Idéale'}</p>
                                                            </div>
                                                            <p className="text-sm font-bold opacity-80 leading-relaxed">{aiGuideResult.planting}</p>
                                                        </div>
                                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-2 h-2 rounded-full bg-agro-yellow"></div>
                                                                <p className="text-agro-yellow font-black text-[10px] uppercase tracking-widest">{language === 'en' ? 'Fertilizer Logic' : 'Engrais Recommandé'}</p>
                                                            </div>
                                                            <p className="text-sm font-bold opacity-80 leading-relaxed">{aiGuideResult.fertilizer}</p>
                                                        </div>
                                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                                <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest">{language === 'en' ? 'Harvest Window' : 'Fenêtre de Récolte'}</p>
                                                            </div>
                                                            <p className="text-sm font-bold opacity-80 leading-relaxed">{aiGuideResult.harvest}</p>
                                                        </div>
                                                        {aiGuideResult.herbicide_info && (
                                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                                    <p className="text-red-400 font-black text-[10px] uppercase tracking-widest">{language === 'en' ? 'Selective Herbicide' : 'Herbi. Sélectif'}</p>
                                                                </div>
                                                                <p className="text-sm font-bold opacity-80 leading-relaxed">{aiGuideResult.herbicide_info}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="mt-10 pt-10 border-t border-white/10 flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-agro-orange/20 rounded-xl flex items-center justify-center text-agro-orange animate-pulse">
                                                                <Clock size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{language === 'en' ? 'Est. Total Duration' : 'Durée Totale Est.'}</p>
                                                                <p className="text-lg font-black text-white leading-none tracking-tighter italic uppercase">{aiGuideResult.duration}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedGuide({
                                                                    ...aiGuideResult,
                                                                    category: "AI EXPERT HUB",
                                                                    color: "border-t-agro-orange",
                                                                    description: aiGuideResult.description || `${aiGuideResult.planting}\n\n${aiGuideResult.herbicide_info || ''}`
                                                                });
                                                            }}
                                                            className="flex items-center gap-4 px-8 py-5 bg-agro-orange text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-agro-orange/20"
                                                        >
                                                            {language === 'en' ? 'OPEN FULL INTERACTIVE GUIDE' : 'OUVRIR LE GUIDE COMPLET'}
                                                            <ArrowRight size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {LEARNING_HUB_DATA
                                    .filter(item => item.language === language && (
                                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.category.toLowerCase().includes(searchQuery.toLowerCase())
                                    ))
                                    .map(item => (
                                        <LearningCard 
                                            key={item.id}
                                            title={item.title}
                                            topic={item.topic}
                                            color={item.color}
                                            description={item.description}
                                            onClick={() => setSelectedGuide(item)}
                                        />
                                    ))
                                }
                                {LEARNING_HUB_DATA.filter(item => 
                                    item.language === language && (
                                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.category.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                ).length === 0 && (
                                    <div className="col-span-full py-20 text-center glass-card bg-white border-dashed border-4 border-slate-100">
                                        <div className="bg-agro-orange/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-agro-orange animate-pulse">
                                            <Zap size={48} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">{language === 'en' ? 'Use AI for custom generation?' : 'Utiliser l\'IA pour générer ?'}</h4>
                                        <p className="text-slate-400 font-bold mt-4 uppercase text-xs tracking-widest max-w-md mx-auto leading-relaxed">
                                            {language === 'en' 
                                                ? `We don't have a static guide for "${searchQuery}" yet. Click the "ASK AI GUIDE" button above to generate one instantly.` 
                                                : `Nous n'avons pas encore de guide fixe pour "${searchQuery}". Cliquez sur "DEMANDER À L'IA" pour en générer un.`}
                                        </p>
                                        <button 
                                            onClick={handleAskAI}
                                            className="mt-8 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-agro-orange transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto"
                                        >
                                            <Zap size={18} /> {language === 'en' ? 'GENERATE AI REPORT NOW' : 'GÉNÉRER LE RAPPORT IA'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'wallet' && (
                        <motion.div key="wallet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-4">
                                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl h-full">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-agro-green/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-12">
                                                <p className="text-xs font-black uppercase tracking-widest text-white/50">{language === 'en' ? 'AVAILABLE BALANCE' : 'SOLDE DISPONIBLE'}</p>
                                                <Wallet size={32} className="text-agro-green" />
                                            </div>
                                            <h2 className="text-5xl font-black tracking-tighter mb-2">{balance.toLocaleString()} <span className="text-xl opacity-50 uppercase italic font-bold">CFA</span></h2>
                                            <p className="text-[10px] font-bold text-white/40 border-t border-white/10 pt-4 mt-6">Orange Money / MTN MoMo Linked</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-8">
                                    <div className="glass-card p-10 h-full">
                                        <h3 className="text-2xl font-black mb-6">{language === 'en' ? 'Withdraw Funds' : 'Retirer des fonds'}</h3>
                                        <form onSubmit={handleWithdraw}>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <WithdrawMethod 
                                                    name="Orange Money" 
                                                    active={withdrawForm.method === 'Orange Money'} 
                                                    onClick={() => setWithdrawForm({...withdrawForm, method: 'Orange Money'})}
                                                />
                                                <WithdrawMethod 
                                                    name="MTN MoMo" 
                                                    active={withdrawForm.method === 'MTN MoMo'} 
                                                    onClick={() => setWithdrawForm({...withdrawForm, method: 'MTN MoMo'})}
                                                />
                                                <WithdrawMethod 
                                                    name="Bank Acc" 
                                                    active={withdrawForm.method === 'Bank Acc'} 
                                                    onClick={() => setWithdrawForm({...withdrawForm, method: 'Bank Acc'})}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Withdraw Amount' : 'Montant à retirer'}</label>
                                                    <input 
                                                        required
                                                        type="number"
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-agro-green transition-all"
                                                        placeholder="e.g. 5000"
                                                        value={withdrawForm.amount}
                                                        onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Recipient Number' : 'Numéro du destinataire'}</label>
                                                    <input 
                                                        required
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-agro-green transition-all"
                                                        placeholder="6xx xxx xxx"
                                                        value={withdrawForm.phone}
                                                        onChange={(e) => setWithdrawForm({...withdrawForm, phone: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full py-5 bg-agro-green text-white rounded-2xl font-black text-sm shadow-xl shadow-agro-green/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                {language === 'en' ? 'Start Withdrawal' : 'Démarrer le retrait'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-10 bg-white">
                                <h3 className="text-2xl font-black mb-8 text-slate-900">{language === 'en' ? 'Recent Transactions' : 'Transactions Récentes'}</h3>
                                <div className="space-y-4">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-agro-green transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'Sale' ? 'bg-agro-green/10 text-agro-green' : 'bg-agro-orange/10 text-agro-orange'}`}>
                                                    {tx.type === 'Sale' ? <PlusCircle size={24}/> : <ArrowRight size={24} className="rotate-[135deg]"/>}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 tracking-tight">{tx.desc}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{tx.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-black text-lg tracking-tighter ${tx.amount.startsWith('+') ? 'text-agro-green' : 'text-slate-800'}`}>{tx.amount} CFA</p>
                                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${tx.status === 'Completed' ? 'text-agro-green' : 'text-agro-orange'}`}>{tx.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'weather' && (
                        <motion.div key="weather" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">{language === 'en' ? 'Weather Advisory' : 'Conseil Météo'}</h3>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{language === 'en' ? 'Agricultural-Specific local forecasts' : 'Prévisions locales spécifiques'}</p>
                                </div>
                                <div className="flex bg-slate-900/5 p-2 rounded-2xl border border-slate-100 items-center gap-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{language === 'en' ? 'Select Region' : 'Région'}</p>
                                    <select 
                                        value={weatherRegion}
                                        onChange={(e) => setWeatherRegion(e.target.value)}
                                        className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 font-black text-xs text-slate-700 outline-none focus:border-agro-green transition-all"
                                    >
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 glass-card p-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-100 mb-3 opacity-60 italic">{language === 'en' ? 'LOCAL WEATHER ADVISORY' : 'CONSEIL MÉTÉO LOCAL'}</p>
                                            <h2 className="text-6xl font-black italic tracking-tighter">{weatherRegion} <span className="text-2xl opacity-60 not-italic uppercase tracking-normal font-bold">28°C</span></h2>
                                            <p className="mt-6 text-blue-50 font-bold max-w-md">{language === 'en' ? 'Moderate rain expected tomorrow. Ideal for Urea application but avoid heavy irrigation.' : 'Pluie modérée demain. Idéal pour l\'urée, évitez l\'irrigation forte.'}</p>
                                        </div>
                                        <CloudSun size={120} className="text-blue-100/20" />
                                    </div>
                                </div>
                                <div className="glass-card p-10 bg-white">
                                    <h3 className="text-xl font-black mb-6 uppercase italic tracking-tighter">{language === 'en' ? 'Weekly Forecast' : 'Prévisions Semaine'}</h3>
                                    <div className="space-y-4">
                                        {[
                                            { day: 'Mon', temp: '30°C', icon: <CloudSun size={16}/>, desc: 'Sunny' },
                                            { day: 'Tue', temp: '26°C', icon: <CloudSun size={16}/>, desc: 'Rain' },
                                            { day: 'Wed', temp: '27°C', icon: <CloudSun size={16}/>, desc: 'Cloudy' }
                                        ].map(d => (
                                            <div key={d.day} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <span className="font-black text-slate-800">{d.day}</span>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold">{d.icon} {d.temp}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'prices' && (
                        <motion.div key="prices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="glass-card p-12 bg-white flex flex-col md:flex-row justify-between items-center gap-10">
                                <div>
                                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">{language === 'en' ? 'Live Price Tracker' : 'Suivi des Prix Direct'}</h3>
                                    <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-[0.3em]">{language === 'en' ? 'Market Intelligence for Cameroon' : 'Intelligence du Marché Camerounais'}</p>
                                </div>
                                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                    <button className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl">TODAY</button>
                                    <button className="px-6 py-2 text-slate-400 text-[10px] font-black rounded-xl">WEEKLY</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(language === 'en' ? MARKET_PRICES : FR_MARKET_PRICES).map((price, i) => (
                                    <motion.div 
                                        key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-900/5 hover:border-agro-green transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight">{price.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{price.region} · {price.unit}</p>
                                            </div>
                                            <div className={`p-2 rounded-lg ${price.trend === 'up' ? 'bg-red-50 text-red-500' : price.trend === 'down' ? 'bg-green-50 text-green-500' : 'bg-slate-50 text-slate-400'}`}>
                                                <TrendingUp size={16} className={price.trend === 'down' ? 'rotate-180' : ''} />
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <p className="text-4xl font-black text-slate-900 tracking-tighter">{price.price}</p>
                                            <p className={`text-[10px] font-bold mb-2 uppercase ${price.trend === 'up' ? 'text-red-500' : 'text-agro-green'}`}>
                                                {price.trend === 'up' ? '↗ Increasing' : price.trend === 'down' ? '↘ Decreasing' : '→ Stable'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bag_scan' && (
                        <motion.div key="bag_scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            <div className="glass-card p-12 bg-white text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-agro-green to-transparent animate-scan"></div>
                                
                                {bagScanState === 'idle' && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-agro-green/20 to-transparent"></div>
                                            <Camera size={48} className="relative z-10" />
                                        </div>
                                        <h3 className="text-4xl font-black mb-4 tracking-tighter italic uppercase">{language === 'en' ? 'AI Smart Bag Scan' : 'Sac Analytique IA'}</h3>
                                        <p className="text-slate-500 font-bold mb-12 max-w-xl mx-auto opacity-70">
                                            {language === 'en' 
                                                ? 'Instant inventory detection using AI computer vision. Arrange your bags clearly and capture to count stock automatically.' 
                                                : 'Détection d\'inventaire instantanée via vision IA. Disposez vos sacs clairement et capturez pour compter automatiquement.'}
                                        </p>
                                        
                                        <div className="max-w-2xl mx-auto aspect-video bg-slate-900 rounded-[3.5rem] relative overflow-hidden flex flex-col items-center justify-center border-8 border-white shadow-[0_0_50px_rgba(0,0,0,0.1)]">
                                             {/* Scanner HUD Overlay */}
                                            <div className="absolute inset-10 border-2 border-agro-green/30 rounded-[2rem] flex flex-col justify-between p-6 overflow-hidden">
                                                 <div className="flex justify-between w-full opacity-50">
                                                     <div className="w-8 h-8 border-t-4 border-l-4 border-agro-green rounded-tl-xl"></div>
                                                     <div className="w-8 h-8 border-t-4 border-r-4 border-agro-green rounded-tr-xl"></div>
                                                 </div>
                                                 <div className="bg-white/5 py-4 px-8 self-center rounded-2xl flex items-center gap-4">
                                                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                     <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Ready for Object Detection</span>
                                                 </div>
                                                 <div className="flex justify-between w-full opacity-50">
                                                     <div className="w-8 h-8 border-b-4 border-l-4 border-agro-green rounded-bl-xl"></div>
                                                     <div className="w-8 h-8 border-b-4 border-r-4 border-agro-green rounded-br-xl"></div>
                                                 </div>
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-agro-green rounded-full flex items-center justify-center text-white shadow-2xl shadow-agro-green/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-white/20">
                                                    <Plus size={40} />
                                                    <input type="file" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBagScan} />
                                                </div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] opacity-60">Initialize Vision</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {bagScanState === 'scanning' && (
                                    <div className="py-20 flex flex-col items-center justify-center">
                                        <div className="relative w-32 h-32 mb-10">
                                            <div className="absolute inset-0 border-4 border-agro-green/20 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-agro-green border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center text-agro-green">
                                                <Zap size={32} className="animate-pulse" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic animate-pulse">{language === 'en' ? 'Analyzing Bags...' : 'Analyse des Sacs...'}</h3>
                                        <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-widest">{language === 'en' ? 'Scanning for uniformity & count' : 'Décompte et uniformité'}</p>
                                    </div>
                                )}

                                {bagScanState === 'result' && bagResult && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
                                        <div className="flex items-center justify-center gap-4 mb-10">
                                            <Shield size={32} className="text-agro-green" />
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{language === 'en' ? 'AI Scan Summary' : 'Résumé Scan IA'}</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{language === 'en' ? 'Bag Count' : 'Nombre de Sacs'}</p>
                                                <p className="text-4xl font-black text-slate-900">{bagResult.count}</p>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{language === 'en' ? 'Est. Weight' : 'Poids Est.'}</p>
                                                <p className="text-4xl font-black text-slate-900">{bagResult.weight}</p>
                                            </div>
                                            <div className="bg-agro-green/5 p-6 rounded-[2.5rem] border border-agro-green/10">
                                                <p className="text-[10px] font-black text-agro-green uppercase tracking-widest mb-2">{language === 'en' ? 'Calibration' : 'Calibration'}</p>
                                                <p className="text-4xl font-black text-agro-green">{bagResult.status}</p>
                                            </div>
                                            <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 text-white">
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">{language === 'en' ? 'AI Confidence' : 'Confiance IA'}</p>
                                                <p className="text-4xl font-black text-agro-green">{bagResult.confidence}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setBagScanState('idle')}
                                                className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-agro-green transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                            >
                                                {language === 'en' ? 'New Scan' : 'Nouveau Scan'}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    alert(language === 'en' ? 'Inventory Updated with 14 Bags!' : 'Inventaire mis à jour avec 14 sacs !');
                                                    setBagScanState('idle');
                                                }}
                                                className="flex-1 py-6 bg-agro-green text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-agro-green/20 active:scale-95"
                                            >
                                                {language === 'en' ? 'Add to Stock' : 'Ajouter au Stock'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'storage' && (
                        <motion.div key="storage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">{language === 'en' ? 'Storage Hub' : 'Espace Stockage'}</h3>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{language === 'en' ? 'Manage your on-farm and secondary storage' : 'Gérez votre stockage à la ferme'}</p>
                                </div>
                                <button 
                                    onClick={() => setShowStorageModal(true)}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-agro-green transition-all uppercase tracking-widest"
                                >
                                    {language === 'en' ? 'Add Facility' : 'Ajouter Esp.'}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {storageFacilities.map(f => (
                                    <div key={f.id} className={`glass-card p-10 bg-white border-l-8 ${f.color}`}>
                                        <h4 className="font-black text-2xl mb-4 italic uppercase tracking-tighter">{f.name}</h4>
                                        <p className="text-slate-400 font-bold mb-8 uppercase text-[10px] tracking-widest">{f.location}</p>
                                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
                                            <div className={`h-full bg-slate-900 ${f.color.replace('border-', 'bg-')}`} style={{ width: f.fill }} />
                                        </div>
                                        <div className="flex justify-between font-black text-xs">
                                            <span className="text-slate-400 italic">{f.fill} Full</span>
                                            <span className="text-slate-900 uppercase tracking-widest">{f.used} / {f.capacity} kg</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'forum' && (
                        <motion.div key="forum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{language === 'en' ? 'Community Hub' : 'Espace Communautaire'}</h3>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{language === 'en' ? 'Connect with farmers & experts' : 'Connectez avec les experts'}</p>
                                </div>
                                <button 
                                    onClick={() => setShowForumModal(true)}
                                    className="bg-agro-green text-white w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl shadow-agro-green/20 hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Plus size={36} />
                                </button>
                            </div>
                            <div className="space-y-6">
                                {forumPosts.map((post) => (
                                    <div key={post.id} className="glass-card p-10 bg-white hover:border-agro-green transition-all group cursor-pointer border-l-8 border-l-transparent hover:border-l-agro-green">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-400 uppercase tracking-tighter group-hover:bg-agro-green group-hover:text-white transition-all">{post.user.charAt(0)}</div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 text-2xl group-hover:text-agro-green transition-colors tracking-tight leading-tight">{post.topic}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">{post.user} • {post.active}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black bg-slate-900/5 px-4 py-2 rounded-xl text-slate-500 group-hover:bg-agro-green/10 group-hover:text-agro-green transition-all uppercase tracking-widest">{post.category}</span>
                                        </div>
                                        <div className="flex items-center gap-8 pt-8 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm"><MessageCircle size={20}/> {post.replies} {language === 'en' ? 'Replies' : 'Réponses'}</div>
                                            <div className="flex items-center gap-2 text-agro-green font-black text-sm uppercase tracking-widest ml-auto">{language === 'en' ? 'Join Discussion' : 'Rejoindre'} <ArrowRight size={20}/></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'verification' && (
                        <motion.div key="verification" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
                            <div className="glass-card p-12 bg-white relative overflow-hidden text-center">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-agro-yellow/5 rounded-full -mr-32 -mt-32"></div>
                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <div className="w-24 h-24 bg-agro-yellow/10 rounded-[2rem] flex items-center justify-center text-agro-yellow mx-auto mb-8 shadow-inner">
                                        <ShieldAlert size={48} />
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">{language === 'en' ? 'ID Verification' : 'Vérification d\'ID'}</h3>
                                    <p className="text-slate-500 font-bold mb-12">
                                        {language === 'en' 
                                            ? 'Unlock unlimited payments and professional marketplace features by verifying your identity. It only takes a minute!' 
                                            : 'Débloquez les paiements illimités et les fonctions pro en vérifiant votre identité. Cela ne prend qu\'une minute !'}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                        <div className="relative p-8 border-4 border-dashed border-slate-100 rounded-[3rem] hover:border-agro-green/30 transition-all cursor-pointer group bg-slate-50/50 overflow-hidden">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={() => alert(language === 'en' ? 'CNI ID Uploaded' : 'CNI Téléchargé')} />
                                            <div className="bg-white p-4 rounded-2xl w-fit mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <Upload className="text-agro-green" />
                                            </div>
                                            <h4 className="font-black text-slate-800">{language === 'en' ? 'National ID (CNI)' : 'Carte d\'Identité (CNI)'}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">Front & Back Photo Required</p>
                                        </div>
                                        <div className="relative p-8 border-4 border-dashed border-slate-100 rounded-[3rem] hover:border-agro-green/30 transition-all cursor-pointer group bg-slate-50/50 overflow-hidden">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={() => alert(language === 'en' ? 'Farm Proof Uploaded' : 'Preuve d\'Activité Téléchargée')} />
                                            <div className="bg-white p-4 rounded-2xl w-fit mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <Upload className="text-agro-yellow" />
                                            </div>
                                            <h4 className="font-black text-slate-800">{language === 'en' ? 'Farm Proof / Land Doc' : 'Preuve d\'Activité / Titre'}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
                                                {language === 'en' ? 'Certificate OR Land Doc OR Chief Recognition' : 'Certificat OU Preuve de Terrain OU Chef Local'}
                                            </p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            alert(language === 'en' ? 'Verification documents submitted! Admin will review within 24 hours.' : 'Documents soumis ! L\'administrateur les examinera sous 24h.');
                                            setActiveTab('overview');
                                        }}
                                        className="mt-12 w-full max-w-md py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-agro-green transition-all shadow-2xl active:scale-95"
                                    >
                                        {language === 'en' ? 'SUBMIT FOR REVIEW' : 'SOUMETTRE POUR REVUE'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* Storage Facility Modal */}
                <AnimatePresence>
                    {showStorageModal && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
                        >
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] p-12">
                                <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">{language === 'en' ? 'Add New Facility' : 'Ajouter un Espace'}</h3>
                                <form onSubmit={handleAddFacility} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Facility Name</label>
                                        <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" value={storageForm.name} onChange={e => setStorageForm({...storageForm, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</label>
                                        <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" value={storageForm.location} onChange={e => setStorageForm({...storageForm, location: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Max Capacity (kg)</label>
                                        <input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" value={storageForm.capacity} onChange={e => setStorageForm({...storageForm, capacity: e.target.value})} />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setShowStorageModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
                                        <button type="submit" className="flex-1 py-4 bg-agro-green text-white rounded-2xl font-black text-xs uppercase tracking-widest">Confirm</button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Forum Post Modal */}
                <AnimatePresence>
                    {showForumModal && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
                        >
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3rem] p-12">
                                <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">{language === 'en' ? 'Start a Discussion' : 'Démarrer un Sujet'}</h3>
                                <form onSubmit={handleAddForumPost} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Topic Title</label>
                                        <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" value={forumForm.topic} onChange={e => setForumForm({...forumForm, topic: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                                        <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" value={forumForm.category} onChange={e => setForumForm({...forumForm, category: e.target.value})}>
                                            <option value="TIPS">FARMING TIPS</option>
                                            <option value="FINANCE">FINANCE / MOMO</option>
                                            <option value="WEATHER">WEATHER</option>
                                            <option value="PRICES">MARKET PRICES</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setShowForumModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
                                        <button type="submit" className="flex-1 py-4 bg-agro-green text-white rounded-2xl font-black text-xs uppercase tracking-widest">Post Now</button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Guide Modal */}
                <AnimatePresence>
                    {selectedGuide && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl"
                            onClick={() => setSelectedGuide(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto p-12 shadow-2xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={`h-4 ${selectedGuide.color} bg-agro-green`}></div>
                                <div className="p-12">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <span className="text-agro-green font-black text-xs uppercase tracking-widest mb-2 block">{selectedGuide.category}</span>
                                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedGuide.title}</h2>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedGuide(null)}
                                            className="p-4 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <LogOut className="rotate-90" size={24} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-10">
                                        {/* 1. Overview & Roadmap */}
                                        <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 text-slate-100">
                                                <GraduationCap size={120} />
                                            </div>
                                            <div className="relative z-10">
                                                <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3 uppercase text-lg italic tracking-tighter">
                                                    <Sprout className="text-agro-green" size={24}/> {language === 'en' ? 'PRODUCTION ROADMAP' : 'FEUILLE DE ROUTE'}
                                                </h4>
                                                <p className="text-slate-600 font-bold leading-relaxed text-lg max-w-2xl">
                                                    {selectedGuide.description || selectedGuide.planting}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 2. Essential Requirements Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-8 bg-agro-green/5 rounded-3xl border border-agro-green/10">
                                                <div className="w-10 h-10 bg-agro-green text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-agro-green/20">
                                                    <MapPin size={20} />
                                                </div>
                                                <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-2">{language === 'en' ? 'Optimal Planting' : 'Plantation Idéale'}</h5>
                                                <p className="font-bold text-slate-600 text-sm leading-relaxed">{selectedGuide.planting || "Consult local zones."}</p>
                                            </div>
                                            <div className="p-8 bg-agro-yellow/5 rounded-3xl border border-agro-yellow/10">
                                                <div className="w-10 h-10 bg-agro-yellow text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-agro-yellow/20">
                                                    <Zap size={20} />
                                                </div>
                                                <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-2">{language === 'en' ? 'Fertilizer Logic' : 'Logique Engrais'}</h5>
                                                <p className="font-bold text-slate-600 text-sm leading-relaxed">{selectedGuide.fertilizer || "NPK 15-15-15 standard."}</p>
                                            </div>
                                            <div className="p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                                                <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                                                    <Clock size={20} />
                                                </div>
                                                <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-2">{language === 'en' ? 'Harvest Window' : 'Récolte'}</h5>
                                                <p className="font-bold text-slate-600 text-sm leading-relaxed">{selectedGuide.harvest || "Check maturation signs."}</p>
                                            </div>
                                        </div>

                                        {/* 3. Protection & Herbicide Section */}
                                        {(selectedGuide.herbicide_info || selectedGuide.herbicide) && (
                                            <div className="p-8 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 flex flex-col md:flex-row items-center gap-8">
                                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-red-500 shadow-xl border border-red-100 flex-shrink-0">
                                                    <Shield size={32} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-red-500 uppercase text-xs tracking-[0.2em] mb-2">{language === 'en' ? 'TREATMENT & PROTECTION' : 'TRAITEMENT & PROTECTION'}</h4>
                                                    <p className="text-slate-600 font-bold leading-relaxed">
                                                        {selectedGuide.herbicide_info || selectedGuide.herbicide}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. The Timeline (Detailed Progression) */}
                                        {selectedGuide.growthStages && (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-[2px] flex-1 bg-slate-100"></div>
                                                    <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.4em] mb-4">{language === 'en' ? 'DETAILED GROWTH PROGRESSION' : 'PROGRESSION DÉTAILLÉE'}</h4>
                                                    <div className="h-[2px] flex-1 bg-slate-100"></div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {selectedGuide.growthStages.map((stage, i) => (
                                                        <div key={i} className="bg-white border-2 border-slate-50 p-8 rounded-[2rem] hover:border-agro-green/20 transition-all relative group h-full">
                                                            <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-xl group-hover:bg-agro-green transition-colors">
                                                                {i + 1}
                                                            </div>
                                                            <p className="font-black text-slate-800 mb-6 text-xl tracking-tighter mt-2">{stage.level}</p>
                                                            <div className="space-y-4">
                                                                <div className="bg-slate-50 p-4 rounded-2xl">
                                                                    <p className="text-[9px] font-black text-agro-green uppercase mb-1">{language === 'en' ? 'Nutrition' : 'Nutrition'}</p>
                                                                    <p className="text-xs font-bold text-slate-600 line-clamp-2">{stage.fertilizer}</p>
                                                                </div>
                                                                <div className="bg-slate-50 p-4 rounded-2xl">
                                                                    <p className="text-[9px] font-black text-red-500 uppercase mb-1">{language === 'en' ? 'Protection' : 'Protection'}</p>
                                                                    <p className="text-xs font-bold text-slate-600 line-clamp-2">{stage.herbicide}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. AI Knowledge Quiz Section */}
                                        <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                                            {!activeQuiz ? (
                                                <div className="max-w-md mx-auto py-4">
                                                    <div className="w-20 h-20 bg-agro-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-agro-green">
                                                        <GraduationCap size={40} />
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic mb-4">{language === 'en' ? 'Test Your Knowledge' : 'Testez Vos Connaissances'}</h4>
                                                    <p className="text-slate-400 font-bold mb-8 uppercase text-xs tracking-widest">{language === 'en' ? 'Take a quick 3-question quiz generated by AI to earn a Certification Badge.' : 'Passez un quiz de 3 questions généré par l\'IA.'}</p>
                                                    <button 
                                                        disabled={quizLoading}
                                                        onClick={() => handleGenerateQuiz(selectedGuide.title)}
                                                        className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-agro-green transition-all shadow-xl disabled:opacity-50 flex items-center gap-3 mx-auto"
                                                    >
                                                        {quizLoading ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18}/>}
                                                        {language === 'en' ? 'START AI QUIZ' : 'DÉMARRER LE QUIZ'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-left space-y-8">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="text-2xl font-black text-slate-900 uppercase italic">{language === 'en' ? 'AI Certification Quiz' : 'Quiz de Certification IA'}</h4>
                                                        <span className="bg-agro-green text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">3 Questions remaining</span>
                                                    </div>
                                                    {activeQuiz.map((q, idx) => (
                                                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                                            <p className="font-black text-slate-800 text-lg mb-6 leading-tight">{idx + 1}. {q.question}</p>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                {q.options.map((opt, oIdx) => (
                                                                    <button 
                                                                        key={oIdx}
                                                                        onClick={() => {
                                                                            if (opt === q.answer) alert(language === 'en' ? 'Correct!' : 'Correct !');
                                                                            else alert(language === 'en' ? 'Wrong Answer' : 'Mauvaise Réponse');
                                                                        }}
                                                                        className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-agro-green hover:bg-agro-green/5 transition-all text-sm font-bold text-slate-600 text-center"
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button 
                                                        onClick={() => setActiveQuiz(null)}
                                                        className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
                                                    >
                                                        {language === 'en' ? 'Cancel Quiz' : 'Annuler'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* 6. Economic & Target Impact */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                            <div className="p-10 bg-slate-900 text-white rounded-[3rem] relative overflow-hidden group shadow-2xl">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-agro-green/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                                                <div className="relative z-10">
                                                    <h5 className="font-black text-agro-green uppercase text-[10px] tracking-[0.3em] mb-4 italic italic uppercase">{language === 'en' ? 'Estimated Duration' : 'Durée Estimée'}</h5>
                                                    <p className="text-4xl font-black tracking-tighter">{selectedGuide.duration || "Variable"}</p>
                                                </div>
                                            </div>
                                            <div className="p-10 bg-agro-orange text-white rounded-[3rem] relative overflow-hidden group shadow-2xl">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                                                <div className="relative z-10">
                                                    <h5 className="font-black text-white/60 uppercase text-[10px] tracking-[0.3em] mb-4 italic uppercase">{language === 'en' ? 'Market Opportunity' : 'Opportunité Marché'}</h5>
                                                    <p className="text-4xl font-black tracking-tighter">{selectedGuide.topic || "Direct Market"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedGuide(null)}
                                        className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-agro-green transition-all"
                                    >
                                        CLOSE GUIDE
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className="glass-card p-8 flex items-center gap-6 group">
            <div className={`${color} p-4 rounded-3xl text-white shadow-lg shadow-slate-900/5 group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}

function SidebarLink({ icon, label, active = false, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-sm transition-all group w-full text-left ${active ? 'bg-agro-green text-white shadow-xl shadow-agro-green/30' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
        >
            <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-agro-green'} transition-colors`}>
                {icon}
            </div>
            {label}
        </button>
    );
}

function WithdrawMethod({ name, active = false, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${active ? 'border-agro-green bg-agro-green/5 text-agro-green shadow-sm' : 'border-slate-100 bg-white text-slate-400 hover:bg-slate-50'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${active ? 'bg-agro-green' : 'bg-slate-200'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{name}</span>
            </div>
            {active && <Shield size={14} className="text-agro-green" />}
        </div>
    );
}

function LearningCard({ title, topic, color, description, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`glass-card p-8 border-t-8 border-slate-900/5 hover:border-t-agro-green hover:scale-[1.02] transition-all cursor-pointer group`}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="font-black text-xl text-slate-800 tracking-tight">{title}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-white mt-1 inline-block ${color}`}>{topic}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-agro-green transition-colors">
                    <ArrowUpRight size={20} />
                </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-bold opacity-80 line-clamp-3">{description}</p>
            <button className="text-xs font-black uppercase tracking-[0.2em] text-agro-green group-hover:underline">View Full Guide</button>
        </div>
    );
}

const MY_CALENDAR_DATA = [
    { name: "White Corn #01", plantedDate: "Jan 12, 2026", nextTask: "Fertilizer Cycle 2", taskDate: "Tomorrow", progress: 65 },
    { name: "Maka Tomatoes", plantedDate: "Feb 05, 2026", nextTask: "Pruning Phase", taskDate: "In 3 Days", progress: 40 }
];
