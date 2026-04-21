import React, { useState, useEffect } from 'react';
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
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">System Analytics</h1>
          <p className="text-admin-text-muted font-medium">Real-time performance metrics and user insights.</p>
        </div>
        <button className="btn-admin-primary flex items-center gap-2">
          <span className="material-symbols-outlined">download</span>
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="clay-card-admin p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-admin-primary/10 rounded-xl flex items-center justify-center text-admin-primary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-[10px] font-black bg-admin-primary/20 text-admin-primary px-2 py-1 rounded-full uppercase tracking-widest">Active</span>
          </div>
          <p className="text-admin-text-muted text-[10px] uppercase font-black tracking-widest mb-1">Total Users</p>
          <p className="text-4xl font-black text-white">{stats.total_users}</p>
        </div>

        <div className="clay-card-admin p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-admin-primary rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-admin-primary uppercase tracking-widest">Live</span>
            </div>
          </div>
          <p className="text-admin-text-muted text-[10px] uppercase font-black tracking-widest mb-1">Active Now</p>
          <p className="text-4xl font-black text-white">{stats.active_users}</p>
        </div>

        <div className="clay-card-admin p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined">filter_center_focus</span>
            </div>
          </div>
          <p className="text-admin-text-muted text-[10px] uppercase font-black tracking-widest mb-1">Top Goal</p>
          <p className="text-2xl font-black text-white">{stats.most_used_lens}</p>
        </div>

        <div className="clay-card-admin p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-admin-primary/10 rounded-xl flex items-center justify-center text-admin-primary">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
          </div>
          <p className="text-admin-text-muted text-[10px] uppercase font-black tracking-widest mb-1">System Health</p>
          <p className="text-4xl font-black text-white">99%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart Wrapper */}
        <div className="lg:col-span-2 clay-card-admin p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-white">User Growth Pipeline</h2>
              <p className="text-sm text-admin-text-muted">Conversion metrics for the last 14 days.</p>
            </div>
            <div className="flex bg-admin-bg-dark/50 p-1 rounded-xl border border-admin-border">
              <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase text-admin-primary bg-admin-surface">Weekly</button>
              <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase text-admin-text-muted">Monthly</button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 95, 100, 85, 90].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-admin-primary/20 to-admin-primary/5 rounded-t-lg relative group transition-all duration-500 hover:from-admin-primary/40"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-admin-surface border border-admin-border px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-2 text-[10px] font-black text-admin-text-muted uppercase tracking-tighter">
            <span>Apr 07</span>
            <span>Apr 10</span>
            <span>Apr 13</span>
            <span>Apr 16</span>
            <span>Apr 19</span>
            <span>Today</span>
          </div>
        </div>

        {/* Sidebar Mini List */}
        <div className="clay-card-admin p-8">
          <h2 className="text-xl font-black text-white mb-6">Lens Popularity</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[11px] font-black uppercase mb-2">
                <span>Muscle Build</span>
                <span className="text-admin-primary">42%</span>
              </div>
              <div className="h-1.5 w-full bg-admin-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-admin-primary shadow-[0_0_10px_var(--admin-primary-glow)]" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-black uppercase mb-2 text-admin-text-muted">
                <span>Fat Loss</span>
                <span>28%</span>
              </div>
              <div className="h-1.5 w-full bg-admin-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-admin-text-muted opacity-50" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-black uppercase mb-2 text-admin-text-muted">
                <span>Diabetes Friendly</span>
                <span>18%</span>
              </div>
              <div className="h-1.5 w-full bg-admin-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-admin-text-muted opacity-30" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-admin-border">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Active Alerts</h3>
            <div className="flex items-center gap-3 p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
              <span className="material-symbols-outlined text-rose-500">warning</span>
              <p className="text-[11px] font-bold text-rose-200">High traffic detected on 'Muscle' lens APIs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
