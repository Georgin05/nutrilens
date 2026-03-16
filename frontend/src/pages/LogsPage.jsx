import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LogsPage() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    const mealCategories = [
        { id: 'breakfast', name: 'Breakfast', icon: 'light_mode', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
        { id: 'lunch', name: 'Lunch', icon: 'sunny', color: 'text-emerald-404', bgColor: 'bg-emerald-400/10' },
        { id: 'dinner', name: 'Dinner', icon: 'dark_mode', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
        { id: 'snacks', name: 'Snacks', icon: 'cookie', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
    ];

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await api.getRecentLogs();
                setLogs(data);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getItemsForCategory = (category) => {
        // This is a placeholder filter. In a real app, logs would have a 'meal_type'
        // For now, we'll slice parts of the logs list or use mock data to match the UI
        if (category === 'breakfast') return logs.slice(0, 2);
        if (category === 'lunch') return logs.slice(2, 3);
        if (category === 'snacks') return logs.slice(3, 4);
        return [];
    };

    const totalKcal = logs.reduce((sum, log) => sum + (log.calories || 0), 0);

    return (
        <div className="min-h-full p-4 md:p-8 text-slate-100 max-w-[800px] mx-auto w-full pb-32">
            
            {/* Header */}
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">Daily Log</h1>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span className="text-sm">{date}</span>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center hover:bg-slate-800 transition-all shadow-clay">
                    <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                </button>
            </header>

            {/* Meal Categories */}
            <div className="space-y-6">
                {mealCategories.map((cat) => {
                    const items = getItemsForCategory(cat.id);
                    return (
                        <div key={cat.id} className="clay-card-dark clay-card-glow rounded-[2rem] p-6 shadow-clay border border-white/5 drift" style={{ animationDelay: '0.2s' }}>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${cat.bgColor} rounded-xl flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${cat.color} font-black`}>{cat.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white">{cat.name}</h3>
                                </div>
                                <button className="bg-primary hover:bg-emerald-400 text-background-dark font-black px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-clay-primary">
                                    <span className="material-symbols-outlined text-sm">add</span> Add
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.length > 0 ? (
                                    items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden border border-white/5 relative group">
                                                <img 
                                                    src={item.image_url || `https://source.unsplash.com/100x100/?food,${item.food_name}`} 
                                                    alt={item.food_name}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-white text-base leading-tight">{item.food_name}</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                                                    {item.portion_size} • {item.calories} kcal
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 opacity-40">
                                        <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Nothing logged yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Button Overlay */}
            <div className="fixed bottom-8 left-0 w-full px-4 flex flex-col items-center gap-4 z-50">
                <button className="w-full max-w-[760px] bg-primary hover:bg-emerald-400 text-background-dark py-4 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-clay-primary hover:scale-[1.02] active:scale-[0.98]">
                    <span className="material-symbols-outlined bg-background-dark text-primary rounded-full p-0.5 text-base font-black">check</span>
                    Log Day Entry
                </button>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                    Total: {totalKcal} kcal logged for today
                </p>
            </div>

        </div>
    );
}
