import React, { useState, useEffect, Fragment } from 'react';
import api from '../../services/api';

export default function ScanHistoryPanel() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const data = await api.getDashboardRecentScans();
                setScans(data);
            } catch (error) {
                console.error("Error fetching recent scans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, []);

    if (loading) {
        return <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 w-full h-64 animate-pulse"></div>;
    }

    return (
        <Fragment>
        <div className="clay-card-dark clay-card-glow rounded-[2rem] p-6 md:p-8 flex flex-col w-full drift" style={{ animationDelay: '1.2s' }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-white">Recent Scans</h3>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-primary text-[10px] font-black tracking-widest uppercase hover:underline"
                >
                    View All
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] text-slate-500 font-black tracking-widest uppercase border-b border-white/5">
                            <th className="pb-4 font-black">FOOD ITEM</th>
                            <th className="pb-4 font-black">BARCODE</th>
                            <th className="pb-4 font-black text-right">TIME</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {scans.length > 0 ? (
                            scans.slice(0, 5).map((scan, index) => (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden clay-thumb flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-slate-400">qr_code_scanner</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm tracking-tight text-white">{scan.food_name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-500 font-mono text-xs">{scan.barcode}</td>
                                    <td className="py-4 text-right text-slate-400 font-black text-sm">
                                        {new Date(scan.scan_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-slate-500 text-sm font-medium">
                                    No recent scans found. Start scanning food!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* View All Modal */}
        {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="clay-card w-full max-w-2xl max-h-[85vh] flex flex-col relative rounded-[2.5rem] overflow-hidden border border-primary/30 shadow-primary-glow bg-background-dark/95">
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-clay">history</span>
                                Scan History
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">Detailed log of all products scanned</p>
                        </div>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all bg-white/5 clay-btn"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4">
                        {scans.length > 0 ? (
                            <div className="space-y-4">
                                {scans.map((scan, index) => (
                                    <div key={index} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-emerald-clay/20 hover:bg-white/10 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 clay-thumb">
                                                <span className="material-symbols-outlined text-emerald-clay opacity-80 text-3xl">qr_code_scanner</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white text-base group-hover:text-emerald-clay transition-colors truncate max-w-[200px] md:max-w-xs">{scan.food_name}</h4>
                                                <p className="text-xs text-slate-400 font-mono mt-1">{scan.barcode}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-base font-black text-white">
                                                {new Date(scan.scan_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                {new Date(scan.scan_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">qr_code_scanner</span>
                                <h3 className="text-lg font-bold text-slate-300">No Scans Recorded</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-sm">Scan products in the web application to automatically log them here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        </Fragment>
    );
}
