/**
 * Zalo SDK Adapter
 * Real implementation using Zalo SDK for Mini App environment
 */

import { getAccessToken, getUserInfo as getZaloUserInfo, getSystemInfo, followOA as zaloFollowOA, requestSendNotification as zaloRequestNotification } from 'zmp-sdk/apis';
import type { IZaloAdapter, UserInfo } from './IZaloAdapter';

export class ZaloSDKAdapter implements IZaloAdapter {
    async getAccessToken(): Promise<string> {
        try {
            const result = await getAccessToken({});
            return (result as any).accessToken || '';
        } catch (error) {
            console.error('ZaloSDKAdapter: getAccessToken failed', error);
            return '';
        }
    }

    async getUserInfo(): Promise<UserInfo> {
        try {
            const result = await getZaloUserInfo({});
            const userInfo = (result as any).userInfo;
            return {
                id: userInfo.id,
                name: userInfo.name,
                avatar: userInfo.avatar || '',
            };
        } catch (error) {
            console.error('ZaloSDKAdapter: getUserInfo failed', error);
            throw new Error('Failed to get user info from Zalo');
        }
    }

    getTheme(): 'light' | 'dark' {
        try {
            const sysInfo = getSystemInfo();
            return (sysInfo as any).zaloTheme || 'light';
        } catch (error) {
            console.warn('ZaloSDKAdapter: getTheme failed', error);
            return 'light';
        }
    }

    async followOA(oaId?: string): Promise<void> {
        try {
            // followOA requires id parameter, use empty string if not provided
            await zaloFollowOA({ id: oaId || '' });
        } catch (error) {
            console.error('ZaloSDKAdapter: followOA failed', error);
            throw new Error('Failed to follow OA');
        }
    }

    async requestSendNotification(data: any): Promise<void> {
        try {
            await zaloRequestNotification(data);
        } catch (error) {
            console.error('ZaloSDKAdapter: requestSendNotification failed', error);
            throw new Error('Failed to request notification permission');
        }
    }
}
