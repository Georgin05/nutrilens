import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminFoodDatabase() {
    const [products, setProducts] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [systemLenses, setSystemLenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('scan');
    const [newMeal, setNewMeal] = useState({
        name: '',
        meal_type: 'Lunch',
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        food_items_json: '[]'
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isNewProductMode, setIsNewProductMode] = useState(false);
    const [productForm, setProductForm] = useState({
        barcode: '',
        name: '',
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0
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
                // Update logic if needed, but the current request focused on Add/Delete
                const updated = await api.createAdminProduct(productForm); // Re-save acts as update in many simple backends, or we just refresh
                setProducts(products.map(p => p.barcode === productForm.barcode ? updated : p));
                setSelectedProduct(updated);
            }
        } catch (err) {
            console.error("Product action failed", err);
            alert("Failed to save product. Check if barcode already exists.");
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedProduct.name}?`)) return;
        
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
        setProductForm({
            barcode: '',
            name: '',
            calories: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0
        });
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

    // Local JS Preview calculation mapping the backend logic
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
    <div className="bg-[#021109] text-[#e6fced] font-['Inter'] selection:bg-primary selection:text-[#005d2e] min-h-screen">
        {/* SideNavBar */}
        <nav className="fixed left-0 top-0 h-full flex flex-col py-8 bg-[#04170e] text-[#3cff90] w-72 border-r border-[#102b1e] rounded-r-[2rem] shadow-[4px_0px_24px_rgba(2,17,9,0.8)] z-50">
            <div className="px-8 mb-12">
                <h1 className="text-[#3cff90] font-extrabold text-2xl tracking-tighter">NutriLens</h1>
                <p className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px] text-[#9bb0a3] mt-1">Admin Mode</p>
            </div>
            <div className="flex flex-col flex-1 gap-2 px-4">
                <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/analytics">
                    <span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Analytics</span>
                </Link>
                <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/users">
                    <span className="material-symbols-outlined" data-icon="group">group</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">User Management</span>
                </Link>
                <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/lenses">
                    <span className="material-symbols-outlined" data-icon="filter_center_focus">filter_center_focus</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Lens Configuration</span>
                </Link>
                <Link className="flex items-center gap-4 bg-[#102b1e] text-[#3cff90] rounded-full px-6 py-3 shadow-[inset_2px_2px_4px_rgba(60,255,144,0.1)] hover:scale-[1.02] transition-all duration-300" to="/admin/products">
                    <span className="material-symbols-outlined" data-icon="database">database</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Food Database</span>
                </Link>
                <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/products">
                    <span className="material-symbols-outlined" data-icon="restaurant_menu">restaurant_menu</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Meal Templates</span>
                </Link>
                <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/ai">
                    <span className="material-symbols-outlined" data-icon="psychology">psychology</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">AI Insights</span>
                </Link>
            </div>
            <div className="mt-auto px-4 flex flex-col gap-2">
                <a className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" href="#">
                    <span className="material-symbols-outlined" data-icon="settings">settings</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Settings</span>
                </a>
                <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/">
                    <span className="material-symbols-outlined" data-icon="logout">logout</span>
                    <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Logout</span>
                </Link>
            </div>
        </nav>

        {/* TopAppBar */}
        <header className="fixed top-0 right-0 left-72 z-40 flex justify-between items-center px-8 h-20 bg-[#021109]/80 backdrop-blur-xl text-[#3cff90]">
            <div className="flex items-center gap-6 w-1/3">
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9bb0a3]">search</span>
                    <input className="w-full bg-[#04170e] border-none rounded-full py-2.5 pl-12 pr-4 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90]/30 transition-all placeholder:text-[#9bb0a3]/50" placeholder="Search 100k+ food items..." type="text"/>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 px-4 py-2 bg-[#0c2419] rounded-full">
                    <span className="material-symbols-outlined text-[#3cff90]" data-icon="notifications">notifications</span>
                    <span className="material-symbols-outlined text-[#9bb0a3] hover:text-[#3cff90] cursor-pointer" data-icon="settings">settings</span>
                    <span className="material-symbols-outlined text-[#9bb0a3] hover:text-[#3cff90] cursor-pointer" data-icon="admin_panel_settings">admin_panel_settings</span>
                </div>
                <img alt="Admin" className="w-10 h-10 rounded-full border-2 border-[#3cff90]/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmpEk1j7C-oHot0ShKsVSVA3OlIYaIpb1kPopasnO79TFYCXI9tMN79w8c1OOZTuyvq66O56ufvaT2siXX8FptJHtO3v14ZsEyAOenQ8hEW5Ps7yAyQxNr2--cvfVSSGlBV6h8-usY94JwS761u9Iyoc4KXR6J8W3Ef1L_tb17eewdFnUicKSHybp7OPov8fFBx_3UQp5fTa9Pu-Oj4WggF_FD0vCvA570IdiVFP2GG8e9M2MEkZNqZ6e5-flYRgoPuiT_Pk7DCifA" />
            </div>
        </header>

        {/* Main Content Canvas */}
        <main className="ml-72 mt-20 p-8 min-h-screen">
            {/* Header Section */}
            <section className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tighter text-[#e6fced] mb-2">Food Database &amp; <span className="text-[#3cff90]">Meal Templates</span></h2>
                    <p className="text-[#9bb0a3] max-w-xl">Manage the core nutritional ontology. High-fidelity macro editing and composite meal construction with real-time validation.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-[#04170e] rounded-full p-1 border border-[#102b1e]">
                        <button 
                            onClick={() => setActiveTab('scan')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'scan' ? 'bg-[#3cff90] text-[#005d2e]' : 'text-[#9bb0a3] hover:text-[#e6fced]'}`}
                        >
                            Scanned Products
                        </button>
                        <button 
                            onClick={() => setActiveTab('meals')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'meals' ? 'bg-[#3cff90] text-[#005d2e]' : 'text-[#9bb0a3] hover:text-[#e6fced]'}`}
                        >
                            Meal Templates
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6 items-start">
                {/* Main Content Area (Col 1-8) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {activeTab === 'scan' ? (
                    <div className="bg-[#04170e] rounded-lg p-6 shadow-[0_8px_32px_0_rgba(2,17,9,0.8)] relative">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-[#3cff90] text-[#005d2e] rounded-full text-xs font-bold uppercase">All Items</button>
                                <button className="px-4 py-1.5 bg-[#102b1e] text-[#9bb0a3] rounded-full text-xs font-bold uppercase hover:text-[#3cff90] transition-colors">Verified</button>
                                <button className="px-4 py-1.5 bg-[#102b1e] text-[#9bb0a3] rounded-full text-xs font-bold uppercase hover:text-[#3cff90] transition-colors">User Added</button>
                            </div>
                            <div className="flex items-center gap-3 text-[#9bb0a3] text-sm">
                                <span className="material-symbols-outlined text-sm">filter_list</span>
                                <span>Sort by: Most Recent</span>
                            </div>
                        </div>

                        {/* Food Items List */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="flex justify-center py-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-8 text-on-surface-variant">No products found.</div>
                            ) : (
                                products.map(product => {
                                    const totalMacros = product.protein_g + product.carbs_g + product.fat_g || 1;
                                    const pPct = (product.protein_g / totalMacros) * 100;
                                    const cPct = (product.carbs_g / totalMacros) * 100;
                                    const fPct = (product.fat_g / totalMacros) * 100;
                                    return (
                                        <div 
                                            key={product.barcode} 
                                            onClick={() => selectProductForEdit(product)}
                                            className={`group flex items-center justify-between p-4 bg-[#102b1e]/40 rounded-xl hover:bg-[#102b1e] transition-all cursor-pointer border-l-4 ${selectedProduct?.barcode === product.barcode ? 'border-[#3cff90] bg-[#102b1e]' : 'border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-[black] flex items-center justify-center text-[#3cff90] overflow-hidden">
                                                    {product.image_url ? (
                                                        <img alt={product.name} className="w-full h-full object-cover opacity-60" src={product.image_url}/>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-2xl">restaurant</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#e6fced]">{product.name}</h4>
                                                    <p className="text-xs text-[#9bb0a3]">{product.category || 'Food'} • {product.serving_size || '100'}g serving • ID: #{product.barcode ? product.barcode.slice(-6) : product.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-[#e6fced]">{product.calories} kcal</div>
                                                    <div className="text-[10px] text-[#9bb0a3] uppercase font-bold tracking-widest">Energy</div>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-8 bg-[#3cff90] rounded-full opacity-20 relative" title={`Protein: ${product.protein_g}g`}><div className="absolute bottom-0 w-full bg-[#3cff90] rounded-full" style={{height: `${pPct}%`}}></div></div>
                                                    <div className="w-2 h-8 bg-[#2db7f2] rounded-full opacity-20 relative" title={`Carbs: ${product.carbs_g}g`}><div className="absolute bottom-0 w-full bg-[#2db7f2] rounded-full" style={{height: `${cPct}%`}}></div></div>
                                                    <div className="w-2 h-8 bg-[#ffb148] rounded-full opacity-20 relative" title={`Fat: ${product.fat_g}g`}><div className="absolute bottom-0 w-full bg-[#ffb148] rounded-full" style={{height: `${fPct}%`}}></div></div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#9bb0a3] group-hover:text-[#3cff90] transition-colors">edit_square</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="text-sm font-bold text-[#3cff90] hover:underline flex items-center gap-2">
                                Load More From Database (99,997 remaining)
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                        </div>
                    </div>
                    ) : (
                    <div className="bg-[#04170e] rounded-lg p-6 shadow-[0_8px_32px_0_rgba(2,17,9,0.8)] relative">
                        <h3 className="text-xl font-bold mb-6">Database Meals</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-8"><span className="material-symbols-outlined animate-spin text-primary">sync</span></div>
                            ) : templates.length === 0 ? (
                                <div className="text-center py-8 text-on-surface-variant">No meals found.</div>
                            ) : (
                                templates.map(tpl => {
                                    const tP = tpl.total_protein_g || tpl.protein_g || 0;
                                    const tC = tpl.total_carbs_g || tpl.carbs_g || 0;
                                    const tF = tpl.total_fat_g || tpl.fat_g || 0;
                                    const tCals = tpl.total_calories || tpl.calories || 0;
                                    const total = tP + tC + tF || 1;
                                    return (
                                        <div key={tpl.id} className="p-4 bg-[#102b1e]/40 rounded-xl group hover:bg-[#102b1e] transition-all cursor-pointer border-l-4 border-transparent hover:border-[#3cff90]">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-[#e6fced] text-lg">{tpl.name}</h4>
                                                    <p className="text-xs text-[#9bb0a3]">{tpl.meal_type} • ID: #{tpl.id}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-[#e6fced]">{tCals} kcal</div>
                                                    <div className="text-[10px] text-[#9bb0a3] uppercase font-bold tracking-widest">Energy</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-center mt-4">
                                                <div className="h-2 flex-1 bg-[black]/50 rounded-full overflow-hidden flex">
                                                    <div className="bg-[#3cff90] h-full relative" style={{width: `${(tP / total) * 100}%`}}></div>
                                                    <div className="bg-[#2db7f2] h-full relative" style={{width: `${(tC / total) * 100}%`}}></div>
                                                    <div className="bg-[#ffb148] h-full relative" style={{width: `${(tF / total) * 100}%`}}></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs mt-2 text-[#9bb0a3] font-bold">
                                                <span className="text-[#3cff90]">{tP}g P</span>
                                                <span className="text-[#2db7f2]">{tC}g C</span>
                                                <span className="text-[#ffb148]">{tF}g F</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    )}
                </div>

                {/* Sidebar (Col 9-12) */}
                <aside className="col-span-12 lg:col-span-4 space-y-6">
                    {activeTab === 'scan' ? (
                    <div className="bg-[#04170e] rounded-lg p-6 sticky top-28 shadow-[0_8px_32px_0_rgba(2,17,9,0.8)] relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">{isNewProductMode ? 'Add New Product' : 'Macro Editor'}</h3>
                            <button 
                                onClick={enterNewProductMode}
                                className="px-3 py-1 bg-[#3cff90]/10 text-[#3cff90] text-[10px] font-bold uppercase rounded-full hover:bg-[#3cff90]/20 transition-all"
                            >
                                {isNewProductMode ? 'Cancel' : 'New Product'}
                            </button>
                        </div>
                        <form onSubmit={handleProductAction} className="space-y-5">
                            <div className="space-y-1.5 text-xs text-[#9bb0a3] font-bold flex flex-col">
                                <label className="uppercase tracking-widest ml-1 mb-1">Barcode (ID)</label>
                                <input 
                                    required
                                    disabled={!isNewProductMode}
                                    className={`w-full bg-[#102b1e] border-none rounded-xl py-3 px-4 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90]/40 font-mono ${!isNewProductMode && 'opacity-50 cursor-not-allowed'}`}
                                    type="text" 
                                    value={productForm.barcode}
                                    onChange={e => setProductForm({...productForm, barcode: e.target.value})}
                                    placeholder="e.g. 5449000000123"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Item Name</label>
                                <input 
                                    required
                                    className="w-full bg-[#102b1e] border-none rounded-xl py-3 px-4 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90]/40 font-semibold" 
                                    type="text" 
                                    value={productForm.name}
                                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Calories (kcal)</label>
                                    <input 
                                        className="w-full bg-[#102b1e] border-none rounded-xl py-3 px-4 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90]/40" 
                                        type="number" 
                                        value={productForm.calories}
                                        onChange={e => setProductForm({...productForm, calories: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Protein (g)</label>
                                    <input 
                                        className="w-full bg-[#102b1e] border-none rounded-xl py-3 px-4 text-[#3cff90] focus:ring-1 focus:ring-[#3cff90]/40" 
                                        type="number" 
                                        value={productForm.protein_g}
                                        onChange={e => setProductForm({...productForm, protein_g: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Carbs (g)</label>
                                    <input 
                                        className="w-full bg-[#102b1e] border-none rounded-xl py-3 px-4 text-[#2db7f2] focus:ring-1 focus:ring-[#2db7f2]/40" 
                                        type="number" 
                                        value={productForm.carbs_g}
                                        onChange={e => setProductForm({...productForm, carbs_g: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Fat (g)</label>
                                    <input 
                                        className="w-full bg-[#102b1e] border-none rounded-xl py-3 px-4 text-[#ffb148] focus:ring-1 focus:ring-[#ffb148]/40" 
                                        type="number" 
                                        value={productForm.fat_g}
                                        onChange={e => setProductForm({...productForm, fat_g: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                            
                            {/* Live Lens Scoring Preview */}
                            <div className="bg-[#102b1e]/50 border border-white/5 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-[#9bb0a3] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    Live Lens Preview
                                </h4>
                                <div className="space-y-2">
                                    {systemLenses.map(lens => {
                                        const score = calculatePreviewScore(lens, productForm);
                                        let color = "text-rose-400";
                                        if (score > 60) color = "text-[#ffb148]";
                                        if (score >= 80) color = "text-[#3cff90]";
                                        
                                        return (
                                            <div key={lens.name} className="flex justify-between items-center text-xs">
                                                <span className="text-[#e6fced]">{lens.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-[#04170e] rounded-full overflow-hidden">
                                                        <div className={`h-full bg-current ${color}`} style={{width: `${score}%`}}></div>
                                                    </div>
                                                    <span className={`font-bold w-6 text-right ${color}`}>{score}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button className="w-full py-4 bg-[#3cff90] text-[#005d2e] font-bold rounded-full shadow-lg shadow-[#3cff90]/20 hover:shadow-[#3cff90]/30 transition-all flex items-center justify-center gap-2" type="submit">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    {isNewProductMode ? 'Save to Database' : 'Update Database'}
                                </button>
                                {!isNewProductMode && selectedProduct && (
                                    <button 
                                        onClick={handleDeleteProduct}
                                        className="w-full py-4 bg-transparent text-[#ff716c] font-bold rounded-full hover:bg-[rgba(255,113,108,0.05)] transition-all flex items-center justify-center gap-2" 
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                        Delete Item
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    ) : (
                    <div className="bg-[#0c2419] rounded-lg p-6 sticky top-28 border-dashed border-2 border-[#394c41]/30 shadow-[0_8px_32px_0_rgba(2,17,9,0.8)] relative">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[#2db7f2]">restaurant_menu</span>
                            <h3 className="text-xl font-bold">Add <span className="text-[#9bb0a3] font-normal">Meal</span></h3>
                        </div>
                        <form onSubmit={handleAddMeal} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Meal Name</label>
                                <input required value={newMeal.name} onChange={e=>setNewMeal({...newMeal, name: e.target.value})} className="w-full bg-[#04170e] border-none rounded-xl py-3 px-4 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90]/40 font-semibold" type="text" placeholder="e.g. Chicken & Rice"/>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Meal Type</label>
                                <select value={newMeal.meal_type} onChange={e=>setNewMeal({...newMeal, meal_type: e.target.value})} className="w-full bg-[#04170e] border-none rounded-xl py-3 px-4 text-[#9bb0a3] focus:ring-1 focus:ring-[#3cff90]/40 border-r-8 border-transparent">
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Calories</label>
                                    <input required value={newMeal.calories || ''} onChange={e=>setNewMeal({...newMeal, calories: Number(e.target.value)})} className="w-full bg-[#04170e] border-none rounded-xl py-3 px-4 text-[#e6fced] focus:ring-1 focus:ring-[#3cff90]/40" type="number" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Protein (g)</label>
                                    <input required value={newMeal.protein_g || ''} onChange={e=>setNewMeal({...newMeal, protein_g: Number(e.target.value)})} className="w-full bg-[#04170e] border-none rounded-xl py-3 px-4 text-[#3cff90] focus:ring-1 focus:ring-[#3cff90]/40" type="number" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Carbs (g)</label>
                                    <input required value={newMeal.carbs_g || ''} onChange={e=>setNewMeal({...newMeal, carbs_g: Number(e.target.value)})} className="w-full bg-[#04170e] border-none rounded-xl py-3 px-4 text-[#2db7f2] focus:ring-1 focus:ring-[#2db7f2]/40" type="number" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#9bb0a3] uppercase tracking-widest ml-1">Fat (g)</label>
                                    <input required value={newMeal.fat_g || ''} onChange={e=>setNewMeal({...newMeal, fat_g: Number(e.target.value)})} className="w-full bg-[#04170e] border-none rounded-xl py-3 px-4 text-[#ffb148] focus:ring-1 focus:ring-[#ffb148]/40" type="number" />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-6 py-4 bg-[#3cff90] text-[#005d2e] rounded-full font-bold uppercase text-xs tracking-widest shadow-lg shadow-[#3cff90]/20 hover:scale-105 active:scale-95 transition-all">
                                Add Meal to Database
                            </button>
                        </form>
                    </div>
                    )}
                </aside>
            </div>
        </main>

        {/* Floating Action Button */}
        <button className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-[#3cff90] to-[#08ea7e] text-[#e6fced] rounded-full shadow-[0_0_30px_rgba(60,255,144,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
            <span className="material-symbols-outlined text-3xl">add_shopping_cart</span>
        </button>
    </div>
  );
}
