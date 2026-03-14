import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LensWizardLimits() {
    const navigate = useNavigate();
    
    // Default starting limits
    const [limits, setLimits] = useState({
        calorie_limit: 2500,
        min_protein_g: 15,
        max_sugar_g: 5
    });

    const handleChange = (e) => {
        setLimits({ ...limits, [e.target.name]: parseInt(e.target.value) });
    };

    const handleNext = () => {
        // Save to temporary local storage to pass to the next step
        localStorage.setItem('lensWizardLimits', JSON.stringify(limits));
        navigate('/lenses/wizard/guard');
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col">
            <header className="flex items-center px-6 pt-8 pb-4 justify-between">
                <button onClick={() => navigate(-1)} className="size-12 flex items-center justify-center rounded-full bg-primary/10 text-primary active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-xl font-bold tracking-tight text-center flex-1">NutriLens Wizard</h2>
                <div className="size-12"></div>
            </header>
            
            <div className="flex w-full flex-row items-center justify-center gap-3 py-6">
                <div className="h-2 w-8 rounded-full bg-primary"></div>
                <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                <div className="h-2 w-2 rounded-full bg-primary/20"></div>
            </div>
            
            <main className="flex-1 px-6 overflow-y-auto pb-32">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight mb-2">What are your limits?</h1>
                    <p className="text-slate-400">Set your nutrition boundaries for this custom lens.</p>
                </div>
                
                <div className="space-y-8">
                    {/* Calorie Ceiling */}
                    <div className="clay-card rounded-2xl p-6 bg-primary/5 border border-primary/10 shadow-[8px_8px_16px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(19,236,128,0.1),inset_4px_4px_8px_rgba(255,255,255,0.05)]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">local_fire_department</span>
                                </div>
                                <span className="font-semibold text-lg">Daily Calorie Ceiling</span>
                            </div>
                            <span className="text-primary font-bold text-lg">{limits.calorie_limit} <span className="text-xs font-normal text-slate-400 uppercase">kcal</span></span>
                        </div>
                        <input className="w-full bg-slate-800/50 h-3 rounded-full appearance-none cursor-pointer accent-primary" name="calorie_limit" max="4000" min="1200" step="50" type="range" value={limits.calorie_limit} onChange={handleChange}/>
                        <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                            <span>1,200</span>
                            <span>4,000</span>
                        </div>
                    </div>

                    {/* Minimum Protein */}
                    <div className="clay-card rounded-2xl p-6 bg-primary/5 border border-primary/10 shadow-[8px_8px_16px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(19,236,128,0.1),inset_4px_4px_8px_rgba(255,255,255,0.05)]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">fitness_center</span>
                                </div>
                                <span className="font-semibold text-lg">Minimum Protein</span>
                            </div>
                            <span className="text-primary font-bold text-lg">{limits.min_protein_g}g <span className="text-xs font-normal text-slate-400 uppercase">/100g</span></span>
                        </div>
                        <input className="w-full bg-slate-800/50 h-3 rounded-full appearance-none cursor-pointer accent-primary" name="min_protein_g" max="50" min="0" step="1" type="range" value={limits.min_protein_g} onChange={handleChange}/>
                        <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                            <span>0g</span>
                            <span>50g</span>
                        </div>
                    </div>

                    {/* Maximum Sugar */}
                    <div className="clay-card rounded-2xl p-6 bg-primary/5 border border-primary/10 shadow-[8px_8px_16px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(19,236,128,0.1),inset_4px_4px_8px_rgba(255,255,255,0.05)]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">ev_shadow</span>
                                </div>
                                <span className="font-semibold text-lg">Maximum Sugar</span>
                            </div>
                            <span className="text-primary font-bold text-lg">{limits.max_sugar_g}g <span className="text-xs font-normal text-slate-400 uppercase">/100g</span></span>
                        </div>
                        <input className="w-full bg-slate-800/50 h-3 rounded-full appearance-none cursor-pointer accent-primary" name="max_sugar_g" max="30" min="0" step="1" type="range" value={limits.max_sugar_g} onChange={handleChange}/>
                        <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                            <span>0g</span>
                            <span>30g</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-sm leading-relaxed text-slate-300">
                        This lens will prioritize foods with <span className="text-primary font-semibold">high protein</span> and <span className="text-primary font-semibold">low sugar</span>.
                    </p>
                </div>
            </main>
            
            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-50">
                <button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                    Next Step
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </footer>
        </div>
    );
}
