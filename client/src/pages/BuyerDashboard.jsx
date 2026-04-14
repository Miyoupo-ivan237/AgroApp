import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, MapPin, ShoppingBag, LogOut, 
    ArrowRight, Tag, LayoutDashboard, Wallet, 
    Clock, Package, Star, ShieldCheck, CreditCard,
    TrendingUp, Bell, Truck, Plus, 
    Edit2, Trash2, CheckCircle, MessageCircle, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BuyerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [language, setLanguage] = useState(localStorage.getItem('agro_lang') || 'en');
    const [crops, setCrops] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [showRegisterTransport, setShowRegisterTransport] = useState(false);
    const [transportForm, setTransportForm] = useState({ vehicle_type: '', price_per_trip_fcfa: '', location: '', phone_number: '' });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ORANGE');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleOrderAction = (order) => {
        setSelectedOrder(order);
    };

    const [favorites, setFavorites] = useState([
        { id: 1, name: "Fresh Maize", price: 500, region: "Bafoussam" },
        { id: 2, name: "Organic Tomatoes", price: 1200, region: "Foumbot" }
    ]);

    const [orders, setOrders] = useState([
        { id: "ORD-99", items: "Cassava (5kg)", total: 3300, status: "Delivering", date: "2026-03-18" }
    ]);

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const res = await api.get('crops');
                setCrops(res.data);
            } catch (err) {
                console.error("Failed to load marketplace crops", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchTransporters = async () => {
            try {
                const res = await api.get('logistics');
                setTransporters(res.data);
            } catch (err) {
                console.error("Failed to load transporters", err);
            }
        };
        fetchCrops();
        fetchTransporters();
    }, []);

    const calculateFee = (price) => Math.round(price * 0.1);
    const calculateTotal = (price) => Math.round(price * 1.0); // Now 10% comes from the farmer's side as requested.

    const handleContactSeller = async (crop) => {
        const confirmContact = window.confirm(`Send an automated alert to the seller at its registered number? Direct contact ensures you inspect the goods before payment.`);
        if (!confirmContact) return;

        try {
            // Simulate SMS Alert
            alert(`SMS ALERT SENT TO SELLER: "Hello, a buyer named ${user.full_name} is interested in your ${crop.name}. Please stay available for inspection and negotiation."`);
            
            // Log negotiation in DB
            await api.post('orders', {
                crop_id: crop.id,
                quantity: 1,
                status: 'NEGOTIATION'
            });
            
            alert(`Contact Initialized! Please call the seller to finalize inspection. DO NOT pay before you have the goods in hand.`);
            const orderRes = await api.get('orders');
            setOrders(orderRes.data);
        } catch (err) {
            console.error("Negotiation failed", err);
        }
    };

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('Tubers');
    const [region, setRegion] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleDeleteCrop = async (id) => {
        if (!window.confirm(language === 'en' ? "Permanently remove this listing?" : "Supprimer cette annonce ?")) return;
        try {
            await api.delete(`crops/${id}`);
            const res = await api.get('crops');
            setCrops(res.data);
            alert(language === 'en' ? "Listing Deleted" : "Annonce Supprimée");
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleEditCrop = (crop) => {
        setEditMode(true);
        setEditId(crop.id);
        setName(crop.name);
        setPrice(crop.price_per_kg_fcfa || crop.price);
        setQuantity(crop.quantity_available_kg || crop.quantity);
        setCategory(crop.category);
        setRegion(crop.region_location || crop.region);
        setActiveTab('resell');
    };
    
    const handleAddOrUpdateCrop = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editMode) {
                await api.put(`crops/${editId}`, {
                    name,
                    category,
                    quantity_available_kg: parseFloat(quantity),
                    price_per_kg_fcfa: parseFloat(price),
                    region_location: region
                });
                alert(language === 'en' ? "Listing updated!" : "Annonce mise à jour !");
            } else {
                await api.post('crops', {
                    name,
                    category,
                    quantity_available_kg: parseFloat(quantity),
                    price_per_kg_fcfa: parseFloat(price),
                    region_location: region
                });
                alert(language === 'en' ? "Product listed successfully!" : "Produit listé avec succès !");
            }
            const res = await api.get('crops');
            setCrops(res.data);
            setName(''); setQuantity(''); setPrice(''); setRegion('');
            setEditMode(false); setEditId(null);
        } catch (err) {
            console.error('Error with product listing:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterTransport = async (e) => {
        e.preventDefault();
        try {
            await api.post('logistics', transportForm);
            setTransportForm({ vehicle_type: '', price_per_trip_fcfa: '', location: '', phone_number: '' });
            setShowRegisterTransport(false);
            const res = await api.get('logistics');
            setTransporters(res.data);
            alert(language === 'en' ? 'Transporter Registered Successfully!' : 'Transporteur enregistré avec succès !');
        } catch (err) {
            console.error('Transport registration failed', err);
        }
    };

    return (
        <div className="h-screen bg-[#f8fafc] flex font-outfit relative overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
            
            {/* Professional Buyer Sidebar */}
            <aside className={`w-72 bg-slate-900 text-white flex flex-col border-r border-white/5 fixed md:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-8 pb-6 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-agro-green p-2 rounded-xl shadow-lg shadow-agro-green/20">
                            <ShoppingBag size={24} />
                        </div>
                        <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">BUYER HUB</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                    <nav className="space-y-1">
                        <SidebarLink icon={<LayoutDashboard size={20}/>} label={language === 'en' ? 'Overview' : 'Aperçu'} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <SidebarLink icon={<ShoppingBag size={20}/>} label={language === 'en' ? 'Explore Shop' : 'Boutique'} active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
                        <SidebarLink icon={<Clock size={20}/>} label={language === 'en' ? 'My Orders' : 'Commandes'} active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <SidebarLink icon={<Star size={20}/>} label={language === 'en' ? 'Favorites' : 'Favoris'} active={activeTab === 'favs'} onClick={() => setActiveTab('favs')} />
                        <SidebarLink icon={<Tag size={20}/>} label={language === 'en' ? 'Resell Hub' : 'Revente'} active={activeTab === 'resell'} onClick={() => setActiveTab('resell')} />
                        <SidebarLink icon={<Truck size={20}/>} label={language === 'en' ? 'Delivery Center' : 'Livraison'} active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} />
                        <SidebarLink icon={<Wallet size={20}/>} label={language === 'en' ? 'Payment Hub' : 'Portefeuille'} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                    </nav>
                </div>
                
                <div className="mt-auto p-8 pt-6 flex-shrink-0 border-t border-white/5">
                    <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
                    <div className="flex items-center gap-4">
                        <button 
                            className="md:hidden p-2 text-slate-600 bg-white rounded-xl shadow-sm border border-slate-100"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <span className="text-agro-green font-bold text-sm uppercase tracking-widest border-l-4 border-agro-yellow pl-3 mb-2 block tracking-[0.2em]">{language === 'en' ? 'BUYER HUB' : 'ESPACE ACHETEUR'}</span>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter capitalize leading-none pt-2">
                                 {language === 'en' ? activeTab.replace('_', ' ') : activeTab === 'overview' ? 'Aperçu' : activeTab === 'shop' ? 'Boutique' : activeTab === 'orders' ? 'Commandes' : activeTab}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end overflow-hidden">
                         {/* Premium Language Switcher */}
                         <div className="flex bg-white p-1 rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
                            <button onClick={() => { setLanguage('en'); localStorage.setItem('agro_lang', 'en'); }} className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${language === 'en' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>EN</button>
                            <button onClick={() => { setLanguage('fr'); localStorage.setItem('agro_lang', 'fr'); }} className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${language === 'fr' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>FR</button>
                        </div>
                        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 relative hover:border-agro-green transition-colors cursor-pointer">
                               <Bell size={20} />
                               <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                               <div className="w-8 h-8 rounded-full bg-agro-green flex items-center justify-center text-white font-black text-xs">{user?.full_name?.[0]}</div>
                               <span className="font-bold text-sm text-slate-700">{user?.full_name}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard label={language === 'en' ? 'Total Saved' : 'Total Économisé'} value="12,500 CFA" icon={<TrendingUp/>} color="bg-agro-green" />
                                <StatCard label={language === 'en' ? 'Active Orders' : 'Commandes Actives'} value={orders.length} icon={<Package/>} color="bg-agro-yellow" />
                                <StatCard label={language === 'en' ? 'Wallet Balance' : 'Solde Portefeuille'} value="15,200 CFA" icon={<Wallet/>} color="bg-slate-900" />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                                <div className="xl:col-span-2 glass-card p-10 bg-white shadow-xl shadow-slate-900/5">
                                    <h3 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">{language === 'en' ? 'Recommended for You' : 'Recommandations'}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {crops.slice(0, 2).map((c) => (
                                            <div key={c.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-agro-green transition-all group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <h4 className="font-black text-2xl italic uppercase tracking-tighter">{c.name}</h4>
                                                    <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{c.category}</span>
                                                </div>
                                                <p className="text-3xl font-black text-agro-green mb-8 italic">{c.price_per_kg_fcfa?.toLocaleString()} CFA <span className="text-xs text-slate-400 not-italic uppercase font-bold">/ kg</span></p>
                                                <button onClick={() => setActiveTab('shop')} className="w-full py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-agro-green hover:border-agro-green hover:text-white transition-all shadow-sm">{language === 'en' ? 'EXPLORE NOW' : 'DÉCOUVRIR'}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-agro-green/5 rounded-full -mr-16 -mt-16"></div>
                                    <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter relative z-10">{language === 'en' ? 'Identity Status' : 'Statut Identité'}</h3>
                                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 mb-8 flex items-center gap-5 relative z-10 hover:bg-white/10 transition-colors">
                                        <div className="bg-agro-green p-4 rounded-2xl text-white shadow-xl shadow-agro-green/20">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-agro-green">{language === 'en' ? 'CIANA / CNI VERIFIED' : 'CIANA / CNI VÉRIFIÉ'}</p>
                                            <p className="text-xs text-slate-400 mt-1 font-bold">{language === 'en' ? 'Secure transactions active.' : 'Transactions sécurisées actives.'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            <CreditCard size={18} /> {language === 'en' ? 'Bank Card Connected' : 'Carte Bancaire Liée'}
                                        </div>
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                                            <div className="w-4.5 h-4.5 bg-orange-500 rounded-full shadow-lg shadow-orange-500/30"></div> {language === 'en' ? 'Orange Money Active' : 'Orange Money Actif'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'shop' && (
                        <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                             <div className="flex bg-white p-2.5 rounded-[1.5rem] shadow-sm border border-slate-100 max-w-xl group focus-within:border-agro-green transition-all">
                                <div className="flex items-center px-4 py-2 gap-3 text-slate-400 flex-1">
                                    <Search size={22} className="group-focus-within:text-agro-green transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder={language === 'en' ? "Search fresh produce..." : "Rechercher des produits frais..."}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="focus:outline-none bg-transparent font-bold text-slate-700 w-full placeholder:text-slate-300" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {crops.filter(c => 
                                    (c?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                                    (c?.category || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
                                    (c?.region_location || c?.region || '').toLowerCase().includes((searchTerm || '').toLowerCase())
                                ).map((crop) => (
                                    <div key={crop.id} className="glass-card p-6 group transition-all duration-500">
                                        <div className="h-40 bg-slate-50 rounded-2xl mb-6 relative flex items-center justify-center">
                                            <Package size={48} className="text-slate-200 group-hover:scale-110 transition-transform" />
                                            <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-slate-300 hover:text-red-500 transition-colors">
                                                <Star size={16} />
                                            </button>
                                        </div>
                                        <h4 className="text-xl font-black mb-4">{crop.name}</h4>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-slate-400">Base Price</span>
                                                <span>{crop.price_per_kg_fcfa} CFA</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold text-agro-green">
                                                <span>Service Fee (10%)</span>
                                                <span>+{calculateFee(crop.price_per_kg_fcfa)} CFA</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 justify-between items-center bg-slate-50 p-6 rounded-[2rem]">
                                            <div className="flex justify-between w-full items-center mb-1">
                                                <span className="text-2xl font-black italic tracking-tighter">{calculateTotal(crop.price_per_kg_fcfa)} CFA</span>
                                                <span className="text-[10px] font-black uppercase text-agro-green tracking-widest px-2 py-0.5 bg-agro-green/5 rounded">NEGOTIABLE</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                                <button 
                                                    onClick={() => handleContactSeller(crop)}
                                                    className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-agro-green transition-all shadow-xl shadow-slate-900/10"
                                                >
                                                    INSPECT & CONTACT
                                                </button>
                                                <button 
                                                    onClick={() => alert(`Starting negotiation chat for ${crop.name}... Current Offer: ${crop.price_per_kg_fcfa} CFA`)}
                                                    className="bg-white border-2 border-slate-200 text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-agro-green transition-all"
                                                >
                                                    OFFER PRICE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                             <div className="flex justify-between items-end mb-4">
                                 <div>
                                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{language === 'en' ? 'Order Tracking' : 'Suivi de Commande'}</h3>
                                     <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{orders.length} {language === 'en' ? 'Active Transactions' : 'Transactions Actives'}</p>
                                 </div>
                             </div>
                             <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-900/5">
                                 <table className="w-full text-left">
                                     <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                         <tr>
                                             <th className="px-10 py-6">{language === 'en' ? 'Items' : 'Produit'}</th>
                                             <th className="px-10 py-6">{language === 'en' ? 'Total' : 'Total'}</th>
                                             <th className="px-10 py-6">{language === 'en' ? 'Status' : 'Statut'}</th>
                                             <th className="px-10 py-6 text-right">{language === 'en' ? 'Actions' : 'Actions'}</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-50">
                                         {orders.map(order => (
                                             <tr key={order.id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-transparent hover:border-agro-green">
                                                 <td className="px-10 py-8">
                                                     <p className="font-black text-lg text-slate-900 tracking-tight">{order.items || order.crop_name || 'Agro Product'}</p>
                                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.date} · ID: {order.id}</p>
</td>
                                                 <td className="px-10 py-8 font-black text-agro-green text-lg">
                                                     {order.total?.toLocaleString() || order.total_price?.toLocaleString()} CFA
</td>
                                                 <td className="px-10 py-8">
                                                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                         order.status === 'Delivering' ? 'bg-blue-100 text-blue-600' :
                                                         order.status === 'NEGOTIATION' ? 'bg-orange-100 text-orange-600' :
                                                         'bg-agro-green/10 text-agro-green'
                                                     }`}>
                                                         {order.status}
                                                     </span>
</td>
                                                 <td className="px-10 py-8">
                                                     <button 
                                                         onClick={() => handleOrderAction(order)}
                                                         className="text-slate-900 hover:text-agro-green transition-all p-3 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-agro-green/20 active:scale-95"
                                                     >
                                                         <ArrowRight size={24} />
                                                     </button>
</td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                        </motion.div>
                    )}

                    {activeTab === 'favs' && (
                        <motion.div key="favs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                             <h3 className="text-2xl font-black mb-8">{language === 'en' ? 'My Liked Products' : 'Mes Produits Aimés'}</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {favorites.map(f => (
                                     <div key={f.id} className="glass-card p-8 flex justify-between items-center group">
                                         <div className="flex items-center gap-6">
                                             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                                                 <Star fill="currentColor" size={32} />
                                             </div>
                                             <div>
                                                 <h4 className="text-xl font-black">{f.name}</h4>
                                                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{f.region}</p>
                                             </div>
                                         </div>
                                         <button onClick={() => setActiveTab('shop')} className="p-4 bg-slate-50 rounded-2xl hover:bg-agro-green hover:text-white transition-all">
                                             <ArrowRight size={24} />
                                         </button>
                                     </div>
                                ))}
                             </div>
                        </motion.div>
                    )}

                    {activeTab === 'resell' && (
                        <motion.div key="resell" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                            <div className="xl:col-span-5">
                                <div className="glass-card p-10 bg-white">
                                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3 tracking-tighter italic uppercase">
                                        <TrendingUp className="text-agro-green"/> {editMode ? (language === 'en' ? 'Edit Listing' : 'Modifier L\'annonce') : (language === 'en' ? 'Resell Hub' : 'Espace Revente')}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-8 font-bold leading-relaxed">{language === 'en' ? 'Turn your crop purchases into profit. List items for buyers in the city.' : 'Transformez vos achats en profit. Listez vos produits pour les citadins.'}</p>
                                    <form onSubmit={handleAddOrUpdateCrop} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{language === 'en' ? 'Produce Name' : 'Nom du Produit'}</label>
                                            <input type="text" required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Red Corn" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                            <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold appearance-none cursor-pointer">
                                                <option>Tubers</option><option>Fruits</option><option>Grains</option><option>Vegetables</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{language === 'en' ? 'Price (CFA)' : 'Prix (CFA)'}</label>
                                                <input type="number" required value={price} onChange={e=>setPrice(e.target.value)} placeholder="500" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Quantity (kg)</label>
                                                <input type="number" required value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="10" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                            <input type="text" required value={region} onChange={e=>setRegion(e.target.value)} placeholder="e.g. Douala Central" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-agro-green/10 transition-all font-bold" />
                                        </div>
                                        <button disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                                            {loading ? '...' : (editMode ? (language === 'en' ? 'UPDATE LISTING' : 'MODIFIER') : (language === 'en' ? 'CONFIRM LISTING' : 'LISTER LE PRODUIT'))}
                                        </button>
                                        {editMode && (
                                            <button type="button" onClick={() => { setEditMode(false); setEditId(null); setName(''); setQuantity(''); setPrice(''); setRegion(''); }} className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
                                                {language === 'en' ? 'Cancel Edit' : 'Annuler Modification'}
                                            </button>
                                        )}
                                    </form>
                                </div>
                            </div>
                            <div className="xl:col-span-7 space-y-8">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{language === 'en' ? 'My Active Listings' : 'Mes Annonces Actives'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {crops.filter(c => c.farmer_id === user?.id || !c.farmer_id).length === 0 ? (
                                        <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed text-slate-300 font-bold uppercase text-xs tracking-widest flex flex-col items-center gap-4">
                                            <Tag size={40} />
                                            {language === 'en' ? 'No personal listings found' : 'Aucune annonce personnelle'}
                                        </div>
                                    ) : crops.filter(c => c.farmer_id === user?.id || !c.farmer_id).map(c => (
                                        <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-black text-lg text-slate-900">{c.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.category}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditCrop(c)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-agro-green hover:text-white transition-all"><Edit2 size={16}/></button>
                                                    <button onClick={() => handleDeleteCrop(c.id)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xl font-black text-agro-green">{c.price_per_kg_fcfa || c.price} <span className="text-[10px] text-slate-400 italic">CFA</span></p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{c.quantity_available_kg || c.quantity} kg</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'transport' && (
                        <motion.div key="transport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{language === 'en' ? 'Delivery Hub' : 'Espace Livraison'}</h3>
                                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">{transporters.length} {language === 'en' ? 'Transporters Listed' : 'Transporteurs Listés'}</p>
                                </div>
                                <button 
                                    onClick={() => setShowRegisterTransport(!showRegisterTransport)}
                                    className="bg-agro-green text-white px-8 py-5 rounded-2xl font-black text-xs hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={16}/> {showRegisterTransport ? (language === 'en' ? 'CANCEL' : 'ANNULER') : (language === 'en' ? 'BECOME A TRANSPORTER' : 'DEVENIR TRANSPORTEUR')}
                                </button>
                            </div>

                            {showRegisterTransport && (
                                <motion.form 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    onSubmit={handleRegisterTransport}
                                    className="glass-card p-12 bg-slate-900 text-white mb-10 overflow-hidden"
                                >
                                    <h4 className="text-xl font-black mb-6 italic uppercase tracking-tighter">{language === 'en' ? 'Register Your Vehicle' : 'Inscrire Votre Véhicule'}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Vehicle Type (e.g. Truck, Bike)' : 'Type de Véhicule (ex: Camion, Moto)'}</label>
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
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Pricing (CFA)' : 'Prix (CFA)'}</label>
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
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Base Location' : 'Ville / Région'}</label>
                                            <div className="relative">
                                                <input 
                                                    required 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:outline-none focus:border-agro-green transition-all" 
                                                    placeholder={language === 'en' ? "e.g. Douala / Littoral" : "ex: Yaoundé"}
                                                    value={transportForm.location}
                                                    onChange={(e) => setTransportForm({...transportForm, location: e.target.value})}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                                                    <MapPin size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{language === 'en' ? 'Contact Phone' : 'Téléphone'}</label>
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
                                    <button type="submit" className="w-full py-5 bg-agro-green text-white rounded-[2rem] font-black shadow-2xl shadow-agro-green/30 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] group">
                                        {language === 'en' ? 'SUBMIT REGISTRATION' : 'ENREGISTRER'}
                                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>

                                </motion.form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {transporters.length === 0 ? (
                                    <div className="col-span-full py-20 text-center opacity-30">
                                        <Truck size={64} className="mx-auto mb-4" />
                                        <p className="font-bold">{language === 'en' ? 'No transporters listed. Be the first!' : 'Aucun transporteur listé. Soyez le premier!'}</p>
                                    </div>
                                ) : transporters.map((t, i) => (
                                    <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-agro-green/10 group-hover:text-agro-green transition-colors">
                                                <Truck size={32} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-2xl text-slate-800 tracking-tight italic uppercase leading-tight">{t.name}</h4>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <span className="text-[10px] font-black text-agro-green uppercase bg-agro-green/10 px-3 py-1 rounded-full tracking-widest">{t.vehicle_type}</span>
                                                    {t.location && (
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 opacity-70">
                                                            <MapPin size={12}/> {t.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:border-agro-green/10 transition-colors">
                                                <p className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">{language === 'en' ? 'Reliability' : 'Fiabilité'}</p>
                                                <p className="text-lg font-black text-slate-800 tracking-tighter mt-1">⭐ {t.rating || 5.0}</p>
                                            </div>
                                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:border-agro-green/10 transition-colors">
                                                <p className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">{language === 'en' ? 'Fee' : 'Tarif'}</p>
                                                <p className="text-lg font-black text-agro-green tracking-tighter mt-1 leading-none">{t.price_per_trip_fcfa?.toLocaleString()}<br/><span className="text-[10px] opacity-30 uppercase tracking-normal font-bold">CFA</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-agro-green transition-all" 
                                                onClick={() => {
                                                    if (t.phone) {
                                                        window.open(`tel:${t.phone}`);
                                                    } else {
                                                        window.open(`tel:698415093`); // Fallback
                                                    }
                                                }}
                                            >
                                                {language === 'en' ? 'CALL NOW' : 'APPELER'}
                                            </button>
                                            <button className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-agro-green transition-colors border border-transparent hover:border-agro-green/20" onClick={() => window.alert('Sending location to transporter via SMS...')}>
                                                <MapPin size={22} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'wallet' && (
                        <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                             <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-80 h-80 bg-agro-green/10 rounded-full -mr-40 -mt-40 animate-pulse"></div>
                                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                     <div>
                                         <p className="text-xs font-black uppercase tracking-[0.4em] text-agro-green mb-3 opacity-60 italic">{language === 'en' ? 'WALLET BALANCE' : 'SOLDE PORTEFEUILLE'}</p>
                                         <h2 className="text-7xl font-black italic tracking-tighter">15,200 <span className="text-2xl opacity-40 not-italic uppercase tracking-normal font-bold">CFA</span></h2>
                                     </div>
                                     <div className="flex gap-4">
                                         <button className="px-12 py-6 bg-agro-green text-white rounded-[2rem] font-black shadow-2xl shadow-agro-green/40 hover:scale-[1.05] transition-transform active:scale-95 text-xs uppercase tracking-widest">{language === 'en' ? 'Top Up' : 'Recharger'}</button>
                                         <button className="px-12 py-6 bg-white/10 text-white rounded-[2rem] font-black border border-white/5 hover:bg-white/20 transition-all text-xs uppercase tracking-widest">{language === 'en' ? 'Withdraw' : 'Retirer'}</button>
                                     </div>
                                 </div>
                             </div>

                             <div className="glass-card p-12 bg-white">
                                 <div className="flex justify-between items-center mb-10">
                                     <h3 className="text-3xl font-black tracking-tighter uppercase italic">{language === 'en' ? 'Cameroonian Payment Methods' : 'Moyens de Paiement Local'}</h3>
                                     <span className="bg-agro-green/10 text-agro-green px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2"><ShieldCheck size={14}/> {language === 'en' ? 'ENCRYPTED' : 'SÉCURISÉ'}</span>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <PaymentCard 
                                        name="Orange Money" 
                                        method="ORANGE" 
                                        active={selectedPaymentMethod === 'ORANGE'} 
                                        onClick={() => setSelectedPaymentMethod('ORANGE')}
                                        language={language} 
                                    />
                                    <PaymentCard 
                                        name="MTN MoMo" 
                                        method="MTN" 
                                        active={selectedPaymentMethod === 'MTN'} 
                                        onClick={() => setSelectedPaymentMethod('MTN')}
                                        language={language} 
                                    />
                                    <PaymentCard 
                                        name="Bank Card (UBA/EcoBank)" 
                                        method="CARD" 
                                        active={selectedPaymentMethod === 'CARD'} 
                                        onClick={() => setSelectedPaymentMethod('CARD')}
                                        language={language} 
                                    />
                                 </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Order Action Modal */}
                <AnimatePresence>
                    {selectedOrder && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
                            onClick={() => setSelectedOrder(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white w-full max-w-lg rounded-[3rem] p-12 relative overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-agro-green"></div>
                                <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tighter text-slate-900">{language === 'en' ? 'Order Management' : 'Gestion Commande'}</h3>
                                <p className="text-slate-400 font-bold mb-8 uppercase text-[10px] tracking-widest">{language === 'en' ? 'Select an action for this transaction' : 'Sélectionnez une action pour cette transaction'}</p>
                                
                                <div className="space-y-4">
                                    <button onClick={() => { alert('Tracking tracking details...'); setSelectedOrder(null); }} className="w-full p-6 bg-slate-50 hover:bg-agro-green/5 border-2 border-slate-100 hover:border-agro-green rounded-2xl flex items-center justify-between group transition-all">
                                        <div className="flex items-center gap-4 text-slate-900 font-black italic text-lg"><Truck size={24} className="text-agro-green"/> {language === 'en' ? 'Track Delivery' : 'Suivre la Livraison'}</div>
                                        <ArrowRight size={20} className="text-slate-300 group-hover:text-agro-green group-hover:translate-x-1 transition-all" />
                                    </button>
                                    <button onClick={() => { alert('Opening dispute channel...'); setSelectedOrder(null); }} className="w-full p-6 bg-slate-50 hover:bg-red-50 border-2 border-slate-100 hover:border-red-200 rounded-2xl flex items-center justify-between group transition-all">
                                        <div className="flex items-center gap-4 text-slate-900 font-black italic text-lg"><MessageCircle size={24} className="text-red-400"/> {language === 'en' ? 'Report Issue' : 'Signaler un Problème'}</div>
                                        <ArrowRight size={20} className="text-slate-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                                    </button>
                                    <button onClick={() => setSelectedOrder(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest mt-4">
                                        {language === 'en' ? 'CLOSE' : 'FERMER'}
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

function SidebarLink({ icon, label, active = false, onClick }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-sm transition-all group w-full text-left ${active ? 'bg-agro-green text-white shadow-xl shadow-agro-green/30' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
            <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-agro-green'} transition-colors`}>{icon}</div>
            {label}
        </button>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="glass-card p-8 group">
            <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                {icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    );
}

function PaymentCard({ name, method, active = false, onClick, language }) {
    const icons = {
        ORANGE: <div className="w-8 h-8 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30" />,
        MTN: <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30" />,
        CARD: <CreditCard className="text-blue-500" />
    };

    return (
        <div 
            onClick={onClick}
            className={`p-10 rounded-[3rem] border-2 transition-all cursor-pointer relative overflow-hidden group ${active ? 'border-agro-green bg-agro-green/5' : 'border-slate-50 bg-slate-50/50 hover:border-agro-green/20'}`}
        >
            {active && <div className="absolute top-0 right-0 w-16 h-16 bg-agro-green/10 rounded-bl-full"></div>}
            <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-50 group-hover:scale-110 transition-transform">{icons[method]}</div>
                {active && <div className="w-3 h-3 bg-agro-green rounded-full shadow-glow"></div>}
            </div>
            <p className="font-black text-xl italic tracking-tighter text-slate-800">{name}</p>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{active ? (language === 'en' ? 'Primary Account' : 'Compte Principal') : (language === 'en' ? 'Tap to Select' : 'Séléctionner')}</p>
        </div>
    );
}
