import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminLenses() {
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLens, setEditingLens] = useState(null);
  
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
          fetchData();
      } catch (error) {
          console.error("Failed to save lens:", error);
      }
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation();
      if (window.confirm("Delete this vision template?")) {
          try {
              await api.deleteAdminLens(id);
              fetchData();
          } catch (error) {
               console.error("Deletion failed:", error);
          }
      }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Lens Configuration</h1>
          <p className="text-admin-text-muted font-medium max-w-xl">
            Configure bioluminescent vision layers. Each lens recalibrates the AI's food recognition priority.
          </p>
        </div>
        <button onClick={handeCreateNew} className="btn-admin-primary flex items-center gap-2">
          <span className="material-symbols-outlined">add_circle</span>
          Create New Lens
        </button>
      </div>

      {/* Lens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-admin-primary text-5xl">sync</span>
          </div>
        ) : (
          lenses.map((lens) => (
            <div 
              key={lens.id} 
              onClick={() => handleEdit(lens)}
              className="clay-card-admin p-8 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-admin-primary/10 flex items-center justify-center text-admin-primary border border-admin-primary/20 group-hover:shadow-[0_0_20px_var(--admin-primary-glow)] transition-all">
                    <span className="material-symbols-outlined text-3xl">{lens.icon || 'visibility'}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{lens.name}</h3>
                    <span className="text-[10px] font-black text-admin-primary uppercase tracking-widest">{lens.theme_color} Theme</span>
                  </div>
                </div>
                <button onClick={(e) => handleDelete(e, lens.id)} className="text-rose-500/40 hover:text-rose-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-admin-text-muted mb-2 tracking-widest">
                    <span>Macro Focus</span>
                    <span className="text-admin-primary">{lens.calorie_modifier > 0 ? "+" : ""}{lens.calorie_modifier} kcal Target</span>
                  </div>
                  <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden bg-admin-bg-dark">
                    <div className="h-full bg-admin-primary" style={{ width: `${lens.protein_ratio * 100}%` }}></div>
                    <div className="h-full bg-blue-400" style={{ width: `${lens.carb_ratio * 100}%` }}></div>
                    <div className="h-full bg-amber-400" style={{ width: `${lens.fat_ratio * 100}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-admin-bg-dark/30 rounded-xl border border-admin-border/5">
                    <p className="text-[10px] font-black text-admin-text-muted uppercase mb-1">PRO</p>
                    <p className="text-lg font-black text-white">{Math.round(lens.protein_ratio * 100)}%</p>
                  </div>
                  <div className="text-center p-3 bg-admin-bg-dark/30 rounded-xl border border-admin-border/5">
                    <p className="text-[10px] font-black text-admin-text-muted uppercase mb-1">CARB</p>
                    <p className="text-lg font-black text-white">{Math.round(lens.carb_ratio * 100)}%</p>
                  </div>
                  <div className="text-center p-3 bg-admin-bg-dark/30 rounded-xl border border-admin-border/5">
                    <p className="text-[10px] font-black text-admin-text-muted uppercase mb-1">FAT</p>
                    <p className="text-lg font-black text-white">{Math.round(lens.fat_ratio * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div 
          onClick={handeCreateNew}
          className="border-2 border-dashed border-admin-border/20 rounded-3xl p-8 flex flex-col items-center justify-center text-admin-text-muted hover:bg-admin-primary/5 hover:border-admin-primary/40 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-admin-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">add_circle</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy New Template</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-admin-bg-dark/80 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-fade-in">
          <div className="clay-card-admin w-full max-w-xl overflow-hidden">
            <div className="p-8 border-b border-admin-border flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white">{editingLens ? "Refine Lens" : "Deploy Lens"}</h3>
                <p className="text-xs text-admin-text-muted font-bold tracking-widest uppercase">Configuration Protocol</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-admin-text-muted hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest mb-2 block">Canonical Name</label>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    type="text" 
                    className="w-full bg-admin-bg-dark/50 border border-admin-border rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-admin-primary"
                    placeholder="e.g. Muscle Peak"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest mb-2 block">Symbol Icon</label>
                  <input 
                    value={formData.icon} 
                    onChange={e => setFormData({...formData, icon: e.target.value})} 
                    type="text" 
                    className="w-full bg-admin-bg-dark/50 border border-admin-border rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-admin-primary font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest mb-2 block">Energy Offset (kcal)</label>
                  <input 
                    value={formData.calorie_modifier} 
                    onChange={e => setFormData({...formData, calorie_modifier: parseFloat(e.target.value)})} 
                    type="number" 
                    className="w-full bg-admin-bg-dark/50 border border-admin-border rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-admin-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest mb-4 block">Macro Synthesis Ratio (Total must be 1.0)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center">
                    <p className="text-[10px] font-black text-admin-primary mb-2">PROTEIN</p>
                    <input 
                      value={formData.protein_ratio} 
                      onChange={e => setFormData({...formData, protein_ratio: parseFloat(e.target.value)})} 
                      type="number" step="0.05"
                      className="bg-transparent w-full text-center text-xl font-black text-white focus:outline-none"
                    />
                  </div>
                  <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center">
                    <p className="text-[10px] font-black text-blue-400 mb-2">CARBS</p>
                    <input 
                      value={formData.carb_ratio} 
                      onChange={e => setFormData({...formData, carb_ratio: parseFloat(e.target.value)})} 
                      type="number" step="0.05"
                      className="bg-transparent w-full text-center text-xl font-black text-white focus:outline-none"
                    />
                  </div>
                  <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center">
                    <p className="text-[10px] font-black text-amber-400 mb-2">FATS</p>
                    <input 
                      value={formData.fat_ratio} 
                      onChange={e => setFormData({...formData, fat_ratio: parseFloat(e.target.value)})} 
                      type="number" step="0.05"
                      className="bg-transparent w-full text-center text-xl font-black text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-admin-bg-dark/50 flex justify-end gap-4 border-t border-admin-border">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-3 rounded-xl font-black text-[10px] uppercase text-admin-text-muted hover:text-white transition-all"
              >
                Abort Changes
              </button>
              <button 
                onClick={handleSave} 
                className="btn-admin-primary text-[10px] uppercase tracking-widest"
              >
                Commit Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
