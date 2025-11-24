/**
 * Platform Detection Utility
 * Detects whether the app is running in Zalo Mini App or Web environment
 */

export type Platform = 'zalo' | 'web';

/**
 * Check if developer wants to view mobile UI on desktop
 * Use ?mode=mobile in URL to force mobile view
 */
export const isDevelopmentMobileMode = (): boolean => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'mobile';
};

/**
 * Check if running in Zalo Mini App environment
 */
export const isZaloEnvironment = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check for Zalo JavaScript Interface
    return (
        // @ts-ignore
        window.ZaloJavaScriptInterface !== undefined ||
        // @ts-ignore
        window.ZaloPayWebInterface !== undefined ||
        // Check user agent for Zalo
        /zalo/i.test(navigator.userAgent)
    );
};

/**
 * Get current platform
 */
export const getPlatform = (): Platform => {
    return isZaloEnvironment() ? 'zalo' : 'web';
};

/**
 * Check if running on web (and NOT in development mobile mode)
 */
export const isWeb = (): boolean => {
    // If in development mobile mode, pretend we're not on web
    if (isDevelopmentMobileMode()) {
        return false;
    }
    return getPlatform() === 'web';
};

/**
 * Check if running in Zalo
 */
export const isZalo = (): boolean => {
    return getPlatform() === 'zalo';
};
