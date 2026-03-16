import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MealCartSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        duration: 'Weekly',
        diet_goal: 'Muscle Build',
        calories: 2000,
        people: 1
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            await api.post('/meal-cart/setup', config);
            navigate('/meal-cart');
        } catch (error) {
            console.error("Failed to setup meal plan", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-white mb-2">Setup Your Week</h1>
                <p className="text-emerald-400 opacity-80">Configure your automated meal plan and grocery list</p>
            </div>

            <div className="w-full max-w-lg bg-[#102219]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest pl-1">Duration</label>
                        <select 
                            value={config.duration}
                            onChange={(e) => setConfig({...config, duration: e.target.value})}
                            className="bg-[#0c1a13] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                        >
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest pl-1">Diet Goal</label>
                        <select 
                            value={config.diet_goal}
                            onChange={(e) => setConfig({...config, diet_goal: e.target.value})}
                            className="bg-[#0c1a13] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                        >
                            <option>Muscle Build</option>
                            <option>Fat Loss</option>
                            <option>Maintenance</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest pl-1">Daily Calories</label>
                        <div className="relative">
                            <input 
                                type="number"
                                value={config.calories}
                                onChange={(e) => setConfig({...config, calories: parseInt(e.target.value)})}
                                className="w-full bg-[#0c1a13] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-500/50 text-sm">local_fire_department</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest pl-1">People</label>
                        <div className="relative">
                            <input 
                                type="number"
                                value={config.people}
                                onChange={(e) => setConfig({...config, people: parseInt(e.target.value)})}
                                className="w-full bg-[#0c1a13] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-emerald-500/50 text-sm">group</span>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-4 items-center mb-8">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-400">info</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Weekly Forecast</span>
                        <span className="text-xs text-emerald-400/70">Total 21 meals will be generated based on your settings.</span>
                    </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">auto_awesome</span>
                            Generate Weekly Meals
                        </>
                    )}
                </button>
            </div>

            <div className="mt-8 flex gap-6">
                <button onClick={() => navigate(-1)} className="text-emerald-400/50 hover:text-emerald-400 text-sm font-bold transition-all">Skip for now</button>
                <button className="text-emerald-400/50 hover:text-emerald-400 text-sm font-bold transition-all">Previous settings</button>
            </div>
        </div>
    );
};

export default MealCartSetup;
