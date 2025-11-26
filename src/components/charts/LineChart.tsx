import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
    data: any[];
    xKey: string;
    lines: Array<{
        dataKey: string;
        name: string;
        color: string;
    }>;
    height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, xKey, lines, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart
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
                {lines.map((line) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};
