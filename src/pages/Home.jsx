import { Link } from 'react-router-dom';
import { Pill, Shield, Activity, ArrowRight, Terminal, Server, GitBranch, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950 font-sans text-dark-100 flex flex-col relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fresh-500/10 blur-[120px] pointer-events-none"></div>
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>

      <div className="page-container relative z-10 py-20 flex-1 flex flex-col justify-center">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse"></div>
            <span className="text-xs font-mono text-fresh-400 font-semibold tracking-wide">Pharmacy OS v1.0.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight animate-slide-up">
            Next-Generation <br className="hidden md:block" />
            <span className="text-gradient-brand">Pharmacy Management</span>
          </h1>
          
          <p className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Streamline your pharmacy operations with our comprehensive, secure, and intuitive digital platform. Real-time monitoring built for scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/shop" className="btn-primary py-4 px-8 text-base shadow-xl shadow-brand-500/20 w-full sm:w-auto justify-center">
              Explore Catalog <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary py-4 px-8 text-base w-full sm:w-auto justify-center">
              Sign In to Admin
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="card p-8 border-brand-500/20 bg-dark-900/50 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
              <Shield size={28} className="text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure Architecture</h3>
            <p className="text-dark-400 leading-relaxed">
              Enterprise-grade security with robust JWT authentication and Role-Based Access Control protecting sensitive data.
            </p>
          </div>

          <div className="card p-8 border-fresh-500/20 bg-dark-900/50 hover:-translate-y-2 transition-transform duration-300 delay-100">
            <div className="w-14 h-14 rounded-2xl bg-fresh-500/10 border border-fresh-500/20 flex items-center justify-center mb-6">
              <Activity size={28} className="text-fresh-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Monitoring</h3>
            <p className="text-dark-400 leading-relaxed">
              Live stock tracking, automated low-inventory alerts, and comprehensive movement history dashboards.
            </p>
          </div>

          <div className="card p-8 border-purple-500/20 bg-dark-900/50 hover:-translate-y-2 transition-transform duration-300 delay-200">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <Pill size={28} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Comprehensive Catalog</h3>
            <p className="text-dark-400 leading-relaxed">
              Manage your entire inventory across multiple categories with detailed metadata, expiry tracking, and analytics.
            </p>
          </div>
        </div>

        {/* Infrastructure / DevOps Section */}
        <div className="max-w-4xl mx-auto w-full mb-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Powered by GitOps</h2>
            <p className="text-dark-400">Zero-downtime deployments managed via Argo Rollouts</p>
          </div>

          <div className="card p-1 md:p-6 bg-dark-900/80 border-dark-700 shadow-2xl relative overflow-hidden">
            {/* Mock CLI Background */}
            <div className="absolute top-0 left-0 w-full h-8 bg-dark-950 border-b border-dark-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-dark-500 font-mono ml-4">kubectl get rollout rxpulse-frontend</span>
            </div>

            <div className="pt-10 pb-4 px-4 font-mono text-sm">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 my-8">
                
                {/* Blue Version */}
                <div className="flex flex-col items-center opacity-50 grayscale">
                  <div className="w-16 h-16 rounded-2xl bg-stable-500/10 border-2 border-stable-500/30 flex items-center justify-center mb-4 relative">
                    <Server size={32} className="text-stable-500" />
                    <span className="absolute -top-3 -right-3 badge-blue bg-dark-900 border-stable-500/50">Blue</span>
                  </div>
                  <span className="text-stable-400 font-bold">v0.0.3</span>
                  <span className="text-xs text-dark-500 mt-1">Previous Release</span>
                  <span className="text-xs font-bold text-stable-500 mt-2">Traffic: 0%</span>
                </div>

                {/* Transition Arrow */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-dark-500">
                    <div className="h-0.5 w-12 bg-dark-700"></div>
                    <GitBranch size={24} className="text-brand-500" />
                    <div className="h-0.5 w-12 bg-gradient-to-r from-dark-700 to-fresh-500/50"></div>
                  </div>
                  <span className="text-[10px] bg-dark-800 px-2 py-1 rounded text-dark-400 mt-2 border border-dark-700">Promoted</span>
                </div>

                {/* Green Version */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-fresh-500/10 border-2 border-fresh-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center justify-center mb-4 relative">
                    <Server size={32} className="text-fresh-500" />
                    <span className="absolute -top-3 -right-3 badge-green bg-dark-900 border-fresh-500/50 flex items-center gap-1">
                      <CheckCircle size={10} /> Active
                    </span>
                  </div>
                  <span className="text-fresh-400 font-bold">v1.0.0</span>
                  <span className="text-xs text-dark-300 mt-1">Current Release</span>
                  <span className="text-xs font-bold text-fresh-500 mt-2">Traffic: 100%</span>
                </div>

              </div>

              <div className="mt-8 bg-dark-950 rounded-lg p-4 text-[11px] md:text-xs text-dark-400 overflow-x-auto border border-dark-800">
                <div className="flex gap-4">
                  <span className="text-brand-400">STATUS:</span>
                  <span className="text-fresh-400">✔ Healthy</span>
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-brand-400">STRATEGY:</span>
                  <span>BlueGreen</span>
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-brand-400">ACTIVE SVC:</span>
                  <span>frontend-active</span>
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-brand-400">MESSAGE:</span>
                  <span>Rollout is fully promoted. Green version is serving 100% of traffic.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
