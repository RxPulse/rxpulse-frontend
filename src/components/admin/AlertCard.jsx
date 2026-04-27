import { Package, Clock, CheckCircle } from 'lucide-react';

export default function AlertCard({ alert, onResolve, resolving }) {
  const severityStyles = {
    CRITICAL: { border: 'border-l-red-500',   bg: 'bg-red-500/5',    badge: 'badge-red',    icon: 'text-red-400' },
    HIGH:     { border: 'border-l-orange-500',bg: 'bg-orange-500/5', badge: 'badge-red',    icon: 'text-orange-400' },
    MEDIUM:   { border: 'border-l-yellow-500',bg: 'bg-yellow-500/5', badge: 'badge-yellow', icon: 'text-yellow-400' },
    LOW:      { border: 'border-l-blue-500',  bg: 'bg-blue-500/5',   badge: 'badge-blue',   icon: 'text-blue-400' }
  };

  const style = severityStyles[alert.severity] || severityStyles.LOW;
  const Icon = alert.alertType === 'LOW_STOCK' ? Package : Clock;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className={`card border-l-4 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${style.border} ${style.bg} hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-start gap-4 flex-1">
        <div className={`mt-1 bg-dark-800 p-2.5 rounded-xl border border-dark-700 ${style.icon}`}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={style.badge}>{alert.severity}</span>
            <span className="badge-gray">{alert.alertType.replace('_', ' ')}</span>
          </div>
          <h4 className="font-semibold text-dark-100 text-lg leading-tight mb-1">{alert.medicineName}</h4>
          <p className="text-sm text-dark-400 mb-2">{alert.message}</p>
          <p className="text-xs text-dark-600 font-mono">{formatDate(alert.createdAt)}</p>
        </div>
      </div>

      <div className="flex-shrink-0 w-full sm:w-auto">
        <button
          onClick={() => onResolve(alert._id)}
          disabled={alert.isResolved || resolving}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            alert.isResolved 
              ? 'bg-dark-700 text-dark-500 cursor-not-allowed border border-dark-600'
              : 'bg-fresh-500/10 border border-fresh-500/30 text-fresh-400 hover:bg-fresh-500/20 active:scale-95'
          }`}
        >
          <CheckCircle size={16} />
          {alert.isResolved ? 'Resolved' : resolving ? 'Resolving...' : 'Resolve'}
        </button>
      </div>
    </div>
  );
}
