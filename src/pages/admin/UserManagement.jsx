import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, UserCheck, UserX, Users, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAllUsers, updateUser, deleteUser, registerUser } from '../../api/authApi';
import { getRoleBadgeClass, getRoleLabel } from '../../utils/roleHelpers';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_FORM = { name: '', email: '', password: '', role: 'pharmacist', department: 'General', phone: '', isActive: true };

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(null); // null | 'add' | user object
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const res = await getAllUsers();
      setUsers(res.data?.data || []);
    } catch { 
      toast.error('Failed to load users'); 
    } finally { 
      setLoading(false); 
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (user = null) => {
    setForm(user ? { ...user, password: '' } : DEFAULT_FORM);
    setModal(user || 'add');
  };

  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await registerUser(form);
        toast.success('User created successfully');
      } else {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(modal._id, payload);
        toast.success('User updated successfully');
      }
      closeModal();
      fetchUsers(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?._id) { toast.error("You can't delete your own account"); return; }
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers(true);
    } catch { toast.error('Failed to delete user'); }
  };

  const handleToggleActive = async (u) => {
    try {
      await updateUser(u._id, { isActive: !u.isActive });
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers(true);
    } catch { toast.error('Failed to update status'); }
  };

  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950 font-sans text-dark-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 border-b border-dark-700/50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.90)', backdropFilter: 'blur(16px)' }}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
            <p className="text-sm text-dark-400 font-medium">Manage system access and roles</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchUsers(true)} disabled={refreshing || loading} className="btn-secondary">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={() => openModal()} className="btn-primary">
              <Plus size={18} /> Add User
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-6">
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="card p-4 flex items-center gap-4 border-brand-500/20 bg-brand-500/5 flex-1 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Users size={24} className="text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-0.5">Total Users</p>
                <p className="text-2xl font-black text-white leading-none">{users.length}</p>
                <p className="text-xs text-dark-400 mt-1">{activeUsers} active, {adminUsers} admins</p>
              </div>
            </div>
          </div>

          {loading && !refreshing ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" text="Loading users..." /></div>
          ) : (
            <div className="table-wrapper flex-1">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-dark-400">No users found.</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-dark-900/50 transition-colors">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 border border-brand-500/30">
                              <span className="text-xs font-bold text-brand-400">{u.name?.charAt(0)?.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-white">{u.name}</span>
                              {u._id === currentUser?._id && <span className="badge-brand ml-2 text-[10px]">You</span>}
                            </div>
                          </div>
                        </td>
                        <td className="text-dark-300">{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'manager' ? 'badge-blue' : 'badge-green'}`}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td className="text-dark-400">{u.department || '—'}</td>
                        <td>
                          {u.isActive ? (
                            <span className="badge-green">Active</span>
                          ) : (
                            <span className="badge-gray">Inactive</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openModal(u)} 
                              className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                              title="Edit User"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleToggleActive(u)} 
                              className={`p-2 rounded-lg transition-colors ${u.isActive ? 'text-dark-400 hover:text-yellow-400 hover:bg-yellow-500/10' : 'text-dark-400 hover:text-green-400 hover:bg-green-500/10'}`}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                            {u._id !== currentUser?._id && (
                              <button 
                                onClick={() => handleDelete(u._id)} 
                                className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="card bg-dark-900 w-full max-w-lg relative z-10 animate-slide-up shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between p-6 border-b border-dark-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Users size={20} className="text-brand-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{modal === 'add' ? 'Add New User' : 'Edit User'}</h2>
              </div>
              <button onClick={closeModal} className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form id="user-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="e.g. John Doe" required />
                </div>
                
                <div>
                  <label className="label">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" placeholder="john@rxpulse.com" required disabled={modal !== 'add'} />
                </div>
                
                <div>
                  <label className="label">{modal !== 'add' ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                  <input name="password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input" placeholder="••••••••" required={modal === 'add'} autoComplete="new-password" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Role *</label>
                    <select name="role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input appearance-none">
                      <option value="pharmacist">Pharmacist</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Department</label>
                    <input name="department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="input" placeholder="e.g. General" />
                  </div>
                </div>
                
                <div>
                  <label className="label">Phone Number</label>
                  <input name="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" placeholder="+1 234 567 8900" />
                </div>

                {modal !== 'add' && (
                  <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 rounded border-dark-600 text-brand-500 focus:ring-brand-500 bg-dark-800" />
                    <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">Account Active</span>
                  </label>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-dark-800 flex justify-end gap-3 bg-dark-900/50 rounded-b-2xl">
              <button type="button" onClick={closeModal} className="btn-secondary px-6">Cancel</button>
              <button type="submit" form="user-form" disabled={saving} className="btn-primary px-8">
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : modal === 'add' ? 'Create User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
