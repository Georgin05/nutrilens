import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LensWizardGuard() {
    const navigate = useNavigate();
    
    // Default checked guards
    const [activeGuards, setActiveGuards] = useState(['Palm Oil', 'Added Sugar']);
    const [searchQuery, setSearchQuery] = useState('');

    const recommended = [
        'Soy', 'Artificial Sweeteners', 'Monosodium Glutamate', 
        'Carrageenan', 'Red 40', 'High Fructose Corn Syrup', 'Trans Fats'
    ];

    const toggleGuard = (guard) => {
        if (activeGuards.includes(guard)) {
            setActiveGuards(activeGuards.filter(g => g !== guard));
        } else {
            setActiveGuards([...activeGuards, guard]);
        }
    };

    const handleNext = () => {
        // Retrieve previous step limits, add guards, and save to local storage
        const limitsStr = localStorage.getItem('lensWizardLimits');
        const profileData = limitsStr ? JSON.parse(limitsStr) : {};
        profileData.flagged_ingredients = activeGuards;
        
        localStorage.setItem('lensWizardProfile', JSON.stringify(profileData));
        navigate('/lenses/wizard/final');
    };

    const filteredRecommended = recommended.filter(
        r => !activeGuards.includes(r) && r.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
             
            {/* Header */}
            <header className="flex items-center p-6 justify-between relative z-10">
                <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full bg-slate-800/50 border border-white/5 text-slate-100 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.1),inset_-1px_-1px_4px_rgba(0,0,0,0.3),4px_4px_10px_rgba(0,0,0,0.2)]">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-xl font-bold tracking-tight text-slate-100">Custom Lens</h2>
                <div className="size-10"></div> 
            </header>

            {/* Progress Stepper */}
            <div className="flex w-full flex-row items-center justify-center gap-3 py-2">
                <div className="h-1.5 w-8 rounded-full bg-primary/20"></div>
                <div className="h-1.5 w-12 rounded-full bg-primary shadow-[0_0_10px_#13ec80]"></div>
                <div className="h-1.5 w-8 rounded-full bg-primary/20"></div>
            </div>

            {/* Main Content */}
            <main className="flex-1 px-6 pt-8 pb-32 overflow-y-auto z-10">
                <section className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-100 leading-tight mb-3">Ingredient Guard</h1>
                    <p className="text-slate-400 text-sm">Select the ingredients you want us to flag while scanning products.</p>
                </section>

                {/* Search Bar */}
                <div className="mb-10">
                    <div className="relative bg-slate-900/40 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-1px_-1px_3px_rgba(255,255,255,0.05)] rounded-2xl flex items-center h-14 px-4">
                        <span className="material-symbols-outlined text-slate-500 mr-3">search</span>
                        <input 
                            className="bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 w-full text-base outline-none" 
                            placeholder="Search ingredients to avoid..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-8">
                    {/* Active Guards */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Selected Guards</h3>
                        <div className="flex flex-wrap gap-3">
                            {activeGuards.map(guard => (
                                <div key={guard} onClick={() => toggleGuard(guard)} className="bg-primary/10 shadow-[inset_1px_1px_4px_rgba(19,236,128,0.3),inset_-1px_-1px_4px_rgba(0,0,0,0.2),4px_4px_10px_rgba(0,0,0,0.2)] border border-primary/40 flex items-center gap-2 px-4 py-2.5 rounded-full group cursor-pointer active:scale-95 transition-transform">
                                    <span className="text-sm font-medium text-primary">{guard}</span>
                                    <span className="material-symbols-outlined text-sm text-primary/70">close</span>
                                </div>
                            ))}
                            {activeGuards.length === 0 && <p className="text-slate-500 text-sm">None selected</p>}
                        </div>
                    </div>

                    {/* Recommended / Filtered */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Recommended</h3>
                        <div className="flex flex-wrap gap-3">
                            {filteredRecommended.map(guard => (
                                <div key={guard} onClick={() => toggleGuard(guard)} className="bg-slate-800/30 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.1),inset_-1px_-1px_4px_rgba(0,0,0,0.3),4px_4px_10px_rgba(0,0,0,0.2)] border border-white/5 flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer hover:bg-white/10 active:scale-95 transition-transform">
                                    <span className="text-sm font-medium text-slate-300">{guard}</span>
                                    <span className="material-symbols-outlined text-sm text-slate-500">add</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-50">
                <button onClick={handleNext} className="w-full bg-primary hover:brightness-110 text-background-dark font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(19,236,128,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    Continue Setup
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
}
