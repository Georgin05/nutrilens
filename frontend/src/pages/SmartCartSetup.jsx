import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SmartCartSetup() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        duration: 'Weekly',
        lens: 'Muscle Build (High Protein)',
        budget: 150,
        people: 1
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.generateSmartCart({
                duration: formData.duration,
                diet_lens: formData.lens,
                budget: parseFloat(formData.budget),
                people: parseInt(formData.people)
            });
            navigate('/smart-cart/dashboard');
        } catch (err) {
            console.error("Error generating smart cart:", err);
            setError("Failed to generate your smart cart. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
            <header className="flex items-center p-6 justify-between relative z-10 sticky top-0 bg-background-dark/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-xl bg-slate-800/50 border border-white/5 text-slate-100 shadow-clay-sm active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </header>

            <main className="flex-1 px-6 pt-2 pb-24 overflow-y-auto z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Smart Cart Setup</h1>
                    <p className="text-slate-400 text-sm">Precision nutrition planning powered by AI.</p>
                </div>

                <div className="bg-clay-surface p-6 rounded-3xl border border-white/5 shadow-clay-md space-y-6">
                    
                    {/* Duration */}
                    <div>
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">Duration Selection</label>
                        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
                            <button 
                                onClick={() => setFormData({...formData, duration: 'Weekly'})} 
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.duration === 'Weekly' ? 'bg-primary text-background-dark shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >Weekly</button>
                            <button 
                                onClick={() => setFormData({...formData, duration: 'Monthly'})} 
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.duration === 'Monthly' ? 'bg-primary text-background-dark shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >Monthly</button>
                        </div>
                    </div>

                    {/* Diet Lens */}
                    <div>
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">Select Diet Lens</label>
                        <select 
                            name="lens" 
                            value={formData.lens} 
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary appearance-none custom-select-arrow"
                        >
                            <option value="Muscle Build (High Protein)">Muscle Build (High Protein)</option>
                            <option value="Fat Loss">Fat Loss (Low Calorie)</option>
                            <option value="Save Money">Budget Saver</option>
                        </select>
                    </div>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">Total Budget ($)</label>
                            <input 
                                type="number" 
                                name="budget" 
                                value={formData.budget} 
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">No. Of People</label>
                            <input 
                                type="number" 
                                name="people" 
                                value={formData.people} 
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                </div>

                {/* Intelligence Teaser */}
                <div className="mt-6 bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-100 mb-1">Cart Intelligence</h4>
                        <p className="text-xs text-slate-400 italic">"The {formData.lens} lens prioritizes specific foods while maintaining your ${formData.budget} constraints."</p>
                    </div>
                </div>

                <div className="mt-8">
                    {error && <p className="text-accent-amber text-xs text-center mb-4">{error}</p>}
                    <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl shadow-clay-primary flex items-center justify-center gap-2 active:scale-95 transition-all outline-none text-lg overflow-hidden relative">
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                <span>Generating AI Cart...</span>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">auto_awesome</span>
                                GENERATE SMART CART
                            </>
                        )}
                    </button>
                </div>

            </main>
        </div>
    );
}
