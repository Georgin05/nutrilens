import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UserNutritionLensPage() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLensData = async () => {
            try {
                const lensData = await api.getUserNutritionLens();
                setData(lensData);
            } catch (error) {
                console.error("Error fetching lens data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLensData();
    }, []);

    if (loading) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-primary font-bold">Loading metabolic profile...</div>;
    if (!data) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-red-500">Failed to load profile.</div>;

    const { user_details, bmr, active_lens, target_nutrition } = data;

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-2xl">visibility</span>
                <h1 className="text-xl font-black tracking-tight">User Nutrition Lens</h1>
            </div>
            <p className="text-primary/70 text-xs font-bold uppercase tracking-widest mb-8">Personalized metabolic profile and goals</p>

            {/* User Details Card */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">User Details</h2>
                </div>
                <div className="bg-clay-surface shadow-clay-md border border-white/5 rounded-2xl p-6 grid grid-cols-2 gap-y-6">
                    <div>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">Age</p>
                        <p className="text-lg font-black text-slate-100">{user_details.age || '--'} Years</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">Weight</p>
                        <p className="text-lg font-black text-slate-100">{user_details.weight || '--'} kg</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">Height</p>
                        <p className="text-lg font-black text-slate-100">{user_details.height || '--'} cm</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">Gender</p>
                        <p className="text-lg font-black text-slate-100">{user_details.gender || '--'}</p>
                    </div>
                </div>
            </section>

            {/* BMR Section */}
            <section className="mb-6">
                <div className="bg-clay-surface shadow-[inset_2px_2px_8px_rgba(255,255,255,0.05)] border-l-4 border-l-primary border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-black text-slate-100">BMR: {bmr} kcal/day</h3>
                        <span className="material-symbols-outlined text-primary text-2xl animate-pulse">bolt</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[90%]">
                        Your Basal Metabolic Rate is the calories burned at rest. This serves as your baseline for calculations.
                    </p>
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                </div>
            </section>

            {/* Active Lens Chips */}
            <section className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Active Lens: {active_lens.name}</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    {active_lens.tags.map(tag => (
                        <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                            <span className="material-symbols-outlined text-xs">
                                {tag.includes('Calorie') ? 'stars' : 'trending_up'}
                            </span>
                            {tag}
                        </div>
                    ))}
                </div>
            </section>

            {/* Target Nutrition Grid */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <span className="material-symbols-outlined text-sm">track_changes</span>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Target Nutrition Goal</h2>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-clay-surface shadow-clay-sm border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase">Calories</span>
                        <span className="text-sm font-black text-slate-100">{target_nutrition.calories}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">kcal</span>
                    </div>
                    <div className="bg-clay-surface shadow-clay-sm border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase">Protein</span>
                        <span className="text-sm font-black text-slate-100">{target_nutrition.protein}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">g</span>
                    </div>
                    <div className="bg-clay-surface shadow-clay-sm border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase">Carbs</span>
                        <span className="text-sm font-black text-slate-100">{target_nutrition.carbs}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">g</span>
                    </div>
                    <div className="bg-clay-surface shadow-clay-sm border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase">Fat</span>
                        <span className="text-sm font-black text-slate-100">{target_nutrition.fat}</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">g</span>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="mt-auto grid grid-cols-2 gap-4 pb-4">
                <button 
                    onClick={() => navigate('/lenses')}
                    className="flex items-center justify-center gap-2 bg-primary text-background-dark font-black px-6 py-4 rounded-2xl shadow-clay-primary active:scale-[0.98] transition-all"
                >
                    <span className="material-symbols-outlined transform rotate-180">sync</span>
                    <span>Change Lens</span>
                </button>
                <button 
                    onClick={() => navigate('/profile')}
                    className="flex items-center justify-center bg-slate-800/80 text-white font-black px-6 py-4 rounded-2xl border border-white/10 active:scale-[0.98] transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
