import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

import DailyNutritionCard from '../components/dashboard/DailyNutritionCard';
import FoodLogList from '../components/dashboard/FoodLogList';
import ScanHistoryPanel from '../components/dashboard/ScanHistoryPanel';
import NutritionTrendChart from '../components/dashboard/NutritionTrendChart';
import LensInsightCard from '../components/dashboard/LensInsightCard';
import DietCalendar from '../components/dashboard/DietCalendar';
import HydrationCard from '../components/dashboard/HydrationCard';

export default function DashboardPage() {
    // Top-level Dashboard Page Body Class
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    return (
        <div className="min-h-full p-4 md:p-8 text-slate-900 dark:text-slate-100 pb-24 lg:pb-8 max-w-[1700px] mx-auto w-full">
            
            {/* Top Header */}
            <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 mb-10 px-2">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">Daily Nutrition</h1>
                    <p className="text-slate-400 font-bold tracking-tight">Monitoring your metabolic health goals</p>
                </div>
                <div className="flex items-center gap-4 self-end md:self-auto">
                    <button className="w-12 h-12 bg-slate-900/60 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all clay-card-dark border border-white/5 shrink-0 shadow-clay-inner">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <Link to="/logs" className="bg-primary hover:opacity-90 text-background-dark px-6 py-3 rounded-xl font-black flex justify-center items-center gap-3 shadow-clay transition-all scale-100 hover:scale-[1.02]">
                        <span className="material-symbols-outlined font-black">add</span>
                        Log Meal
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                
                {/* Main Dashboard Column */}
                <div className="col-span-12 lg:col-span-8 space-y-8 min-w-0">
                    
                    {/* Macro Summary Area */}
                    <div className="w-full">
                        <DailyNutritionCard />
                    </div>

                    {/* Food Log Table */}
                    <div className="w-full">
                        <FoodLogList />
                    </div>

                    {/* Recent Scans (Positioned under Food Log) */}
                    <div className="w-full">
                        <ScanHistoryPanel />
                    </div>
                </div>

                {/* Side Widgets Column (Right Sidebar) */}
                <aside className="col-span-12 lg:col-span-4 space-y-6 shrink-0">
                    <LensInsightCard />
                    <DietCalendar />
                    <NutritionTrendChart />
                    <HydrationCard />
                </aside>

            </div>
        </div>
    );
}
