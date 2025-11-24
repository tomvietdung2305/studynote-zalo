import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';

interface StatsCardProps {
    icon: string;
    value: number | string;
    label: string;
    color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
    gradient?: boolean;
    onClick?: () => void;
}

const colorStyles = {
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100',
        gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        iconBg: 'bg-green-100',
        gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        iconBg: 'bg-purple-100',
        gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    red: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        iconBg: 'bg-red-100',
        gradient: 'bg-gradient-to-br from-red-400 to-red-600',
    },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        iconBg: 'bg-orange-100',
        gradient: 'bg-gradient-to-br from-orange-400 to-orange-600',
    },
};

/**
 * Stats Card Component
 * 
 * Displays a statistic with an icon, value, and label
 * 
 * @example
 * <StatsCard icon="zi-user" value={45} label="Học sinh" color="blue" />
 */
export function StatsCard({
    icon,
    value,
    label,
    color = 'blue',
    gradient = false,
    onClick
}: StatsCardProps) {
    const styles = colorStyles[color];

    if (gradient) {
        return (
            <Box
                className={`${styles.gradient} rounded-xl p-4 text-white shadow-md ${onClick ? 'cursor-pointer active:scale-95' : ''} transition-transform`}
                onClick={onClick}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 mb-3">
                        <Icon icon={icon} className="text-white" size={24} />
                    </div>
                    <Text.Title size="large" className="text-white font-bold mb-1">
                        {value}
                    </Text.Title>
                    <Text size="small" className="text-white text-opacity-90">
                        {label}
                    </Text>
                </div>
            </Box>
        );
    }

    return (
        <Box
            className={`${styles.bg} rounded-xl p-4 border border-gray-100 ${onClick ? 'cursor-pointer active:scale-95' : ''} transition-transform`}
            onClick={onClick}
        >
            <div className="flex flex-col items-center text-center">
                <div className={`${styles.iconBg} rounded-full p-3 mb-3`}>
                    <Icon icon={icon} className={styles.text} size={24} />
                </div>
                <Text.Title size="large" className={`${styles.text} font-bold mb-1`}>
                    {value}
                </Text.Title>
                <Text size="small" className="text-gray-600">
                    {label}
                </Text>
            </div>
        </Box>
    );
}
