'use client';

import { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Sector } from 'recharts';

const COLORS = ['#4F8EF7', '#E040FB', '#FFD600', '#00E5FF', '#FF6B6B', '#69DB7C', '#FFA94D', '#A9E34B'];

type ChartEntry = { name: string; value: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 4}
      outerRadius={outerRadius + 10}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
}

function PieCard({ title, data }: { title: string; data: ChartEntry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onEnter = useCallback((_: unknown, index: number) => setActiveIndex(index), []);

  if (data.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data yet</div>
      </div>
    );
  }

  const active = data[activeIndex];
  const activeColor = COLORS[activeIndex % COLORS.length];
  const label = active.name.length > 12 ? active.name.slice(0, 12) + '…' : active.name;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={ActiveShape}
              onMouseEnter={onEnter}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div
          className="absolute pointer-events-none flex flex-col items-center justify-center"
          style={{ top: 0, left: 0, right: 0, height: '78%' }}
        >
          <span className="text-base font-black leading-tight" style={{ color: activeColor }}>
            {active.value}
          </span>
          <span className="text-xs text-gray-400 mt-0.5 max-w-[80px] text-center leading-tight">
            {label}
          </span>
        </div>
      </div>
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
