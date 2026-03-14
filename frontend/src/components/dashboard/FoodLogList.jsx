import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FoodLogList() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 md:p-8 flex flex-col w-full drift" style={{ animationDelay: '1s' }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl">Today's Food Log</h3>
                <button className="text-primary text-sm font-bold tracking-widest uppercase hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] text-slate-500 font-black tracking-widest uppercase border-b border-slate-200 dark:border-slate-800">
                            <th className="pb-4 font-black">Meal Item</th>
                            <th className="pb-4 font-black">Portion</th>
                            <th className="pb-4 font-black">Macros (P/C/F)</th>
                            <th className="pb-4 font-black text-right">Calories</th>
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
                                            <p className="text-[10px] text-slate-500 font-medium">{log.time}</p>
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
    );
}
