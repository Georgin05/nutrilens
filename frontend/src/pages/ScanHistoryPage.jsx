import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './ScanHistoryPage.css';

const ScanHistoryPage = () => {
    const navigate = useNavigate();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getDashboardRecentScans();
                setScans(data);
            } catch (err) {
                console.error("Failed to fetch scan history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // --- Helper: Group scans by date ---
    const groupScansByDate = (scansList) => {
        const groups = {};
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        scansList.forEach(scan => {
            const scanDate = scan.scan_time.split('T')[0];
            let label = scanDate;
            if (scanDate === today) label = 'TODAY';
            else if (scanDate === yesterday) label = 'YESTERDAY';
            else {
                label = new Date(scanDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
            }

            if (!groups[label]) groups[label] = [];
            groups[label].push(scan);
        });
        return groups;
    };

    const filteredScans = scans.filter(s => 
        s.food_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedScans = groupScansByDate(filteredScans);

    const getBadge = (scan) => {
        if (scan.nutri_score) {
            const score = scan.nutri_score.toLowerCase();
            if (score === 'a' || score === 'b') return { text: 'VITALITY', class: 'badge-success' };
            if (score === 'd' || score === 'e') return { text: 'HIGH SUGAR', class: 'badge-warning' };
        }
        if (scan.protein > 15) return { text: 'CLEAN FUEL', class: 'badge-success' };
        return { text: 'HYDRATING', class: 'badge-success' };
    };

    const getPlaceholderImage = (name) => {
        // Simple mapping for demo purposes
        if (name.toLowerCase().includes('nutella')) return "https://images.unsplash.com/photo-1559144490-8328294facd8?auto=format&fit=crop&q=80&w=400";
        if (name.toLowerCase().includes('salad') || name.toLowerCase().includes('quinoa')) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
        if (name.toLowerCase().includes('smoothie')) return "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400";
        return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400";
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface font-body pb-20">
            {/* Header Area */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#021109]/90 backdrop-blur-xl border-b border-primary/5">
                <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-[#3cff90] tracking-tighter uppercase font-headline cursor-pointer">NutriLens</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#3cff90]">
                        <button className="p-2 hover:bg-[#102b1e] rounded-full transition-all" onClick={() => navigate('/scanner')}>
                            <span className="material-symbols-outlined">center_focus_strong</span>
                        </button>
                        <button className="p-2 hover:bg-[#102b1e] rounded-full transition-all" onClick={() => navigate('/dashboard')}>
                            <span className="material-symbols-outlined">person</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="history-container px-6">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Scan History</h1>
                    <p className="text-on-surface-variant font-medium">Review your nutritional journey through the lens.</p>
                </div>

                <div className="search-wrapper">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input 
                        type="text" 
                        placeholder="Search past scans..." 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="filter-btn">
                        <span className="material-symbols-outlined text-sm">tune</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold uppercase tracking-widest text-[#9bb0a3]">Accessing Archives...</p>
                    </div>
                ) : filteredScans.length === 0 ? (
                    <div className="text-center py-20 bg-surface-container-low rounded-[3rem] border border-outline-variant/10">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">history</span>
                        <h3 className="text-xl font-bold">No scans found</h3>
                        <p className="text-on-surface-variant mt-2">Start scanning to build your history.</p>
                        <button 
                            onClick={() => navigate('/scanner')}
                            className="mt-6 claymorphic-primary px-8 py-3 rounded-full font-bold text-surface"
                        >
                            Open Scanner
                        </button>
                    </div>
                ) : (
                    Object.entries(groupedScans).map(([dateLabel, scansInGroup]) => (
                        <div key={dateLabel} className="mb-12">
                            <h2 className="date-group-title">{dateLabel}</h2>
                            <div className="space-y-6">
                                {scansInGroup.map((scan) => {
                                    const badge = getBadge(scan);
                                    const scanTime = new Date(scan.scan_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    
                                    return (
                                        <div key={scan.id} className="scan-history-card group" onClick={() => navigate('/scanner')}>
                                            <div className="scan-card-main">
                                                <div className="scan-card-image-wrapper shadow-lg">
                                                    <img 
                                                        src={getPlaceholderImage(scan.food_name)} 
                                                        alt={scan.food_name} 
                                                        className="scan-card-image group-hover:scale-110 transition-transform duration-500" 
                                                    />
                                                    <span className={`scan-badge ${badge.class}`}>{badge.text}</span>
                                                </div>
                                                <div className="scan-card-info">
                                                    <div className="scan-card-header">
                                                        <h3 className="scan-card-title">{scan.food_name}</h3>
                                                        <span className="scan-card-time">{scanTime}</span>
                                                    </div>
                                                    <p className="scan-card-subtitle">
                                                        {scan.brand === "Generic" ? "Fresh Preparation" : scan.brand} &bull; {scan.barcode ? `Barcode: ${scan.barcode}` : "Manual Entry"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="scan-macro-grid">
                                                <div className="scan-macro-item shadow-sm">
                                                    <span className="macro-label">Cal</span>
                                                    <span className="macro-value text-white">{Math.round(scan.calories)}</span>
                                                </div>
                                                <div className="scan-macro-item shadow-sm">
                                                    <span className="macro-label">Prot</span>
                                                    <span className="macro-value text-primary">{Math.round(scan.protein)}g</span>
                                                </div>
                                                <div className="scan-macro-item shadow-sm">
                                                    <span className="macro-label">Carb</span>
                                                    <span className="macro-value text-amber-500">{Math.round(scan.carbs)}g</span>
                                                </div>
                                                <div className="scan-macro-item shadow-sm">
                                                    <span className="macro-label">Fat</span>
                                                    <span className="macro-value text-error">{Math.round(scan.fat)}g</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default ScanHistoryPage;
