/**
 * Adapter Factory
 * Exports the appropriate adapter based on current platform
 */

import { getPlatform } from '@/utils/platform';
import { WebAdapter } from './WebAdapter';
import { ZaloSDKAdapter } from './ZaloSDKAdapter';
import type { IZaloAdapter } from './IZaloAdapter';

let _adapter: IZaloAdapter | null = null;

const createAdapter = (): IZaloAdapter => {
    if (_adapter) return _adapter;

    const platform = getPlatform();

    if (platform === 'zalo') {
        console.log('Using ZaloSDKAdapter');
        _adapter = new ZaloSDKAdapter();
    } else {
        console.log('Using WebAdapter');
        _adapter = new WebAdapter();
    }

    return _adapter;
};

// Export singleton instance
export const zaloAdapter = createAdapter();

// Re-export types
export type { IZaloAdapter, UserInfo } from './IZaloAdapter';

