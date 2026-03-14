import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

import DailyNutritionCard from '../components/dashboard/DailyNutritionCard';
import FoodLogList from '../components/dashboard/FoodLogList';
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
        <div className="flex flex-col lg:flex-row min-h-full p-4 md:p-6 gap-6 text-slate-900 dark:text-slate-100 pb-24 lg:pb-6 max-w-[1600px] mx-auto w-full">
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col xl:flex-row gap-6 min-w-0">
                
                {/* Center Column (Nutrition & Logs) */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 mb-8 mt-2 px-2">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-1">Daily Nutrition</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Monitoring your metabolic health goals</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors clay-btn shrink-0">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <Link to="/scan" className="bg-primary hover:bg-emerald-400 text-background-dark w-full md:w-auto px-8 py-4 rounded-full font-black flex justify-center items-center gap-3 clay-btn shadow-primary-glow transition-all">
                                <span className="material-symbols-outlined font-black">add</span>
                                Log Meal
                            </Link>
                        </div>
                    </header>

                    <div className="overflow-x-hidden min-w-0 w-full mb-6">
                        <DailyNutritionCard />
                    </div>
                    <div className="overflow-x-hidden min-w-0 w-full">
                        <FoodLogList />
                    </div>
                </div>

                {/* Right Column (Insights & History) */}
                <aside className="w-full xl:w-80 2xl:w-96 flex flex-col gap-6 shrink-0 pt-2 pb-6 flex-none">
                    <LensInsightCard />
                    <DietCalendar />
                    <HydrationCard />
                </aside>

            </div>

            {/* Right Sidebar */}
            <aside className="w-80 clay-card-light dark:clay-card-dark rounded-clay hidden 2xl:flex flex-col p-8 overflow-hidden shrink-0 transition-colors duration-300">
                <h3 className="text-xl font-black tracking-tight mb-8">Live Insights</h3>
                <div className="space-y-8">
                    <div className="bg-primary-10 rounded-clay p-6 clay-thumb border border-primary-5">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-primary font-black">priority_high</span>
                            <h4 className="font-black text-sm uppercase tracking-tight">Fiber Progress</h4>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-4 clay-thumb w-full">
                            <div className="bg-primary h-full rounded-full shadow-primary-glow" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">You are 12g short of your fiber goal. Try adding beans to dinner.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900-40 rounded-clay p-6 clay-thumb">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Recommended Next</h4>
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl clay-thumb overflow-hidden border-2 border-white-20">
                                <img alt="Salmon meal" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzyJw-HQKXFw3Puh2jG8yBemT969INCoHFH3AHy4keT-p7_uEH6wP-JW5hfPUuLNFJ73FcdsqHFYNOodWH4-YijWxfSGEoS1TETxG1aigMZqxcJrm3pUpqnZo_g1vwgRqpOeQ5bp3pBxMtOr4KB7Nsy7rOpzCklO1ubZeEPyqW1jfaUix2uouwbDeCyDhSBAhUT_nrn4SUseggUhZlQRpju_kzyqnhUcdRNufu9dNeeJ5mB7Gh-lnX3qlMqSyZvEQ_ygwsknWbe78d" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black truncate">Steamed Salmon</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-tighter">Perfect Macro Fit</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-white clay-btn shadow-amber">
                            <span className="material-symbols-outlined font-black">emoji_events</span>
                        </div>
                        <div>
                            <p className="text-sm font-black">Sugar-Free Streak!</p>
                            <p className="text-[10px] text-slate-400 font-medium italic">5 days below 30g sugar</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="bg-primary text-background-dark p-6 rounded-clay text-center clay-btn">
                        <p className="text-xs font-black uppercase tracking-widest mb-2">Upgrade To Pro</p>
                        <p className="text-[10px] font-bold leading-tight flex justify-center mb-4 px-2 text-slate-800">
                            Clinical-grade bloodwork analysis & meal plans
                        </p>
                        <button className="w-full bg-background-dark text-primary py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Unlock Now</button>
                    </div>
                </div>
            </aside>
        </div>
    );
}
