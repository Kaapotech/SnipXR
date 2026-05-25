'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4F8EF7', '#E040FB', '#FFD600', '#00E5FF', '#FF6B6B', '#69DB7C', '#FFA94D', '#A9E34B'];

type ChartEntry = { name: string; value: number };

function PieCard({ title, data }: { title: string; data: ChartEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#aaa' }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardCharts({
  clicksPerLink,
  countries,
  browsers,
  devices,
}: {
  clicksPerLink: ChartEntry[];
  countries: ChartEntry[];
  browsers: ChartEntry[];
  devices: ChartEntry[];
}) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <PieCard title="Clicks per Link" data={clicksPerLink} />
      <PieCard title="Countries" data={countries} />
      <PieCard title="Browsers" data={browsers} />
      <PieCard title="Devices" data={devices} />
    </div>
  );
}
