import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Eye, EyeOff, UserPlus, ArrowRight, Shield, Activity } from 'lucide-react';
import { registerUser } from '../api/authApi';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'pharmacist' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950 font-sans">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] bg-dark-900 border-r border-dark-800 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fresh-500/5 blur-[100px]"></div>
        <div 
          className="absolute inset-0 opacity-[0.03] z-0"
          style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        ></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-2 w-fit hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-fresh-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Pill size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gradient-brand">RxPulse</span>
          </Link>
          <span className="font-mono text-xs text-dark-400">Pharmacy OS v1.0.0</span>
        </div>

        <div className="relative z-10 max-w-md my-auto pt-10">
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-2 tracking-tight">
            Join the Future of
          </h1>
          <h1 className="text-5xl font-black text-gradient-brand leading-[1.1] mb-6 tracking-tight">
            Pharmacy Ops
          </h1>
          <p className="text-lg text-dark-400 mb-10 leading-relaxed">
            Create an account to manage your pharmacy inventory, monitor live stock levels, and securely handle prescription orders.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="text-brand-400" size={24} />
              </div>
              <span className="text-base font-medium text-dark-100">Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Activity className="text-brand-400" size={24} />
              </div>
              <span className="text-base font-medium text-dark-100">Real-time Analytics</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 card bg-dark-800/80 backdrop-blur-sm p-5 border border-dark-700 w-full mt-10 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse"></div>
              <span className="text-sm font-bold text-fresh-400">System Online</span>
            </div>
          </div>
          <p className="text-xs text-dark-400 mb-4">All services are currently fully operational and serving traffic.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-950 relative overflow-y-auto">
        <div className="w-full max-w-md relative z-10 py-10">
          
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-fresh-500 flex items-center justify-center">
              <Pill size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">RxPulse</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-dark-400">Sign up to get started with RxPulse</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input 
                name="name" 
                type="text" 
                value={form.name} 
                onChange={handleChange}
                className="input" 
                placeholder="John Doe" 
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Email address</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange}
                className="input" 
                placeholder="you@example.com" 
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={form.password} 
                  onChange={handleChange}
                  className="input pr-11" 
                  placeholder="••••••••" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-dark-500 mt-2">Must be at least 6 characters long.</p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-3.5 mt-4 justify-center text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Sign Up
                  <ArrowRight size={18} className="ml-auto opacity-70" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
