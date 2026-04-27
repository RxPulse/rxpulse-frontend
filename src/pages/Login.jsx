import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, Eye, EyeOff, LogIn, ArrowRight, Shield, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/shop';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { 
      toast.error('Please fill in all fields.'); 
      return; 
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
      toast.success('Successfully logged in');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950 font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] bg-dark-900 border-r border-dark-800 relative overflow-hidden flex-col justify-between p-12">
        
        {/* Background Gradients & Patterns */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fresh-500/5 blur-[100px]"></div>
        <div 
          className="absolute inset-0 opacity-[0.03] z-0"
          style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        ></div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-fresh-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Pill size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gradient-brand">RxPulse</span>
          </div>
          <span className="font-mono text-xs text-dark-400">Pharmacy OS v1.0.0</span>
        </div>

        {/* Middle: Hero */}
        <div className="relative z-10 max-w-md my-auto pt-10">
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-2 tracking-tight">
            Pharmacy Management
          </h1>
          <h1 className="text-5xl font-black text-gradient-brand leading-[1.1] mb-6 tracking-tight">
            Reimagined
          </h1>
          <p className="text-lg text-dark-400 mb-10 leading-relaxed">
            The next-generation platform for pharmacy operations, delivering secure, real-time insights across your entire supply chain.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="text-brand-400" size={24} />
              </div>
              <span className="text-base font-medium text-dark-100">Secure JWT Authentication</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Activity className="text-brand-400" size={24} />
              </div>
              <span className="text-base font-medium text-dark-100">Real-time Stock Monitoring</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Pill className="text-brand-400" size={24} />
              </div>
              <span className="text-base font-medium text-dark-100">Complete Medicine Catalog</span>
            </div>
          </div>
        </div>

        {/* Bottom: Deployment Info */}
        <div className="relative z-10 card bg-dark-800/80 backdrop-blur-sm p-5 border border-dark-700 w-full mt-10 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse"></div>
              <span className="text-sm font-bold text-fresh-400">v1.0.0 — Green Active</span>
            </div>
            <span className="text-xs font-mono text-stable-400 bg-stable-500/10 px-2 py-0.5 rounded border border-stable-500/20">Previous: v0.0.3</span>
          </div>
          <p className="text-xs text-dark-400 mb-4">Successfully promoted via Argo Rollouts BlueGreen deployment.</p>
          <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-dark-900 border border-dark-700">
            <div className="h-full bg-fresh-500 w-full"></div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-950 relative">
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-fresh-500 flex items-center justify-center">
              <Pill size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">RxPulse</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-dark-400">Sign in to your RxPulse account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input 
                id="login-email" 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange}
                className="input" 
                placeholder="you@example.com" 
                autoComplete="email"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input 
                  id="login-password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={form.password} 
                  onChange={handleChange}
                  className="input pr-11" 
                  placeholder="••••••••" 
                  autoComplete="current-password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              id="login-submit" 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full py-3.5 mt-4 justify-center text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                  <ArrowRight size={18} className="ml-auto opacity-70" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-8">
            New to RxPulse?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
