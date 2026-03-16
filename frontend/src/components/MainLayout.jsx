import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/logs', icon: 'restaurant_menu', label: 'Daily Log' },
        { path: '/scan', icon: 'barcode_scanner', label: 'Scanner' },
        { path: '/ai-buddy', icon: 'smart_toy', label: 'AI Buddy' },
        { path: '/smart-cart', icon: 'shopping_cart', label: 'Smart Cart' },
        { path: '/profile', icon: 'person', label: 'Profile' }
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display">
            
            <aside className="hidden lg:flex w-72 h-full flex-col p-6 shrink-0 border-r border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary clay-thumb shrink-0">
                        <span className="material-symbols-outlined text-3xl">biotech</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">NutriLog</h1>
                        <p className="text-[10px] uppercase tracking-widest text-primary/70 font-bold leading-none">High-Fidelity Health</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => {
                        const isActive = currentPath.startsWith(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                                    isActive 
                                        ? 'bg-primary text-background-dark shadow-clay-primary' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 clay-thumb overflow-hidden border-2 border-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Nutri User</p>
                            <p className="text-[10px] text-primary uppercase font-black tracking-tight">Pro Plan Active</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-24 lg:pb-0 h-full relative custom-scrollbar">
                {children}
            </main>

            {/* Mobile Bottom Navigation (hidden on desktop) */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 pb-6 pt-3 flex justify-between items-center z-50">
                {navItems.map((item) => {
                    const isActive = currentPath.startsWith(item.path);
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-colors ${
                                isActive ? 'text-primary' : 'text-slate-500 hover:text-primary/70'
                            }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            
        </div>
    );
}
