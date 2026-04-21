import React, { useState, useEffect, Fragment } from 'react';
import api from '../../services/api';

export default function FoodLogList() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await api.getDashboardFoodLogs();
                setLogs(data);
            } catch (error) {
                console.error("Error fetching food logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) {
        return <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 w-full h-64 animate-pulse"></div>;
    }

    return (
        <Fragment>
        <div className="clay-card-dark clay-card-glow rounded-[2rem] p-6 md:p-8 flex flex-col w-full drift" style={{ animationDelay: '1s' }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl">Today's Food Log</h3>
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
                            <th className="pb-4 font-black">MEAL ITEM</th>
                            <th className="pb-4 font-black">PORTION</th>
                            <th className="pb-4 font-black">MACROS (P/C/F)</th>
                            <th className="pb-4 font-black text-right">CALORIES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? (
                            logs.map((log, index) => (
                                <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="py-4 flex items-center gap-4">
                                        {/* Mock icon/image placeholder for now */}
                                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 clay-thumb flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-slate-400">restaurant</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm tracking-tight">{log.food}</p>
                                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{log.meal_type || 'Snack'} • {log.time}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {log.portion}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-2 text-[9px] font-black uppercase tracking-tighter">
                                            <div className="bg-primary-10 text-primary px-2 py-1 rounded flex flex-col items-center min-w-[32px]">
                                                <span>{log.macros.p}g</span>
                                                <span>P</span>
                                            </div>
                                            <div className="bg-amber-500-10 text-amber-500 px-2 py-1 rounded flex flex-col items-center min-w-[32px]">
                                                <span>{log.macros.c}g</span>
                                                <span>C</span>
                                            </div>
                                            <div className="bg-teal-500-10 text-teal-500 px-2 py-1 rounded flex flex-col items-center min-w-[32px]">
                                                <span>{log.macros.f}g</span>
                                                <span>F</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-black text-sm">
                                        {log.calories} kcal
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-slate-500 text-sm font-medium">
                                    No food logged today. Click top right to scan!
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
                                <span className="material-symbols-outlined text-primary">history</span>
                                Daily Consumption
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">Complete record of your logged meals</p>
                        </div>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all bg-white/5 clay-btn"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4">
                        {logs.length > 0 ? (
                            logs.map((log, index) => (
                                <div key={index} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 clay-thumb">
                                            <span className="material-symbols-outlined text-primary/80 text-3xl">restaurant</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white text-base group-hover:text-primary transition-colors">{log.food}</h4>
                                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{log.meal_type || 'Snack'} • {log.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-lg font-black text-white">
                                            {log.calories} <span className="text-[10px] text-slate-500 uppercase">kcal</span>
                                        </span>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[9px] font-black text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/10">{log.macros?.p || 0}P</span>
                                            <span className="text-[9px] font-black text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/10">{log.macros?.c || 0}C</span>
                                            <span className="text-[9px] font-black text-teal-400 px-2 py-0.5 rounded bg-teal-400/10 border border-teal-400/10">{log.macros?.f || 0}F</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-7xl text-slate-700 mb-4 animate-pulse">restaurant</span>
                                <h3 className="text-xl font-black text-slate-300">No Food Logged</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        </Fragment>
    );
}
