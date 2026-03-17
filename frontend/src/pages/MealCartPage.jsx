import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Bell, 
    MoreVertical, 
    UtensilsCrossed, 
    BarChart3, 
    Sparkles, 
    Plus,
    PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GroceryPage from './GroceryPage';
import { getMockWeeklyPlan, getMockGroceriesFromPlan, USER_GOALS } from '../utils/mockMealData';
import './MealCartPage.css';

const MealCartPage = ({ initialMode = 'meals' }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState(initialMode);
    const [weeklyPlan, setWeeklyPlan] = useState([]);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [loading, setLoading] = useState(true);
    const [includeProteinShake, setIncludeProteinShake] = useState(false);

    useEffect(() => {
        setViewMode(initialMode);
    }, [initialMode]);

    const dayLabels = {
        'Monday': 'Mon',
        'Tuesday': 'Tue',
        'Wednesday': 'Wed',
        'Thursday': 'Thu',
        'Friday': 'Fri',
        'Saturday': 'Sat',
        'Sunday': 'Sun'
    };

    const days = Object.entries(dayLabels).map(([full, label], idx) => ({
        full,
        label,
        date: (23 + idx).toString()
    }));

    useEffect(() => {
        generatePlan();
    }, [includeProteinShake]);

    const generatePlan = () => {
        setLoading(true);
        const plan = getMockWeeklyPlan(includeProteinShake);
        setWeeklyPlan(plan);
        setLoading(false);
    };

    const dayPlan = weeklyPlan.find(d => d.day_of_week === selectedDay);
    const currentDayMeals = dayPlan ? dayPlan.meals : [];

    const mealCategories = currentDayMeals.map(meal => {
        return {
            type: meal.type,
            time: meal.type === 'Breakfast' ? '08:30 AM' : meal.type === 'Lunch' ? '12:45 PM' : meal.type === 'Snack' ? '04:00 PM' : meal.type === 'Supplement' ? '06:00 PM' : '07:30 PM',
            name: meal.name,
            description: 'Balanced nutritional meal based on active lens.',
            kcal: meal.calories,
            protein: meal.protein,
            image: meal.image_url || 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=200'
        };
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="meal-plan-container animate-fade-in">
            {/* Header */}
            <header className="meal-plan-header">
                <div>
                    <h2 className="title text-slate-900 dark:text-white">Meals Cart</h2>
                    <p className="subtitle">Week of Oct 23rd - Oct 29th</p>
                </div>

                <div className="header-actions">
                    <div className="toggle-container">
                        <button 
                            className={`toggle-btn ${viewMode === 'meals' ? 'active' : ''}`}
                            onClick={() => {
                                setViewMode('meals');
                                navigate('/meals-cart');
                            }}
                        >
                            Meals
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === 'groceries' ? 'active' : ''}`}
                            onClick={() => {
                                setViewMode('groceries');
                                navigate('/meals-cart/grocery');
                            }}
                        >
                            Groceries
                        </button>
                    </div>

                    <div className="shake-toggle-container clay-inset">
                        <span className="text-[10px] font-black uppercase text-slate-500 mr-2">Protein Shake</span>
                        <div 
                            className={`clay-switch ${includeProteinShake ? 'active' : ''}`}
                            onClick={() => setIncludeProteinShake(!includeProteinShake)}
                        >
                            <div className="switch-thumb"></div>
                        </div>
                    </div>

                    <div className="icon-btns">
                        <button className="icon-btn"><Search size={20} /></button>
                        <button className="icon-btn"><Bell size={20} /></button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            {viewMode === 'meals' ? (
                <div className="meal-plan-grid">
                    {/* Left: Weekly Schedule */}
                    <div className="meals-list-section">
                        <div className="section-header">
                            <h3 className="section-title text-slate-900 dark:text-white">
                                <UtensilsCrossed className="accent-color" />
                                Weekly Schedule
                            </h3>
                            <div className="chip-actions">
                                <span className="chip active">All Days</span>
                                <span className="chip text-slate-500">Edit</span>
                            </div>
                        </div>

                        {/* Calendar Strip */}
                        <div className="calendar-strip">
                            {days.map((day) => (
                                <div 
                                    key={day.full}
                                    className={`day-card ${selectedDay === day.full ? 'active' : ''}`}
                                    onClick={() => setSelectedDay(day.full)}
                                >
                                    <span className="day-name">{day.label}</span>
                                    <span className="day-date">{day.date}</span>
                                </div>
                            ))}
                        </div>

                        {/* Meals List */}
                        <div className="meals-stack">
                            {mealCategories.map((meal, idx) => (
                                <div key={idx} className={`meal-card-item ${meal.isPlaceholder ? 'placeholder' : ''}`}>
                                    {meal.isPlaceholder ? (
                                        <>
                                            <div className="placeholder-img">
                                                <PlusCircle size={32} />
                                            </div>
                                            <div className="meal-info">
                                                <h4 className="text-slate-900 dark:text-white">Add {meal.type}</h4>
                                                <p>{meal.suggestion}</p>
                                            </div>
                                            <button className="add-meal-btn">
                                                <Plus size={24} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="meal-img">
                                                <img src={meal.image} alt={meal.name} />
                                            </div>
                                            <div className="meal-info">
                                                <div className="meal-top">
                                                    <span className="meal-badge">{meal.type}</span>
                                                    <span className="meal-time">{meal.time}</span>
                                                </div>
                                                <h4 className="text-slate-900 dark:text-white">{meal.name}</h4>
                                                <p>{meal.description}</p>
                                                <div className="meal-macros">
                                                    <span className="macro"><i className="dot kcal"></i> {meal.kcal} kcal</span>
                                                    <span className="macro"><i className="dot protein"></i> {meal.protein}g Protein</span>
                                                </div>
                                            </div>
                                            <button className="more-btn text-slate-400"><MoreVertical size={20} /></button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Insights */}
                    <div className="insights-section">
                        <h3 className="section-title text-slate-900 dark:text-white">
                            <BarChart3 className="accent-color" />
                            Daily Insights
                        </h3>

                        {/* Macro Progress Card */}
                        <div className="macro-ring-card">
                            <div className="ring-container">
                                <svg className="progress-ring" viewBox="0 0 100 100">
                                    <circle className="ring-bg" cx="50" cy="50" r="45" />
                                    <circle 
                                        className="ring-fill" 
                                        cx="50" cy="50" r="45" 
                                        style={{ strokeDashoffset: `${283 - (283 * (dayPlan?.totals.calories || 0) / USER_GOALS.calories)}` }}
                                    />
                                </svg>
                                <div className="ring-content">
                                    <span className="value text-slate-900 dark:text-white">{Math.round(dayPlan?.totals.calories || 0)}</span>
                                    <span className="label">KCAL / {USER_GOALS.calories}</span>
                                </div>
                            </div>

                            <div className="macro-stats-grid">
                                <div className="stat-pill highlight-blue">
                                    <span className="val">{Math.round(dayPlan?.totals.protein || 0)}g</span>
                                    <span className="lbl">Protein / {USER_GOALS.protein}g</span>
                                </div>
                                <div className="stat-pill highlight-yellow">
                                    <span className="val">{Math.round(dayPlan?.totals.carbs || 0)}g</span>
                                    <span className="lbl">Carbs / {USER_GOALS.carbs}g</span>
                                </div>
                                <div className="stat-pill highlight-pink">
                                    <span className="val">{Math.round(dayPlan?.totals.fat || 0)}g</span>
                                    <span className="lbl">Fats / {USER_GOALS.fat}g</span>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Progress */}
                        <div className="progress-mini-card">
                            <h4 className="text-slate-900 dark:text-white">Weekly Nutrition Progress</h4>
                            <div className="progress-bar-group">
                                <div className="bar-header">
                                    <span className="text-slate-500">Protein Goal</span>
                                    <span className="accent">85%</span>
                                </div>
                                <div className="bar-bg">
                                    <div className="bar-fill" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div className="progress-bar-group">
                                <div className="bar-header">
                                    <span className="text-slate-500">Fiber Goal</span>
                                    <span className="accent">62%</span>
                                </div>
                                <div className="bar-bg">
                                    <div className="bar-fill dim" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* AI Tip */}
                        <div className="ai-tip-card">
                            <div className="tip-header">
                                <div className="tip-icon"><Sparkles size={18} /></div>
                                <h4 className="text-slate-900 dark:text-white">NutriLens AI Tip</h4>
                            </div>
                            <p>
                                Your dinner plan for Wednesday is high in sodium. Consider swapping the soy sauce for coconut aminos to stay within your daily metabolic targets.
                            </p>
                            <button className="swap-action-btn">Swap Ingredient</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grocery-view-content">
                    <GroceryPage showHeader={false} initialItems={getMockGroceriesFromPlan(weeklyPlan)} />
                </div>
            )}
        </div>
    );
};

export default MealCartPage;
