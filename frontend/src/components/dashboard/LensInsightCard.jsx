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
        <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 md:p-8 flex flex-col w-full border-[1.5px] border-amber-500/50 shadow-amber drift" style={{ animationDelay: '1.5s' }}>
            <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-amber-500 font-black">bolt</span>
                <h3 className="font-black text-xl tracking-tight">AI Insights</h3>
            </div>

            <div className="flex-1 space-y-4 mb-8 overflow-y-auto custom-scrollbar">
                {data.insights.map((insight, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 clay-thumb">
                        <h4 className="font-black text-sm mb-2">{insight.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {insight.description}
                        </p>
                    </div>
                ))}
            </div>

            <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-full transition-colors shadow-amber tracking-wide">
                Full Analysis
            </button>
        </div>
    );
}
