import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center">
        <span className="text-dark-500 font-medium">No category data available</span>
      </div>
    );
  }

  const COLORS = ['#2aa3f7', '#22c55e', '#f59e0b', '#a78bfa', '#f472b6', '#34d399', '#60a5fa'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="card p-3 shadow-xl border border-dark-700 bg-dark-800/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.payload.fill }}></div>
            <p className="font-semibold text-white">{data.name}</p>
          </div>
          <p className="text-sm mt-1" style={{ color: data.payload.fill }}>
            <span className="text-dark-400 mr-2">Count:</span>
            <span className="font-bold">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5 text-xs text-dark-300">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
