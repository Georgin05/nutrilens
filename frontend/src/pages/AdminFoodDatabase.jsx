import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminFoodDatabase() {
    const [products, setProducts] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [systemLenses, setSystemLenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('scan');
    const [newMeal, setNewMeal] = useState({
        name: '', meal_type: 'Lunch', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, food_items_json: '[]'
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isNewProductMode, setIsNewProductMode] = useState(false);
    const [productForm, setProductForm] = useState({
        barcode: '', name: '', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0
    });

    const handleAddMeal = async (e) => {
        e.preventDefault();
        try {
            const added = await api.createAdminMealTemplate(newMeal);
            setTemplates([...templates, added]);
            setNewMeal({
                name: '', meal_type: 'Lunch', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, food_items_json: '[]'
            });
        } catch (err) {
            console.error("Failed to add meal template", err);
        }
    };

    const handleProductAction = async (e) => {
        e.preventDefault();
        try {
            if (isNewProductMode) {
                const added = await api.createAdminProduct(productForm);
                setProducts([added, ...products]);
                setIsNewProductMode(false);
                setSelectedProduct(added);
            } else if (selectedProduct) {
                const updated = await api.createAdminProduct(productForm); 
                setProducts(products.map(p => p.barcode === productForm.barcode ? updated : p));
                setSelectedProduct(updated);
            }
        } catch (err) {
            console.error("Product action failed", err);
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        if (!window.confirm(`Permanently delete ${selectedProduct.name}?`)) return;
        try {
            await api.deleteAdminProduct(selectedProduct.barcode);
            setProducts(products.filter(p => p.barcode !== selectedProduct.barcode));
            setSelectedProduct(null);
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const selectProductForEdit = (product) => {
        setIsNewProductMode(false);
        setSelectedProduct(product);
        setProductForm({
            barcode: product.barcode,
            name: product.name,
            calories: product.calories || 0,
            protein_g: product.protein_g || 0,
            carbs_g: product.carbs_g || 0,
            fat_g: product.fat_g || 0
        });
    };

    const enterNewProductMode = () => {
        setIsNewProductMode(true);
        setSelectedProduct(null);
        setProductForm({ barcode: '', name: '', calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodsData, mealsData, lensesData] = await Promise.all([
                    api.getAdminProducts(),
                    api.getAdminMeals(),
                    api.getSystemLenses()
                ]);
                setProducts(prodsData || []);
                setTemplates(mealsData || []);
                setSystemLenses(lensesData || []);
            } catch (err) {
                console.error("Failed to fetch food db data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculatePreviewScore = (lens, prodObj) => {
        let score = 100;
        const p = Number(prodObj.protein_g) || 0;
        const c = Number(prodObj.carbs_g) || 0;
        const f = Number(prodObj.fat_g) || 0;
        const total = p + c + f;
        if (total > 0) {
            const pRatio = p / total;
            const cRatio = c / total;
            const fRatio = f / total;
            if (pRatio < lens.protein_ratio * 0.7) score -= 15;
            else if (pRatio >= lens.protein_ratio) score += 10;
            if (cRatio > lens.carb_ratio * 1.5) score -= 10;
            if (fRatio > lens.fat_ratio * 1.5) score -= 10;
        }
        return Math.max(0, Math.min(100, score));
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Food Database</h1>
                    <p className="text-admin-text-muted font-medium">Manage the system's nutritional ontology and meal templates.</p>
                </div>
                <div className="flex bg-admin-surface p-1 rounded-2xl border border-admin-border">
                    <button 
                        onClick={() => setActiveTab('scan')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'scan' ? 'bg-admin-primary text-admin-bg-dark' : 'text-admin-text-muted hover:text-white'}`}
                    >
                        Scanned Items
                    </button>
                    <button 
                        onClick={() => setActiveTab('meals')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'meals' ? 'bg-admin-primary text-admin-bg-dark' : 'text-admin-text-muted hover:text-white'}`}
                    >
                        Meal Templates
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 h-[calc(100vh-280px)]">
                {/* Main List Area */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                    <div className="clay-card-admin flex-1 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-admin-border flex justify-between items-center bg-admin-bg-dark/10">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                {activeTab === 'scan' ? 'Global Food Log' : 'Canonical Meal Library'}
                            </h3>
                            <span className="text-[10px] font-black text-admin-text-muted uppercase">
                                {activeTab === 'scan' ? `${products.length} Items` : `${templates.length} Templates`}
                            </span>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-6 space-y-4">
                            {activeTab === 'scan' ? (
                                products.map(product => {
                                    const total = product.protein_g + product.carbs_g + product.fat_g || 1;
                                    return (
                                        <div 
                                            key={product.barcode} 
                                            onClick={() => selectProductForEdit(product)}
                                            className={`p-4 rounded-2xl border border-admin-border transition-all cursor-pointer flex items-center justify-between group ${selectedProduct?.barcode === product.barcode ? 'bg-admin-primary/10 border-admin-primary/30' : 'hover:bg-admin-surface'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-admin-bg-dark flex items-center justify-center text-admin-primary group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined">restaurant</span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-sm">{product.name}</p>
                                                    <p className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest italic">{product.barcode}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-white">{product.calories} kcal</p>
                                                    <div className="flex gap-1 mt-1 justify-end">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-admin-primary"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-admin-primary opacity-0 group-hover:opacity-100 transition-opacity">edit_square</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                templates.map(tpl => (
                                    <div key={tpl.id} className="p-5 rounded-2xl border border-admin-border hover:bg-admin-surface transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-black text-white text-lg">{tpl.name}</h4>
                                                <span className="text-[10px] font-black text-admin-primary uppercase tracking-widest">{tpl.meal_type}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-white">{tpl.total_calories || tpl.calories} <span className="text-[10px] text-admin-text-muted uppercase">kcal</span></p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase text-admin-text-muted">
                                            <span>{tpl.total_protein_g || tpl.protein_g}g Prot</span>
                                            <span>{tpl.total_carbs_g || tpl.carbs_g}g Carb</span>
                                            <span>{tpl.total_fat_g || tpl.fat_g}g Fat</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Panel */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="clay-card-admin p-8 h-full overflow-y-auto custom-scrollbar">
                        {activeTab === 'scan' ? (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black text-white">{isNewProductMode ? 'Initialize New' : 'Refine Object'}</h3>
                                    <button 
                                        onClick={isNewProductMode ? () => setIsNewProductMode(false) : enterNewProductMode}
                                        className="text-[10px] font-black uppercase text-admin-primary bg-admin-primary/10 px-3 py-1.5 rounded-lg"
                                    >
                                        {isNewProductMode ? 'Abort' : 'Create New'}
                                    </button>
                                </div>
                                <form onSubmit={handleProductAction} className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest block mb-2">Barcode Sequence</label>
                                        <input 
                                            required disabled={!isNewProductMode}
                                            className="w-full bg-admin-bg-dark/50 border border-admin-border rounded-xl px-4 py-4 text-white font-bold font-mono focus:ring-1 focus:ring-admin-primary outline-none disabled:opacity-40"
                                            value={productForm.barcode}
                                            onChange={e => setProductForm({...productForm, barcode: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest block mb-2">Display Name</label>
                                        <input 
                                            required
                                            className="w-full bg-admin-bg-dark/50 border border-admin-border rounded-xl px-4 py-4 text-white font-black focus:ring-1 focus:ring-admin-primary outline-none"
                                            value={productForm.name}
                                            onChange={e => setProductForm({...productForm, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0">
                                            <p className="text-[8px] font-black text-admin-text-muted uppercase mb-1">Calories</p>
                                            <input type="number" value={productForm.calories} onChange={e=>setProductForm({...productForm, calories: Number(e.target.value)})} className="bg-transparent w-full text-lg font-black text-white focus:outline-none" />
                                        </div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0">
                                            <p className="text-[8px] font-black text-admin-primary uppercase mb-1">Protein</p>
                                            <input type="number" value={productForm.protein_g} onChange={e=>setProductForm({...productForm, protein_g: Number(e.target.value)})} className="bg-transparent w-full text-lg font-black text-white focus:outline-none" />
                                        </div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0">
                                            <p className="text-[8px] font-black text-blue-400 uppercase mb-1">Carbs</p>
                                            <input type="number" value={productForm.carbs_g} onChange={e=>setProductForm({...productForm, carbs_g: Number(e.target.value)})} className="bg-transparent w-full text-lg font-black text-white focus:outline-none" />
                                        </div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0">
                                            <p className="text-[8px] font-black text-amber-400 uppercase mb-1">Fat</p>
                                            <input type="number" value={productForm.fat_g} onChange={e=>setProductForm({...productForm, fat_g: Number(e.target.value)})} className="bg-transparent w-full text-lg font-black text-white focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-4">
                                        <button className="btn-admin-primary w-full py-4 uppercase text-[10px] tracking-widest font-black" type="submit">
                                            {isNewProductMode ? 'Commit to Registry' : 'Update Ontology'}
                                        </button>
                                        {!isNewProductMode && selectedProduct && (
                                            <button onClick={handleDeleteProduct} type="button" className="w-full text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/5 py-4 rounded-xl transition-all">
                                                Delete Mapping
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-black text-white mb-8">Architect Meal</h3>
                                <form onSubmit={handleAddMeal} className="space-y-4">
                                    <div>
                                        <input required value={newMeal.name} onChange={e=>setNewMeal({...newMeal, name: e.target.value})} className="w-full bg-admin-bg-dark/50 border border-admin-border rounded-xl px-4 py-4 text-white font-black focus:ring-1 focus:ring-admin-primary outline-none" placeholder="Target Name (e.g. Keto Bowl)"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0 col-span-2">
                                            <p className="text-[8px] font-black text-admin-text-muted uppercase mb-1">Type</p>
                                            <select value={newMeal.meal_type} onChange={e=>setNewMeal({...newMeal, meal_type: e.target.value})} className="bg-transparent w-full text-sm font-black text-white focus:outline-none">
                                                <option value="Breakfast">Breakfast</option><option value="Lunch">Lunch</option><option value="Dinner">Dinner</option><option value="Snack">Snack</option>
                                            </select>
                                        </div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center"><p className="text-[8px] font-black text-admin-text-muted uppercase mb-1">kcal</p><input type="number" required value={newMeal.calories || ''} onChange={e=>setNewMeal({...newMeal, calories: Number(e.target.value)})} className="bg-transparent w-full text-center text-lg font-black text-white outline-none"/></div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center"><p className="text-[8px] font-black text-admin-primary uppercase mb-1">PRO</p><input type="number" required value={newMeal.protein_g || ''} onChange={e=>setNewMeal({...newMeal, protein_g: Number(e.target.value)})} className="bg-transparent w-full text-center text-lg font-black text-white outline-none"/></div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center"><p className="text-[8px] font-black text-blue-400 uppercase mb-1">CARB</p><input type="number" required value={newMeal.carbs_g || ''} onChange={e=>setNewMeal({...newMeal, carbs_g: Number(e.target.value)})} className="bg-transparent w-full text-center text-lg font-black text-white outline-none"/></div>
                                        <div className="clay-card-admin p-4 border-0 hover:translate-y-0 text-center"><p className="text-[8px] font-black text-amber-400 uppercase mb-1">FAT</p><input type="number" required value={newMeal.fat_g || ''} onChange={e=>setNewMeal({...newMeal, fat_g: Number(e.target.value)})} className="bg-transparent w-full text-center text-lg font-black text-white outline-none"/></div>
                                    </div>
                                    <button type="submit" className="btn-admin-primary w-full py-4 uppercase text-[10px] tracking-widest font-black mt-6">
                                        Synthesize Template
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
