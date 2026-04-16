import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../services/api';

const LiveScannerPage = () => {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    
    // --- State Management ---
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [isFlashing, setIsFlashing] = useState(false);
    const [isBursting, setIsBursting] = useState(false);
    const [detectedBarcode, setDetectedBarcode] = useState(null);

    useEffect(() => {
        const scannerId = "reader";
        let isMounted = true;
        let burstInterval = null;
        
        const startScanner = async () => {
            if (!isCameraActive || detectedBarcode) return;

            await new Promise(r => setTimeout(r, 150));
            if (!isMounted) return;

            const element = document.getElementById(scannerId);
            if (!element) return;

            try {
                if (scannerRef.current) {
                    try { if (scannerRef.current.isScanning) await scannerRef.current.stop(); } catch (e) {}
                    scannerRef.current = null;
                }

                const html5QrCode = new Html5Qrcode(scannerId, false);
                scannerRef.current = html5QrCode;

                const config = { 
                    fps: 20, 
                    qrbox: { width: 450, height: 250 }
                };

                await html5QrCode.start(
                    { facingMode: "environment" }, 
                    config, 
                    (decodedText) => {
                        console.log("Video Scan Success:", decodedText);
                        handleBarcodeDetected(decodedText);
                    },
                    (errorMessage) => {}
                );

                // --- BURST MODE LOGIC ---
                burstInterval = setInterval(async () => {
                    if (!isMounted || !scannerRef.current || !scannerRef.current.isScanning || loading || productData || detectedBarcode) return;

                    const videoElement = document.querySelector(`#${scannerId} video`);
                    if (!videoElement) return;

                    setIsFlashing(true);
                    setIsBursting(true);
                    setTimeout(() => setIsFlashing(false), 150);

                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = videoElement.videoWidth;
                        canvas.height = videoElement.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                        
                        canvas.toBlob(async (blob) => {
                            if (!blob || !isMounted) return;
                            try {
                                const result = await html5QrCode.scanFile(blob, false);
                                if (result && isMounted) {
                                    console.log("Burst Mode Success:", result);
                                    handleBarcodeDetected(result);
                                }
                            } catch (e) {
                            } finally {
                                if (isMounted) setIsBursting(false);
                            }
                        }, 'image/jpeg', 0.95);
                    } catch (err) {
                        if (isMounted) setIsBursting(false);
                    }
                }, 3500);

            } catch (err) {
                console.error("Scanner start failed:", err);
                if (isMounted) setError("Camera access failed. Ensure permissions.");
            }
        };

        startScanner();

        return () => {
            isMounted = false;
            if (burstInterval) clearInterval(burstInterval);
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(e => {});
                }
            }
        };
    }, [isCameraActive, detectedBarcode]); // Restart if detectedBarcode is cleared

    const handleBarcodeDetected = (barcode) => {
        if (loading || (detectedBarcode === barcode)) return;
        
        // Step 1: Immediately show the barcode in the UI
        setDetectedBarcode(barcode);
        setError(null);
        
        // Stop scanning to focus on the result
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(e => {});
        }
    };

    const fetchProductDetails = async () => {
        if (!detectedBarcode) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.getProduct(detectedBarcode);
            setProductData(data);
            try { await api.logScan(detectedBarcode, data.name || "Unknown Product"); } catch (e) {}
        } catch (err) {
            console.error("Lookup failed:", err);
            setError("Product not found in our global database. Would you like to add it manually?");
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setDetectedBarcode(null);
        setProductData(null);
        setError(null);
    };

    const handleLogMeal = async () => {
        if (!productData) return;
        try {
            await api.logFood(productData.barcode || detectedBarcode);
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to log food:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#050807] text-white font-display overflow-y-auto pb-24">
            {/* --- CAMERA SECTION --- */}
            <div className="relative w-full aspect-square md:aspect-video bg-black overflow-hidden rounded-b-[3rem] shadow-2xl">
                <div 
                    id="reader" 
                    className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
                ></div>

                {/* Shutter Flash Effect */}
                {isFlashing && (
                    <div className="absolute inset-0 bg-white z-50 animate-pulse transition-opacity duration-150" />
                )}

                {/* Burst Status Indicator */}
                {isBursting && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500/80 backdrop-blur-md rounded-full border border-white/20 z-40 animate-bounce">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Analyzing High-Res Frame...</span>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{isCameraActive ? 'Live Scan' : 'Camera Off'}</span>
                    </div>
                    
                    <button 
                        onClick={() => setIsCameraActive(!isCameraActive)}
                        className={`p-2.5 rounded-full border backdrop-blur-md transition-all flex items-center justify-center ${
                            isCameraActive 
                            ? 'bg-rose-500/20 border-rose-500/30 text-rose-500 hover:bg-rose-500/40' 
                            : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/40'
                        }`}
                        title={isCameraActive ? "Stop Camera" : "Start Camera"}
                    >
                        <span className="material-symbols-outlined text-sm font-black">
                            {isCameraActive ? 'videocam_off' : 'videocam'}
                        </span>
                    </button>
                </div>

                <button 
                    onClick={() => navigate('/scan')}
                    className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Center Reticle - Widened for Barcodes */}
                {!productData && !loading && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-[85%] h-52 md:w-[450px] md:h-[250px] relative">
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-emerald-400 rounded-tl-3xl shadow-[0_0_25px_rgba(52,211,153,0.6)]"></div>
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-emerald-400 rounded-tr-3xl shadow-[0_0_25px_rgba(52,211,153,0.6)]"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-emerald-400 rounded-bl-3xl shadow-[0_0_25px_rgba(52,211,153,0.6)]"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-emerald-400 rounded-br-3xl shadow-[0_0_25px_rgba(52,211,153,0.6)]"></div>
                            
                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-2 right-2 h-1.5 bg-emerald-400 shadow-[0_0_25px_#34d399] animate-[scanner_2.5s_infinite]" />
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
                        {/* FULL PRODUCT UI (SUCCESS) */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Verified</span>
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Scanned via NutriLens AI</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">{productData.name}</h1>
                                <p className="text-white/40 text-lg font-medium">Full nutritional blueprint detected from barcode entry.</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={resetScanner}
                                    className="bg-white/5 hover:bg-white/10 text-white font-black px-8 py-5 rounded-2xl border border-white/10 transition-all uppercase text-sm tracking-widest"
                                >
                                    Clear
                                </button>
                                <button 
                                    onClick={handleLogMeal}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-bg-dark font-black px-10 py-5 rounded-2xl flex items-center gap-3 transition-all shadow-[0_15px_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95"
                                >
                                    <span className="material-symbols-outlined font-black">add_circle</span>
                                    <span className="text-lg tracking-widest uppercase">Log</span>
                                </button>
                            </div>
                        </div>

                        {/* Macros and Details (Grid) */}
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
                        {/* ... Rest of full product UI ... */}
                        <div className="text-center py-10">
                             <button onClick={resetScanner} className="text-emerald-500 font-black uppercase tracking-widest text-[10px] hover:underline">Scan Another Product</button>
                        </div>
                    </div>
                ) : detectedBarcode ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-10 duration-500">
                        {/* DETECTION READY VIEW */}
                        <div className="w-32 h-32 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                             <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                             <span className="material-symbols-outlined text- emerald-500 text-6xl font-black relative z-10">barcode_scanner</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">Barcode Identified!</h2>
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl mb-10 font-mono text-emerald-400 text-2xl tracking-[0.1em] shadow-inner">
                            {detectedBarcode}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                <p className="text-white/40 font-black uppercase tracking-widest text-[10px] animate-pulse">Consulting Global AI Database...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center max-w-md">
                                <span className="material-symbols-outlined text-rose-500 text-5xl mb-4">report_problem</span>
                                <p className="text-rose-400 font-bold mb-8">{error}</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                     <button onClick={resetScanner} className="px-8 py-4 bg-white/5 text-white/60 font-black rounded-xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest">Try Again</button>
                                     <button onClick={() => navigate('/manual-entry')} className="px-8 py-4 bg-emerald-500 text-bg-dark font-black rounded-xl hover:bg-emerald-400 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase text-xs tracking-widest">Manual Entry</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-6">
                                <button 
                                    onClick={resetScanner}
                                    className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black rounded-2xl border border-white/5 transition-all text-sm uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button 
                                    onClick={fetchProductDetails}
                                    className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-bg-dark font-black rounded-2xl flex items-center gap-3 transition-all shadow-[0_15px_40px_rgba(16,185,129,0.3)] hover:-translate-y-1"
                                >
                                    <span className="material-symbols-outlined font-black">search_insights</span>
                                    <span className="text-lg tracking-widest uppercase text-black">Analyze Product</span>
                                </button>
                            </div>
                        )}
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
                #reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    display: block !important;
                }
            `}</style>
        </div>
    );
};

export default LiveScannerPage;
