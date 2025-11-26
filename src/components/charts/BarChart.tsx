import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
    data: any[];
    xKey: string;
    bars: Array<{
        dataKey: string;
        name: string;
        color: string;
    }>;
    height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, xKey, bars, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
                data={data}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '12px'
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                />
                {bars.map((bar) => (
                    <Bar
                        key={bar.dataKey}
                        dataKey={bar.dataKey}
                        name={bar.name}
                        fill={bar.color}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};
