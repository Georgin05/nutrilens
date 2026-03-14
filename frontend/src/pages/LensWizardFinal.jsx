import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LensWizardFinal() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [themeColor, setThemeColor] = useState('Neon');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            alert("Please give your lens a name");
            return;
        }
        
        setLoading(true);
        try {
            const profileStr = localStorage.getItem('lensWizardProfile');
            const profileData = profileStr ? JSON.parse(profileStr) : {};
            
            const payload = {
                name: name,
                theme_color: themeColor,
                calorie_limit: profileData.calorie_limit,
                min_protein_g: profileData.min_protein_g,
                max_sugar_g: profileData.max_sugar_g,
                flagged_ingredients: profileData.flagged_ingredients || []
            };
            
            // Create via API
            const newLens = await api.createCustomLens(payload);
            
            // Set it as active and redirect
            localStorage.setItem('activeLensId', newLens.id);
            navigate('/lenses', { state: { newLensPopupId: newLens.id } });
        } catch (error) {
            console.error("Failed to create lens", error);
            alert("Failed to save lens.");
            setLoading(false);
        }
    };

    const gradientClass = themeColor === 'Blue' 
        ? 'from-blue-400 to-blue-600' 
        : themeColor === 'Purple' 
        ? 'from-purple-400 to-purple-600' 
        : 'from-primary to-emerald-400';

    const ringClass = themeColor === 'Blue' ? 'ring-blue-400/50' : themeColor === 'Purple' ? 'ring-purple-400/50' : 'ring-primary/50';

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden">
             
            {/* Header */}
            <header className="flex items-center p-6 justify-between max-w-md mx-auto w-full z-10">
                <button onClick={() => navigate(-1)} className="bg-slate-800/50 p-2 rounded-full flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-primary">arrow_back</span>
                </button>
                <h2 className="text-xl font-bold tracking-tight text-slate-100">Wizard</h2>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full px-6 pb-24 z-10">
                {/* Progress Section */}
                <div className="flex flex-col gap-3 mb-8">
                    <div className="flex justify-between items-end">
                        <span className="text-primary text-sm font-semibold uppercase tracking-widest">Step 3 of 3</span>
                        <span className="text-slate-400 text-xs">Name &amp; Save</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
                        <div className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(19,236,128,0.6)]" style={{width: "100%"}}></div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2 leading-tight">Finalize your Lens</h1>
                <p className="text-slate-400 mb-8">Give your custom AI nutritionist a unique identity and look.</p>

                {/* Form Card */}
                <div className="bg-white/5 border border-white/10 rounded-[24px] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.4),8px_8px_16px_rgba(0,0,0,0.3)] backdrop-blur-md p-6 flex flex-col gap-8">
                    
                    {/* Name Input */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-slate-300 ml-1">Give your Lens a name</label>
                        <input 
                            className={`bg-black/20 border-none rounded-2xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] w-full h-14 px-5 text-slate-100 focus:ring-2 focus:${ringClass} outline-none transition-all placeholder:text-slate-600`}
                            placeholder="Josh’s Shredding Lens" 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Color Selection */}
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-slate-300 ml-1">Theme Color</label>
                        <div className="flex gap-3">
                            <button onClick={() => setThemeColor('Blue')} className={`shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] flex-1 py-3 px-2 rounded-xl bg-blue-600 flex flex-col items-center gap-2 transition-all ${themeColor === 'Blue' ? 'ring-2 ring-white/50 border-blue-400/30' : 'border border-transparent opacity-70'}`}>
                                <div className="w-6 h-6 rounded-full bg-blue-300/40"></div>
                                <span className="text-xs font-bold text-white uppercase tracking-tighter">Blue</span>
                            </button>
                            <button onClick={() => setThemeColor('Purple')} className={`shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] flex-1 py-3 px-2 rounded-xl bg-purple-600 flex flex-col items-center gap-2 transition-all ${themeColor === 'Purple' ? 'ring-2 ring-white/50 border-purple-400/30' : 'border border-transparent opacity-70'}`}>
                                <div className="w-6 h-6 rounded-full bg-purple-300/40"></div>
                                <span className="text-xs font-bold text-white uppercase tracking-tighter">Purple</span>
                            </button>
                            <button onClick={() => setThemeColor('Neon')} className={`shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] flex-1 py-3 px-2 rounded-xl bg-primary flex flex-col items-center gap-2 transition-all ${themeColor === 'Neon' ? 'ring-2 ring-white/50 border-white/30 text-slate-900' : 'border border-transparent opacity-70 text-slate-700'}`}>
                                <div className="w-6 h-6 rounded-full bg-white/40"></div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Neon</span>
                            </button>
                        </div>
                    </div>

                    {/* Preview Placeholder */}
                    <div className="mt-4 relative group">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} rounded-2xl blur opacity-30 transition duration-1000`}></div>
                        <div className="relative bg-black/40 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">lens</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium tracking-widest text-left">PREVIEW</p>
                                <p className="text-slate-200 font-semibold">{name || 'Your Lens Name'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button onClick={handleCreate} disabled={loading} className="bg-primary shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.2),0_10px_20px_rgba(19,236,128,0.2)] w-full py-5 rounded-2xl text-slate-900 font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <span>{loading ? 'Creating...' : 'Create & Activate'}</span>
                        <span className="material-symbols-outlined">bolt</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
