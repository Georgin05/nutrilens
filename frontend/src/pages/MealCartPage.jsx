import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MealCartPage = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('meals'); // 'meals' or 'groceries'
    const [selectedDay, setSelectedDay] = useState('Mon');
    const [plan, setPlan] = useState({});
    const [groceries, setGroceries] = useState([]);
    const [loading, setLoading] = useState(true);

    const days = [
        { label: 'Mon', full: 'Monday', date: '23' },
        { label: 'Tue', full: 'Tuesday', date: '24' },
        { label: 'Wed', full: 'Wednesday', date: '25' },
        { label: 'Thu', full: 'Thursday', date: '26' },
        { label: 'Fri', full: 'Friday', date: '27' },
        { label: 'Sat', full: 'Saturday', date: '28' },
        { label: 'Sun', full: 'Sunday', date: '29' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [planRes, groceryRes] = await Promise.all([
                api.get('/meal-cart/plan'),
                api.get('/meal-cart/groceries')
            ]);
            setPlan(planRes.data);
            setGroceries(groceryRes.data);
            
            // If plan is empty, redirect to setup
            if (!planRes.data || Object.keys(planRes.data).length === 0) {
                navigate('/meal-cart-setup');
            }
        } catch (error) {
            console.error("Failed to fetch meal cart data", error);
            navigate('/meal-cart-setup');
        } finally {
            setLoading(false);
        }
    };

    const currentDayFull = days.find(d => d.label === selectedDay)?.full;
    const currentDayMeals = plan[currentDayFull] || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-400 text-4xl">shopping_basket</span>
                        Meals Cart
                    </h1>
                    <p className="text-emerald-400/50 text-sm font-medium mt-1">Week of Oct 23rd - Oct 29th</p>
                </div>

                <div className="flex bg-[#0c1a13] p-1.5 rounded-2xl border border-white/5 self-center">
                    <button 
                        onClick={() => setView('meals')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'meals' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-400/40 hover:text-emerald-400'}`}
                    >
                        Meals
                    </button>
                    <button 
                        onClick={() => setView('groceries')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'groceries' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-emerald-400/40 hover:text-emerald-400'}`}
                    >
                        Groceries
                    </button>
                </div>

                <div className="flex gap-3">
                    <button className="w-12 h-12 rounded-xl bg-[#102219] border border-white/5 flex items-center justify-center hover:bg-[#152e22] transition-all">
                        <span className="material-symbols-outlined text-emerald-400">search</span>
                    </button>
                    <button className="w-12 h-12 rounded-xl bg-[#102219] border border-white/5 flex items-center justify-center hover:bg-[#152e22] transition-all">
                        <span className="material-symbols-outlined text-emerald-400">notifications</span>
                    </button>
                </div>
            </div>

            {view === 'meals' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Weekly Schedule Sidebar/Column */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-400">calendar_month</span>
                                Weekly Schedule
                            </h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all">All Days</button>
                                <button className="px-4 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-bold hover:bg-white/10 transition-all">Edit</button>
                            </div>
                        </div>

                        {/* Day Picker */}
                        <div className="flex justify-between gap-2 p-2 bg-[#102219]/40 rounded-3xl border border-white/5">
                            {days.map((day) => (
                                <button 
                                    key={day.label}
                                    onClick={() => setSelectedDay(day.label)}
                                    className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl min-w-[70px] transition-all ${selectedDay === day.label ? 'bg-emerald-500 text-black shadow-lg scale-105' : 'text-white/40 hover:bg-white/5'}`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-1">{day.label}</span>
                                    <span className="text-xl font-black">{day.date}</span>
                                </button>
                            ))}
                        </div>

                        {/* Meal List for Selected Day */}
                        <div className="flex flex-col gap-4">
                            {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((type) => {
                                const meal = currentDayMeals.find(m => m.meal_type === type);
                                if (!meal) return (
                                    <button key={type} className="group p-6 rounded-3xl bg-[#102219]/30 border border-dashed border-white/10 flex items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-all">
                                            <span className="material-symbols-outlined text-emerald-400">add</span>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">{type}</span>
                                            <span className="text-emerald-400 font-bold">Add {type}</span>
                                        </div>
                                    </button>
                                );

                                return (
                                    <div key={type} className="p-4 rounded-3xl bg-[#102219]/60 border border-white/5 flex gap-5 group hover:border-emerald-500/30 transition-all">
                                        <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl relative">
                                            <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[8px] font-black text-emerald-400 uppercase tracking-widest">{type}</div>
                                        </div>
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-black text-white leading-tight mb-1">{meal.name}</h3>
                                                    <p className="text-emerald-400/50 text-xs font-medium">Protein, kale, roasted sweet potatoes</p>
                                                </div>
                                                <button className="material-symbols-outlined text-white/20 hover:text-emerald-400 transition-all">more_vert</button>
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md">
                                                    <span className="material-symbols-outlined text-[14px] text-emerald-400">local_fire_department</span>
                                                    <span className="text-[10px] font-black text-emerald-400">{meal.calories} kcal</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-1 rounded-md">
                                                    <span className="material-symbols-outlined text-[14px] text-blue-400">egg</span>
                                                    <span className="text-[10px] font-black text-blue-400">{meal.protein_g}g Protein</span>
                                                </div>
                                                <div className="ml-auto text-white/20 text-[10px] font-bold">08:30 AM</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Insights Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="p-8 rounded-[40px] bg-[#102219]/80 border border-white/10 shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                           <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                               <span className="material-symbols-outlined text-emerald-400 text-sm">analytics</span>
                               Daily Insights
                           </h3>
                           
                           <div className="flex flex-col items-center mb-8">
                               <div className="relative w-48 h-48 flex items-center justify-center">
                                   <svg className="w-full h-full transform -rotate-90">
                                       <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                       <circle cx="96" cy="96" r="88" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - 0.7)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                   </svg>
                                   <div className="absolute flex flex-col items-center">
                                       <span className="text-4xl font-black text-white">1,820</span>
                                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">kcal total</span>
                                   </div>
                               </div>
                           </div>

                           <div className="grid grid-cols-3 gap-3 mb-4">
                               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 border-b-white/10 flex flex-col items-center">
                                   <span className="text-white font-black text-lg">112g</span>
                                   <span className="text-[8px] font-black text-white/30 uppercase">Protein</span>
                               </div>
                               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 border-b-white/10 flex flex-col items-center">
                                   <span className="text-white font-black text-lg">215g</span>
                                   <span className="text-[8px] font-black text-white/30 uppercase">Carbs</span>
                               </div>
                               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 border-b-white/10 flex flex-col items-center">
                                   <span className="text-white font-black text-lg">58g</span>
                                   <span className="text-[8px] font-black text-white/30 uppercase">Fats</span>
                               </div>
                           </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#102219]/60 border border-white/10 flex flex-col gap-5">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Weekly Nutrition Progress</h3>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/60">Protein Goal</span>
                                        <span className="text-emerald-400">85%</span>
                                    </div>
                                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/60">Fiber Goal</span>
                                        <span className="text-emerald-400">62%</span>
                                    </div>
                                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[62%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 relative group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald-400 text-lg">temp_preferences_custom</span>
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest">NutriLens AI Tip</span>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed mb-6">
                                Your dinner plan for Wednesday is high in sodium. Consider swapping the soy sauce for coconut aminos to stay within your daily metabolic targets.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-black/40 hover:bg-black/60 text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all">Swap Ingredient</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black text-white mb-2">Weekly Grocery List</h2>
                        <p className="text-emerald-400/50 text-sm font-medium italic">Based on your personalized nutrition plan (7 days)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['Vegetables', 'Protein', 'Carbs', 'Healthy Fats'].map((cat) => (
                            <div key={cat} className="bg-[#102219]/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-400">
                                        {cat === 'Vegetables' ? 'flatware' : cat === 'Protein' ? 'egg' : cat === 'Carbs' ? 'bakery_dining' : 'water_drop'}
                                    </span>
                                    {cat}
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {groceries.filter(g => g.category === cat).map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0c1a13] border border-white/5 group hover:border-emerald-500/30 transition-all cursor-pointer">
                                            <span className="text-xs font-bold text-white/80">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-emerald-400/60 uppercase">{item.quantity} {item.unit}</span>
                                                <div className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center group-hover:border-emerald-500 transition-all">
                                                    {idx % 2 === 0 && <span className="material-symbols-outlined text-emerald-400 text-sm">check</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Fallback mock items if no templates seeded for this category */}
                                    {groceries.filter(g => g.category === cat).length === 0 && (
                                        <div className="flex flex-col gap-2 italic text-white/20 text-[10px] text-center py-4">
                                            <span>No items detected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grocery Footer */}
                    <div className="mt-10 p-8 rounded-[40px] bg-[#102219]/80 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                        <div className="flex items-baseline gap-4">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Estimated Cost</span>
                            <span className="text-4xl font-black text-emerald-400">₹ 2800</span>
                            <span className="text-sm font-medium text-emerald-400/50">/ week</span>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export List
                            </button>
                            <button className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-emerald-500 text-black font-black text-sm hover:bg-emerald-400 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
                                <span className="material-symbols-outlined text-lg">print</span>
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealCartPage;
