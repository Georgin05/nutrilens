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
        <div className="clay-card-dark clay-card-glow rounded-[1.5rem] p-5 flex flex-col w-full drift shadow-clay border-emerald-500/10" style={{ animationDelay: '0.8s' }}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Hydration</h4>
                    <p className="text-2xl font-black text-white">{data.current_l} <span className="text-xs text-slate-500">/ {data.target_l} L</span></p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-500 text-lg font-black">water_drop</span>
                </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-4 shadow-clay-inner border border-white/5">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-blue-glow" style={{ width: `${percentage}%` }}></div>
            </div>

            <div className="flex gap-2.5">
                <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-blue-500 font-black text-[10px] py-1.5 rounded-lg transition-colors border border-white/5 uppercase tracking-tighter">
                    + 250ml
                </button>
                <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-blue-500 font-black text-[10px] py-1.5 rounded-lg transition-colors border border-white/5 uppercase tracking-tighter">
                    + 500ml
                </button>
            </div>
        </div>
    );
}
