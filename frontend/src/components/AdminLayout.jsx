import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Admin.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Analytics', path: '/admin/analytics', icon: 'monitoring' },
    { name: 'Users', path: '/admin/users', icon: 'group' },
    { name: 'Lenses', path: '/admin/lenses', icon: 'filter_center_focus' },
    { name: 'Food Database', path: '/admin/products', icon: 'database' },
    { name: 'AI Insights', path: '/admin/ai', icon: 'psychology' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
  ];

  const adminProfile = {
    name: 'Georgin',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' 
  };

  return (
    <div className="admin-dashboard-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo-container">
          <div className="admin-logo-icon">
            <span className="material-symbols-outlined text-3xl">accessibility_new</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">NutriLens</h1>
        </div>

        <nav className="flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${currentPath === item.path ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <Link to="/" className="admin-nav-item mt-auto text-rose-500 hover:bg-rose-500/10">
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </Link>
      </aside>

      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-search-bar">
          <span className="material-symbols-outlined text-on-surface-variant/50">search</span>
          <input 
            type="text" 
            placeholder="Search system metrics..." 
            className="admin-search-input"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="text-admin-text-muted hover:text-admin-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <div className="admin-profile-pill">
            <div className="admin-profile-info">
              <p className="admin-profile-name">{adminProfile.name}</p>
              <p className="admin-profile-role">{adminProfile.role}</p>
            </div>
            <div className="admin-avatar-icon">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
