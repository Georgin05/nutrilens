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
    const [scannerError, setScannerError] = useState(null);

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

    // Navigation helper
    const handleStartLiveScanner = () => {
        navigate('/live-scan');
    };

    // --- Action Handlers ---
    const handleLogIntake = async () => {
        if (!productData) return;

        try {
            await api.logFood(productData.barcode, 1.0); // Default 1 serving
            navigate('/dashboard'); // Go to dashboard to see updated rings
        } catch (err) {
            console.error("Failed to log food:", err);
            alert("Failed to log intake. Please try again.");
        }
    };

    return (
        <div className="font-display bg-bg-dark text-slate-100 antialiased overflow-hidden min-h-full h-full">
            <div className="relative flex h-full w-full flex-col overflow-hidden">
                    {/* Hero Dashboard for Scanner */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10 flex-col px-4">
                        <div className="w-full max-w-4xl text-center">
                            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <span className="material-symbols-outlined text-[100px] text-emerald-clay mb-6 drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]">qr_code_scanner</span>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">AI Molecular <span className="text-emerald-clay">Scanner</span></h1>
                                <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                                    Analyze nutritional compounds, additives, and bio-markers in real-time using high-precision computer vision.
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleStartLiveScanner} 
                                className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-bg-dark font-black px-12 py-5 rounded-[2rem] hover:brightness-110 transition-all mb-6 shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] active:scale-95 active:shadow-none duration-150 transform flex items-center gap-3 mx-auto group border border-emerald-300/50"
                            >
                                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform duration-300">fit_screen</span> 
                                <span className="text-xl tracking-[0.1em] uppercase">Start Live Camera</span>
                            </button>
                        </div>
                    </div>


                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-bg-dark/70 pointer-events-none z-10"></div>

                <header className="relative z-20 flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="p-2 clay-badge-green">
                                <span className="material-symbols-outlined text-bg-dark font-bold">center_focus_weak</span>
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight">NutriLens</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* SandBox Trigger Button */}
                        <button
                            onClick={() => setShowSandbox(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-purple-700 transition"
                        >
                            <span className="material-symbols-outlined text-sm">construction</span>
                            Dev Sandbox
                        </button>

                        <div className="clay-chip px-5 py-2 flex items-center gap-3">
                            <span className="material-symbols-outlined text-emerald-clay text-sm">bolt</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Live Analysis</span>
                        </div>
                        <button className="clay-utility-btn w-12 h-12 flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-clay/30 overflow-hidden shadow-lg cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx9mnPg2rumpRyLWpez7Ob2zmQ-8HO_BRDNkuv2XRz9OIDPxi5zEC5fL2vPLexYTq7FtBxJQJAUi7IlFIyJuebtbbC9E8JeLKllUEEG1RBOzbYGOGlZMZfjfTdZ8Be0UJs-Fmn7kfjjpAMqcaGsPoOsoeF4Al4Ch8he8ukJ1D_Bnx6wbM3IhbFX8nygcoDO-7wQbuE2M9lnovlD4VshIKsQkh42SPTmK-fHx01bqz4dl5vt5tLx9-i56G2RYBo_vuM-AH28vkNC8Hz" />
                        </div>
                    </div>
                </header>

                <main className="relative z-10 flex-1 flex flex-col items-center justify-end pb-10 px-6">
                    {loading ? (
                        <div className="clay-card w-full max-w-5xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 border-4 border-emerald-clay border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-emerald-clay font-bold tracking-widest uppercase">Analyzing Biochemistry...</p>
                        </div>
                    ) : error ? (
                        <div className="clay-card w-full max-w-5xl p-10 flex flex-col items-center justify-center min-h-[400px] border-amber-clay/50 border">
                            <span className="material-symbols-outlined text-5xl text-amber-clay mb-4">error</span>
                            <h2 className="text-2xl font-bold text-white mb-2">Scan Failed</h2>
                            <p className="text-slate-400 max-w-md text-center">{error}</p>
                        </div>
                    ) : scanned && productData ? (
                        <div className="clay-card w-full max-w-5xl p-10">
                            <div className="flex flex-col lg:flex-row gap-12">
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="bg-emerald-clay/10 text-emerald-clay px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                                Barcode Detected &bull; {productData.barcode}
                                            </span>
                                            <h2 className="text-3xl font-extrabold text-white mt-3 truncate max-w-md" title={productData.name}>
                                                {productData.name}
                                            </h2>
                                            <p className="text-slate-400 text-lg font-medium">Scanned via OpenFoodFacts</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            {/* Dynamic Grade Badge based on Nutri-Score */}
                                            <div className={`w-20 h-20 flex items-center justify-center rounded-2xl ${['a', 'b'].includes(productData.nutri_score?.toLowerCase()) ? 'clay-badge-green' :
                                                ['c'].includes(productData.nutri_score?.toLowerCase()) ? 'clay-badge-amber' :
                                                    ['d', 'e'].includes(productData.nutri_score?.toLowerCase()) ? 'bg-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.3)] shadow-inner border border-rose-500/30' :
                                                        'bg-slate-700/50 border border-slate-600'
                                                }`}>
                                                <span className={`text-4xl font-black italic uppercase ${['d', 'e'].includes(productData.nutri_score?.toLowerCase()) ? 'text-rose-400' :
                                                    !productData.nutri_score ? 'text-slate-400 text-2xl' : 'text-bg-dark'
                                                    }`}>
                                                    {productData.nutri_score || '?'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Nutri-Score
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="clay-chip px-4 py-3 flex items-center gap-3">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Calories</span>
                                            <span className="text-lg font-extrabold text-white">{Math.round(productData.calories || 0)}</span>
                                        </div>
                                        <div className="clay-chip px-4 py-3 flex items-center gap-3">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Carbs</span>
                                            <span className="text-lg font-extrabold text-amber-clay">{Math.round(productData.carbs_g || 0)}g</span>
                                        </div>
                                        <div className="clay-chip px-4 py-3 flex items-center gap-3">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Protein</span>
                                            <span className="text-lg font-extrabold text-emerald-clay">{Math.round(productData.protein_g || 0)}g</span>
                                        </div>
                                        <div className="clay-chip px-4 py-3 flex items-center gap-3">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Fat</span>
                                            <span className="text-lg font-extrabold text-rose-400">{Math.round(productData.fat_g || 0)}g</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-[400px] flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-1.5 clay-badge-amber">
                                                <span className="material-symbols-outlined text-bg-dark text-xl">science</span>
                                            </div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">The Hidden Truth</h3>
                                        </div>

                                        <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                            {productData.flagged_ingredients && productData.flagged_ingredients.length > 0 ? (
                                                productData.flagged_ingredients.map((ing, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 clay-chip">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white capitalize">{ing.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-medium">{ing.reason}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-slate-500 text-sm">warning</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 clay-chip border border-emerald-clay/30 bg-emerald-clay/5 text-center">
                                                    <span className="text-emerald-clay font-bold text-sm">Clean Label</span>
                                                    <p className="text-xs text-slate-400 mt-1">No major ultra-processed flags found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogIntake}
                                        className="w-full mt-8 clay-button-primary text-bg-dark font-black py-4 flex items-center justify-center gap-3 text-lg hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        <span>Log Intake</span>
                                        <span className="material-symbols-outlined font-bold">add_circle</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-10 flex flex-col items-center">
                            {scannerError && (
                                <div className="clay-chip px-8 py-3 mb-4 border border-amber-clay/50 bg-amber-clay/10">
                                    <p className="text-amber-clay text-sm font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined">warning</span> Warning: {scannerError}
                                    </p>
                                </div>
                            )}
                            <div className="clay-chip px-8 py-3">
                                <p className="text-slate-200 text-sm font-bold">
                                    Position product barcode for high-fidelity molecular analysis
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 flex items-center gap-10">
                        <button onClick={() => setShowManual(true)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                            <div className="clay-utility-btn p-3 group-hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined">keyboard</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Manual Entry</span>
                        </button>
                        <div className="h-8 w-1 bg-white/5 rounded-full"></div>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                            <div className="clay-utility-btn p-3 group-hover:bg-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-emerald-clay">flash_on</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Flash Light</span>
                        </button>
                    </div>
                </main>

                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
                    <button className="w-14 h-14 clay-utility-btn flex items-center justify-center text-slate-300 hover:text-emerald-clay transition-colors">
                        <span className="material-symbols-outlined text-2xl">zoom_in</span>
                    </button>
                    <button className="w-14 h-14 clay-utility-btn flex items-center justify-center text-slate-300 hover:text-emerald-clay transition-colors">
                        <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
                    </button>
                    <button className="w-14 h-14 clay-utility-btn flex items-center justify-center text-slate-300 hover:text-emerald-clay transition-colors">
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </button>
                </div>

                {/* --- DEV SANDBOX MODAL --- */}
                {showSandbox && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="clay-card w-full max-w-md p-8 relative">
                            <button
                                onClick={() => setShowSandbox(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">construction</span>
                                Dev Sandbox
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">Simulate scanning a real barcode to test the OpenFoodFacts API integration.</p>

                            <div className="space-y-3 mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Presets</h4>
                                {PRESET_PRODUCTS.map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSimulateScan(p.barcode)}
                                        className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors flex justify-between items-center group"
                                    >
                                        <span className="font-bold text-white group-hover:text-amber-500 transition-colors">{p.name}</span>
                                        <span className="text-xs text-slate-500 font-mono bg-black/30 px-2 py-1 rounded">{p.barcode}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Barcode</h4>
                                <form onSubmit={handleCustomScanSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customBarcode}
                                        onChange={(e) => setCustomBarcode(e.target.value)}
                                        placeholder="e.g. 8000500167106"
                                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono outline-none focus:border-purple-500 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-bold transition-colors"
                                    >
                                        Scan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MANUAL ENTRY MODAL --- */}
                {showManual && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="clay-card w-full max-w-md p-8 relative">
                            <button
                                onClick={() => setShowManual(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-clay">keyboard</span>
                                Manual Entry
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">Type or paste the ingredients list below to analyze a product not found via barcode.</p>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (manualText.trim()) {
                                    setLoading(true);
                                    setError(null);
                                    setShowManual(false);
                                    try {
                                        const data = await api.analyzeIngredients(manualText, manualName || "Custom Product");
                                        setProductData(data);
                                        setScanned(true);
                                    } catch (err) {
                                        console.error("Failed to analyze manual input:", err);
                                        setError(err.response?.data?.detail || "Analysis failed.");
                                        setScanned(false);
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Product Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={manualName}
                                        onChange={(e) => setManualName(e.target.value)}
                                        placeholder="e.g. Grandma's Cookies"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-clay transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">Ingredients List *</label>
                                    <textarea
                                        value={manualText}
                                        onChange={(e) => setManualText(e.target.value)}
                                        placeholder="Water, Sugar, Enriched Flour, Partially Hydrogenated Soybean Oil..."
                                        rows={4}
                                        required
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-clay transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full clay-button-primary text-bg-dark px-4 py-3 rounded-xl font-black text-lg hover:brightness-110 active:scale-95 transition-all mt-4"
                                >
                                    Analyze Ingredients
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
