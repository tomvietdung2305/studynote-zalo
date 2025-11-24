/**
 * Web Adapter
 * Fallback implementation for web browser environment
 */

import type { IZaloAdapter, UserInfo } from './IZaloAdapter';

export class WebAdapter implements IZaloAdapter {
    async getAccessToken(): Promise<string> {
        // Web doesn't use Zalo token, return empty
        // AuthService will use JWT from localStorage instead
        return '';
    }

    async getUserInfo(): Promise<UserInfo> {
        // Try to get cached user info from localStorage
        const cached = localStorage.getItem('user_info');
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (e) {
                console.error('Failed to parse cached user info', e);
            }
        }

        // No cached user info, user needs to login
        throw new Error('Not authenticated - please login');
    }

    getTheme(): 'light' | 'dark' {
        // Check system preference on web
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    async followOA(oaId?: string): Promise<void> {
        // OA follow is Zalo-specific, show message on web
        console.warn('followOA is only available in Zalo Mini App');
        alert('Tính năng theo dõi Zalo OA chỉ khả dụng trong ứng dụng Zalo Mini App');
    }

    async requestSendNotification(data: any): Promise<void> {
        // Notification is Zalo-specific, show message on web
        console.warn('requestSendNotification is only available in Zalo Mini App');
        alert('Tính năng gửi thông báo chỉ khả dụng trong ứng dụng Zalo Mini App');
    }
}
