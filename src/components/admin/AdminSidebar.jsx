import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, Menu, X, LayoutDashboard, Pill, Package, 
  ArrowUpDown, Bell, Users, ChevronRight, LogOut 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import clsx from 'clsx';

export default function AdminSidebar({ alertCount = 0 }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Medicines', path: '/admin/medicines', icon: Pill },
    { title: 'Inventory', path: '/admin/inventory', icon: Package },
    { title: 'Movements', path: '/admin/movements', icon: ArrowUpDown },
    { title: 'Alerts',    path: '/admin/alerts',    icon: Bell, badge: true },
    { title: 'Users',     path: '/admin/users',     icon: Users },
  ];

  return (
    <aside 
      className={clsx(
        "h-screen bg-dark-900 border-r border-dark-700 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className={clsx("flex items-center h-16 border-b border-dark-800 px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-brand-500" />
            <div className="flex flex-col">
              <span className="font-bold text-gradient-brand leading-tight">RxPulse</span>
              <span className="text-[10px] text-dark-400 font-medium">Admin Panel</span>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Version Badge (Expanded only) */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-dark-800">
          <div className="bg-fresh-500/10 border border-fresh-500/20 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse"></div>
              <span className="font-mono text-xs text-fresh-400 font-semibold">v1.0.0</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-fresh-500 tracking-wider">Green Active</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
          const showBadge = item.badge && alertCount > 0;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.title : undefined}
              className={clsx(
                "flex items-center rounded-xl transition-all duration-200 relative group",
                collapsed ? "justify-center p-3" : "px-3 py-2.5 gap-3",
                isActive 
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/25 shadow-inner" 
                  : "text-dark-400 hover:text-dark-100 hover:bg-dark-800 border border-transparent"
              )}
            >
              <item.icon size={20} className={isActive ? "text-brand-400" : "text-dark-400 group-hover:text-dark-200"} />
              
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.title}</span>
                  {showBadge && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {alertCount > 99 ? '99+' : alertCount}
                    </span>
                  )}
                  {isActive && <ChevronRight size={16} className="text-brand-500/50" />}
                </>
              )}

              {/* Collapsed Badge Dot */}
              {collapsed && showBadge && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User & Actions */}
      <div className="p-3 border-t border-dark-800">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl border border-dark-700 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">{user.name}</span>
              <span className="text-[10px] text-dark-400 capitalize">{user.role}</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={clsx(
            "flex items-center rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full group",
            collapsed ? "justify-center p-3" : "px-4 py-3 gap-3"
          )}
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          {!collapsed && <span className="text-sm font-bold">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
