/**
 * Design System - Centralized theming and design tokens
 * Based on modern education app aesthetics
 */

export const colors = {
    // Primary colors
    primary: {
        main: '#3B82F6',      // Blue 500
        light: '#60A5FA',     // Blue 400
        dark: '#2563EB',      // Blue 600
        50: '#EFF6FF',
        100: '#DBEAFE',
    },

    // Secondary colors
    secondary: {
        main: '#8B5CF6',      // Purple 500
        light: '#A78BFA',     // Purple 400
        dark: '#7C3AED',      // Purple 600
        50: '#F5F3FF',
        100: '#EDE9FE',
    },

    // Status colors
    success: {
        main: '#10B981',      // Green 500
        light: '#34D399',
        dark: '#059669',
        50: '#ECFDF5',
    },

    warning: {
        main: '#F59E0B',      // Amber 500
        light: '#FBBF24',
        dark: '#D97706',
        50: '#FFFBEB',
    },

    error: {
        main: '#EF4444',      // Red 500
        light: '#F87171',
        dark: '#DC2626',
        50: '#FEF2F2',
    },

    // Neutral colors
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        hero: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        card: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)',
    },
};

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
};

export const borderRadius = {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
};

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const typography = {
    fontFamily: {
        base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },

    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const zIndex = {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
};

/**
 * Utility function to get color value
 */
export const getColor = (path: string): string => {
    const keys = path.split('.');
    let value: any = colors;

    for (const key of keys) {
        value = value[key];
        if (value === undefined) return path;
    }

    return value;
};
