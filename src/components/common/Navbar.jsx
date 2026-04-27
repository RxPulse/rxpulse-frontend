import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Pill, ShoppingCart, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => clsx(
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm",
    isActive ? "bg-brand-500/10 text-brand-400" : "text-dark-300 hover:text-dark-100 hover:bg-dark-800"
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-700/50" style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(20px)' }}>
      <div className="page-container h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-fresh-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Pill size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-gradient-brand">RxPulse</span>
            <div className="flex items-center gap-1.5 -mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-fresh-500 animate-pulse"></div>
              <span className="font-mono text-[10px] text-dark-400 leading-none">v1.0.0</span>
            </div>
          </div>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          {isAdmin && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart Button */}
          {!isAdmin && (
            <Link to="/cart" className="relative p-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-dark-900">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-white leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-dark-400 capitalize leading-tight">{user.role}</span>
                </div>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-xl py-2 animate-slide-up origin-top-right">
                  <div className="px-4 py-3 border-b border-dark-700 mb-2">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-dark-400 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-white">
                      <Shield size={16} className="text-brand-400" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 mt-1">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden md:flex py-2 px-4">
              <User size={18} /> Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-700 animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg">Shop</Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg">
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-dark-800 my-2 pt-2">
                  <div className="px-4 py-3">
                    <p className="text-base font-medium text-white">{user.name}</p>
                    <p className="text-sm text-dark-400">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-base font-medium text-red-400 hover:bg-dark-800 rounded-lg flex items-center gap-2">
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block mt-4 px-4 py-3 text-center text-base font-medium bg-brand-600 text-white rounded-xl">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
