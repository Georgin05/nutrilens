import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminLenses() {
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLens, setEditingLens] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
      name: '', theme_color: 'green', icon: 'visibility',
      calorie_modifier: 0, protein_ratio: 0.3, carb_ratio: 0.4, fat_ratio: 0.3
  });

  const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getAdminLenses();
        setLenses(data || []);
      } catch (err) {
        console.error("Failed to fetch lenses", err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (lens) => {
      setEditingLens(lens);
      setFormData({
          name: lens.name, theme_color: lens.theme_color, icon: lens.icon || 'visibility',
          calorie_modifier: lens.calorie_modifier, protein_ratio: lens.protein_ratio,
          carb_ratio: lens.carb_ratio, fat_ratio: lens.fat_ratio
      });
      setIsModalOpen(true);
  };

  const handeCreateNew = () => {
      setEditingLens(null);
      setFormData({
          name: '', theme_color: 'green', icon: 'visibility',
          calorie_modifier: 0, protein_ratio: 0.3, carb_ratio: 0.4, fat_ratio: 0.3
      });
      setIsModalOpen(true);
  };

  const handleSave = async () => {
      try {
          if (editingLens) {
              await api.updateAdminLens(editingLens.id, formData);
          } else {
              await api.createAdminLens(formData);
          }
          setIsModalOpen(false);
          fetchData(); // Refresh list
      } catch (error) {
          console.error("Failed to save lens:", error);
          alert("Error saving lens");
      }
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation(); // prevent opening edit
      if (window.confirm("Are you sure you want to delete this specific lens view?")) {
          try {
              await api.deleteAdminLens(id);
              fetchData();
          } catch (error) {
               console.error("Deletion failed:", error);
          }
      }
  };
  return (
    <div className="bg-[#021109] text-[#e6fced] font-['Inter'] selection:bg-primary selection:text-[#005d2e] min-h-screen flex">
        {/* SideNavBar Shell */}
        <aside className="fixed left-0 top-0 w-64 border-r border-primary/10 bg-[#04170e] flex flex-col h-screen py-8 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
            <div className="px-8 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(60,255,144,0.3)]">
                        <span className="material-symbols-outlined text-primary" data-icon="visibility">visibility</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#3cff90]">NutriLens</h1>
                        <p className="font-['Inter'] font-semibold text-[10px] uppercase tracking-widest text-[#9bb0a3]">Admin Console</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 space-y-1">
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/analytics">
                    <span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
                    <span>Analytics</span>
                </Link>
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/users">
                    <span className="material-symbols-outlined" data-icon="group">group</span>
                    <span>Users</span>
                </Link>
                <Link className="flex items-center gap-3 bg-[#102b1e] text-[#3cff90] rounded-r-full py-3 px-6 border-l-4 border-[#3cff90] shadow-[inset_0_0_12px_rgba(60,255,144,0.1)] font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/lenses">
                    <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
                    <span>Lenses</span>
                </Link>
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/products">
                    <span className="material-symbols-outlined" data-icon="database">database</span>
                    <span>Food Database</span>
                </Link>
                <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/admin/ai">
                    <span className="material-symbols-outlined" data-icon="psychology">psychology</span>
                    <span>AI Insights</span>
                </Link>
            </nav>
            <div className="px-6 mt-auto space-y-4">
                <button className="w-full bg-gradient-to-r from-[#3cff90] to-[#08ea7e] text-[#004822] font-bold py-3 px-4 rounded-full shadow-[0_4px_15px_rgba(60,255,144,0.2)] active:scale-95 transition-all">
                    Generate Report
                </button>
                <div className="pt-6 border-t border-white/5 space-y-1">
                    <a className="flex items-center gap-3 text-[#9bb0a3] py-2 px-4 hover:text-[#3cff90] transition-colors font-['Inter'] font-semibold text-sm uppercase tracking-widest" href="#">
                        <span className="material-symbols-outlined" data-icon="help">help</span>
                        <span>Support</span>
                    </a>
                    <Link className="flex items-center gap-3 text-[#ff716c] py-2 px-4 hover:bg-[#ff716c]/10 rounded-full transition-all font-['Inter'] font-semibold text-sm uppercase tracking-widest" to="/">
                        <span className="material-symbols-outlined" data-icon="logout">logout</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </div>
        </aside>

        {/* Main Canvas */}
        <main className="ml-64 flex-1 flex flex-col min-h-screen">
            {/* TopAppBar */}
            <header className="bg-[#021109] w-full top-0 z-40 shadow-[0_4px_20px_rgba(60,255,144,0.05)] sticky">
                <div className="flex justify-between items-center w-full px-8 py-4">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9bb0a3]" data-icon="search">search</span>
                            <input className="bg-[#04170e] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#3cff90] w-64 placeholder:text-outline text-[#e6fced]" placeholder="Search lenses..." type="text"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-[#9bb0a3] hover:bg-[#102b1e] hover:text-[#3cff90] transition-all duration-300 rounded-full active:scale-95">
                            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        </button>
                        <button className="p-2 text-[#9bb0a3] hover:bg-[#102b1e] hover:text-[#3cff90] transition-all duration-300 rounded-full active:scale-95">
                            <span className="material-symbols-outlined" data-icon="settings">settings</span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-[#102b1e] border border-[#3cff90]/20 overflow-hidden ml-2">
                            <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgBTTzD6Nea7YHHYnZ3JeWiVJWjc3MDuvz1U03VPuKvp7fE9_zCdleDTMY0EB0KnEiq-orTGDZgJvjN9EDVSPi3yN2JkJtlwA8eKndFHFM3Tzt1JXL8ZNGCURCC1HZyAia3V3AIRU5y_fWXOjjfRPvWxMojpEFPrLl0DEsWGTUVtOhZzyBuYT3GYA_mWsc5iARYYGDLGPEGrRsN8Wc6a-FLTI9l5W1RmlPcJ-Vp5usy1Wg8qjc5so2GB5SluJn9tNg-2seKmTrXFxu" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <div className="p-10">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">Lens Management</h2>
                        <p className="text-on-surface-variant max-w-xl">Configure bioluminescent vision layers for specific nutritional goals. Each lens recalibrates the AI's food recognition priority.</p>
                    </div>
                    <button onClick={handeCreateNew} className="flex items-center gap-2 bg-[#102b1e] border border-primary/20 hover:border-primary/50 text-primary px-6 py-3 rounded-full transition-all active:scale-95">
                        <span className="material-symbols-outlined" data-icon="add">add</span>
                        <span className="font-bold uppercase text-xs tracking-widest">Create New Lens</span>
                    </button>
                </div>

                {/* Lens Grid (Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex justify-center py-12">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
                        </div>
                    ) : (
                        lenses.map((lens) => (
                            <div key={lens.id} onClick={() => handleEdit(lens)} className="bg-[#04170e] rounded-lg p-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 border border-[#3cff90]/10 shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_4px_4px_8px_rgba(60,255,144,0.05),inset_-4px_-4px_8px_rgba(0,0,0,0.3)] cursor-pointer">
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#102b1e] flex items-center justify-center text-[#3cff90] group-hover:shadow-[0_0_20px_rgba(60,255,144,0.2)] transition-shadow">
                                            <span className="material-symbols-outlined text-3xl" data-icon={lens.icon || "visibility"}>{lens.icon || "visibility"}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#e6fced]">{lens.name}</h3>
                                            <span className="text-[10px] font-semibold text-[#3cff90] uppercase tracking-[0.2em]">{lens.theme_color} Theme</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={(e) => handleDelete(e, lens.id)} className="text-rose-500 hover:text-rose-400 p-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <span className="text-[10px] font-bold text-[#3cff90] uppercase">Active</span>
                                        <div className="w-10 h-5 bg-[#3cff90]/20 rounded-full relative p-1 cursor-pointer">
                                            <div className="absolute right-1 top-1 w-3 h-3 bg-[#3cff90] rounded-full shadow-[0_0_8px_rgba(60,255,144,0.6)]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-semibold text-[#9bb0a3] uppercase tracking-widest">Macro Target Ratios</span>
                                        <span className="text-xs font-bold text-[#3cff90]">{lens.calorie_modifier > 0 ? "+" : ""}{lens.calorie_modifier} kcal Mod</span>
                                    </div>
                                    <div className="flex gap-2 h-4 w-full rounded-full overflow-hidden bg-[#102b1e]">
                                        <div className="h-full bg-[#3cff90]" style={{width: `${Math.round(lens.protein_ratio * 100)}%`}}></div>
                                        <div className="h-full bg-[#2db7f2]" style={{width: `${Math.round(lens.carb_ratio * 100)}%`}}></div>
                                        <div className="h-full bg-[#ffb148]" style={{width: `${Math.round(lens.fat_ratio * 100)}%`}}></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#9bb0a3] mb-1">Protein</p>
                                            <p className="text-lg font-black text-[#3cff90]">{Math.round(lens.protein_ratio * 100)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#9bb0a3] mb-1">Carbs</p>
                                            <p className="text-lg font-black text-[#2db7f2]">{Math.round(lens.carb_ratio * 100)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-[#9bb0a3] mb-1">Fats</p>
                                            <p className="text-lg font-black text-[#ffb148]">{Math.round(lens.fat_ratio * 100)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Add New Lens Placeholder */}
                    <div onClick={handeCreateNew} className="rounded-lg p-8 border-2 border-dashed border-primary/10 flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-[#102b1e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl" data-icon="add_circle">add_circle</span>
                        </div>
                        <span className="font-bold uppercase text-xs tracking-[0.2em] text-[#9bb0a3]">Add Vision Template</span>
                    </div>
                </div>

                {/* Dashboard Stats Bar */}
                <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#0c2419] rounded-lg p-6 border border-white/5">
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Deployments</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#3cff90]">12.4k</span>
                            <span className="text-xs text-[#3cff90]/60">+12%</span>
                        </div>
                    </div>
                    <div className="bg-[#0c2419] rounded-lg p-6 border border-white/5">
                        <p className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Active Users</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#2db7f2]">8,102</span>
                            <span className="text-xs text-[#2db7f2]/60">Live</span>
                        </div>
                    </div>
                    <div className="bg-[#0c2419] rounded-lg p-6 border border-white/5">
                        <p className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Recognition Accuracy</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#e6fced]">98.2%</span>
                            <span className="text-xs text-[#3cff90]/60">Optimal</span>
                        </div>
                    </div>
                    <div className="bg-[#0c2419] rounded-lg p-6 border border-white/5">
                        <p className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Compute Load</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-[#ffb148]">42ms</span>
                            <span className="text-xs text-[#ffb148]/60">Fast</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
        
        {/* Floating Action Button */}
        <button className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-[#3cff90] to-primary-container text-[#004f26] rounded-full shadow-[0_0_30px_rgba(60,255,144,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
            <span className="material-symbols-outlined text-3xl font-bold" data-icon="bolt">bolt</span>
        </button>

        {/* Modal Editor */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                <div className="bg-[#04170e] border border-[#3cff90]/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-xl font-bold">{editingLens ? "Edit System Lens" : "Create New Lens"}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-[#9bb0a3] hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Lens Name</label>
                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-[#102b1e] border border-white/5 rounded-lg px-4 py-3 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90] focus:outline-none" placeholder="e.g. Keto Shred" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Icon (Material Sym)</label>
                                <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} type="text" className="w-full bg-[#102b1e] border border-white/5 rounded-lg px-4 py-3 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90] focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Calorie Mod (kcal)</label>
                                <input value={formData.calorie_modifier} onChange={e => setFormData({...formData, calorie_modifier: parseFloat(e.target.value)})} type="number" className="w-full bg-[#102b1e] border border-white/5 rounded-lg px-4 py-3 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90] focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#9bb0a3] uppercase tracking-widest mb-2">Macros (Protein / Carbs / Fats)</label>
                            <div className="grid grid-cols-3 gap-2">
                                <input value={formData.protein_ratio} onChange={e => setFormData({...formData, protein_ratio: parseFloat(e.target.value)})} type="number" step="0.05" className="w-full bg-[#102b1e] border border-white/5 rounded-lg px-2 py-2 text-center text-[#3cff90] font-bold focus:outline-none" title="Protein" />
                                <input value={formData.carb_ratio} onChange={e => setFormData({...formData, carb_ratio: parseFloat(e.target.value)})} type="number" step="0.05" className="w-full bg-[#102b1e] border border-white/5 rounded-lg px-2 py-2 text-center text-[#2db7f2] font-bold focus:outline-none" title="Carbs" />
                                <input value={formData.fat_ratio} onChange={e => setFormData({...formData, fat_ratio: parseFloat(e.target.value)})} type="number" step="0.05" className="w-full bg-[#102b1e] border border-white/5 rounded-lg px-2 py-2 text-center text-[#ffb148] font-bold focus:outline-none" title="Fats" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-[#021109] flex justify-end gap-3 border-t border-white/5">
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-full font-bold text-[#9bb0a3] hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-full font-bold bg-[#3cff90] text-[#004f26] shadow-[0_0_15px_rgba(60,255,144,0.3)] hover:scale-105 active:scale-95 transition-all">
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
