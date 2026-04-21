import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
      if (data.length > 0) {
        fetchUserDetails(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
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
    <div className="bg-surface text-on-surface overflow-hidden h-screen w-full font-body">
      {/* SideNavBar Execution */}
      <nav className="fixed left-0 top-0 h-full w-64 border-r border-[#3cff90]/10 bg-[#021109] shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col py-8 z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[#3cff90]" style={{fontVariationSettings: "'FILL' 1"}}>lens_blur</span>
          </div>
          <div>
            <div className="text-2xl font-black text-[#3cff90]">NutriLens</div>
            <div className="text-[10px] tracking-[0.2em] opacity-60">Admin Console</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-grow">
          <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full transition-all duration-300 ease-in-out" to="/admin/analytics">
            <span className="material-symbols-outlined">monitoring</span>
            <span>Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 bg-[#102b1e] text-[#3cff90] rounded-r-full py-3 px-6 border-l-4 border-[#3cff90] shadow-[inset_0_0_12px_rgba(60,255,144,0.1)] transition-all duration-300 ease-in-out" to="/admin/users">
            <span className="material-symbols-outlined">group</span>
            <span>Users</span>
          </Link>
          <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full transition-all duration-300 ease-in-out" to="/admin/lenses">
            <span className="material-symbols-outlined">visibility</span>
            <span>Lenses</span>
          </Link>
          <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full transition-all duration-300 ease-in-out" to="/admin/products">
            <span className="material-symbols-outlined">database</span>
            <span>Food Database</span>
          </Link>
          <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full transition-all duration-300 ease-in-out" to="/admin/ai">
            <span className="material-symbols-outlined">psychology</span>
            <span>AI Insights</span>
          </Link>
        </div>
        <div className="px-6 mb-8">
          <button className="w-full py-4 bg-gradient-to-br from-primary to-[#006834] text-on-primary font-bold rounded-xl shadow-[0_0_15px_rgba(60,255,144,0.3)] hover:scale-[1.02] transition-transform active:scale-95">
            Generate Report
          </button>
        </div>
        <div className="mt-auto border-t border-outline-variant/10 pt-6">
          <a className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full transition-all duration-300 ease-in-out" href="#">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </a>
          <Link className="flex items-center gap-3 text-[#9bb0a3] py-3 px-6 hover:translate-x-1 transition-transform hover:bg-[#102b1e] hover:text-[#3cff90] rounded-r-full transition-all duration-300 ease-in-out" to="/">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-col ml-64 h-full">
        {/* TopAppBar Execution */}
        <header className="bg-[#04170e] font-['Inter'] font-extrabold tracking-tight shadow-[0_4px_20px_rgba(60,255,144,0.05)] flex justify-between items-center w-full px-8 py-4 z-40 relative">
          <div className="flex items-center gap-8">
            <div className="text-xl font-black text-[#3cff90] uppercase tracking-tighter">NutriLens Admin</div>
            <div className="hidden md:flex items-center bg-surface-container-highest rounded-full px-4 py-2 gap-3 w-96 border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface outline-none" placeholder="Search users by name or lens ID..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <button className="text-[#9bb0a3] hover:bg-[#102b1e] hover:text-[#3cff90] transition-all duration-300 p-2 rounded-full active:scale-95">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="text-[#9bb0a3] hover:bg-[#102b1e] hover:text-[#3cff90] transition-all duration-300 p-2 rounded-full active:scale-95">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <img className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover" alt="Admin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-48fbSF0oZaQmz4taz5bfUmE5MIqlV5NBcEYKB8KKNVPRvK5TKnA2WhmR8ITAEsHaO-g3iMpHbpPcPF8BZ_CuRoPVDCa2NDto4nrXp4u5E2VZVMBIVtwwjsJFWbbAFzpmnlNeCqdBG14zCDmP7G4IoUIFLCQXYksxfscFj3E1b_d0FMB1SnvViLVMK679LNMJVxXkzn4MAP7dEGf3ZYouyJzGh-dn6U42dYmtrR9ELt0PZxQe0C6AJW_eYQDAXnAUHxQ_rlyTFMdC"/>
          </div>
        </header>

        {/* User Management Canvas */}
        <main className="flex-grow p-8 overflow-y-auto bg-[#021109] relative">
          {/* Contextual Breadcrumb/Header */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">User Directory</h1>
              <p className="text-[#9bb0a3] font-medium">Managing <span className="text-primary">1,284 active nodes</span> within the NutriLens ecosystem.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 rounded-full border border-outline-variant text-sm font-semibold hover:bg-[#102b1e] transition-colors text-on-surface">Export CSV</button>
              <button className="px-6 py-2 rounded-full bg-primary text-on-primary text-sm font-bold shadow-lg shadow-primary/10">Add New User</button>
            </div>
          </div>
          
          <div className="flex gap-8 items-start">
            {/* Users Table Section */}
            <div className="flex-grow">
              <div className="bg-[#04170e] rounded-lg overflow-hidden" style={{boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3), inset 2px 2px 4px rgba(60, 255, 144, 0.1), inset -4px -4px 8px rgba(0, 0, 0, 0.5)'}}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#102b1e]/50 border-b border-outline-variant/10">
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#9bb0a3]">Name &amp; Status</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#9bb0a3]">Lens Type</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#9bb0a3]">Last Activity</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#9bb0a3] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {users.map((u) => (
                      <tr 
                        key={u.id}
                        onClick={() => fetchUserDetails(u.id)}
                        className={`hover:bg-[#102b1e] transition-colors group cursor-pointer ${selectedUser?.user?.id === u.id ? 'bg-[#102b1e]/50' : ''}`}
                      >
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt={u.email}/>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#04170e]"></div>
                              </div>
                              <div>
                                <div className="text-on-surface font-bold text-lg">{u.email.split('@')[0]}</div>
                                <div className="text-[#9bb0a3] text-xs">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                              {u.health_goal || "General Health"}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-on-surface font-medium text-sm">Active</div>
                            <div className="text-[#9bb0a3] text-xs">Recently active</div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="material-symbols-outlined text-[#9bb0a3] group-hover:text-primary transition-colors">chevron_right</span>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Details Sidebar */}
            <aside className="w-[400px] shrink-0 sticky top-0">
              <div className="bg-[#102b1e] rounded-lg p-8 border border-primary/5" style={{boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3), inset 2px 2px 4px rgba(60, 255, 144, 0.1), inset -4px -4px 8px rgba(0, 0, 0, 0.5)'}}>
                {selectedUser ? (
                  <>
                    <div className="flex flex-col items-center mb-8">
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary mb-4">
                        <img className="w-full h-full rounded-full object-cover border-4 border-[#102b1e]" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.user.email}`} alt="Details avatar"/>
                      </div>
                      <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">{selectedUser.user.email.split('@')[0]}</h2>
                      <p className="text-primary text-xs font-bold tracking-widest uppercase mt-1">{selectedUser.user.health_goal || "General Health"}</p>
                    </div>

                    {/* Bio-Metrics Section */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-[#04170e] p-4 rounded-xl border border-outline-variant/10">
                        <div className="text-[10px] font-bold text-[#9bb0a3] uppercase mb-1">BMR</div>
                        <div className="text-xl font-black text-on-surface">{selectedUser.user.bmr ? Math.round(selectedUser.user.bmr) : 'N/A'} <span className="text-xs font-normal opacity-40">kcal</span></div>
                      </div>
                      <div className="bg-[#04170e] p-4 rounded-xl border border-outline-variant/10">
                        <div className="text-[10px] font-bold text-[#9bb0a3] uppercase mb-1">TDEE</div>
                        <div className="text-xl font-black text-secondary">{selectedUser.user.tdee ? Math.round(selectedUser.user.tdee) : 'N/A'} <span className="text-xs font-normal opacity-40">kcal</span></div>
                      </div>
                    </div>

                    {/* Activity Log Summary */}
                    <div className="mb-8">
                      <h3 className="text-xs font-bold text-[#9bb0a3] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm">history</span>
                        Recent Log Summary
                      </h3>
                      <div className="space-y-4">
                        {selectedUser.logs && selectedUser.logs.length > 0 ? (
                          selectedUser.logs.slice(-3).map((log, i) => (
                            <div key={log.id} className="flex gap-4">
                              <div className={`w-1 h-full rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}></div>
                              <div>
                                <div className="text-sm font-bold text-on-surface">{log.product_name}</div>
                                <div className="text-xs text-[#9bb0a3]">{Math.round(log.calories)} kcal • {log.protein_g}g Prot</div>
                                <div className="text-[10px] text-primary/60 mt-1">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-[#9bb0a3] italic">No recent logs found.</div>
                        )}
                      </div>
                    </div>
                    <button className="w-full py-4 rounded-xl bg-[#102b1e] border border-primary/20 text-primary font-bold hover:bg-primary hover:text-on-primary transition-all duration-300">
                      Full Activity Report
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-4 text-[#9bb0a3]">account_circle</span>
                    <p className="text-[#9bb0a3]">Select a user to view details</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
