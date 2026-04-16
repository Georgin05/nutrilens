import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminAiInsights() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAdminAiConversations();
        setConversations(data || []);
      } catch (err) {
        console.error("Failed to fetch ai insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex min-h-screen bg-[#021109] text-[#e6fced] font-['Inter']">
        {/* SideNavBar */}
        <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#3cff90]/10 bg-[#04170e] flex flex-col py-8 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50">
            <div className="px-8 mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                        <img alt="NutriLens Logo" data-alt="Abstract glowing green geometric logo icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIyZit-dHoeHwwdgOy5694LGGELME5quEC3RKDKXYM4tat1lXttvA5xsG-Es0lI3SlyS4rfQKZG6bRkihMcXC7rZfqhaiT0L7k56O2FLrS15sRnH8G4kolL6WBkPM1q5gfT7eWyFMl7n0oFQhS3o2u1y7G2uTr8JtNKLwlGOJd1xlkMDhmzXVLmAOwkavXCGR0JTemZgowut-7jwUL4d9TCKwu2QHkqs1wANSNJdKtRDVKuFFPrWRBYEWt2H20rhcSDTv2bVsCz5yh"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#3cff90] leading-none">NutriLens</h1>
                        <p className="font-['Inter'] font-semibold text-[10px] uppercase tracking-widest text-[#9bb0a3] mt-1">Admin Console</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 space-y-2">
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform transition-all duration-300 ease-in-out hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/analytics">
                    <span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
                    <span>Analytics</span>
                </Link>
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform transition-all duration-300 ease-in-out hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/users">
                    <span className="material-symbols-outlined" data-icon="group">group</span>
                    <span>Users</span>
                </Link>
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform transition-all duration-300 ease-in-out hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/lenses">
                    <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
                    <span>Lenses</span>
                </Link>
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform transition-all duration-300 ease-in-out hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/products">
                    <span className="material-symbols-outlined" data-icon="database">database</span>
                    <span>Food Database</span>
                </Link>
                <Link className="flex items-center gap-3 bg-[#102b1e] text-[#3cff90] rounded-r-full py-3 px-6 border-l-4 border-[#3cff90] shadow-[inset_0_0_12px_rgba(60,255,144,0.1)] transition-all duration-300 ease-in-out font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/ai">
                    <span className="material-symbols-outlined" data-icon="psychology" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                    <span>AI Insights</span>
                </Link>
            </nav>
            <div className="px-6 mt-auto">
                <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-full transition-transform active:scale-95 shadow-[0_8px_24px_rgba(60,255,144,0.2)]">
                    Generate Report
                </button>
                <div className="mt-8 pt-8 border-t border-[#3cff90]/10 flex flex-col gap-2">
                    <a className="flex items-center gap-3 text-[#9bb0a3] py-2 px-4 hover:text-[#3cff90] transition-colors font-['Inter'] font-semibold text-sm uppercase tracking-widest" href="#">
                        <span className="material-symbols-outlined" data-icon="help">help</span>
                        <span>Support</span>
                    </a>
                    <Link className="flex items-center gap-3 text-[#9bb0a3] py-2 px-4 hover:text-error transition-colors font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/">
                        <span className="material-symbols-outlined" data-icon="logout">logout</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="ml-64 flex-1 flex flex-col min-h-screen">
            {/* TopAppBar */}
            <header className="sticky top-0 z-40 w-full px-8 py-4 bg-[#021109] flex justify-between items-center shadow-[0_4px_20px_rgba(60,255,144,0.05)]">
                <div className="flex items-center gap-8 flex-1">
                    <h2 className="font-['Inter'] font-extrabold tracking-tight text-[#e6fced] text-xl">AI Insight Monitoring</h2>
                    <div className="max-w-md w-full relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9bb0a3]">search</span>
                        <input className="w-full bg-[#04170e] border-none rounded-full py-2 pl-12 pr-4 text-on-surface focus:ring-1 focus:ring-primary/30" placeholder="Search insights..." type="text"/>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-4">
                        <button className="p-2 rounded-full text-[#9bb0a3] hover:bg-[#102b1e] hover:text-[#3cff90] transition-all duration-300 active:scale-95">
                            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        </button>
                        <button className="p-2 rounded-full text-[#9bb0a3] hover:bg-[#102b1e] hover:text-[#3cff90] transition-all duration-300 active:scale-95">
                            <span className="material-symbols-outlined" data-icon="settings">settings</span>
                        </button>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden">
                        <img alt="Admin Profile" className="w-full h-full object-cover rounded-full" data-alt="Portrait of a modern professional admin user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgBTTzD6Nea7YHHYnZ3JeWiVJWjc3MDuvz1U03VPuKvp7fE9_zCdleDTMY0EB0KnEiq-orTGDZgJvjN9EDVSPi3yN2JkJtlwA8eKndFHFM3Tzt1JXL8ZNGCURCC1HZyAia3V3AIRU5y_fWXOjjfRPvWxMojpEFPrLl0DEsWGTUVtOhZzyBuYT3GYA_mWsc5iARYYGDLGPEGrRsN8Wc6a-FLTI9l5W1RmlPcJ-Vp5usy1Wg8qjc5so2GB5SluJn9tNg-2seKmTrXFxu"/>
                    </div>
                </div>
            </header>

            {/* Content Grid */}
            <div className="p-8 space-y-8">
                {/* Quick Metrics Row */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-surface-container-low p-6 rounded-lg border border-primary/10 border-l-4 border-l-primary shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)]">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">AI Accuracy Rating</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-primary">98.4%</span>
                            <span className="text-xs text-primary mb-1 flex items-center"><span className="material-symbols-outlined text-sm">arrow_upward</span> 1.2%</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-low p-6 rounded-lg border border-primary/10 border-l-4 border-l-secondary shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)]">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Daily Insights</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-secondary">2,842</span>
                            <span className="text-xs text-on-surface-variant mb-1">Today</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-low p-6 rounded-lg border border-primary/10 border-l-4 border-l-tertiary shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)]">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Flagged Conversations</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-tertiary">14</span>
                            <span className="text-xs text-tertiary mb-1 flex items-center">High Priority</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-low p-6 rounded-lg border border-primary/10 border-l-4 border-l-outline shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)]">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Response Latency</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-on-surface">1.2s</span>
                            <span className="text-xs text-on-surface-variant mb-1">Average</span>
                        </div>
                    </div>
                </section>

                {/* Main Layout: Feed and Triggers */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Recent AI Conversations Feed */}
                    <section className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold tracking-tight">Recent Live Insights</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-primary uppercase">Live Stream</span>
                                <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold text-on-surface-variant uppercase">All Topics</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center p-8 text-on-surface-variant">No recent insights found.</div>
                        ) : (
                            conversations.slice().reverse().slice(0, 5).map((conv, i) => (
                                <div key={conv.id || i} className="bg-surface-container-highest p-8 rounded-lg hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group mb-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center border border-primary/20">
                                                <span className="material-symbols-outlined text-primary" data-icon="person">person</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-on-surface">User #{conv.user_id}</p>
                                                <p className="text-xs text-on-surface-variant">{new Date(conv.timestamp).toLocaleString()} • AI Interaction</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-surface-container-low rounded-full flex items-center gap-2 border border-outline-variant">
                                            <span className="w-2 h-2 rounded-full bg-primary filter drop-shadow-[0_0_8px_rgba(60,255,144,0.4)]"></span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Data</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-surface-container-low rounded-xl rounded-tl-none border border-outline-variant/30">
                                            <p className="text-sm italic text-on-surface-variant leading-relaxed">"{conv.message}"</p>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-xl rounded-tr-none border border-primary/20">
                                            <p className="text-sm font-medium text-on-surface leading-relaxed">
                                                <span className="text-primary font-bold">{conv.is_user ? "User" : "NutriLens AI"}:</span> {conv.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-outline-variant/20 flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-sm">thumb_up</span> Correct
                                            </button>
                                            <button className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant hover:text-error transition-colors">
                                                <span className="material-symbols-outlined text-sm">thumb_down</span> Flag
                                            </button>
                                        </div>
                                        <button className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline">View Full Session</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    {/* Sidebar: Active Triggers */}
                    <aside className="space-y-6">
                        <div className="bg-surface-container-low p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)] border-b border-primary/10">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl" data-icon="bolt">bolt</span>
                                Active Triggers
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-surface-container-highest rounded-xl border border-outline-variant/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                                        <span className="text-xs font-semibold">Medical Advice Flag</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-error-container text-on-error-container px-2 py-0.5 rounded uppercase">Active</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-surface-container-highest rounded-xl border border-outline-variant/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <span className="text-xs font-semibold">Macro Discrepancy</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded uppercase">Idle</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-surface-container-highest rounded-xl border border-outline-variant/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <span className="text-xs font-semibold">Unrecognized SKU</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded uppercase">Idle</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-surface-container-highest rounded-xl border border-outline-variant/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                                        <span className="text-xs font-semibold">Weight Loss Speed</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-error-container text-on-error-container px-2 py-0.5 rounded uppercase">Active</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary/5 transition-colors">
                                Manage All Triggers
                            </button>
                        </div>

                        {/* AI Confidence Map */}
                        <div className="bg-surface-container-low p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-6">Topic Confidence</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                        <span>Micronutrients</span>
                                        <span className="text-primary">99%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{width: "99%"}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                        <span>Supplements</span>
                                        <span className="text-primary">92%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{width: "92%"}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                        <span>Meal Timing</span>
                                        <span className="text-secondary">78%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary rounded-full" style={{width: "78%"}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer Overlay Action */}
            <div className="mt-auto p-8 pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-center pointer-events-auto">
                    <button className="px-12 py-4 bg-primary text-on-primary font-black uppercase tracking-widest rounded-full shadow-[0_20px_40px_rgba(60,255,144,0.3)] transition-transform active:scale-95 flex items-center gap-3">
                        <span className="material-symbols-outlined" data-icon="auto_awesome" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                        Run Global Accuracy Audit
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
}
