import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function LensInsightCard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            try {
                const insightData = await api.getDashboardLensInsight();
                setData(insightData);
            } catch (error) {
                console.error("Error fetching lens insight:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsight();
    }, []);

    if (loading) {
        return <div className="clay-card-light dark:clay-card-dark rounded-clay border border-amber-500/30 p-6 w-full h-80 animate-pulse"></div>;
    }

    if (!data) return null;

    return (
        <div className="clay-card-dark clay-card-glow rounded-[1.5rem] p-5 flex flex-col w-full drift shadow-clay border-emerald-500/10" style={{ animationDelay: '1.5s' }}>
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-amber-500 text-lg font-black">bolt</span>
                <h3 className="font-black text-white text-base uppercase tracking-tight">AI Insights</h3>
            </div>

            <div className="flex-1 space-y-3 mb-4 overflow-y-auto custom-scrollbar">
                <div className="bg-slate-900/40 rounded-xl p-4 clay-thumb border border-white/5">
                    <h4 className="font-black text-[10px] mb-1.5 text-white tracking-tight uppercase opacity-80">General Health Active</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        {data.insight || "Weight and muscle mass building target for your activity level."}
                    </p>
                </div>

                <div className="bg-slate-900/40 rounded-xl p-4 clay-thumb border border-white/5">
                    <h4 className="font-black text-[10px] mb-1.5 text-white tracking-tight uppercase opacity-80">Action Plan</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        {data.recommendation || "Add high protein meals like eggs or chicken for your next meal."}
                    </p>
                </div>
            </div>

            <button className="w-full bg-[#f59e0b] hover:bg-amber-500 text-slate-900 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-amber shadow-clay">
                Full Analysis
            </button>
        </div>
    );
}
