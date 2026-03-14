import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function HydrationCard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHydration = async () => {
            try {
                const hydroData = await api.getDashboardHydration();
                setData(hydroData);
            } catch (error) {
                console.error("Error fetching hydration:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHydration();
    }, []);

    if (loading || !data) {
        return <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 w-full h-40 animate-pulse"></div>;
    }

    const percentage = Math.min((data.current_l / data.target_l) * 100, 100);

    return (
        <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 md:p-8 flex flex-col w-full drift" style={{ animationDelay: '0.8s' }}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Hydration</h4>
                    <p className="text-3xl font-black">{data.current_l} <span className="text-base text-slate-400">/ {data.target_l} L</span></p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 font-black">water_drop</span>
                </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-6 clay-thumb">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>

            <div className="flex gap-4">
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-500 font-bold text-xs py-2 rounded-full transition-colors">
                    + 250ml
                </button>
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-500 font-bold text-xs py-2 rounded-full transition-colors">
                    + 500ml
                </button>
            </div>
        </div>
    );
}
