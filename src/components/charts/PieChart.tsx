import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
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
            </RechartsPieChart>
        </ResponsiveContainer>
    );
};
