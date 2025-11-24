import React from 'react';
import { Box, Text } from 'zmp-ui';

interface StreakBadgeProps {
    days: number;
    size?: 'small' | 'medium' | 'large';
    variant?: 'compact' | 'detailed';
}

/**
 * Streak Badge Component
 * 
 * Displays user's attendance tracking streak with fire icon
 * 
 * @example
 * <StreakBadge days={7} size="medium" variant="detailed" />
 */
export function StreakBadge({
    days,
    size = 'medium',
    variant = 'compact'
}: StreakBadgeProps) {
    const sizeStyles = {
        small: {
            container: 'px-2 py-1',
            icon: 'text-base',
            number: 'text-sm',
            label: 'text-xs',
        },
        medium: {
            container: 'px-3 py-2',
            icon: 'text-xl',
            number: 'text-base',
            label: 'text-sm',
        },
        large: {
            container: 'px-4 py-3',
            icon: 'text-2xl',
            number: 'text-lg',
            label: 'text-base',
        },
    };

    const styles = sizeStyles[size];

    // Determine streak color based on days
    const getStreakColor = () => {
        if (days >= 30) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
        if (days >= 14) return 'bg-gradient-to-r from-orange-400 to-red-500';
        if (days >= 7) return 'bg-gradient-to-r from-red-400 to-pink-500';
        return 'bg-gradient-to-r from-blue-400 to-purple-500';
    };

    const getStreakIcon = () => {
        if (days >= 30) return '🏆';
        if (days >= 14) return '🔥';
        if (days >= 7) return '⚡';
        return '✨';
    };

    const getStreakMessage = () => {
        if (days >= 30) return 'Xuất sắc!';
        if (days >= 14) return 'Tuyệt vời!';
        if (days >= 7) return 'Tốt lắm!';
        if (days > 0) return 'Cố lên!';
        return 'Bắt đầu ngay!';
    };

    if (variant === 'compact') {
        return (
            <Box className={`${getStreakColor()} ${styles.container} rounded-full inline-flex items-center gap-2 text-white shadow-md`}>
                <span className={styles.icon}>{getStreakIcon()}</span>
                <span className={`font-bold ${styles.number}`}>{days}</span>
                <span className={styles.label}>ngày</span>
            </Box>
        );
    }

    // Detailed variant
    return (
        <Box className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <Text size="small" className="text-gray-600">
                    Chuỗi điểm danh
                </Text>
                <div className={`${getStreakColor()} px-3 py-1 rounded-full`}>
                    <Text className="text-white font-bold text-sm">
                        {getStreakMessage()}
                    </Text>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className={`${getStreakColor()} w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                    {getStreakIcon()}
                </div>
                <div>
                    <Text.Title className="text-gray-900">
                        <span className="text-4xl font-bold">{days}</span>
                        <span className="text-lg text-gray-600 ml-2">ngày</span>
                    </Text.Title>
                    <Text size="small" className="text-gray-500">
                        Điểm danh liên tiếp
                    </Text>
                </div>
            </div>
            {days > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <Text size="xSmall" className="text-gray-500">
                            Tiếp tục để duy trì chuỗi!
                        </Text>
                        <div className="flex gap-1">
                            {[...Array(Math.min(days, 7))].map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-orange-400"></div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Box>
    );
}
