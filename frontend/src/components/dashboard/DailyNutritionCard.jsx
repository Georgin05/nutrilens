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

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
            {/* Calories Ring */}
            <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 flex flex-col items-center justify-center shrink-0 w-full md:w-64 drift" style={{ animationDelay: '0s' }}>
                <div className="relative w-40 h-40 clay-ring mb-4">
                    <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                        <circle className="text-slate-200 dark:text-slate-800" cx="50" cy="50" fill="transparent" r="44" stroke="currentColor" strokeWidth="8"></circle>
                        <circle className="text-primary transition-all duration-1000 ease-out" cx="50" cy="50" fill="transparent" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset={276 - (calPercent/100 * 276)} strokeLinecap="round" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black leading-none">{summary.calories}</span>
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mt-1">Kcal Today</span>
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-black text-base">Total Calories</p>
                    <p className="text-primary text-xs font-bold">{calPercent}% of target</p>
                </div>
            </div>

            {/* Macros Container */}
            <div className="clay-card-light dark:clay-card-dark rounded-clay p-6 flex-1 flex justify-around items-center gap-4 drift" style={{ animationDelay: '0.5s' }}>
                
                {/* Protein */}
                <div className="flex flex-col items-center gap-4 w-24">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Protein</p>
                    <div className="w-20 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl clay-thumb relative overflow-hidden flex items-end p-2">
                        <div className="w-full bg-primary rounded-xl shadow-primary-glow transition-all duration-1000 ease-out" style={{ height: `${proPercent}%` }}></div>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-xl">{summary.protein}g</p>
                        <p className="text-[9px] text-primary font-bold">Target: {summary.target_protein}g</p>
                    </div>
                </div>

                {/* Carbs */}
                <div className="flex flex-col items-center gap-4 w-24">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Carbs</p>
                    <div className="w-20 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl clay-thumb relative overflow-hidden flex items-end p-2">
                        <div className="w-full bg-amber-500 rounded-xl shadow-amber transition-all duration-1000 ease-out" style={{ height: `${carbPercent}%` }}></div>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-xl">{summary.carbs}g</p>
                        <p className="text-[9px] text-amber-500 font-bold">Target: {summary.target_carbs}g</p>
                    </div>
                </div>

                {/* Fats */}
                <div className="flex flex-col items-center gap-4 w-24">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Fats</p>
                    <div className="w-20 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl clay-thumb relative overflow-hidden flex items-end p-2">
                        <div className="w-full bg-teal-500 rounded-xl shadow-teal-glow transition-all duration-1000 ease-out" style={{ height: `${fatPercent}%` }}></div>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-xl">{summary.fat}g</p>
                        <p className="text-[9px] text-teal-500 font-bold">Target: {summary.target_fat}g</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
