import React, { useState, useEffect } from 'react';
import { Box, Text, Icon } from 'zmp-ui';

const LOADING_STEPS = [
    { icon: '🔍', text: 'Đang phân tích dữ liệu học tập...' },
    { icon: '🧠', text: 'Đang tổng hợp nhận xét...' },
    { icon: '✍️', text: 'Đang soạn thảo lời khuyên...' },
    { icon: '✨', text: 'Đang hoàn thiện báo cáo...' }
];

export const ReportLoader: React.FC = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 2000); // Change step every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <Box className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-6">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                    {LOADING_STEPS[step].icon}
                </div>
            </div>

            <Text.Title size="small" className="text-blue-600 mb-2 transition-all duration-500">
                {LOADING_STEPS[step].text}
            </Text.Title>

            <Text size="xSmall" className="text-gray-400">
                Quá trình này mất khoảng 5-10 giây
            </Text>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-6">
                {LOADING_STEPS.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${idx <= step ? 'bg-blue-500 scale-110' : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
        </Box>
    );
};
