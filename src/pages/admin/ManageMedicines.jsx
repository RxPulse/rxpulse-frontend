import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Pill, RefreshCw } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getMedicines, getCategories, createMedicine, updateMedicine, deleteMedicine } from '../../api/catalogApi';
import toast from 'react-hot-toast';

const EMPTY = { 
  name: '', genericName: '', manufacturer: '', category: '', 
  batchNumber: '', expiryDate: '', unitPrice: '', unit: 'tablets', 
  requiresPrescription: false, isActive: true, description: '', imageUrl: '' 
};

export default function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [medRes, catRes] = await Promise.all([getMedicines(), getCategories()]);
      setMedicines(medRes.data?.data?.medicines || medRes.data?.data || []);
      setCategories(catRes.data?.data?.categories || catRes.data?.data || []);
    } catch (e) { 
      console.error(e); 
      toast.error('Failed to fetch data');
    } finally { 
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = medicines.filter((m) => {
    return !search || 
           m.name.toLowerCase().includes(search.toLowerCase()) || 
           m.genericName?.toLowerCase().includes(search.toLowerCase());
  });

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('add'); };
  const openEdit = (med) => {
    setForm({ 
      ...med, 
      expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : '', 
      unitPrice: med.unitPrice?.toString() 
    });
    setEditId(med._id);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setForm(EMPTY); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, unitPrice: parseFloat(form.unitPrice) };
      if (modal === 'edit') { 
        await updateMedicine(editId, payload); 
        toast.success('Medicine updated successfully'); 
      } else { 
        await createMedicine(payload); 
        toast.success('Medicine created successfully'); 
      }
      closeModal();
      fetchData(true);
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error saving medicine'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeletingId(id);
    try { 
      await deleteMedicine(id); 
      toast.success('Medicine deleted'); 
      fetchData(true); 
    } catch { 
      toast.error('Error deleting medicine'); 
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 font-sans text-dark-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 border-b border-dark-700/50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(16px)' }}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Medicines</h1>
            <p className="text-sm text-dark-400 font-medium">{medicines.length} total medicines in catalog</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              className="btn-secondary"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button onClick={openAdd} className="btn-primary">
              <Plus size={18} /> Add Medicine
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Main Content */}
          <div className="mb-6 max-w-sm relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input 
              type="text"
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search medicines..."
              className="input pl-11 bg-dark-900" 
            />
          </div>

          {loading && !refreshing ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" text="Loading catalog..." /></div>
          ) : (
            <div className="table-wrapper flex-1">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Unit</th>
                    <th>Rx</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-dark-400">No medicines found matching your search.</td>
                    </tr>
                  ) : filtered.map((med) => (
                    <tr key={med._id}>
                      <td>
                        <p className="font-semibold text-white">{med.name}</p>
                        <p className="text-xs text-dark-400 mt-0.5">{med.genericName || '—'}</p>
                      </td>
                      <td><span className="badge-gray">{med.category || '—'}</span></td>
                      <td className="font-medium text-white">₹{med.unitPrice?.toFixed(2)}</td>
                      <td className="text-xs text-dark-300">{med.unit || '—'}</td>
                      <td>
                        {med.requiresPrescription ? (
                          <span className="badge-yellow">Rx</span>
                        ) : (
                          <span className="text-dark-500">—</span>
                        )}
                      </td>
                      <td>
                        {med.isActive !== false ? (
                          <span className="badge-green">Active</span>
                        ) : (
                          <span className="badge-gray">Inactive</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEdit(med)} 
                            className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                            title="Edit Medicine"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(med._id, med.name)} 
                            disabled={deletingId === med._id}
                            className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="Delete Medicine"
                          >
                            {deletingId === med._id ? (
                              <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="card bg-dark-900 w-full max-w-2xl relative z-10 animate-slide-up shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-dark-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Pill size={20} className="text-brand-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{modal === 'edit' ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              </div>
              <button onClick={closeModal} className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="medicine-form" onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="sm:col-span-2">
                  <label className="label">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required placeholder="e.g. Paracetamol 500mg" />
                </div>
                
                <div>
                  <label className="label">Generic Name</label>
                  <input value={form.genericName} onChange={(e) => setForm({ ...form, genericName: e.target.value })} className="input" placeholder="e.g. Acetaminophen" />
                </div>
                
                <div>
                  <label className="label">Manufacturer</label>
                  <input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className="input" placeholder="e.g. GSK" />
                </div>
                
                <div>
                  <label className="label">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input appearance-none" required>
                    <option value="" disabled>Select category</option>
                    {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" step="0.01" min="0" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} className="input" required placeholder="0.00" />
                </div>
                
                <div>
                  <label className="label">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input appearance-none">
                    {['tablets', 'capsules', 'ml', 'mg', 'strips', 'vials', 'units'].map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="label">Batch Number</label>
                  <input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} className="input" placeholder="e.g. BT-2023-XYZ" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="label">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" placeholder="Product details and usage instructions..." />
                </div>
                
                <div className="sm:col-span-2 flex items-center gap-6 p-4 bg-dark-900 border border-dark-800 rounded-xl mt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })} className="w-4 h-4 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800" />
                    <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">Requires Prescription</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800" />
                    <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">Active Status</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-dark-800 flex justify-end gap-3 bg-dark-900/50 rounded-b-2xl">
              <button type="button" onClick={closeModal} className="btn-secondary px-6">Cancel</button>
              <button type="submit" form="medicine-form" disabled={saving} className="btn-primary px-8">
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : modal === 'edit' ? 'Save Changes' : 'Create Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
