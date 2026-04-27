export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'brand', 
  trend, 
  loading 
}) {
  const colorStyles = {
    brand:  { bg: 'bg-brand-500/10',  border: 'border-brand-500/20',  icon: 'text-brand-400',  text: 'text-brand-300',  cardBorder: 'border-brand-500/30' },
    green:  { bg: 'bg-fresh-500/10',  border: 'border-fresh-500/20',  icon: 'text-fresh-400',  text: 'text-fresh-300',  cardBorder: 'border-fresh-500/30' },
    blue:   { bg: 'bg-stable-500/10', border: 'border-stable-500/20', icon: 'text-stable-400', text: 'text-stable-300', cardBorder: 'border-stable-500/30' },
    red:    { bg: 'bg-red-500/10',    border: 'border-red-500/20',    icon: 'text-red-400',    text: 'text-red-300',    cardBorder: 'border-red-500/30' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'text-yellow-400', text: 'text-yellow-300', cardBorder: 'border-yellow-500/30' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400', text: 'text-purple-300', cardBorder: 'border-purple-500/30' }
  };

  const currentColors = colorStyles[color] || colorStyles.brand;

  if (loading) {
    return (
      <div className={`card p-5 relative overflow-hidden ${currentColors.cardBorder}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl skeleton"></div>
          {trend && <div className="w-16 h-6 rounded-full skeleton"></div>}
        </div>
        <div className="w-24 h-8 rounded-lg skeleton mb-2"></div>
        <div className="w-32 h-4 rounded skeleton mb-2"></div>
        <div className="w-48 h-3 rounded skeleton opacity-50"></div>
      </div>
    );
  }

  return (
    <div className={`card p-5 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 ${currentColors.cardBorder} hover:shadow-lg hover:shadow-${color}-500/10`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${currentColors.bg} ${currentColors.border}`}>
          {Icon && <Icon size={24} className={currentColors.icon} />}
        </div>
        {trend && (
          <div className={`badge ${trend.up ? 'badge-green' : 'badge-red'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <div className={`text-3xl font-black tracking-tight mb-1 ${currentColors.text}`}>
          {value}
        </div>
        <div className="text-sm font-semibold text-dark-200">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-dark-500 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
