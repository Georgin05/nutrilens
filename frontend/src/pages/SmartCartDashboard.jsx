import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function SmartCartDashboard() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [cartData, setCartData] = useState(null);
    const [error, setError] = useState(null);
    const [items, setItems] = useState({
        vegetables: [], protein: [], carbs: [], fats: []
    });
    const [swaps, setSwaps] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.getLatestSmartCart();
                const parsedCart = JSON.parse(response.cart_json);
                setCartData(parsedCart);
                setItems(parsedCart.items);
                setSwaps(parsedCart.swaps || []);
            } catch (err) {
                console.error("Failed to load smart cart", err);
                setError("No smart cart found. Please generate one first.");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const toggleCheck = (category, id) => {
        setItems(prev => ({
            ...prev,
            [category]: prev[category].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
        }));
    };

    const applySwap = (swapId) => {
        setSwaps(prev => prev.map(s => s.id === swapId ? { ...s, applied: true } : s));
        // In fully functioning app, this would modify the items array above.
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col relative overflow-hidden pb-24">
            
            <header className="flex items-center p-6 justify-between relative z-10 sticky top-0 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
                <button onClick={() => navigate('/smart-cart')} className="flex size-10 items-center justify-center rounded-xl bg-slate-800/50 border border-white/5 text-slate-100 shadow-clay-sm active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold tracking-tight text-slate-100">Grocery List</h2>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                        {loading ? '...' : (cartData ? `${Object.values(items).flat().length} items` : '0 items')}
                    </span>
                </div>
                <button className="flex size-10 items-center justify-center rounded-xl bg-primary text-background-dark shadow-clay-primary active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">ios_share</span>
                </button>
            </header>

            <main className="flex-1 px-4 pt-6 overflow-y-auto space-y-6">

                {loading && (
                    <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                        <span className="material-symbols-outlined animate-spin text-4xl mb-2">refresh</span>
                        <p>Loading your AI-optimized cart...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-20 text-accent-amber px-6">
                        <span className="material-symbols-outlined text-4xl mb-2">error</span>
                        <p>{error}</p>
                        <button onClick={() => navigate('/smart-cart/setup')} className="mt-4 bg-primary text-background-dark px-6 py-2 rounded-xl font-bold">Create a Cart</button>
                    </div>
                )}

                {!loading && cartData && (
                    <>
                    {/* Coverage Summary */}
                    <section className="grid grid-cols-2 gap-4">
                        <div className="bg-clay-surface p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Protein Goal</span>
                            <span className="text-2xl font-bold text-slate-100">{cartData.coverage.protein}%</span>
                            <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{width: `${cartData.coverage.protein}%`}}></div>
                            </div>
                        </div>
                        <div className="bg-clay-surface p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Fiber Match</span>
                            <span className="text-2xl font-bold text-slate-100">{cartData.coverage.fiber}%</span>
                            <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{width: `${cartData.coverage.fiber}%`}}></div>
                            </div>
                        </div>
                    </section>

                {/* Main List */}
                <section className="bg-clay-surface rounded-3xl border border-white/5 p-5 shadow-clay-md">
                    
                    {/* Category: Veggies */}
                    <div className="mb-6">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                            <span className="material-symbols-outlined text-sm">local_florist</span> Vegetables
                        </h4>
                        <div className="space-y-3">
                            {items.vegetables.map(item => (
                                <div key={item.id} onClick={() => toggleCheck('vegetables', item.id)} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${item.checked ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-slate-800/30'}`}>
                                    <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded pl-[1px] border ${item.checked ? 'bg-primary border-primary text-background-dark' : 'border-slate-500'}`}>
                                        {item.checked && <span className="material-symbols-outlined text-[14px]">check</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${item.checked ? 'text-primary line-through opacity-70' : 'text-slate-100'}`}>{item.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category: Protein */}
                    <div className="mb-6">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                            <span className="material-symbols-outlined text-sm">set_meal</span> Protein
                        </h4>
                        <div className="space-y-3">
                            {items.protein.map(item => (
                                <div key={item.id} onClick={() => toggleCheck('protein', item.id)} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${item.checked ? 'border-primary/30 bg-primary/5' : item.warning ? 'border-accent-amber/30 bg-accent-amber/5' : 'border-white/5 bg-slate-800/30'}`}>
                                    <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded pl-[1px] border ${item.checked ? 'bg-primary border-primary text-background-dark' : 'border-slate-500'}`}>
                                        {item.checked && <span className="material-symbols-outlined text-[14px]">check</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${item.checked ? 'text-primary line-through opacity-70' : 'text-slate-100'}`}>{item.name}</p>
                                        {item.warning ? (
                                            <p className="text-[10px] text-accent-amber mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">warning</span> {item.desc}</p>
                                        ) : (
                                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

                {/* Budget Optimizer */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <span className="material-symbols-outlined text-accent-amber text-lg">auto_fix</span>
                        <h3 className="text-sm font-bold text-slate-100">AI Budget Optimizer</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {swaps.map(swap => (
                            <div key={swap.id} className="bg-clay-surface border border-accent-amber/20 rounded-2xl p-5 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestion</p>
                                    <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-md">-${swap.savings.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-slate-300 line-through text-sm">{swap.original}</span>
                                    <span className="material-symbols-outlined text-slate-500 text-sm">arrow_forward</span>
                                    <span className="text-slate-100 font-bold text-sm">{swap.new}</span>
                                </div>
                                <p className="text-xs text-slate-400 italic mb-4 leading-relaxed">"{swap.detail}"</p>
                                
                                <button 
                                    onClick={() => applySwap(swap.id)} 
                                    disabled={swap.applied}
                                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${swap.applied ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20 active:scale-95 border border-accent-amber/20'}`}
                                >
                                    {swap.applied ? 'SWAP APPLIED' : 'APPLY SWAP'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Totals */}
                <section className="bg-clay-surface p-6 rounded-3xl border border-white/5 mb-6">
                    <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                        <span>Current Total</span>
                        <span className="line-through">${cartData.totals.current.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-slate-100 border-t border-white/10 pt-2 pb-1">
                        <span>Optimized Total</span>
                        <span className="text-primary">${cartData.totals.optimized.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest mt-4">Synced to NutriLens Mobile App</p>
                </section>
                </>
                )}

            </main>
        </div>
    );
}
