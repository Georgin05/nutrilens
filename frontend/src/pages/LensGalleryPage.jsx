import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function LensGalleryPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [customLenses, setCustomLenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeLensId, setActiveLensId] = useState(localStorage.getItem('activeLensId') || 'muscle_build');
    const [selectedLensForPopup, setSelectedLensForPopup] = useState(null);
    
    useEffect(() => {
        // Fetch custom lenses from API
        api.getCustomLenses().then(data => {
            if (data && data.length) {
                setCustomLenses(data);
                
                // Check if we just created a lens
                if (location.state?.newLensPopupId) {
                    const createdLens = data.find(l => l.id.toString() === location.state.newLensPopupId.toString());
                    if (createdLens) {
                        // Map it to the format used in allLenses
                        let colorClass = { bg: 'bg-primary', text: 'text-primary' };
                        if (createdLens.theme_color === 'Blue') colorClass = { bg: 'bg-blue-400', text: 'text-blue-400' };
                        if (createdLens.theme_color === 'Purple') colorClass = { bg: 'bg-purple-400', text: 'text-purple-400' };
                        
                        setSelectedLensForPopup({
                            id: createdLens.id.toString(),
                            name: createdLens.name,
                            desc: 'Custom user-defined logic boundaries.',
                            icon: 'lens',
                            colorClass: colorClass,
                            isCustom: true,
                            limits: { calories: createdLens.calorie_limit, protein: createdLens.min_protein_g, sugar: createdLens.max_sugar_g },
                            flags: createdLens.flagged_ingredients
                        });
                        
                        // Clear state so it doesn't pop up again on refresh
                        window.history.replaceState({}, document.title);
                    }
                }
            }
        }).catch(err => console.error("Error fetching custom lenses", err))
          .finally(() => setIsLoading(false));
    }, [location]);

    const handleSelectLens = (id) => {
        setActiveLensId(id);
        localStorage.setItem('activeLensId', id);
        setSelectedLensForPopup(null);
    };

    const PRESET_LENSES = [
        { id: 'muscle_build', name: 'Muscle Build', desc: 'Protein maximization and calorie surplus focus.', icon: 'fitness_center', colorClass: {bg: 'bg-primary', text: 'text-primary'} },
        { id: 'fat_loss', name: 'Fat Loss', desc: 'Caloric deficit and low sugar optimization.', icon: 'monitor_weight', colorClass: {bg: 'primary', text: 'text-primary'} },
        { id: 'diabetes_friendly', name: 'Diabetes Friendly', desc: 'Glycemic index and low sugar focus.', icon: 'blood_pressure', colorClass: {bg: 'bg-blue-400', text: 'text-blue-400'} },
        { id: 'athlete_performance', name: 'Athlete Performance', desc: 'Carb-loading and electrolyte optimization.', icon: 'sprint', colorClass: {bg: 'bg-amber-custom', text: 'text-amber-custom'} },
        { id: 'clean_eating', name: 'Clean Eating', desc: 'Avoidance of ultra-processed artificial ingredients.', icon: 'eco', colorClass: {bg: 'bg-emerald-custom', text: 'text-emerald-custom'} }
    ];

    const allLenses = [
        ...PRESET_LENSES,
        ...customLenses.map(cl => {
            let colorClass = { bg: 'bg-primary', text: 'text-primary' };
            if (cl.theme_color === 'Blue') colorClass = { bg: 'bg-blue-400', text: 'text-blue-400' };
            if (cl.theme_color === 'Purple') colorClass = { bg: 'bg-purple-400', text: 'text-purple-400' };
            
            return {
                id: cl.id.toString(),
                name: cl.name,
                desc: 'Custom user-defined logic boundaries.',
                icon: 'lens',
                colorClass: colorClass,
                isCustom: true,
                limits: { calories: cl.calorie_limit, protein: cl.min_protein_g, sugar: cl.max_sugar_g },
                flags: cl.flagged_ingredients
            };
        })
    ];
    
    const activeObj = allLenses.find(l => l.id === activeLensId) || (isLoading ? null : allLenses[0]);

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col relative">
            <header className="flex items-center bg-background-dark p-4 sticky top-0 z-10 border-b border-white/5">
                <div onClick={() => navigate('/dashboard')} className="text-primary flex size-10 shrink-0 items-center justify-center clay-card rounded-full cursor-pointer active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </div>
                <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Lens Gallery</h2>
                <div className="flex w-10 items-center justify-end">
                    <div onClick={() => navigate('/profile')} className="text-primary flex size-10 shrink-0 items-center justify-center clay-card rounded-full cursor-pointer active:scale-95 transition-transform">
                        <span className="material-symbols-outlined">account_circle</span>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 overflow-y-auto px-4 pb-24">
                <section className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-slate-100 text-xl font-extrabold tracking-tight">Your Active Lens</h2>
                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Live</span>
                    </div>
                    
                    {activeObj ? (
                        <div onClick={() => setSelectedLensForPopup(activeObj)} className="clay-card rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                            <div className={`size-16 rounded-xl ${activeObj.colorClass.bg}/20 flex items-center justify-center shrink-0 shadow-inner ring-1 ring-white/10`}>
                                <span className={`material-symbols-outlined ${activeObj.colorClass.text} text-4xl`}>{activeObj.icon}</span>
                            </div>
                            <div className="flex flex-col flex-1 z-10">
                                <h3 className="text-slate-100 text-lg font-bold">{activeObj.name}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed line-clamp-1">{activeObj.isCustom ? 'Custom parameters & specific ingredient guarding' : activeObj.desc}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg clay-button">
                                        <span className="material-symbols-outlined text-sm">check_circle</span> Active
                                    </span>
                                    {activeObj.isCustom && (
                                       <span className="flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg clay-button">
                                           <span className="material-symbols-outlined text-sm">build</span> Custom
                                       </span> 
                                    )}
                                </div>
                            </div>
                            <div className={`h-16 w-1 ${activeObj.colorClass.bg} rounded-full`}></div>
                        </div>
                    ) : (
                        <div className="clay-card rounded-2xl p-5 flex items-center justify-center min-h-[120px]">
                            <span className="text-primary material-symbols-outlined animate-spin">refresh</span>
                        </div>
                    )}
                </section>

                <section className="mt-10">
                    <h2 className="text-slate-100 text-xl font-extrabold tracking-tight mb-4">All Lenses</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {allLenses.map(lens => (
                            <div key={lens.id} onClick={() => setSelectedLensForPopup(lens)} className="clay-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all active:scale-[0.98]">
                                <div className={`size-12 rounded-xl ${lens.colorClass.bg === 'primary' ? 'bg-primary' : lens.colorClass.bg}/20 flex items-center justify-center shrink-0`}>
                                    <span className={`material-symbols-outlined ${lens.colorClass.text} text-2xl`}>{lens.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-slate-100 font-bold">{lens.name}</h4>
                                    <p className="text-slate-400 text-xs">{lens.isCustom ? 'Custom user limits and guards' : 'Standard preset'}</p>
                                </div>
                                {activeLensId === lens.id ? (
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                ) : (
                                    <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-8 mb-4">
                    <div onClick={() => navigate('/lenses/wizard/limits')} className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-primary/10 transition-all active:scale-[0.98]">
                        <div className="size-16 clay-primary rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(19,236,128,0.4)]">
                            <span className="material-symbols-outlined text-3xl font-bold text-slate-900">add</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-primary text-lg font-bold">Create Custom Lens</h3>
                            <p className="text-slate-400 text-sm">Define your own nutrient goals &amp; filters</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Popup Modal */}
            {selectedLensForPopup && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-background-dark/80 backdrop-blur-sm p-4 pb-24 transition-opacity">
                    {/* Dark overlay click-to-close handler */}
                    <div className="absolute inset-0 z-[-1]" onClick={() => setSelectedLensForPopup(null)}></div>
                    
                    <div className="w-full max-w-md bg-clay-surface rounded-3xl p-6 border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative">
                        <button onClick={() => setSelectedLensForPopup(null)} className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className={`size-16 rounded-2xl ${selectedLensForPopup.colorClass.bg === 'primary' ? 'bg-primary' : selectedLensForPopup.colorClass.bg}/20 flex items-center justify-center mb-4`}>
                             <span className={`material-symbols-outlined ${selectedLensForPopup.colorClass.text} text-4xl`}>{selectedLensForPopup.icon}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1 text-slate-100">{selectedLensForPopup.name}</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">{selectedLensForPopup.desc}</p>
                        
                        {selectedLensForPopup.isCustom && (
                            <div className="mb-6 space-y-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Custom Bounds Enforced</h4>
                                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="text-slate-400">Calorie Density Filter</span>
                                    <span className="font-bold text-slate-200">Max {selectedLensForPopup.limits?.calories || '--'} kcal/d</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2 pt-1">
                                    <span className="text-slate-400">Protein Preference</span>
                                    <span className="font-bold text-slate-200">Min {selectedLensForPopup.limits?.protein || 0}g</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-1">
                                    <span className="text-slate-400">Sugar Penalty</span>
                                    <span className="font-bold text-slate-200">Max {selectedLensForPopup.limits?.sugar || 0}g</span>
                                </div>
                                
                                {selectedLensForPopup.flags && selectedLensForPopup.flags.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <span className="block text-xs font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">warning</span> Active Guards</span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedLensForPopup.flags.map(f => (
                                                <span key={f} className="text-xs px-2 py-1 bg-red-500/10 text-red-500 rounded-md border border-red-500/20">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeLensId === selectedLensForPopup.id ? (
                             <button disabled className="w-full py-4 rounded-xl flex justify-center gap-2 items-center font-bold text-slate-400 bg-white/5 cursor-not-allowed">
                                 <span className="material-symbols-outlined">check_circle</span> Already Active
                             </button>
                        ) : (
                            <button 
                                onClick={() => handleSelectLens(selectedLensForPopup.id)} 
                                className={`w-full py-4 rounded-xl flex justify-center gap-2 items-center font-bold text-slate-900 ${selectedLensForPopup.colorClass.bg === 'primary' ? 'bg-primary' : selectedLensForPopup.colorClass.bg} active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:brightness-110`}
                            >
                                <span className="material-symbols-outlined">bolt</span> Make Active Lens
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <footer className="fixed bottom-0 w-full bg-background-dark/80 backdrop-blur-xl border-t border-white/5 px-4 pb-6 pt-3 z-40">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <a onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-medium">Home</span>
                    </a>
                    <a onClick={(e) => { e.preventDefault(); navigate('/lenses'); }} className="flex flex-col items-center gap-1 text-primary cursor-pointer">
                        <span className="material-symbols-outlined fill-1">target</span>
                        <span className="text-[10px] font-bold">Lenses</span>
                    </a>
                    <a onClick={(e) => { e.preventDefault(); navigate('/scan'); }} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">document_scanner</span>
                        <span className="text-[10px] font-medium">Scanner</span>
                    </a>
                    <a onClick={(e) => { e.preventDefault(); navigate('/profile'); }} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-medium">Profile</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}
