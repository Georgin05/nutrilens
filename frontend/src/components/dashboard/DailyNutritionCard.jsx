import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function DailyNutritionCard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await api.getDashboardDailySummary();
                setSummary(data);
            } catch (error) {
                console.error("Error fetching daily summary:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 w-full h-48 animate-pulse"></div>;
    }

    if (!summary) return null;

    const calPercent = Math.min(Math.round((summary.calories / summary.target_calories) * 100), 100) || 0;
    const proPercent = Math.min(Math.round((summary.protein / summary.target_protein) * 100), 100) || 0;
    const carbPercent = Math.min(Math.round((summary.carbs / summary.target_carbs) * 100), 100) || 0;
    const fatPercent = Math.min(Math.round((summary.fat / summary.target_fat) * 100), 100) || 0;

    const calLeft = summary.target_calories - summary.calories;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
            {/* Calories Ring Card */}
            <div className="md:col-span-1 clay-card-dark clay-card-glow rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-clay drift" style={{ animationDelay: '0s' }}>
                <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-slate-800/40" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
                        <circle className="text-primary transition-all duration-1000 ease-out" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeDasharray="264" strokeDashoffset={264 - (calPercent/100 * 264)} strokeLinecap="round" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white">{calLeft}</span>
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mt-2">KCAL LEFT</span>
                    </div>
                </div>
                <h3 className="font-black text-white text-xl mb-1">Total Calories</h3>
                <p className="text-sm font-black text-primary">{calPercent}% of target</p>
            </div>

            {/* Macro Bars Card */}
            <div className="md:col-span-2 clay-card-dark clay-card-glow rounded-[2rem] p-8 shadow-clay grid grid-cols-3 gap-6 drift" style={{ animationDelay: '0.4s' }}>
                {/* Protein */}
                <div className="flex flex-col h-full">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-4">Protein</p>
                    <div className="flex-1 w-full bg-slate-900/60 rounded-2xl shadow-clay-inner relative flex flex-col justify-end overflow-hidden border border-white/5">
                        {/* Vertical fill from bottom to top */}
                        <div className="bg-primary w-full transition-all duration-1000 shadow-primary-glow" style={{ height: `${proPercent}%`, minHeight: '2px' }}></div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="font-black text-white text-2xl">{summary.protein}g</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-tighter opacity-80">Target: {summary.target_protein}g</p>
                    </div>
                </div>

                {/* Carbs */}
                <div className="flex flex-col h-full">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-4">Carbs</p>
                    <div className="flex-1 w-full bg-slate-900/60 rounded-2xl shadow-clay-inner relative flex flex-col justify-end overflow-hidden border border-white/5">
                        {/* Vertical fill from bottom to top */}
                        <div className="bg-amber-500 w-full transition-all duration-1000 shadow-amber" style={{ height: `${carbPercent}%`, minHeight: '2px' }}></div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="font-black text-white text-2xl">{summary.carbs}g</p>
                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-tighter opacity-80">Target: {summary.target_carbs}g</p>
                    </div>
                </div>

                {/* Fats */}
                <div className="flex flex-col h-full">
                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-4">Fats</p>
                    <div className="flex-1 w-full bg-slate-900/60 rounded-2xl shadow-clay-inner relative flex flex-col justify-end overflow-hidden border border-white/5">
                        {/* Vertical fill from bottom to top */}
                        <div className="bg-teal-500 w-full transition-all duration-1000 shadow-teal-glow" style={{ height: `${fatPercent}%`, minHeight: '2px' }}></div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="font-black text-white text-2xl">{summary.fat}g</p>
                        <p className="text-[10px] text-teal-500 font-black uppercase tracking-tighter opacity-80">Target: {summary.target_fat}g</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
