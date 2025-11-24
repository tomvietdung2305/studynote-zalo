import React from 'react';
import { Box, Text, Icon } from 'zmp-ui';

export interface ActionItem {
    id: string;
    icon: string;
    label: string;
    onClick: () => void;
    color?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink';
    badge?: number | string;
}

interface ActionGridProps {
    actions: ActionItem[];
    columns?: 2 | 3 | 4;
    size?: 'small' | 'medium' | 'large';
}

const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
};

const sizeStyles = {
    small: {
        iconSize: 20,
        padding: 'p-3',
        textSize: 'text-xs',
    },
    medium: {
        iconSize: 24,
        padding: 'p-4',
        textSize: 'text-sm',
    },
    large: {
        iconSize: 28,
        padding: 'p-5',
        textSize: 'text-base',
    },
};

/**
 * Action Grid Component
 * 
 * Displays a grid of action buttons with icons
 * 
 * @example
 * <ActionGrid 
 *   actions={[
 *     { id: '1', icon: 'zi-check', label: 'Điểm danh', onClick: () => {}, color: 'blue' },
 *     { id: '2', icon: 'zi-edit', label: 'Quản lý', onClick: () => {}, color: 'green' }
 *   ]}
 *   columns={4}
 * />
 */
export function ActionGrid({
    actions,
    columns = 4,
    size = 'medium'
}: ActionGridProps) {
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };

    const sizeConfig = sizeStyles[size];

    return (
        <Box className={`grid ${gridCols[columns]} gap-3 mb-4`}>
            {actions.map((action) => (
                <div
                    key={action.id}
                    onClick={action.onClick}
                    className="relative cursor-pointer active:scale-95 transition-transform"
                >
                    <Box
                        className={`${colorStyles[action.color || 'blue']} ${sizeConfig.padding} rounded-2xl flex flex-col items-center justify-center gap-2 h-full`}
                    >
                        <div className="relative">
                            <Icon icon={action.icon} size={sizeConfig.iconSize} />
                            {action.badge !== undefined && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {action.badge}
                                </div>
                            )}
                        </div>
                        <Text className={`${sizeConfig.textSize} font-medium text-center leading-tight`}>
                            {action.label}
                        </Text>
                    </Box>
                </div>
            ))}
        </Box>
    );
}
