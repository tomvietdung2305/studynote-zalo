import React from 'react';
import { Text } from 'zmp-ui';

interface GreetingProps {
    userName: string;
    userRole: 'teacher' | 'parent';
    className?: string;
}

/**
 * Get time-based greeting message
 */
const getGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Chào buổi sáng';
    } else if (hour >= 12 && hour < 18) {
        return 'Chào buổi chiều';
    } else {
        return 'Chào buổi tối';
    }
};

/**
 * Greeting Component - Personalized time-based greetings
 * 
 * @example
 * <Greeting userName="Nguyễn Thị Lan" userRole="teacher" />
 * // Output: "Chào buổi sáng, Cô Nguyễn Thị Lan!"
 */
export function Greeting({ userName, userRole, className = '' }: GreetingProps) {
    const greeting = getGreeting();
    const prefix = userRole === 'teacher' ? 'Cô' : '';

    return (
        <div className={`greeting-component ${className}`}>
            <Text.Title size="large" className="font-bold text-white">
                {greeting}, {prefix && `${prefix} `}{userName}!
            </Text.Title>
        </div>
    );
}
