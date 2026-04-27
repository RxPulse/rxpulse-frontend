import { useEffect, useState } from 'react';
import { Search, PackagePlus, PackageMinus, Settings, RefreshCw, X, AlertTriangle, TrendingUp, TrendingDown, Package } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AlertCard from '../../components/admin/AlertCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getStocks, stockIn, stockOut, updateThreshold, getActiveAlerts, resolveAlert } from '../../api/inventoryApi';
import toast from 'react-hot-toast';

export default function ManageInventory() {
  const [stocks, setStocks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  
  const [modal, setModal] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [form, setForm] = useState({ quantity: '', reason: '', supplierName: '', threshold: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [stockRes, alertRes] = await Promise.all([getStocks(), getActiveAlerts()]);
      const stks = stockRes.data?.data?.stocks || stockRes.data?.data || [];
      const alts = alertRes.data?.data?.alerts || alertRes.data?.data || [];
      setStocks(Array.isArray(stks) ? stks : []);
      setAlerts(Array.isArray(alts) ? alts : []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (stock, type) => {
    setSelectedStock(stock);
    setForm({ quantity: '', reason: '', supplierName: '', threshold: stock.threshold?.toString() || '' });
    setModal(type);
  };

  const closeModal = () => { setModal(null); setSelectedStock(null); };

  const canStockIn = (stock) => stock.currentQuantity < stock.threshold;
  const canStockOut = (stock) => stock.currentQuantity > 0 && stock.currentQuantity > stock.threshold;

  const handleStockIn = async (e) => {
    e.preventDefault();
    if (!canStockIn(selectedStock)) {
      toast.error(`Stock is at or above threshold (${selectedStock.threshold}). No restocking needed.`);
      return;
    }
    setSaving(true);
    try {
      await stockIn({
        medicineId: selectedStock.medicineId,
        medicineName: selectedStock.medicineName,
        category: selectedStock.category,
        unit: selectedStock.unit,
        quantity: parseInt(form.quantity),
        reason: form.reason,
        supplierName: form.supplierName,
        batchNumber: '',
      });
      toast.success('Stock added successfully');
      closeModal();
      fetchData(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Error adding stock'); } 
    finally { setSaving(false); }
  };

  const handleStockOut = async (e) => {
    e.preventDefault();
    if (!canStockOut(selectedStock)) {
      toast.error(`Stock is at or below threshold (${selectedStock.threshold}). Cannot dispense.`);
      return;
    }
    const qty = parseInt(form.quantity);
    if (qty > selectedStock.currentQuantity) {
      toast.error(`Cannot dispense ${qty}. Only ${selectedStock.currentQuantity} available.`);
      return;
    }
    setSaving(true);
    try {
      await stockOut({
        medicineId: selectedStock.medicineId,
        medicineName: selectedStock.medicineName,
        quantity: qty,
        reason: form.reason,
      });
      toast.success('Stock removed successfully');
      closeModal();
      fetchData(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Error removing stock'); } 
    finally { setSaving(false); }
  };

  const handleThreshold = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateThreshold(selectedStock._id, { threshold: parseInt(form.threshold) });
      toast.success('Threshold updated');
      closeModal();
      fetchData(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Error updating threshold'); } 
    finally { setSaving(false); }
  };

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
      toast.success('Alert resolved');
      fetchData(true);
    } catch { toast.error('Error resolving alert'); }
  };

  const filtered = stocks.filter((s) => !search || s.medicineName.toLowerCase().includes(search.toLowerCase()));

  const totalItems = stocks.length;
  const lowStockCount = stocks.filter(s => s.isLowStock && s.currentQuantity > 0).length;
  const outOfStockCount = stocks.filter(s => s.currentQuantity === 0).length;

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 font-sans text-dark-100">
      <AdminSidebar alertCount={alerts.length} />
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 border-b border-dark-700/50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(16px)' }}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Inventory</h1>
            <p className="text-sm text-dark-400 font-medium">Monitor and update stock levels</p>
          </div>
          <button onClick={() => fetchData(true)} disabled={refreshing || loading} className="btn-secondary">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-6">
          {loading && !refreshing ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" text="Loading inventory..." /></div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-5 border-brand-500/20 bg-brand-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand-500/10 rounded-lg"><Package size={18} className="text-brand-400" /></div>
                    <span className="font-semibold text-brand-300">Total Items</span>
                  </div>
                  <span className="text-3xl font-black text-white">{totalItems}</span>
                </div>
                <div className="card p-5 border-yellow-500/20 bg-yellow-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg"><AlertTriangle size={18} className="text-yellow-400" /></div>
                    <span className="font-semibold text-yellow-300">Low Stock</span>
                  </div>
                  <span className="text-3xl font-black text-white">{lowStockCount}</span>
                </div>
                <div className="card p-5 border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-500/10 rounded-lg"><PackageMinus size={18} className="text-red-400" /></div>
                    <span className="font-semibold text-red-300">Out of Stock</span>
                  </div>
                  <span className="text-3xl font-black text-white">{outOfStockCount}</span>
                </div>
              </div>

              {/* Active Alerts */}
              {alerts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Active Alerts ({alerts.length})</h3>
                  <div className="space-y-3">
                    {alerts.map((a) => <AlertCard key={a._id} alert={a} onResolve={handleResolve} />)}
                  </div>
                </div>
              )}

              {/* Table Section */}
              <div className="flex-1 flex flex-col">
                <div className="mb-4 max-w-sm relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory..." className="input pl-11 bg-dark-900" />
                </div>

                <div className="table-wrapper flex-1">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Current Qty</th>
                        <th>Threshold</th>
                        <th>Unit</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-10 text-dark-400">No stock records found.</td></tr>
                      ) : filtered.map((s) => {
                        const isOut = s.currentQuantity === 0;
                        return (
                          <tr key={s._id} className={s.isLowStock ? "bg-red-500/5" : ""}>
                            <td>
                              <p className="font-semibold text-white">{s.medicineName}</p>
                              <p className="text-xs text-dark-400 mt-0.5">{s.category}</p>
                            </td>
                            <td>
                              <span className={`text-lg font-bold ${isOut ? 'text-red-500' : s.isLowStock ? 'text-yellow-500' : 'text-white'}`}>
                                {s.currentQuantity}
                              </span>
                            </td>
                            <td className="text-dark-300 font-medium">{s.threshold}</td>
                            <td className="text-xs text-dark-400">{s.unit}</td>
                            <td>
                              {isOut ? <span className="badge-red">Out of Stock</span> : s.isLowStock ? <span className="badge-yellow">Low Stock</span> : <span className="badge-green">OK</span>}
                            </td>
                            <td>
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => openModal(s, 'in')} 
                                  disabled={!canStockIn(s)}
                                  className="p-2 rounded-lg text-fresh-400 hover:bg-fresh-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Stock In"
                                >
                                  <TrendingUp size={18} />
                                </button>
                                <button 
                                  onClick={() => openModal(s, 'out')} 
                                  disabled={!canStockOut(s)}
                                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Stock Out"
                                >
                                  <TrendingDown size={18} />
                                </button>
                                <button 
                                  onClick={() => openModal(s, 'threshold')} 
                                  className="p-2 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors"
                                  title="Update Threshold"
                                >
                                  <Settings size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {modal && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="card bg-dark-900 w-full max-w-sm relative z-10 animate-slide-up shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between p-5 border-b border-dark-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  modal === 'in' ? 'bg-fresh-500/10 border-fresh-500/20 text-fresh-400' :
                  modal === 'out' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  'bg-brand-500/10 border-brand-500/20 text-brand-400'
                }`}>
                  {modal === 'in' ? <PackagePlus size={20} /> : modal === 'out' ? <PackageMinus size={20} /> : <Settings size={20} />}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {modal === 'in' ? 'Stock In' : modal === 'out' ? 'Stock Out' : 'Update Threshold'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-dark-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="p-3 bg-dark-800 rounded-xl border border-dark-700 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-dark-400">Medicine</p>
                  <p className="text-sm font-semibold text-white">{selectedStock.medicineName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-dark-400">Current Qty</p>
                  <p className={`text-sm font-bold ${selectedStock.currentQuantity === 0 ? 'text-red-500' : selectedStock.isLowStock ? 'text-yellow-500' : 'text-fresh-500'}`}>
                    {selectedStock.currentQuantity} {selectedStock.unit}
                  </p>
                </div>
              </div>

              <form id="inventory-form" onSubmit={modal === 'in' ? handleStockIn : modal === 'out' ? handleStockOut : handleThreshold} className="space-y-4">
                
                {modal !== 'threshold' ? (
                  <>
                    <div>
                      <label className="label">Quantity *</label>
                      <input type="number" min="1" max={modal === 'out' ? selectedStock.currentQuantity - selectedStock.threshold : undefined} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input" placeholder="Enter amount" required />
                      {modal === 'out' && (
                        <p className="text-xs text-dark-400 mt-1 mt-1">Max dispensable: {Math.max(0, selectedStock.currentQuantity - selectedStock.threshold)} (keeps threshold safe)</p>
                      )}
                    </div>
                    <div>
                      <label className="label">Reason *</label>
                      <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="input" placeholder={modal === 'in' ? 'e.g. Supplier delivery' : 'e.g. Dispensed'} required />
                    </div>
                    {modal === 'in' && (
                      <div>
                        <label className="label">Supplier Name</label>
                        <input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} className="input" placeholder="Optional" />
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <label className="label">New Threshold *</label>
                    <input type="number" min="1" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} className="input" required />
                    <p className="text-xs text-dark-400 mt-2">Alerts trigger when stock falls below this number.</p>
                  </div>
                )}
              </form>
            </div>

            <div className="p-5 border-t border-dark-800 flex gap-3">
              <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" form="inventory-form" disabled={saving} className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm text-white flex justify-center items-center ${
                modal === 'in' ? 'bg-fresh-600 hover:bg-fresh-500 shadow-lg shadow-fresh-500/20' :
                modal === 'out' ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20' :
                'bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20'
              }`}>
                {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 
                  modal === 'in' ? 'Add Stock' : modal === 'out' ? 'Remove Stock' : 'Update'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
