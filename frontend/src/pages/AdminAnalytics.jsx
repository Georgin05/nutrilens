import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    most_used_lens: 'Loading...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminAnalytics();
        setStats({
          total_users: data.total_users || 0,
          active_users: data.active_users || 0,
          most_used_lens: data.most_used_lens || 'None'
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="bg-surface text-on-surface overflow-hidden h-screen w-full">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 w-72 border-r border-[#102b1e] rounded-r-[2rem] bg-[#04170e] shadow-[4px_0px_24px_rgba(2,17,9,0.8)] z-50">
        <div className="px-8 mb-10 flex flex-col gap-1">
          <span className="text-primary font-extrabold text-2xl tracking-tighter">NutriLens</span>
          <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px] text-on-surface-variant">Admin Mode</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {/* Active Tab: Analytics */}
          <Link className="flex items-center gap-4 bg-[#102b1e] text-[#3cff90] rounded-full px-6 py-3 shadow-[inset_2px_2px_4px_rgba(60,255,144,0.1)] hover:scale-[1.02] transition-all duration-300" to="/admin/analytics">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Analytics</span>
          </Link>
          <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/users">
            <span className="material-symbols-outlined">group</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">User Management</span>
          </Link>
          <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/lenses">
            <span className="material-symbols-outlined">filter_center_focus</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Lens Configuration</span>
          </Link>
          <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/products">
            <span className="material-symbols-outlined">database</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Food Database</span>
          </Link>
          <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/meals">
            <span className="material-symbols-outlined">restaurant_menu</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Meal Templates</span>
          </Link>
          <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] hover:bg-[#102b1e]/50 hover:scale-[1.02] transition-all duration-300" to="/admin/ai">
            <span className="material-symbols-outlined">psychology</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">AI Insights</span>
          </Link>
        </nav>
        <div className="px-4 mt-auto space-y-2">
          <button className="w-full mb-4 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm tracking-wide">
            System Status
          </button>
          <a className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Settings</span>
          </a>
          <Link className="flex items-center gap-4 text-[#9bb0a3] px-6 py-3 hover:text-[#3cff90] transition-colors" to="/">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-['Inter'] font-semibold tracking-tight uppercase text-[12px]">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="fixed top-0 right-0 left-72 bottom-0 overflow-y-auto bg-surface">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 left-72 z-40 flex justify-between items-center px-8 h-20 bg-[#021109]/80 backdrop-blur-xl">
          <div className="flex items-center bg-surface-container-highest/50 rounded-full px-4 py-2 w-96 border border-outline-variant/10">
            <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-on-surface-variant/50 text-on-surface" placeholder="Search analytics..." type="text"/>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-[#9bb0a3] hover:text-[#3cff90] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="text-[#9bb0a3] hover:text-[#3cff90] transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface leading-none">Alex Rivera</p>
                <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Admin</p>
              </div>
              <img alt="Admin Profile Avatar" className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADsEOcMWJLWK6hFhTdXoR85DmOUez0jdvV0oO5-Y-Kty-C50cF3HbglHg5Ct2YO1tyPLWnvmhYuuvoh1wMi01-1r2MeLmZsM0W11V1mnE6FIVNa3ZPQu4vtMSDa_tNOCzfwD_LKhY9CnxXoSsVoioZjieGhplxbqOaqffHM6WM4hhiGC4S5MdgQeAuD14YTLRxUi3LLIC3l277GYpjuBWaYqETQwJYFm7mnBvONnPGqKCg9ojpdFATQT1zTS5V6x5NjD8F5VWuSksx"/>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="pt-28 pb-12 px-8">
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-8">System Analytics</h1>
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="clay-card p-6 rounded-lg flex flex-col justify-between" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-primary">group</span>
                </div>
                <span className="text-primary text-xs font-bold flex items-center bg-primary/5 px-2 py-1 rounded-full">+12.5% <span className="material-symbols-outlined text-[14px] ml-1">trending_up</span></span>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Total Users</p>
                <p className="text-3xl font-extrabold text-on-surface">{stats.total_users}</p>
              </div>
            </div>

            <div className="clay-card p-6 rounded-lg flex flex-col justify-between" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <span className="material-symbols-outlined text-secondary">sensors</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse mr-2"></span>
                  <span className="text-secondary text-xs font-bold uppercase">Live</span>
                </div>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Active Users</p>
                <p className="text-3xl font-extrabold text-on-surface">{stats.active_users}</p>
              </div>
            </div>

            <div className="clay-card p-6 rounded-lg flex flex-col justify-between relative overflow-hidden group" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-primary">filter_center_focus</span>
                </div>
                <span className="text-primary text-xs font-bold px-2 py-1 rounded-full border border-primary/20">Top Tier</span>
              </div>
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">Most Used Lens</p>
                <p className="text-2xl font-extrabold text-on-surface">{stats.most_used_lens}</p>
              </div>
            </div>

            <div className="clay-card p-6 rounded-lg flex flex-col justify-between" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                </div>
                <span className="text-primary text-xs font-bold uppercase tracking-tighter">99.9% Uptime</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-1">System Health</p>
                <p className="text-3xl font-extrabold text-on-surface">Good</p>
              </div>
            </div>
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* User Growth Chart */}
            <div className="lg:col-span-2 clay-card p-8 rounded-lg" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">User Growth</h3>
                  <p className="text-sm text-on-surface-variant">Last 30 Days Performance</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-full bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-variant transition-colors">Daily</button>
                  <button className="px-4 py-2 rounded-full bg-primary text-xs font-bold text-on-primary">Weekly</button>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {/* Simulated Chart Bars with Gradient */}
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[40%] hover:h-[45%] transition-all duration-500">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/40 to-primary/0 rounded-t-lg"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[55%] hover:h-[60%] transition-all duration-500">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/40 to-primary/0 rounded-t-lg"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[45%] hover:h-[50%] transition-all duration-500">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/40 to-primary/0 rounded-t-lg"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[70%] hover:h-[75%] transition-all duration-500">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/40 to-primary/0 rounded-t-lg"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[60%] hover:h-[65%] transition-all duration-500">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/40 to-primary/0 rounded-t-lg"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[85%] hover:h-[90%] transition-all duration-500">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/40 to-primary/0 rounded-t-lg"></div>
                </div>
                <div className="w-full bg-primary/10 rounded-t-lg relative group h-[95%] hover:h-[100%] transition-all duration-500 cursor-pointer shadow-[0_0_20px_rgba(60,255,144,0.15)]">
                  <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-lg"></div>
                </div>
              </div>
              <div className="flex justify-between mt-4 px-2">
                <span className="text-[10px] text-on-surface-variant font-bold">MON</span>
                <span className="text-[10px] text-on-surface-variant font-bold">TUE</span>
                <span className="text-[10px] text-on-surface-variant font-bold">WED</span>
                <span className="text-[10px] text-on-surface-variant font-bold">THU</span>
                <span className="text-[10px] text-on-surface-variant font-bold">FRI</span>
                <span className="text-[10px] text-on-surface-variant font-bold">SAT</span>
                <span className="text-[10px] text-primary font-bold">SUN</span>
              </div>
            </div>

            {/* Lens Popularity Distribution */}
            <div className="clay-card p-8 rounded-lg flex flex-col" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <h3 className="text-xl font-bold text-on-surface mb-6">Lens Usage</h3>
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                    <span>Muscle</span>
                    <span className="text-primary">42%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: '42%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                    <span>Weight Loss</span>
                    <span className="text-secondary">28%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{width: '28%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                    <span>Keto Precision</span>
                    <span className="text-tertiary">18%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary" style={{width: '18%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
                    <span>Vegan Bio</span>
                    <span className="text-on-surface-variant">12%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-on-surface-variant" style={{width: '12%'}}></div>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full py-3 rounded-xl border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-variant transition-all">View All Lens Data</button>
            </div>
          </div>

          {/* Bottom Row: Activity & Popular Meals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Activity Heatmap */}
            <div className="clay-card p-8 rounded-lg" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-on-surface">Peak Activity Heatmap</h3>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-surface-container"></span>
                    <span className="text-[10px] uppercase text-on-surface-variant">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-primary"></span>
                    <span className="text-[10px] uppercase text-on-surface-variant">High</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-1.5">
                {/* Heatmap Grid Simulation (4 rows x 12 cols simplified for brevity) */}
                {[
                  [10, 20, 30, 20, 10, 50, 80, 100, 70, 40, 20, 10],
                  [5, 10, 20, 40, 70, 90, 100, 90, 60, 30, 10, 5],
                  [30, 50, 70, 90, 100, 100, 100, 100, 80, 50, 30, 20],
                  [10, 20, 30, 20, 10, 50, 80, 100, 70, 40, 20, 10]
                ].map((row, i) => (
                  <React.Fragment key={i}>
                    {row.map((val, j) => (
                      <div key={j} className={`h-6 rounded-sm bg-primary ${val===100 && i===2 ? 'shadow-[0_0_20px_rgba(60,255,144,0.15)]' : ''}`} style={{opacity: val/100}}></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold">
                <span>12 AM</span>
                <span>4 AM</span>
                <span>8 AM</span>
                <span>12 PM</span>
                <span>4 PM</span>
                <span>8 PM</span>
                <span>11 PM</span>
              </div>
            </div>

            {/* Popular Meals Feed */}
            <div className="clay-card p-8 rounded-lg overflow-hidden" style={{ background: '#102b1e', boxShadow: 'inset 2px 2px 4px rgba(60, 255, 144, 0.05), inset -2px -2px 8px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(2, 17, 9, 0.5)'}}>
              <h3 className="text-xl font-bold text-on-surface mb-6">Trending Meals</h3>
              <div className="space-y-1">
                {/* Meal Item 1 */}
                <div className="flex items-center p-4 rounded-xl hover:bg-surface-variant/50 transition-colors group">
                  <img alt="Quinoa Salad" className="w-12 h-12 rounded-lg bg-surface-container-high p-2 object-cover" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"/>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-on-surface">Avocado Quinoa Power Bowl</p>
                    <p className="text-xs text-on-surface-variant">Logged 12.4k times this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">540 kcal</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">24g Protein</p>
                  </div>
                </div>
                {/* Meal Item 2 */}
                <div className="flex items-center p-4 rounded-xl hover:bg-surface-variant/50 transition-colors">
                  <img alt="Ribeye Steak" className="w-12 h-12 rounded-lg bg-surface-container-high p-2 object-cover" src="https://images.unsplash.com/photo-1579366948929-444eb79881eb?auto=format&fit=crop&q=80&w=200"/>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-on-surface">Grilled Ribeye &amp; Asparagus</p>
                    <p className="text-xs text-on-surface-variant">Logged 8.1k times this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">720 kcal</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">52g Protein</p>
                  </div>
                </div>
                {/* Meal Item 3 */}
                <div className="flex items-center p-4 rounded-xl hover:bg-surface-variant/50 transition-colors">
                  <img alt="Oatmeal" className="w-12 h-12 rounded-lg bg-surface-container-high p-2 object-cover" src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=200"/>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-on-surface">Overnight Protein Oats</p>
                    <p className="text-xs text-on-surface-variant">Logged 7.5k times this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">310 kcal</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">18g Protein</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <button className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">add_chart</span>
      </button>
    </div>
  );
}
