import React from 'react';
import { Box, Text } from 'zmp-ui';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Homework } from '@/types/homework';

interface HomeworkCardProps {
    homework: Homework;
    onClick: () => void;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework, onClick }) => {
    const dueDate = new Date(homework.due_date);
    const now = new Date();
    const isOverdue = dueDate < now && homework.status === 'active';
    const formattedDate = format(dueDate, 'dd/MM/yyyy HH:mm', { locale: vi });

    return (
        <Box
            className={`bg-white rounded-xl p-4 shadow-sm border ${isOverdue ? 'border-red-200' : 'border-gray-100'
                } active:scale-98 transition-transform`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">{homework.title}</Text>
                    {homework.description && (
                        <Text size="xSmall" className="text-gray-600 mb-2 line-clamp-2">
                            {homework.description}
                        </Text>
                    )}
                </div>
                <div
                    className={`px-2 py-1 rounded-full text-xs ${homework.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    {homework.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                        📅 {formattedDate}
                    </span>
                    {isOverdue && <span className="text-red-500 font-semibold">Quá hạn!</span>}
                </div>
                <div className="bg-blue-50 rounded-full px-2 py-1">
                    <Text className="text-blue-600 text-xs">→</Text>
                </div>
            </div>
        </Box>
    );
};
