import { useEffect, useState } from 'react';
import { Pill, Package, Bell, Activity, Users, TrendingUp, RefreshCw } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import AlertCard from '../../components/admin/AlertCard';
import StockBarChart from '../../components/charts/StockBarChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';

import { getMedicines, getCategories } from '../../api/catalogApi';
import { getStocks, getActiveAlerts, resolveAlert } from '../../api/inventoryApi';
import { getAllUsers } from '../../api/authApi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [medRes, stockRes, alertRes, userRes, catRes] = await Promise.all([
        getMedicines(),
        getStocks(),
        getActiveAlerts(),
        getAllUsers().catch(() => ({ data: { data: [] } })), // fallback if auth fails
        getCategories().catch(() => ({ data: { data: [] } }))
      ]);

      const extract = (res, key) => {
        const d = res?.data?.data;
        if (Array.isArray(d)) return d;
        if (d && Array.isArray(d[key])) return d[key];
        return [];
      };

      setMedicines(extract(medRes, 'medicines'));
      setStocks(extract(stockRes, 'stocks'));
      setAlerts(extract(alertRes, 'alerts'));
      setUsers(extract(userRes, 'users') || extract(userRes, 'data'));
      setCategories(extract(catRes, 'categories') || extract(catRes, 'data'));

    } catch (e) {
      console.error('Dashboard fetch error:', e.message);
      toast.error('Failed to load some dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      toast.success('Alert resolved');
      fetchAll(true);
    } catch (e) {
      toast.error('Failed to resolve alert');
    }
  };

  // Calculations
  const totalMedicines = medicines.length;
  const activeMedicines = medicines.filter(m => m.isActive).length;
  
  const totalStock = stocks.reduce((sum, s) => sum + (s.currentQuantity || 0), 0);
  const lowStockCount = stocks.filter(s => s.isLowStock).length;
  const outOfStockCount = stocks.filter(s => s.currentQuantity === 0).length;
  
  const activeAlerts = alerts.length;
  const totalUsers = users.length || 0;
  const totalCategories = categories.length || 0;

  // Chart Data
  const stockChartData = [...stocks]
    .sort((a, b) => (b.currentQuantity || 0) - (a.currentQuantity || 0))
    .slice(0, 8)
    .map(s => ({
      name: s.medicineName ? s.medicineName.substring(0, 12) + (s.medicineName.length > 12 ? '...' : '') : 'Unknown',
      quantity: s.currentQuantity || 0,
      isLowStock: s.isLowStock || false
    }));

  const catMap = {};
  medicines.forEach(m => {
    const c = m.category || 'Uncategorized';
    catMap[c] = (catMap[c] || 0) + 1;
  });
  const catChartData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 font-sans text-dark-100">
      <AdminSidebar alertCount={activeAlerts} />
      
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 border-b border-dark-700/50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(16px)' }}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-sm text-dark-400 font-medium">RxPulse Admin — Real-time overview</p>
          </div>
          <button 
            onClick={() => fetchAll(true)}
            disabled={refreshing || loading}
            className="btn-secondary"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && !refreshing ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
          ) : (
            <>
              {/* 1. Deployment status banner */}
              <div className="card border-l-4 border-l-fresh-500 p-5 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.05) 0%, transparent 100%)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-fresh-500 animate-pulse"></div>
                    <span className="text-lg font-bold text-fresh-300 tracking-tight">v1.0.0 Green — Active & Serving Traffic</span>
                  </div>
                  <p className="text-sm text-dark-400">Promoted from BlueGreen deployment via Argo Rollouts · Previous: v0.0.3</p>
                </div>
                
                <div className="flex items-center gap-6 md:border-l border-dark-700 md:pl-6 w-full md:w-auto">
                  <div>
                    <div className="text-[10px] text-dark-400 uppercase font-semibold mb-0.5">Active Service</div>
                    <div className="text-sm font-mono text-fresh-400">frontend-active</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-dark-400 uppercase font-semibold mb-0.5">Strategy</div>
                    <div className="text-sm font-mono text-brand-400">BlueGreen</div>
                  </div>
                </div>
              </div>

              {/* 2. Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Medicines" value={totalMedicines} subtitle={`${activeMedicines} active`} icon={Pill} color="brand" loading={loading} />
                <StatCard title="Total Stock" value={totalStock} subtitle={`${lowStockCount} low stock`} icon={Package} color="blue" loading={loading} />
                <StatCard title="Active Alerts" value={activeAlerts} subtitle={`${outOfStockCount} out of stock`} icon={Bell} color={activeAlerts > 0 ? 'red' : 'green'} loading={loading} />
                <StatCard title="Total Users" value={totalUsers} subtitle={`${totalCategories} categories`} icon={Users} color="purple" loading={loading} />
              </div>

              {/* 3. Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="card p-5 lg:col-span-3">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20"><Activity size={18} className="text-brand-400" /></div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">Top Stock Levels</h3>
                      <p className="text-xs text-dark-400">Top 8 medicines by quantity</p>
                    </div>
                  </div>
                  <StockBarChart data={stockChartData} />
                </div>
                <div className="card p-5 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20"><TrendingUp size={18} className="text-purple-400" /></div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">By Category</h3>
                      <p className="text-xs text-dark-400">Medicine distribution</p>
                    </div>
                  </div>
                  <CategoryPieChart data={catChartData} />
                </div>
              </div>

              {/* 4. Recent Alerts */}
              {recentAlerts.length > 0 && (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-lg">Recent Alerts</h3>
                    <a href="/admin/alerts" className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">View all →</a>
                  </div>
                  <div className="space-y-3">
                    {recentAlerts.map(alert => (
                      <AlertCard 
                        key={alert._id} 
                        alert={alert} 
                        onResolve={handleResolve} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
