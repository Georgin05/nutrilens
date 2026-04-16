import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-[#021109]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3cff90] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                        <span className="text-2xl font-extrabold text-[#3cff90] tracking-tighter font-headline">NutriLens</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
                        <a className="text-[#9bb0a3] hover:text-[#3cff90] transition-colors hover:scale-105 transition-transform duration-200" href="#">Features</a>
                        <a className="text-[#9bb0a3] hover:text-[#3cff90] transition-colors hover:scale-105 transition-transform duration-200" href="#">Meal Plans</a>
                        <a className="text-[#9bb0a3] hover:text-[#3cff90] transition-colors hover:scale-105 transition-transform duration-200" href="#">AI Buddy</a>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/admin" title="Admin Panel">
                            <span className="material-symbols-outlined text-[#9bb0a3] cursor-pointer hover:text-[#3cff90] transition-colors">admin_panel_settings</span>
                        </Link>
                        <Link to="/auth">
                            <span className="material-symbols-outlined text-[#9bb0a3] cursor-pointer hover:text-[#3cff90] transition-colors">account_circle</span>
                        </Link>
                        <Link to="/auth">
                            <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-105 active:scale-95 transition-all claymorphic-primary">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Updated Hero Section inspired by IMAGE_13 */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-curve">
                {/* Immersive Background with Grid of Food/Tech items */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30 grayscale-[0.5] contrast-125"></div>
                    <div className="absolute inset-0 hero-bg-overlay"></div>
                    {/* Bioluminescent Glows */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
                    <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter leading-[1.1] mb-8">
                        Precision Nutrition, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed-dim to-secondary">Optimized.</span>
                    </h1>
                    <p className="text-on-surface-variant text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        Scan your meals, track your biometrics, and let NutriLens AI craft a metabolic strategy as unique as your DNA.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/auth">
                            <button className="claymorphic-primary text-on-primary px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-lg shadow-primary/25">
                                Join to Explore
                            </button>
                        </Link>
                        <button className="bg-surface-variant/20 backdrop-blur-md border border-outline-variant/30 text-on-surface px-10 py-5 rounded-full font-bold text-xl hover:bg-surface-variant/40 transition-all group flex items-center gap-2">
                            How it Works
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
                {/* Subtle Gradient transition to next section at the curve */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">Master Your Metabolism</h2>
                    <p className="text-on-surface-variant text-lg">Harness the power of bioluminescent precision tracking.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="claymorphic-card p-8 rounded-lg hover:scale-[1.02] transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Express Scan</h3>
                        <p className="text-on-surface-variant leading-relaxed">
                            Instantly identify ingredients and macros with your camera. No more manual searching through databases.
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="claymorphic-card p-8 rounded-lg hover:scale-[1.02] transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                            <span className="material-symbols-outlined text-secondary text-3xl">smart_toy</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">AI Buddy</h3>
                        <p className="text-on-surface-variant leading-relaxed">
                            Your 24/7 metabolic coach. Ask questions about your progress and get personalized, science-backed advice.
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="claymorphic-card p-8 rounded-lg hover:scale-[1.02] transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-6 group-hover:bg-tertiary/20 transition-colors">
                            <span className="material-symbols-outlined text-tertiary text-3xl">restaurant_menu</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Precision Planning</h3>
                        <p className="text-on-surface-variant leading-relaxed">
                            Automated meal plans and grocery lists tailored specifically to your BMR and activity levels.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-surface-container-low px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                                    <span className="material-symbols-outlined text-primary text-4xl">qr_code_scanner</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</div>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Scan</h4>
                            <p className="text-on-surface-variant">Point your lens at any food or ingredient.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                                    <span className="material-symbols-outlined text-secondary text-4xl">analytics</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">2</div>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Analyze</h4>
                            <p className="text-on-surface-variant">AI breaks down nutrition and impacts on your body.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                                    <span className="material-symbols-outlined text-tertiary text-4xl">trending_up</span>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold">3</div>
                            </div>
                            <h4 className="text-xl font-bold mb-2">Optimize</h4>
                            <p className="text-on-surface-variant">Adjust your plan in real-time for peak performance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Biometric Dashboard Preview */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">Data, But Make It <span className="text-primary">Beautiful.</span></h2>
                        <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                            Experience a dashboard designed for clarity. NutriLens turns complex biometric data into a soft, claymorphic interface that's as intuitive as it is powerful.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-on-surface">Real-time macro feedback rings</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-on-surface">Daily metabolic energy forecast</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-on-surface">Biometric sync with wearables</span>
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        {/* Dashboard Mockup Card */}
                        <div className="claymorphic-card p-10 rounded-lg max-w-md mx-auto relative z-10 border border-outline-variant/10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <p className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-1">Today's Summary</p>
                                    <h5 className="text-2xl font-bold">Vitality Stats</h5>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                                </div>
                            </div>
                            {/* Macro Rings Grid */}
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="flex flex-col items-center">
                                    <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-surface-variant" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                            <circle className="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" strokeWidth="8"></circle>
                                        </svg>
                                        <span className="absolute text-sm font-bold">78%</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase text-on-surface-variant">Protein</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-surface-variant" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                            <circle className="text-secondary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round" strokeWidth="8"></circle>
                                        </svg>
                                        <span className="absolute text-sm font-bold">32%</span>
                                    </div>
                                    <span className="text-xs font-bold uppercase text-on-surface-variant">Carbs</span>
                                </div>
                            </div>
                            {/* Stats Card Small */}
                            <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between mb-4 border border-outline-variant/20">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
                                    <span className="font-bold">Active Burn</span>
                                </div>
                                <span className="text-tertiary font-bold">1,240 kcal</span>
                            </div>
                        </div>
                        {/* Background decorative elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-surface to-surface-container-low text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold font-headline mb-8 tracking-tighter">Your healthiest self is waiting <br /> behind the lens.</h2>
                    <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">Join 50,000+ humans optimizing their biology with NutriLens AI. The best time to start was yesterday. The second best time is now.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/auth">
                            <button className="claymorphic-primary text-on-primary px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform">
                                Join the Waitlist
                            </button>
                        </Link>
                        <button className="bg-surface-bright border border-outline-variant/30 text-on-surface px-10 py-5 rounded-full font-bold text-xl hover:bg-surface-variant transition-all">
                            Explore Plans
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#04170e] w-full py-12 px-8 border-t border-[#102b1e]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-[#3cff90] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                            <span className="text-xl font-bold text-[#3cff90] font-headline">NutriLens</span>
                        </div>
                        <p className="text-[#9bb0a3] text-sm leading-relaxed">Precision nutrition engineered for the future of human performance.</p>
                    </div>
                    <div>
                        <h6 className="text-on-surface font-bold mb-4">Product</h6>
                        <ul className="space-y-3 font-['Inter'] text-sm text-[#9bb0a3]">
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">Features</a></li>
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">App Store</a></li>
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">Play Store</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="text-on-surface font-bold mb-4">Resources</h6>
                        <ul className="space-y-3 font-['Inter'] text-sm text-[#9bb0a3]">
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">Support</a></li>
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">Science</a></li>
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">API</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="text-on-surface font-bold mb-4">Company</h6>
                        <ul className="space-y-3 font-['Inter'] text-sm text-[#9bb0a3]">
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">Privacy</a></li>
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">Terms</a></li>
                            <li><a className="hover:text-[#3cff90] transition-colors" href="#">About Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/10 text-center">
                    <p className="font-['Inter'] text-sm text-[#9bb0a3]">© 2024 NutriLens AI. Harvesting precision nutrition.</p>
                </div>
            </footer>
        </div>
    );
}
