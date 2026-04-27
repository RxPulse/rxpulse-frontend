import { useEffect, useState } from 'react';
import { Search, RefreshCw, Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AlertCard from '../../components/admin/AlertCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAlerts, resolveAlert } from '../../api/inventoryApi';
import toast from 'react-hot-toast';

export default function ManageAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');

  const fetchAlerts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getAlerts();
      setAlerts(res.data?.data?.alerts || res.data?.data || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try { 
      await resolveAlert(id); 
      toast.success('Alert resolved successfully'); 
      fetchAlerts(true); 
    } catch { 
      toast.error('Error resolving alert'); 
    } finally {
      setResolvingId(null);
    }
  };

  const filtered = alerts.filter((a) => {
    const matchSearch = !search || a.medicineName.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'All' || a.severity === severityFilter;
    const matchStatus = statusFilter === 'All' || (statusFilter === 'Active' ? !a.isResolved : a.isResolved);
    return matchSearch && matchSeverity && matchStatus;
  });

  const activeAlerts = alerts.filter(a => !a.isResolved);
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = activeAlerts.filter(a => a.severity === 'HIGH').length;
  const mediumCount = activeAlerts.filter(a => a.severity === 'MEDIUM').length;
  const lowCount = activeAlerts.filter(a => a.severity === 'LOW').length;

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 font-sans text-dark-100">
      <AdminSidebar alertCount={activeAlerts.length} />
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 border-b border-dark-700/50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(16px)' }}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Alerts</h1>
            <p className="text-sm text-dark-400 font-medium">Monitor and resolve inventory issues</p>
          </div>
          <button onClick={() => fetchAlerts(true)} disabled={refreshing || loading} className="btn-secondary">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-6">
          {loading && !refreshing ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" text="Loading alerts..." /></div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-4 border-dark-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-dark-800 rounded-lg"><Bell size={16} className="text-dark-300" /></div>
                    <span className="font-semibold text-dark-300">Total Active</span>
                  </div>
                  <span className="text-3xl font-black text-white">{activeAlerts.length}</span>
                </div>
                <div className="card p-4 border-red-500/30 bg-red-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle size={16} className="text-red-400" /></div>
                    <span className="font-semibold text-red-400">Critical</span>
                  </div>
                  <span className="text-3xl font-black text-white">{criticalCount}</span>
                </div>
                <div className="card p-4 border-orange-500/30 bg-orange-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg"><AlertCircle size={16} className="text-orange-400" /></div>
                    <span className="font-semibold text-orange-400">High Priority</span>
                  </div>
                  <span className="text-3xl font-black text-white">{highCount}</span>
                </div>
                <div className="card p-4 border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Info size={16} className="text-blue-400" /></div>
                    <span className="font-semibold text-blue-400">Low Priority</span>
                  </div>
                  <span className="text-3xl font-black text-white">{mediumCount + lowCount}</span>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicine name..." className="input pl-11 bg-dark-900" />
                </div>
                <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="input w-full sm:w-48 bg-dark-900 appearance-none">
                  <option value="All">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-full sm:w-48 bg-dark-900 appearance-none">
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Unresolved</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Grid Content */}
              <div className="flex-1">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-dark-900/50 rounded-2xl border border-dark-800">
                    <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                      <Bell size={24} className="text-dark-500" />
                    </div>
                    <p className="text-lg font-bold text-white mb-2">No alerts found</p>
                    <p className="text-dark-400 text-sm">All clear based on your current filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-8">
                    {filtered.map((alert) => (
                      <AlertCard 
                        key={alert._id} 
                        alert={alert} 
                        onResolve={handleResolve} 
                        resolving={resolvingId === alert._id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
