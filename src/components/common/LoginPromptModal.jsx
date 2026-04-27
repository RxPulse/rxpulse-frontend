import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export default function LoginPromptModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="card relative z-10 w-full max-w-sm p-6 animate-slide-up shadow-2xl shadow-dark-950">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5 mx-auto">
          <ShieldCheck size={24} className="text-brand-400" />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm text-dark-300">
            Please sign in to add items to your cart and complete purchases.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link to="/login" className="btn-primary w-full justify-center py-3">
            Sign In
          </Link>
          <button onClick={onClose} className="btn-secondary w-full justify-center py-3">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
