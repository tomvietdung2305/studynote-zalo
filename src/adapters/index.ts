/**
 * Adapter Factory
 * Exports the appropriate adapter based on current platform
 */

import { getPlatform } from '@/utils/platform';
import { ZaloSDKAdapter } from './ZaloSDKAdapter';
import { WebAdapter } from './WebAdapter';
import type { IZaloAdapter } from './IZaloAdapter';

// Create singleton instance based on platform
const createAdapter = (): IZaloAdapter => {
    const platform = getPlatform();

    if (platform === 'zalo') {
        console.log('Using ZaloSDKAdapter');
        return new ZaloSDKAdapter();
    } else {
        console.log('Using WebAdapter');
        return new WebAdapter();
    }
};

// Export singleton instance
export const zaloAdapter = createAdapter();

// Re-export types
export type { IZaloAdapter, UserInfo } from './IZaloAdapter';
