/**
 * Zalo Adapter Interface
 * Common interface for both Zalo SDK and Web implementations
 */

export interface UserInfo {
    id: string;
    name: string;
    avatar: string;
}

export interface IZaloAdapter {
    /**
     * Get access token for API calls
     */
    getAccessToken(): Promise<string>;

    /**
     * Get user information
     */
    getUserInfo(): Promise<UserInfo>;

    /**
     * Get system theme
     */
    getTheme(): 'light' | 'dark';

    /**
     * Follow Official Account
     */
    followOA(oaId?: string): Promise<void>;

    /**
     * Request send notification permission
     */
    requestSendNotification(data: any): Promise<void>;
}
