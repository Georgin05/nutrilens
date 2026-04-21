import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './ScanningPage.css';

export default function ScanningPage() {
    const navigate = useNavigate();

    // --- State Management ---
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showSandbox, setShowSandbox] = useState(false);
    const [customBarcode, setCustomBarcode] = useState('');
    const [showManual, setShowManual] = useState(false);
    const [manualText, setManualText] = useState('');
    const [manualName, setManualName] = useState('');

    // --- Demo Sandbox Presets ---
    const PRESET_PRODUCTS = [
        { name: "Ferrero Rocher", barcode: "8000500167106" },
        { name: "Coca Cola", barcode: "5449000000996" },
        { name: "Oreo Cookies", barcode: "7622300441443" },
        { name: "Nutella Market", barcode: "3017620422003" },
        { name: "Ketchup Heinz", barcode: "8715700421360" },
    ];

    // --- Product Fetching ---
    const handleSimulateScan = async (barcode) => {
        setLoading(true);
        setError(null);
        setShowSandbox(false);
        try {
            const data = await api.getProduct(barcode);
            setProductData(data);
            setScanned(true);
            
            // Record this in recent scans history automatically
            try {
                await api.logScan(barcode, data.name);
            } catch (scanErr) {
                console.warn("Failed to record scan in history:", scanErr);
            }
        } catch (err) {
            console.error("Failed to fetch product:", err);
            setError(err.response?.data?.detail || "Could not find product data for this barcode.");
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomScanSubmit = (e) => {
        e.preventDefault();
        if (customBarcode.trim()) {
            handleSimulateScan(customBarcode.trim());
        }
    };

    const handleStartLiveScanner = () => {
        navigate('/live-scan');
    };

    const handleLogIntake = async () => {
        if (!productData) return;
        try {
            await api.logFood(productData.barcode, 1.0);
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to log food:", err);
            alert("Failed to log intake. Please try again.");
        }
    };

    // --- Render Helpers ---
    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-neon"></div>
                <h1 className="text-2xl font-black uppercase tracking-widest animate-pulse">Analyzing Biochemistry...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface text-center">
                <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
                <h2 className="text-3xl font-black mb-2 uppercase">Scan Failed</h2>
                <p className="text-on-surface-variant max-w-md mb-8">{error}</p>
                <button 
                    onClick={() => { setError(null); setScanned(false); }}
                    className="claymorphic-primary px-8 py-3 rounded-full font-bold text-on-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (scanned && productData) {
        return (
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
                <div className="clay-card w-full max-w-4xl p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                                        Barcode Detected &bull; {productData.barcode}
                                    </span>
                                    <h2 className="text-4xl font-extrabold text-white mt-4 tracking-tighter" title={productData.name}>
                                        {productData.name}
                                    </h2>
                                    <p className="text-on-surface-variant text-lg font-medium mt-1 italic">Molecular Composition Identified</p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-24 h-24 flex items-center justify-center rounded-3xl ${
                                        ['a', 'b'].includes(productData.nutri_score?.toLowerCase()) ? 'clay-badge-green' :
                                        ['c'].includes(productData.nutri_score?.toLowerCase()) ? 'clay-badge-amber' :
                                        'bg-error/20 border border-error/30'
                                    } shadow-lg`}>
                                        <span className={`text-5xl font-black italic uppercase ${
                                            ['d', 'e'].includes(productData.nutri_score?.toLowerCase()) ? 'text-error' : 'text-surface'
                                        }`}>
                                            {productData.nutri_score || '?'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Nutri-Score</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="clay-chip p-4 flex flex-col items-center">
                                    <span className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Calories</span>
                                    <span className="text-2xl font-black text-white">{Math.round(productData.calories || 0)}</span>
                                </div>
                                <div className="clay-chip p-4 flex flex-col items-center text-primary">
                                    <span className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Protein</span>
                                    <span className="text-2xl font-black">{Math.round(productData.protein_g || 0)}g</span>
                                </div>
                                <div className="clay-chip p-4 flex flex-col items-center text-amber-500">
                                    <span className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Carbs</span>
                                    <span className="text-2xl font-black">{Math.round(productData.carbs_g || 0)}g</span>
                                </div>
                                <div className="clay-chip p-4 flex flex-col items-center text-error">
                                    <span className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Fat</span>
                                    <span className="text-2xl font-black">{Math.round(productData.fat_g || 0)}g</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[350px] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                        <span className="material-symbols-outlined text-amber-500 text-xl">science</span>
                                    </div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Bio-Marker Alerts</h3>
                                </div>

                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {productData.flagged_ingredients && productData.flagged_ingredients.length > 0 ? (
                                        productData.flagged_ingredients.map((ing, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-surface-container-highest/30 border border-outline-variant/10 flex items-center justify-between group hover:bg-surface-container-highest/50 transition-all">
                                                <div>
                                                    <span className="text-sm font-bold text-white block capitalize">{ing.name}</span>
                                                    <span className="text-[10px] text-on-surface-variant font-medium">{ing.reason}</span>
                                                </div>
                                                <span className="material-symbols-outlined text-error text-xl animate-pulse">warning</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                                            <span className="material-symbols-outlined text-primary text-3xl mb-2">verified</span>
                                            <p className="text-primary font-bold text-sm uppercase tracking-widest">Clean Bio-Profile</p>
                                            <p className="text-xs text-on-surface-variant mt-1">No inflammatory additives detected.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-8">
                                <button
                                    onClick={handleLogIntake}
                                    className="w-full claymorphic-primary text-surface font-black py-5 flex items-center justify-center gap-3 text-lg hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <span>Log Daily Intake</span>
                                    <span className="material-symbols-outlined font-black">add_circle</span>
                                </button>
                                <button
                                    onClick={() => setScanned(false)}
                                    className="w-full bg-surface-container-highest/40 text-on-surface-variant font-bold py-4 rounded-2xl hover:bg-surface-container-highest/60 transition-all text-sm uppercase tracking-widest"
                                >
                                    Dismiss Result
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
            {/* TopAppBar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#021109]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(60,255,144,0.05)] border-b border-primary/5">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-[#3cff90] tracking-tighter uppercase font-headline cursor-pointer">NutriLens</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/dashboard" className="font-['Inter'] font-semibold text-[10px] uppercase tracking-widest text-[#9bb0a3] hover:text-[#3cff90] transition-all">Dashboard</Link>
                        <Link to="/scanner" className="font-['Inter'] font-semibold text-[10px] uppercase tracking-widest text-[#3cff90]">Scan</Link>
                        <Link to="/history" className="font-['Inter'] font-semibold text-[10px] uppercase tracking-widest text-[#9bb0a3] hover:text-[#3cff90] transition-all">History</Link>
                        <span className="font-['Inter'] font-semibold text-[10px] uppercase tracking-widest text-[#9bb0a3] hover:text-[#3cff90] transition-all cursor-pointer">Sandbox</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#3cff90]">
                        <button className="p-2 hover:bg-[#102b1e] rounded-full transition-all active:scale-95">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="p-2 hover:bg-[#102b1e] rounded-full transition-all active:scale-95" onClick={() => navigate('/dashboard')}>
                            <span className="material-symbols-outlined">person</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-grow flex flex-col items-center justify-center relative px-6 pt-24 pb-32">
                {/* Viewfinder Background */}
                <div className="absolute inset-0 z-0 overflow-hidden opacity-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square max-w-[600px] border-[1px] border-primary/20 rounded-xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] aspect-square max-w-[800px] border-[1px] border-primary/5 rounded-full"></div>
                    <img 
                        alt="Scanning Background" 
                        className="w-full h-full object-cover mix-blend-overlay" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4Fe4vn0YUZvqp4KVtNXealAYVoSn7z5Cly3zb8zdLtf1aKzK5WHlMY08EbLqmbTljBMm7IPp6E8k5SncBmZR9J-Ya3jI2ej72v9TocCGZhT8Pqb2Dm38A7l3etR_d47evR2MHjoK6hEMYd_JwkBce7FP71lOfWfWqknElvADShfq2evyDkG8EJUWYiOiJmkXIbOUCwFTshnRJ35btAeulAt44OsNuFpJOvk9zPsR2fTwDHpX9Dkr4OiYBqjXQ9HCzb9YT1SFr-ivT"
                    />
                </div>

                {/* Center Scan Action */}
                <div className="relative z-10 flex flex-col items-center gap-12 max-w-4xl w-full">
                    <div className="text-center space-y-4">
                        <h1 className="font-headline font-extrabold text-5xl md:text-7xl tracking-tighter uppercase text-primary leading-none">Scan & Go</h1>
                        <p className="text-on-surface-variant font-medium text-lg md:text-xl max-w-md mx-auto">Point your camera at any meal to unlock instant nutritional insights.</p>
                    </div>
                    <div className="relative group">
                        {/* Decorative Rings */}
                        <div className="absolute -inset-8 border border-primary/10 rounded-full animate-pulse"></div>
                        <div className="absolute -inset-16 border border-primary/5 rounded-full"></div>
                        {/* Main Button */}
                        <button 
                            onClick={handleStartLiveScanner}
                            className="w-48 h-48 md:w-64 md:h-64 rounded-full claymorphic-primary flex flex-col items-center justify-center gap-3 active:scale-90 transition-all duration-300 group-hover:scale-105 scan-glow-ring shadow-neon"
                        >
                            <span className="material-symbols-outlined text-surface text-6xl md:text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>center_focus_strong</span>
                            <span className="text-surface font-headline font-black tracking-tighter uppercase text-lg">Tap to Scan</span>
                        </button>
                    </div>
                </div>

                {/* Right Side Quick Actions (Floating Glass) */}
                <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 hidden md:flex">
                    <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 border border-outline-variant/10 shadow-2xl">
                        <button 
                            onClick={() => setShowSandbox(true)}
                            className="flex items-center gap-4 px-4 py-4 rounded-xl bg-surface-container-highest/40 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all group"
                        >
                            <span className="material-symbols-outlined text-2xl">construction</span>
                            <span className="font-['Inter'] font-bold text-[10px] uppercase tracking-widest hidden lg:block">Dev Sandbox</span>
                        </button>
                        <button 
                            onClick={() => navigate('/history')}
                            className="flex items-center gap-4 px-4 py-4 rounded-xl bg-surface-container-highest/40 hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all group"
                        >
                            <span className="material-symbols-outlined text-2xl">history</span>
                            <span className="font-['Inter'] font-bold text-[10px] uppercase tracking-widest hidden lg:block">Scan History</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Secondary Actions */}
                <div className="flex md:hidden gap-4 mt-12 z-10">
                    <button onClick={() => setShowSandbox(true)} className="glass-panel flex items-center gap-3 px-6 py-4 rounded-full text-on-surface-variant border border-primary/10">
                        <span className="material-symbols-outlined text-xl">construction</span>
                        <span className="font-['Inter'] font-bold text-[10px] uppercase tracking-widest">Sandbox</span>
                    </button>
                    <button onClick={() => navigate('/history')} className="glass-panel flex items-center gap-3 px-6 py-4 rounded-full text-on-surface-variant border border-primary/10">
                        <span className="material-symbols-outlined text-xl">history</span>
                        <span className="font-['Inter'] font-bold text-[10px] uppercase tracking-widest">History</span>
                    </button>
                </div>
            </main>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[#021109]/90 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-primary/10 shadow-2xl">
                <Link to="/dashboard" className="flex flex-col items-center gap-1 text-[#9bb0a3] p-2">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="font-bold text-[9px] uppercase tracking-widest">Dashboard</span>
                </Link>
                <Link to="/scanner" className="flex flex-col items-center gap-1 bg-primary/10 text-primary rounded-2xl px-5 py-2 border border-primary/20">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>center_focus_strong</span>
                    <span className="font-bold text-[9px] uppercase tracking-widest">Scan</span>
                </Link>
                <Link to="/history" className="flex flex-col items-center gap-1 text-[#9bb0a3] p-2">
                    <span className="material-symbols-outlined">history</span>
                    <span className="font-bold text-[9px] uppercase tracking-widest">History</span>
                </Link>
            </nav>

            {/* --- Modals for Sandbox/Manual --- */}
            {showSandbox && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="clay-card w-full max-w-md p-8 relative">
                        <button onClick={() => setShowSandbox(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">construction</span>
                            Dev Sandbox
                        </h3>
                        <div className="space-y-3">
                            {PRESET_PRODUCTS.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSimulateScan(p.barcode)}
                                    className="w-full text-left px-5 py-4 bg-surface-container-highest/40 hover:bg-primary/10 rounded-2xl border border-outline-variant/10 transition-all flex justify-between items-center group"
                                >
                                    <span className="font-bold text-white group-hover:text-primary">{p.name}</span>
                                    <span className="text-xs text-on-surface-variant font-mono bg-black/30 px-2 py-1 rounded">{p.barcode}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-outline-variant/10">
                            <form onSubmit={handleCustomScanSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={customBarcode}
                                    onChange={(e) => setCustomBarcode(e.target.value)}
                                    placeholder="Enter Barcode"
                                    className="flex-1 bg-surface-container-highest/30 border border-outline-variant/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-primary transition-all"
                                />
                                <button type="submit" className="claymorphic-primary px-6 py-3 rounded-xl font-black">Scan</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
