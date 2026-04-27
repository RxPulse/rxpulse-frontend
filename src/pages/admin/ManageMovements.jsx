import { useEffect, useState } from 'react';
import { Search, RefreshCw, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getMovements } from '../../api/inventoryApi';
import toast from 'react-hot-toast';

export default function ManageMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchMovements = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getMovements();
      const data = res.data?.data;
      const movs = Array.isArray(data) ? data : Array.isArray(data?.movements) ? data.movements : [];
      // Sort by date descending
      movs.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
      setMovements(movs);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load stock movements');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMovements(); }, []);

  const filtered = movements.filter((m) => {
    const matchSearch = !search || 
      m.medicineName.toLowerCase().includes(search.toLowerCase()) || 
      (m.reason && m.reason.toLowerCase().includes(search.toLowerCase())) ||
      (m.supplierName && m.supplierName.toLowerCase().includes(search.toLowerCase()));
    
    const matchType = typeFilter === 'ALL' || m.type === typeFilter;
    
    return matchSearch && matchType;
  });

  const inCount = movements.filter((m) => m.type === 'STOCK_IN').length;
  const outCount = movements.filter((m) => m.type === 'STOCK_OUT').length;

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 font-sans text-dark-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 border-b border-dark-700/50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(16px)' }}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Stock Movements</h1>
            <p className="text-sm text-dark-400 font-medium">Complete history of all inventory changes</p>
          </div>
          <button onClick={() => fetchMovements(true)} disabled={refreshing || loading} className="btn-secondary">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-6">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search by medicine, reason or supplier..." 
                className="input pl-11 bg-dark-900" 
              />
            </div>
            
            <div className="flex bg-dark-900 border border-dark-700 rounded-xl p-1 overflow-hidden">
              {['ALL', 'STOCK_IN', 'STOCK_OUT'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    typeFilter === f 
                      ? 'bg-dark-700 text-white shadow-sm border border-dark-600' 
                      : 'text-dark-400 hover:text-white border border-transparent'
                  }`}
                >
                  {f === 'ALL' ? `All (${movements.length})` : f === 'STOCK_IN' ? `Stock In (${inCount})` : `Stock Out (${outCount})`}
                </button>
              ))}
            </div>
          </div>

          {loading && !refreshing ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" text="Loading movements..." /></div>
          ) : (
            <div className="table-wrapper flex-1">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Supplier / Ref</th>
                    <th>Performed By</th>
                    <th className="text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-20 bg-dark-900/50">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                            <ArrowUpDown size={24} className="text-dark-500" />
                          </div>
                          <p className="text-lg font-bold text-white mb-1">No movements found</p>
                          <p className="text-dark-400 text-sm">Adjust your filters or search query.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m) => (
                      <tr key={m._id} className="hover:bg-dark-900/50 transition-colors">
                        <td className="font-semibold text-white">
                          {m.medicineName}
                        </td>
                        <td>
                          {m.type === 'STOCK_IN' ? (
                            <span className="badge-green flex items-center gap-1 w-fit"><TrendingUp size={12} /> Stock In</span>
                          ) : (
                            <span className="badge-red flex items-center gap-1 w-fit"><TrendingDown size={12} /> Stock Out</span>
                          )}
                        </td>
                        <td>
                          <span className={`text-lg font-bold ${m.type === 'STOCK_IN' ? 'text-fresh-500' : 'text-red-500'}`}>
                            {m.type === 'STOCK_IN' ? '+' : '-'}{m.quantity}
                          </span>
                        </td>
                        <td className="text-dark-200">{m.reason || '—'}</td>
                        <td className="text-dark-300 text-sm">{m.supplierName || '—'}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-[10px] font-bold">
                              {(m.performedByName || 'A').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-dark-200">{m.performedByName || 'Admin'}</span>
                          </div>
                        </td>
                        <td className="text-right">
                          <p className="text-sm font-semibold text-white">
                            {new Date(m.date || m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-dark-400 font-mono">
                            {new Date(m.date || m.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
