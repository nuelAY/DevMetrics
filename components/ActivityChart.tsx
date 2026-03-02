"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function ActivityChart({ data }: { data: any[] }) {
    const chartData = data?.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        count: d.count,
    })) || [];

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }}
                        dy={10}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: '#171717',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
