import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StockBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center">
        <span className="text-dark-500 font-medium">No stock data available</span>
      </div>
    );
  }

  const maxQuantity = Math.max(...data.map((d) => d.quantity));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3 shadow-xl border border-dark-700 bg-dark-800/95 backdrop-blur-sm">
          <p className="font-semibold text-white mb-1">{payload[0].payload.name}</p>
          <p className="text-sm">
            <span className="text-dark-400 mr-2">Quantity:</span>
            <span className="text-brand-300 font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
            angle={-30} 
            textAnchor="end" 
            height={50} 
            interval={0}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 11 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
          <Bar dataKey="quantity" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => {
              let color = '#2aa3f7'; // brand blue
              if (entry.quantity === 0) color = '#ef4444'; // red
              else if (entry.isLowStock) color = '#f59e0b'; // yellow
              else if (entry.quantity === maxQuantity) color = '#22c55e'; // green

              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
