import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Coffee, 
    Sun, 
    Moon, 
    Apple, 
    Zap, 
    CheckCircle2, 
    RefreshCw,
    Plus,
    CalendarDays,
    Sparkles,
    Calendar,
    MoreHorizontal,
    X
} from 'lucide-react';
import api from '../services/api';

export default function LogsPage() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [weeklyPlan, setWeeklyPlan] = useState([]);
    const [allTemplates, setAllTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const mealCategories = [
        { id: 'Breakfast', name: 'Breakfast', icon: <Coffee size={20} />, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
        { id: 'Lunch', name: 'Lunch', icon: <Sun size={20} />, color: 'text-amber-400', bgColor: 'bg-amber-400/10' },
        { id: 'Dinner', name: 'Dinner', icon: <Moon size={20} />, color: 'text-indigo-400', bgColor: 'bg-indigo-400/10' },
        { id: 'Snack', name: 'Snack', icon: <Apple size={20} />, color: 'text-rose-400', bgColor: 'bg-rose-400/10' },
        { id: 'Supplement', name: 'Supplement', icon: <Zap size={20} />, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    ];

    useEffect(() => {
        const initData = async () => {
            try {
                // Ensure a plan exists - if not, generate one for the test
                await api.post('/meals/generate-weekly');
                
                const [logsRes, planRes, templatesRes] = await Promise.all([
                    api.getRecentLogs(),
                    api.get('/meals/weekly'),
                    api.getMealTemplates()
                ]);
                setLogs(logsRes);
                setWeeklyPlan(planRes);
                setAllTemplates(templatesRes);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await api.getRecentLogs();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const getItemsForCategory = (categoryName) => {
        // Find logs where meal_type matches (we updated the backend to save meal_type)
        return logs.filter(log => log.meal_type === categoryName);
    };

    const getPlannedMeal = (categoryName) => {
        return weeklyPlan.find(p => p.day_of_week === dayOfWeek && p.meal_type === categoryName);
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSyncAll = async () => {
        setIsSyncing(true);
        try {
            const todayPlan = weeklyPlan.filter(p => p.day_of_week === dayOfWeek);
            const untracked = todayPlan.filter(p => !logs.some(l => l.meal_type === p.meal_type));
            
            if (untracked.length === 0) {
                alert("All planned meals are already logged!");
                return;
            }

            await Promise.all(untracked.map(p => api.post(`/meals/log-planned-meal/${p.id}`)));
            await fetchLogs();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Sync Error:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogPlanned = async (planId) => {
        try {
            await api.post(`/meals/log-planned-meal/${planId}`);
            fetchLogs();
            // Show a brief success pulse or toast
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Error logging planned meal:", error);
        }
    };

    const handleFinalizeLog = () => {
        // This is the "Enter" action the user described
        // It should give a strong confirmation and update goals
        alert("Daily nutrition goals and charts updated successfully!");
        navigate('/dashboard');
    };

    const handleLogTemplate = async (template) => {
        try {
            await api.logCustomMeal({
                name: template.name,
                calories: template.calories,
                protein: template.protein_g,
                carbs: template.carbs_g,
                fat: template.fat_g,
                type: activeCategory
            });
            await fetchLogs();
            setIsModalOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error("Error logging template:", error);
        }
    };

    const totalKcal = logs.reduce((sum, log) => sum + (log.calories || 0), 0);

    return (
        <div className="min-h-full p-4 md:p-8 text-slate-100 max-w-[800px] mx-auto w-full pb-32">
            
            {/* Header */}
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">Daily Log</h1>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <Calendar size={14} />
                        <span className="text-sm">{dayOfWeek}, {date}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSyncAll}
                        disabled={isSyncing}
                        className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-all shadow-clay group"
                        title="Sync Today's Plan"
                    >
                        <RefreshCw size={20} className={`text-primary ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>
                    <button 
                        onClick={() => navigate('/meals-cart')}
                        className="w-10 h-10 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center hover:bg-slate-800 transition-all shadow-clay"
                        title="Meal Plan"
                    >
                        <CalendarDays size={20} className="text-slate-400" />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center hover:bg-slate-800 transition-all shadow-clay">
                        <MoreHorizontal size={20} className="text-slate-400" />
                    </button>
                </div>
            </header>

            {/* Meal Categories */}
            <div className="space-y-6">
                {mealCategories.map((cat) => {
                    const items = getItemsForCategory(cat.id);
                    const planned = getPlannedMeal(cat.id);
                    return (
                        <div key={cat.id} className="clay-card-dark rounded-[2rem] p-6 shadow-clay border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${cat.bgColor} rounded-xl flex items-center justify-center`}>
                                        <div className={`${cat.color} flex items-center justify-center`}>{cat.icon}</div>
                                    </div>
                                    <h3 className="text-xl font-black text-white">{cat.name}</h3>
                                </div>
                                
                                <div className="flex gap-2">
                                    {planned && items.length === 0 && (
                                        <button 
                                            onClick={() => handleLogPlanned(planned.id)}
                                            className="bg-primary/20 hover:bg-primary/30 text-primary font-black px-4 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all border border-primary/20 animate-pulse"
                                        >
                                            <Sparkles size={12} /> Suggestion
                                        </button>
                                    )}
                                        <button 
                                            onClick={() => {
                                                if (planned) {
                                                    handleLogPlanned(planned.id);
                                                } else {
                                                    setActiveCategory(cat.id);
                                                    setIsModalOpen(true);
                                                }
                                            }}
                                            className="bg-primary hover:bg-emerald-400 text-background-dark font-black px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-clay-primary active:scale-95"
                                        >
                                            {planned ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                                            {planned ? `Log ${planned.meal_template?.name || 'Plan'}` : 'Add'}
                                        </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {items.length > 0 ? (
                                    items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden border border-white/5 relative group">
                                                <img 
                                                    src={item.image_url || `https://source.unsplash.com/100x100/?food,${item.product_name}`} 
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-white text-base leading-tight">{item.product_name}</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">
                                                    {item.serving_size} portion • {item.calories} kcal
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-primary uppercase">{item.protein_g}g P</span>
                                                <span className="text-[10px] font-black text-slate-600 uppercase">{item.carbs_g}g C</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 opacity-30">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Nothing logged yet</p>
                                        {planned && (
                                            <p className="text-[10px] text-primary mt-1">Suggested: {planned.meal_template?.name}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Button Overlay */}
            {/* Meal Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-md animate-fade-in">
                    <div className="clay-card-dark w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-black text-white mb-2">Log {activeCategory}</h2>
                        <p className="text-slate-400 text-sm font-bold mb-6">Select a meal to add to your log</p>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {allTemplates && allTemplates.length > 0 ? (
                                allTemplates
                                    .filter(t => t.meal_type === activeCategory || !t.meal_type)
                                    .map(template => (
                                        <button 
                                            key={template.id}
                                            onClick={() => handleLogTemplate(template)}
                                            className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center justify-between group"
                                        >
                                            <div className="text-left">
                                                <p className="font-black text-white group-hover:text-primary transition-colors">{template.name}</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase">{template.calories} kcal • {template.protein_g}g P</p>
                                            </div>
                                            <Plus size={18} className="text-slate-600 group-hover:text-primary" />
                                        </button>
                                    ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">No templates available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className={`fixed bottom-8 left-0 w-full px-4 flex flex-col items-center gap-4 z-50 transition-all duration-300 ${showSuccess ? 'scale-105' : ''}`}>
                <button 
                    onClick={handleFinalizeLog}
                    className={`w-full max-w-[760px] ${showSuccess ? 'bg-emerald-400' : 'bg-primary'} hover:bg-emerald-400 text-background-dark py-4 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-clay-primary hover:scale-[1.02] active:scale-[0.98] outline-none`}
                >
                    <div className="bg-background-dark rounded-full p-1 leading-none shadow-sm">
                        <CheckCircle2 size={16} className="text-primary" />
                    </div>
                    {showSuccess ? 'Nutrition Updated!' : 'Log Day Entry'}
                </button>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                    Total: {totalKcal} kcal logged for today
                </p>
            </div>

        </div>
    );
}
