import React from 'react';
import { Box, Text } from 'zmp-ui';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Exam } from '@/types/schedule';

interface ExamCardProps {
    exam: Exam;
    onClick: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onClick }) => {
    const examDate = new Date(exam.date);
    const formattedDate = format(examDate, 'dd/MM/yyyy', { locale: vi });
    const formattedTime = format(examDate, 'HH:mm', { locale: vi });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'quiz':
                return 'bg-blue-100 text-blue-700';
            case 'midterm':
                return 'bg-orange-100 text-orange-700';
            case 'final':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'quiz':
                return 'Kiểm tra';
            case 'midterm':
                return 'Giữa kỳ';
            case 'final':
                return 'Cuối kỳ';
            default:
                return 'Khác';
        }
    };

    return (
        <Box
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-98 transition-transform"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">{exam.title}</Text>
                    {exam.notes && (
                        <Text size="xSmall" className="text-gray-600 mb-2 line-clamp-2">
                            {exam.notes}
                        </Text>
                    )}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${getTypeColor(exam.type)}`}>
                    {getTypeName(exam.type)}
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                    <span>📅 {formattedDate}</span>
                    <span>🕒 {formattedTime}</span>
                    {exam.duration && <span>⏱️ {exam.duration} phút</span>}
                </div>
                <div className="bg-purple-50 rounded-full px-2 py-1">
                    <Text className="text-purple-600 text-xs">→</Text>
                </div>
            </div>
        </Box>
    );
};
