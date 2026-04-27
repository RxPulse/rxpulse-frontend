import { useState, useEffect } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import clsx from 'clsx';

export default function BlueGreenBanner() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative z-50 font-sans text-dark-100">
      {/* Top slim banner */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-b border-dark-700/50 relative overflow-hidden transition-all duration-300"
        style={{ background: 'linear-gradient(90deg, rgba(30,58,138,0.4) 0%, rgba(15,23,42,0.8) 40%, rgba(20,83,45,0.4) 100%)' }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse"></div>
            <span className="text-xs font-bold text-fresh-400 tracking-wider">LIVE</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Blue Chip */}
            <div className="flex items-center gap-2 px-2 py-1 bg-stable-500/10 border border-stable-500/20 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-stable-500"></div>
              <span className="font-mono text-xs text-stable-300">v0.0.3</span>
              <span className="text-xs font-semibold text-stable-400">Blue</span>
              <span className="text-xs text-dark-400">Previous</span>
            </div>

            {/* Traffic Bar */}
            <div className="flex flex-col gap-1 w-24">
              <div className="flex justify-between text-[10px] text-dark-400">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="h-1 flex rounded-full overflow-hidden bg-dark-700">
                <div className="h-full bg-stable-500 transition-all duration-1000" style={{ width: '0%' }}></div>
                <div className="h-full bg-fresh-500 transition-all duration-1000" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Green Chip */}
            <div className="flex items-center gap-2 px-2 py-1 bg-fresh-500/10 border border-fresh-500/20 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-fresh-500 animate-ping"></div>
              <span className="font-mono text-xs text-fresh-300">v1.0.0</span>
              <span className="text-xs font-semibold text-fresh-400">Green</span>
              <span className="text-xs text-dark-200">Active</span>
              <CheckCircle size={12} className="text-fresh-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-mono text-dark-400 border border-dark-700 rounded px-1.5 py-0.5 bg-dark-800">BlueGreen</span>
            <span className="text-xs font-mono text-dark-400 border border-dark-700 rounded px-1.5 py-0.5 bg-dark-800">Argo Rollouts</span>
            <span className="text-xs text-dark-400 tabular-nums">Uptime: {uptime}s</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="p-1 hover:bg-dark-700 rounded text-dark-300 hover:text-white transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button 
              onClick={() => setDismissed(true)} 
              className="p-1 hover:bg-dark-700 rounded text-dark-300 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Panel */}
      <div 
        className={clsx(
          "overflow-hidden transition-all duration-500 ease-in-out border-b border-dark-700/50 absolute w-full top-full left-0 origin-top",
          expanded ? "max-h-[600px] opacity-100 border-b" : "max-h-0 opacity-0 border-transparent"
        )}
        style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="page-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Blue */}
            <div className="card bg-dark-900 border-l-4 border-l-stable-500 p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stable-100 mb-2">Blue — Previous</h3>
                <div className="font-mono text-xs text-stable-300 bg-stable-500/10 inline-block px-2 py-1 rounded mb-3">frontend-v0.0.3</div>
                <p className="text-sm text-dark-300 mb-4">Previous release — basic UI, light theme, minimal admin panel</p>
                <ul className="space-y-2 text-sm text-dark-400">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-dark-600"></div>Basic medicine listing</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-dark-600"></div>Simple admin dashboard</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-dark-600"></div>Light theme UI</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-dark-600"></div>Basic cart functionality</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-dark-700/50 flex items-center justify-between">
                <span className="text-sm text-dark-500 font-semibold">Traffic: 0%</span>
                <div className="w-2 h-2 rounded-full bg-stable-500/30"></div>
              </div>
            </div>

            {/* Column 2: Status */}
            <div className="flex flex-col items-center text-center justify-center p-5">
              <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">Deployment Status</h3>
              <div className="flex items-center gap-2 text-fresh-400 font-bold text-xl mb-1">
                <CheckCircle size={24} /> Promoted
              </div>
              <p className="text-sm text-dark-400 mb-8">Green is now active</p>

              <div className="w-full mb-8">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-stable-400">0% Blue</span>
                  <span className="text-fresh-400">100% Green</span>
                </div>
                <div className="h-3 flex rounded-full overflow-hidden bg-dark-800 border border-dark-700">
                  <div className="h-full bg-stable-500 transition-all duration-1000" style={{ width: '0%' }}></div>
                  <div className="h-full bg-fresh-500 transition-all duration-1000 relative" style={{ width: '100%' }}>
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 text-left">
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <div className="text-[10px] text-dark-400 uppercase font-semibold mb-1">Strategy</div>
                  <div className="text-sm text-dark-100">BlueGreen</div>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <div className="text-[10px] text-dark-400 uppercase font-semibold mb-1">Controller</div>
                  <div className="text-sm text-dark-100">Argo Rollouts</div>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <div className="text-[10px] text-dark-400 uppercase font-semibold mb-1">Active Svc</div>
                  <div className="text-xs font-mono text-fresh-400">frontend-active</div>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                  <div className="text-[10px] text-dark-400 uppercase font-semibold mb-1">Preview Svc</div>
                  <div className="text-xs font-mono text-dark-500">frontend-preview</div>
                </div>
              </div>
            </div>

            {/* Column 3: Green */}
            <div className="card bg-dark-900 border-l-4 border-l-fresh-500 p-5 flex flex-col justify-between glow-green">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">Green — Current ✓</h3>
                  <span className="badge-green">Active</span>
                </div>
                <div className="font-mono text-xs text-fresh-300 bg-fresh-500/10 inline-block px-2 py-1 rounded mb-3">frontend-v1.0.0</div>
                <p className="text-sm text-dark-200 mb-4">Major redesign — dark theme, real-time monitoring, enhanced UX</p>
                <ul className="space-y-2 text-sm text-dark-300">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-fresh-500" />Dark theme UI overhaul</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-fresh-500" />BlueGreen deployment panel</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-fresh-500" />Real-time stock monitoring</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-fresh-500" />Advanced admin analytics</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-dark-700/50 flex items-center justify-between">
                <span className="text-sm text-fresh-400 font-bold">Traffic: 100%</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
