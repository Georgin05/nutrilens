import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import api from '../services/api';

const LiveScannerPage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    
    // --- State Management ---
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(true);

    // Mock data for initial design verification if needed
    // useEffect(() => {
    //     setProductData({
    //         name: "Mediterranean Salad",
    //         calories: 342,
    //         protein_g: 12,
    //         carbs_g: 24,
    //         fat_g: 18,
    //         nutri_score: 'A',
    //         eco_score: 'B',
    //         ingredients_tags: ['Organic Kale', 'Cherry Tomatoes', 'Cucumber', 'Kalamata Olives', 'Feta Cheese', 'Lemon Vinaigrette'],
    //         flagged_ingredients: []
    //     });
    // }, []);

    useEffect(() => {
        if (!isCameraActive) return;

        const startScanner = async () => {
            try {
                const codeReader = new BrowserMultiFormatReader();
                codeReaderRef.current = codeReader;
                
                await codeReader.decodeFromVideoDevice(
                    undefined, 
                    videoRef.current, 
                    async (result, err) => {
                        if (result) {
                            const barcode = result.getText();
                            console.log("Barcode detected:", barcode);
                            handleBarcodeDetected(barcode);
                        }
                    }
                );
            } catch (err) {
                console.error("Camera access failed:", err);
                setError("Failed to access camera. Please ensure permissions are granted.");
            }
        };

        startScanner();

        return () => {
            if (codeReaderRef.current) {
                // Ideally stop the tracks but ZXing handles most
            }
        };
    }, [isCameraActive]);

    const handleBarcodeDetected = async (barcode) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.getProduct(barcode);
            setProductData(data);
            
            // Log scan
            try {
                await api.logScan(barcode, data.name || "Unknown Product");
            } catch (scanErr) {
                console.error("Non-fatal: Failed to log scan", scanErr);
            }
        } catch (err) {
            console.error("Barcode lookup failed:", err);
            setError("Product data not found in database.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogMeal = async () => {
        if (!productData) return;
        try {
            await api.logFood(productData.barcode || "000000");
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to log food:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#050807] text-white font-display overflow-y-auto pb-24">
            {/* --- CAMERA SECTION --- */}
            <div className="relative w-full aspect-video md:aspect-[21/9] bg-black overflow-hidden rounded-b-[3rem] shadow-2xl">
                {isCameraActive ? (
                    <video 
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <span className="material-symbols-outlined text-emerald-500/20 text-9xl">barcode_reader</span>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Scan</span>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/scan')}
                    className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Center Reticle */}
                {!productData && !loading && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-64 h-64 md:w-80 md:h-80 relative">
                            <div className="absolute top-0 left-0 w-10 h-10 border-t-8 border-l-8 border-emerald-400 rounded-tl-2xl shadow-[0_0_20px_rgba(52,211,153,0.5)]"></div>
                            <div className="absolute top-0 right-0 w-10 h-10 border-t-8 border-r-8 border-emerald-400 rounded-tr-2xl shadow-[0_0_20px_rgba(52,211,153,0.5)]"></div>
                            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-8 border-l-8 border-emerald-400 rounded-bl-2xl shadow-[0_0_20px_rgba(52,211,153,0.5)]"></div>
                            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-8 border-r-8 border-emerald-400 rounded-br-2xl shadow-[0_0_20px_rgba(52,211,153,0.5)]"></div>
                            
                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-1 right-1 h-1 bg-emerald-400/50 shadow-[0_0_20px_#34d399] animate-[scanner_3s_infinite]" />
                        </div>
                    </div>
                )}

                {/* Floating Macro Indicators (Mocked Position) */}
                {productData && !loading && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 left-1/3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2 animate-in fade-in zoom-in duration-500">
                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
                             <span className="text-sm font-black">{Math.round(productData.calories)} kcal</span>
                        </div>
                        <div className="absolute top-1/2 right-1/4 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2 animate-in fade-in zoom-in duration-500 delay-100">
                             <div className="w-2 h-2 rounded-full bg-blue-500" />
                             <span className="text-sm font-black">{Math.round(productData.carbs_g)}g Carbs</span>
                        </div>
                        <div className="absolute bottom-1/4 left-1/2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2 animate-in fade-in zoom-in duration-500 delay-200">
                             <div className="w-2 h-2 rounded-full bg-amber-500" />
                             <span className="text-sm font-black">{Math.round(productData.protein_g)}g Protein</span>
                        </div>
                    </div>
                )}
            </div>

            {/* --- PRODUCT DATA SECTION --- */}
            <div className="max-w-6xl mx-auto px-6 mt-10">
                {productData ? (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                        {/* Title and Metadata */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Verified</span>
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Scanned via OpenFoodFacts</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">{productData.name}</h1>
                                <p className="text-white/40 text-lg font-medium">Full nutritional blueprint detected from barcode entry.</p>
                            </div>
                            
                            <button 
                                onClick={handleLogMeal}
                                className="bg-emerald-500 hover:bg-emerald-400 text-bg-dark font-black px-10 py-5 rounded-2xl flex items-center gap-3 transition-all shadow-[0_15px_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95"
                            >
                                <span className="material-symbols-outlined font-black">add_circle</span>
                                <span className="text-lg tracking-widest uppercase">Log Meal</span>
                            </button>
                        </div>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                { label: 'Calories', value: Math.round(productData.calories || 0), unit: 'kcal', color: 'text-emerald-500' },
                                { label: 'Protein', value: Math.round(productData.protein_g || 0), unit: 'grams', color: 'text-amber-500' },
                                { label: 'Carbs', value: Math.round(productData.carbs_g || 0), unit: 'grams', color: 'text-blue-500' },
                                { label: 'Fat', value: Math.round(productData.fat_g || 0), unit: 'grams', color: 'text-rose-500' }
                            ].map((macro, idx) => (
                                <div key={idx} className="bg-[#121614] border border-white/5 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg transition-colors hover:bg-white/[0.02]">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4">{macro.label}</span>
                                    <span className="text-5xl font-black text-white mb-1">{macro.value}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${macro.color}`}>{macro.unit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Ingredients and Cards Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Left: Ingredients */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500 font-bold">restaurant</span>
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Identified Ingredients</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(productData.ingredients_tags || []).slice(0, 8).map((ing, idx) => (
                                        <div key={idx} className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-all">
                                            <div className="p-2 bg-emerald-500/10 rounded-xl">
                                                <span className="material-symbols-outlined text-emerald-500 text-xl">spa</span>
                                            </div>
                                            <span className="text-sm font-bold text-white/80 capitalize">{ing.replace('en:', '').replace(/-/g, ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Score and Guard */}
                            <div className="space-y-6">
                                <div className="bg-[#0b1b14] border-2 border-emerald-500/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50"></div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-xl font-black text-white">Clean Label</h4>
                                        <span className="material-symbols-outlined text-emerald-500 text-3xl">verified</span>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium mb-6">
                                        This product contains no artificial preservatives, colors, or flavors. All ingredients are recognized as minimally processed.
                                    </p>
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                        100% Natural Choice
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-[#121614] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Nutri-Score</span>
                                        <span className={`text-4xl font-black uppercase ${['A', 'B'].includes(productData.nutri_score) ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {productData.nutri_score || '?'}
                                        </span>
                                    </div>
                                    <div className="bg-[#121614] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Eco-Score</span>
                                        <span className="text-4xl font-black text-amber-500 uppercase">
                                            {productData.eco_score || '?'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-5 rounded-2xl flex items-center justify-between transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors">history</span>
                                            <span className="text-sm font-bold text-white uppercase tracking-wider">Compare with history</span>
                                        </div>
                                        <span className="material-symbols-outlined text-white/20">chevron_right</span>
                                    </button>
                                    <button className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-5 rounded-2xl flex items-center justify-between transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors">share</span>
                                            <span className="text-sm font-bold text-white uppercase tracking-wider">Share analysis</span>
                                        </div>
                                        <span className="material-symbols-outlined text-white/20">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6" />
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Awaiting Analysis...</h2>
                        <p className="text-white/40 text-sm max-w-sm">Position any product barcode within the scanner brackets above for real-time nutritional extraction.</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scanner {
                    0%, 100% { top: 5%; opacity: 0.2; }
                    50% { top: 95%; opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LiveScannerPage;
