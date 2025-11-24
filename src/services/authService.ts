import { zaloAdapter } from '@/adapters';

// Use localtunnel HTTPS URL to avoid Mixed Content error on mobile
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://stupid-steaks-stick.loca.lt/api';



export const authService = {
    // Dev login for localhost testing (bypass Zalo SDK)
    async devLogin() {
        try {
            // Mock user data for development - FIXED USER ID for persistence
            const mockUserInfo = {
                id: 'dev_teacher_001', // Fixed ID so classes persist across logins
                name: 'Giáo viên Test',
                avatar: '',
            };

            // Send to backend for authentication
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: 'dev_token',
                    userInfo: mockUserInfo,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            // Store token in localStorage
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_info', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Dev login error:', error);
            throw error;
        }
    },

    // Login with Zalo
    async login() {
        try {
            console.log('Starting Zalo login...');
            // Get access token from Zalo via adapter
            const accessToken = await zaloAdapter.getAccessToken();
            console.log('Got access token');

            // Get user info from Zalo via adapter
            const userInfo = await zaloAdapter.getUserInfo();
            console.log('Got user info:', userInfo);

            // Send to backend for authentication
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken,
                    userInfo,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend login failed:', response.status, errorText);
                throw new Error(`Login failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();

            // Store token in localStorage
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_info', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Get current user from backend
    async getCurrentUser() {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get user info');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
    },

    // Get stored token
    getToken() {
        return localStorage.getItem('auth_token');
    },

    // Get stored user info
    getUserInfo() {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },
};
