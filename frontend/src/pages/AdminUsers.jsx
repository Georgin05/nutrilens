import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminUsers();
      setUsers(data);
      if (data.length > 0) {
        fetchUserDetails(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      const data = await api.getAdminUserDetails(id);
      setSelectedUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-160px)]">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">User Directory</h1>
          <p className="text-admin-text-muted font-medium">
            Managing <span className="text-admin-primary">{users.length} active nodes</span> within the NutriLens ecosystem.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl border border-admin-border text-sm font-bold text-admin-text-muted hover:text-admin-primary transition-all">
            Export JSON
          </button>
          <button className="btn-admin-primary">
            Provision User
          </button>
        </div>
      </div>

      <div className="flex gap-8 h-full overflow-hidden">
        {/* User Table Card */}
        <div className="flex-1 clay-card-admin overflow-hidden flex flex-col">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-admin-surface z-10">
                <tr className="border-b border-admin-border">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-admin-text-muted">Node Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-admin-text-muted">Lens Profile</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-admin-text-muted">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-admin-text-muted text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {users.map((u) => (
                  <tr 
                    key={u.id}
                    onClick={() => fetchUserDetails(u.id)}
                    className={`hover:bg-admin-primary/5 cursor-pointer transition-all ${selectedUser?.user?.id === u.id ? 'bg-admin-primary/10' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-admin-primary/10 flex items-center justify-center text-admin-primary font-black border border-admin-primary/20">
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-admin-primary rounded-full border-2 border-admin-bg-dark"></div>
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{u.email.split('@')[0]}</p>
                          <p className="text-[10px] text-admin-text-muted font-bold lowercase">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-admin-surface-light border border-admin-border text-[10px] font-black uppercase tracking-widest text-admin-primary">
                        {u.health_goal || "General"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-admin-primary"></span>
                        <span className="text-[10px] font-black uppercase text-admin-text-muted">Active</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="material-symbols-outlined text-admin-text-muted scale-90 group-hover:scale-110 transition-transform">terminal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Side Panel */}
        <div className="w-96 clay-card-admin p-8 overflow-y-auto custom-scrollbar">
          {selectedUser ? (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-admin-primary to-admin-primary-glow p-1 mb-4">
                  <div className="w-full h-full rounded-2xl bg-admin-bg-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-admin-primary">person</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">{selectedUser.user.email.split('@')[0]}</h2>
                <span className="text-[10px] font-black text-admin-primary uppercase tracking-[0.2em] mt-1">ID: 0x{selectedUser.user.id}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest mb-4">Clinical Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="clay-card-admin p-4 bg-admin-bg-dark/50 border-0 hover:translate-y-0">
                      <p className="text-[10px] font-bold text-admin-text-muted uppercase mb-1">BMR</p>
                      <p className="text-xl font-black text-white">{selectedUser.user.bmr || '---'}</p>
                    </div>
                    <div className="clay-card-admin p-4 bg-admin-bg-dark/50 border-0 hover:translate-y-0">
                      <p className="text-[10px] font-bold text-admin-text-muted uppercase mb-1">TDEE</p>
                      <p className="text-xl font-black text-admin-primary">{selectedUser.user.tdee || '---'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-admin-text-muted uppercase tracking-widest mb-4">Metabolic Activity</h3>
                  <div className="space-y-4">
                    {selectedUser.logs && selectedUser.logs.length > 0 ? (
                      selectedUser.logs.slice(-3).map((log, i) => (
                        <div key={log.id} className="flex gap-4 p-3 bg-admin-bg-dark/30 rounded-xl border border-admin-border/5">
                          <div className="w-1 h-full rounded-full bg-admin-primary"></div>
                          <div className="flex-1">
                            <p className="text-xs font-black text-white">{log.product_name}</p>
                            <div className="flex justify-between mt-1">
                              <span className="text-[10px] font-bold text-admin-text-muted">{Math.round(log.calories)} kcal</span>
                              <span className="text-[10px] font-black text-admin-primary uppercase">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-admin-text-muted italic text-center py-4">No recent activity detected.</p>
                    )}
                  </div>
                </div>
              </div>

              <button className="w-full mt-10 py-4 rounded-xl bg-admin-surface-light border border-admin-border text-admin-primary font-black text-xs uppercase tracking-widest hover:bg-admin-primary hover:text-admin-bg-dark transition-all">
                Access Audit Logs
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <span className="material-symbols-outlined text-4xl mb-4">account_circle_off</span>
              <p className="text-sm font-bold">Select node for telemetry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
