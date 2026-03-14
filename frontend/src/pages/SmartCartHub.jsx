import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SmartCartHub() {
    const navigate = useNavigate();

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="flex items-center p-6 justify-between relative z-10 sticky top-0 bg-background-dark/80 backdrop-blur-md">
                <button onClick={() => navigate('/dashboard')} className="flex size-10 items-center justify-center rounded-xl bg-slate-800/50 border border-white/5 text-slate-100 shadow-clay-sm active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold tracking-tight text-slate-100">Smart Cart</h2>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Hub</span>
                </div>
                <button className="flex size-10 items-center justify-center rounded-xl bg-slate-800/50 border border-white/5 text-slate-100 shadow-clay-sm active:scale-95 transition-transform relative">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </header>

            <main className="flex-1 px-6 pt-4 pb-24 overflow-y-auto z-10 space-y-6">
                
                {/* Active List Card */}
                <section>
                    <div className="bg-clay-surface p-6 rounded-3xl border border-white/5 shadow-clay-md relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">Currently Active</span>
                                <h3 className="text-2xl font-bold text-slate-100 mt-2">Weekly Muscle Build</h3>
                                <p className="text-slate-400 text-sm mt-1">12/18 items found</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-primary font-bold">67% Complete</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_#13ec80]" style={{width: "67%"}}></div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => navigate('/smart-cart/dashboard')} className="flex-1 bg-primary text-background-dark font-bold py-3 rounded-xl shadow-clay-primary flex items-center justify-center gap-2 active:scale-95 transition-all outline-none">
                                <span className="material-symbols-outlined text-lg">shopping_basket</span>
                                View List
                            </button>
                        </div>
                        
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </section>

                {/* Actions Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <div onClick={() => navigate('/smart-cart/setup')} className="bg-clay-surface p-5 rounded-2xl border border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 active:scale-95 transition-all group text-center">
                        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-bold">add</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100 text-sm">New Cart</h4>
                            <p className="text-[10px] text-slate-400 mt-1">Generate list</p>
                        </div>
                    </div>

                    <div className="bg-clay-surface p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 active:scale-95 transition-all group text-center">
                        <div className="size-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">history</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100 text-sm">Past Lists</h4>
                            <p className="text-[10px] text-slate-400 mt-1">View history</p>
                        </div>
                    </div>
                </section>

                {/* Savings Summary */}
                <section>
                    <div className="bg-clay-surface p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-accent-amber/20 text-accent-amber flex items-center justify-center">
                                <span className="material-symbols-outlined">savings</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Saved this month</p>
                                <p className="text-xl font-bold text-slate-100">$142.50</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-600">chevron_right</span>
                    </div>
                </section>

            </main>
        </div>
    );
}
