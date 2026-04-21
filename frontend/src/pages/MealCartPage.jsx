import React, { useState, useEffect } from 'react';
import { 
    Search, Bell, MoreVertical, UtensilsCrossed, BarChart3, 
    Sparkles, Plus, PlusCircle, Coffee, Sun, Moon, Apple, Zap, 
    CheckCircle2, CalendarDays, Copy, RefreshCw, Wand2, Trash2, GripVertical,
    X, IndianRupee, Save, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GroceryPage from './GroceryPage';
import { USER_GOALS } from '../utils/mockMealData';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter } from '@dnd-kit/core';
import './MealCartPage.css';

// --- Draggable Meal Item (Library) ---
function DraggableMeal({ meal }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `lib-meal-${meal.id}`,
        data: { meal }
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
    } : undefined;

    let tags = [];
    try {
        tags = JSON.parse(meal.tags_json || "[]");
    } catch(e) {}

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="library-meal-card clay-card cursor-grab active:cursor-grabbing p-3 mb-3 shrink-0 flex items-center gap-3">
            <GripVertical size={16} className="text-slate-400" />
            <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{meal.name}</h4>
                <div className="flex gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-primary">{meal.calories} kcal</span>
                    <span>{meal.protein_g}g Pro</span>
                    <span className="opacity-60">· {meal.meal_type}</span>
                    {meal.estimated_cost > 0 && (
                        <span className="text-emerald-500 font-bold">₹{meal.estimated_cost}</span>
                    )}
                </div>
                {tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                        {tags.map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full uppercase tracking-wider">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Droppable Day Panel ---
function DroppableDay({ day, activeDay, setActiveDay, dayPlan, onRemove, onRepeat, onCloneDay, onAutoFill, loggedMeals, handleLogMeal }) {
    const { isOver, setNodeRef } = useDroppable({
        id: `day-${day.full}`,
        data: { day: day.full }
    });

    const isSelected = activeDay === day.full;
    const style = isOver ? { backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: '#10b981' } : undefined;
    const meals = dayPlan ? dayPlan.meals : [];

    // Helper for icons based on MealType
    const getIcon = (type) => {
        if (type === 'Breakfast') return <Coffee size={20} className="text-emerald-400" />;
        if (type === 'Lunch') return <Sun size={20} className="text-amber-400" />;
        if (type === 'Dinner') return <Moon size={20} className="text-indigo-400" />;
        if (type === 'Snack') return <Apple size={20} className="text-rose-400" />;
        return <Zap size={20} className="text-yellow-400" />;
    };

    return (
        <div 
            ref={setNodeRef}
            className={`border-2 rounded-2xl p-4 mb-4 transition-all duration-300 ${isSelected ? 'border-primary shadow-clay-primary' : 'border-dashed border-slate-200 dark:border-slate-800'}`}
            style={style}
            onClick={() => setActiveDay(day.full)}
        >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                        {day.date}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{day.full}</h4>
                        <span className="text-xs text-slate-500">
                            {dayPlan?.totals?.calories || 0} kcal total
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onAutoFill(day.full); }} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all font-bold text-xs flex gap-2 items-center">
                        <Wand2 size={14} /> Smart Fill
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onCloneDay(day.full); }} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-xs flex gap-2 items-center">
                        <Copy size={14} /> Clone Day
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {meals.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                        Drop meals here
                    </div>
                ) : (
                    meals.map(m => (
                        <div key={m.id} className="clay-card p-3 flex items-center justify-between gap-4 w-full bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    {getIcon(m.type)}
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</h5>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span className="font-bold">{m.calories} kcal</span>
                                        <span>Pro: {m.protein}g</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <div className="flex gap-1">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onRepeat(m.id); }}
                                        className="p-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors flex items-center"
                                        title="Repeat Meal 7 Days"
                                    >
                                        <RefreshCw size={14} className="mr-1"/> 7 Days
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onRemove(m.id); }}
                                        className="p-1.5 text-xs bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <button 
                                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded w-full flex justify-center items-center gap-1 mt-1 transition-all ${
                                        loggedMeals[`${day.full}-${m.type}`] 
                                            ? 'bg-emerald-500/10 text-emerald-500' 
                                            : 'bg-primary text-background-dark hover:brightness-110 active:scale-95'
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); handleLogMeal(m, day.full); }}
                                    disabled={loggedMeals[`${day.full}-${m.type}`]}
                                >
                                    {loggedMeals[`${day.full}-${m.type}`] ? <><CheckCircle2 size={10} /> Logged</> : 'Log'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// --- Create Meal Modal ---
function CreateMealModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        name: '', meal_type: 'Breakfast', calories: '', protein_g: '', carbs_g: '', fat_g: '',
        estimated_cost: '', tags: '', ingredients: '', isAdmin: false
    });
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const ingredientList = form.ingredients.split(',').map(i => i.trim()).filter(Boolean);
            const tagList = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
            const payload = {
                name: form.name,
                meal_type: form.meal_type,
                food_items_json: JSON.stringify(ingredientList.map(name => ({ name, quantity: 1, unit: 'unit', category: 'Other' }))),
                calories: parseFloat(form.calories) || 0,
                protein_g: parseFloat(form.protein_g) || 0,
                carbs_g: parseFloat(form.carbs_g) || 0,
                fat_g: parseFloat(form.fat_g) || 0,
                estimated_cost: parseFloat(form.estimated_cost) || 0,
                tags_json: JSON.stringify(tagList)
            };
            await api.createMealTemplate(payload, form.isAdmin);
            onSave();
            onClose();
            setForm({ name: '', meal_type: 'Breakfast', calories: '', protein_g: '', carbs_g: '', fat_g: '', estimated_cost: '', tags: '', ingredients: '', isAdmin: false });
        } catch (err) {
            console.error('Create meal error:', err);
            alert('Failed to create meal.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content create-meal-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title"><PlusCircle size={20} className="text-emerald-500" /> Create Custom Meal</h3>
                    <button onClick={onClose} className="modal-close"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-row">
                        <label className="form-label">Meal Name</label>
                        <input className="form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Super Salad Bowl" required />
                    </div>
                    <div className="form-row-group">
                        <div className="form-row">
                            <label className="form-label">Type</label>
                            <select className="form-input" value={form.meal_type} onChange={e => handleChange('meal_type', e.target.value)}>
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                                <option>Supplement</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <label className="form-label">Est. Cost (₹)</label>
                            <input className="form-input" type="number" value={form.estimated_cost} onChange={e => handleChange('estimated_cost', e.target.value)} placeholder="150" />
                        </div>
                    </div>
                    <div className="form-row-group four-col">
                        <div className="form-row">
                            <label className="form-label">Calories</label>
                            <input className="form-input" type="number" value={form.calories} onChange={e => handleChange('calories', e.target.value)} placeholder="500" required />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Protein (g)</label>
                            <input className="form-input" type="number" value={form.protein_g} onChange={e => handleChange('protein_g', e.target.value)} placeholder="30" />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Carbs (g)</label>
                            <input className="form-input" type="number" value={form.carbs_g} onChange={e => handleChange('carbs_g', e.target.value)} placeholder="50" />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Fat (g)</label>
                            <input className="form-input" type="number" value={form.fat_g} onChange={e => handleChange('fat_g', e.target.value)} placeholder="15" />
                        </div>
                    </div>
                    <div className="form-row">
                        <label className="form-label">Ingredients (comma separated)</label>
                        <input className="form-input" value={form.ingredients} onChange={e => handleChange('ingredients', e.target.value)} placeholder="Chicken, Rice, Spinach, Olive Oil" />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Tags (comma separated)</label>
                        <input className="form-input" value={form.tags} onChange={e => handleChange('tags', e.target.value)} placeholder="high-protein, low-carb, vegetarian" />
                    </div>
                    <div className="form-row admin-toggle">
                        <label className="admin-toggle-label">
                            <input type="checkbox" checked={form.isAdmin} onChange={e => handleChange('isAdmin', e.target.checked)} />
                            <Globe size={14} />
                            <span>Save to Common Database (Admin)</span>
                        </label>
                        <span className="admin-hint">Available to all users if checked</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" disabled={saving} className="btn-save">
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save Meal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const MealCartPage = ({ initialMode = 'meals' }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState(initialMode);
    const [weeklyPlan, setWeeklyPlan] = useState([]);
    const [libraryMeals, setLibraryMeals] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
    const [loading, setLoading] = useState(true);
    const [loggedMeals, setLoggedMeals] = useState({});
    const [activeDragMeal, setActiveDragMeal] = useState(null);
    const [showCreateMeal, setShowCreateMeal] = useState(false);

    const getDaysForWeek = () => {
        const today = new Date();
        const currentDayIndex = today.getDay();
        const mondayOffset = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;
        
        const daysArray = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + mondayOffset + i);
            daysArray.push({
                full: date.toLocaleDateString('en-US', { weekday: 'long' }),
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.getDate().toString()
            });
        }
        return daysArray;
    };
    const days = getDaysForWeek();

    useEffect(() => { setViewMode(initialMode); }, [initialMode]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await fetchPlan();
            await fetchLibrary();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLibrary = async () => {
        try {
            const result = await api.getMealLibrary();
            setLibraryMeals(result);
        } catch (error) { console.error("Error fetching library:", error); }
    };

    const fetchPlan = async () => {
        try {
            let planData = await api.getMealPlan();
            const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const grouped = daysOrder.map(day => {
                const dayMeals = planData
                    .filter(p => p.day_of_week === day)
                    .map(p => ({
                        id: p.id,
                        type: p.meal_type,
                        name: p.meal_template?.name || 'Standard Meal',
                        calories: p.meal_template?.calories || 0,
                        protein: p.meal_template?.protein_g || 0,
                        carbs: p.meal_template?.carbs_g || 0,
                        fat: p.meal_template?.fat_g || 0
                    }));

                const totals = dayMeals.reduce((acc, m) => ({
                    calories: acc.calories + m.calories,
                    protein: acc.protein + m.protein,
                }), { calories: 0, protein: 0 });

                return { day_of_week: day, meals: dayMeals, totals };
            });
            setWeeklyPlan(grouped);
        } catch (error) {
            console.error("Error fetching plan:", error);
        }
    };

    const handleLogMeal = async (meal, dayStr) => {
        const mealId = `${dayStr}-${meal.type}`;
        if (loggedMeals[mealId]) return;
        try {
            await api.logCustomMeal({
                name: meal.name, calories: meal.calories, protein: meal.protein,
                carbs: meal.carbs, fat: meal.fat, type: meal.type
            });
            setLoggedMeals(prev => ({ ...prev, [mealId]: true }));
        } catch (error) {
            alert("Failed to log meal.");
        }
    };

    // --- Action Handlers ---
    const handleRemoveMeal = async (planId) => {
        try {
            await api.removeMealFromPlan(planId);
            fetchPlan();
        } catch (e) { alert("Failed to remove meal."); }
    };

    const handleRepeatMeal = async (planId) => {
        try {
            await api.repeatMealForWeek(planId);
            fetchPlan();
        } catch (e) { alert("Failed to repeat meal."); }
    };

    const handleCloneDay = async (sourceDay) => {
        try {
            await api.cloneDayToAll(sourceDay);
            fetchPlan();
        } catch (e) { alert("Failed to clone day."); }
    };

    const handleAutoFill = async (dayOfWeek) => {
        try {
            const loadingToast = setTimeout(() => { alert("Auto-filling via Lens Smart engine..."); }, 200);
            await api.autoFillDay(dayOfWeek);
            clearTimeout(loadingToast);
            fetchPlan();
        } catch (e) { alert("Failed to auto fill. Your lens goals might be met already or unavailable."); }
    };

    // --- Drag and Drop ---
    const handleDragStart = (event) => {
        const { active } = event;
        const mealData = active.data.current?.meal;
        if (mealData) setActiveDragMeal(mealData);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveDragMeal(null);
        if (!over) return;

        const dayId = over.data.current?.day;
        const mealTemplate = active.data.current?.meal;

        if (dayId && mealTemplate) {
             try {
                await api.addMealToPlan({
                    day_of_week: dayId,
                    meal_type: mealTemplate.meal_type,
                    meal_template_id: mealTemplate.id
                });
                fetchPlan();
             } catch(error) {
                 console.error("Drop failed:", error);
                 alert("Failed to drop meal.");
             }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const dayPlan = weeklyPlan.find(d => d.day_of_week === selectedDay);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="meal-plan-container animate-fade-in p-6 h-screen flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Meals Cart</h2>
                        <p className="text-slate-500">Plan your week. Drag & Drop supported.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button 
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'meals' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500'}`}
                                onClick={() => { setViewMode('meals'); navigate('/meals-cart'); }}
                            >
                                Planner
                            </button>
                            <button 
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'groceries' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500'}`}
                                onClick={() => { setViewMode('groceries'); navigate('/meals-cart/grocery'); }}
                            >
                                Groceries
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                {viewMode === 'meals' ? (
                    <div className="flex gap-6 h-full overflow-hidden">
                        {/* Left: Library Sidebar */}
                        <div className="w-80 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-3xl p-5 overflow-y-auto flex flex-col shadow-inner">
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                                        <UtensilsCrossed className="text-emerald-500" size={20}/>
                                        Meal Library
                                    </h3>
                                    <button
                                        onClick={() => setShowCreateMeal(true)}
                                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                                        title="Add Custom Meal"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">Drag items to your days</p>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 pb-20">
                                {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Supplement'].map(category => {
                                    const meals = libraryMeals.filter(m => m.meal_type === category);
                                    if (meals.length === 0) return null;
                                    return (
                                        <div key={category} className="mb-6">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{category}</h4>
                                            {meals.map(meal => (
                                                <DraggableMeal key={meal.id} meal={meal} />
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Planner */}
                        <div className="flex-1 flex flex-col min-w-0 pr-4">
                            <div className="flex gap-2 overflow-x-auto pb-4 shrink-0 px-1 snap-x">
                                {days.map((day) => (
                                    <div 
                                        key={day.full}
                                        className={`snap-start shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                                            selectedDay === day.full 
                                                ? 'bg-primary text-background-dark shadow-clay-primary scale-105' 
                                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 hover:border-primary/50'
                                        }`}
                                        onClick={() => setSelectedDay(day.full)}
                                    >
                                        <span className={`text-sm font-black ${selectedDay === day.full ? 'text-background-dark/80' : 'text-slate-400'}`}>{day.label}</span>
                                        <span className="text-3xl font-black mt-1 leading-none">{day.date}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto px-1 pb-20">
                                <h3 className="font-black text-xl mb-4 text-slate-900 dark:text-white flex justify-between items-end">
                                    <span>{selectedDay}'s Plan</span>
                                </h3>
                                {/* Mobile/tablet view optimization - only show active day normally, but show all for scrolling/dropping */}
                                <div className="max-w-3xl">
                                    {days.map(day => (
                                        <div key={day.full} className={selectedDay !== day.full ? "hidden xl:block opacity-50" : "block"}>
                                            <DroppableDay 
                                                day={day} 
                                                activeDay={selectedDay}
                                                setActiveDay={setSelectedDay}
                                                dayPlan={weeklyPlan.find(p => p.day_of_week === day.full)}
                                                onRemove={handleRemoveMeal}
                                                onRepeat={handleRepeatMeal}
                                                onCloneDay={handleCloneDay}
                                                onAutoFill={handleAutoFill}
                                                loggedMeals={loggedMeals}
                                                handleLogMeal={handleLogMeal}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Far Right: Insights Panel */}
                        <div className="w-80 shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-5 overflow-y-auto border-l border-slate-100 dark:border-slate-800 hidden 2xl:block">
                            <h3 className="section-title text-slate-900 dark:text-white mb-6">
                                <BarChart3 className="accent-color mr-2" />
                                {selectedDay} Insights
                            </h3>

                            <div className="macro-ring-card bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 mb-6 text-center shadow-inner">
                                <div className="text-5xl font-black text-primary mb-1">{Math.round(dayPlan?.totals?.calories || 0)}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Kcal / {USER_GOALS.calories}</div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl">
                                        <div className="text-lg font-black text-emerald-400">{Math.round(dayPlan?.totals?.protein || 0)}g</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400">Protein</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl">
                                        <div className="text-lg font-black text-amber-400">0g*</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400">Carbs</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/10 border-2 border-primary/20 p-4 rounded-2xl text-sm text-slate-900 dark:text-white">
                                <strong className="flex items-center gap-1 text-primary mb-2"><Sparkles size={16}/> Lens Tip</strong>
                                <p>Your automated meals prioritize high-protein suggestions. Click "Smart Fill" on empty days to balance your remaining calories!</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 rounded-3xl p-2 mt-4 border border-slate-100 dark:border-slate-800">
                        <GroceryPage showHeader={false} />
                    </div>
                )}
            </div>

            <DragOverlay>
                {activeDragMeal ? (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl border-2 border-primary w-64 transform rotate-3">
                        <h4 className="font-bold text-slate-900 dark:text-white">{activeDragMeal.name}</h4>
                        <span className="text-xs font-bold text-primary">{activeDragMeal.calories} kcal</span>
                    </div>
                ) : null}
            </DragOverlay>

            <CreateMealModal
                isOpen={showCreateMeal}
                onClose={() => setShowCreateMeal(false)}
                onSave={() => fetchLibrary()}
            />
        </DndContext>
    );
};

export default MealCartPage;
