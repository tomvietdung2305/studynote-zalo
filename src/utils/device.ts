/**
 * Device Detection Utility
 * Determines device type and routing strategy
 */

import { isZaloEnvironment } from './platform';

/**
 * Detect if user is on a mobile device based on user agent
 */
export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'mobile', 'tablet'];

    return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Check if viewport width suggests mobile device
 */
export const isMobileViewport = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768; // Standard tablet breakpoint
};

/**
 * Determine if user should be redirected to Zalo Mini App
 * Only mobile users NOT already in Zalo should be redirected
 */
export const shouldShowMobileLanding = (): boolean => {
    // Don't show landing if already in Zalo
    if (isZaloEnvironment()) return false;

    // Show landing for mobile devices
    return isMobileDevice() || isMobileViewport();
};

/**
 * Get routing strategy based on current environment
 */
export type RoutingStrategy = 'zalo' | 'mobile-landing' | 'web';

export const getRoutingStrategy = (): RoutingStrategy => {
    // Priority 1: Zalo Mini App
    if (isZaloEnvironment()) {
        return 'zalo';
    }

    // Priority 2: Mobile browser → Landing page
    if (shouldShowMobileLanding()) {
        return 'mobile-landing';
    }

    // Priority 3: Desktop → Web app
    return 'web';
};
