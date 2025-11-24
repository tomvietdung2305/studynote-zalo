import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom, currentUserAtom } from '@/store/authAtoms';
import { authService } from '@/services/authService';
import LoginPage from '@/pages/login';

interface AuthWrapperProps {
    children: React.ReactNode;
}

import { useAppNavigation } from '@/context/AppContext';

export function AuthWrapper({ children }: AuthWrapperProps) {
    const { currentPage } = useAppNavigation();
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [, setCurrentUser] = useAtom(currentUserAtom);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is authenticated on mount
        const checkAuth = async () => {
            try {
                const token = authService.getToken();
                console.log('Checking auth, token:', token);

                if (token) {
                    // Verify token with backend
                    const user = await authService.getCurrentUser();
                    console.log('User verified:', user);
                    setIsAuthenticated(true);
                    setCurrentUser(user);
                } else {
                    console.log('No token found, attempting auto-login (Bypass Mode)...');
                    // Auto-login for development bypass
                    try {
                        const data = await authService.devLogin();
                        console.log('Auto-login successful:', data);
                        setIsAuthenticated(true);
                        setCurrentUser(data.user);
                    } catch (loginError: any) {
                        console.error('Auto-login failed:', loginError);
                        setError(`Login failed: ${loginError.message}`);
                        setIsAuthenticated(false);
                    }
                }
            } catch (error: any) {
                console.error('Auth check failed:', error);
                // Clear invalid token
                authService.logout();
                // Try auto-login even if check failed
                try {
                    console.log('Attempting auto-login after auth check failure...');
                    const data = await authService.devLogin();
                    setIsAuthenticated(true);
                    setCurrentUser(data.user);
                } catch (retryError: any) {
                    setError(`Auth failed: ${retryError.message}`);
                    setIsAuthenticated(false);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [setIsAuthenticated, setCurrentUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4">
                <div className="text-red-600 mb-4 text-center">
                    <h3 className="text-lg font-bold">Lỗi Đăng Nhập</h3>
                    <p>{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                    Thử Lại
                </button>
            </div>
        );
    }

    const publicPages = ['parent-connect'];

    // For non-authenticated users:
    // - If on a public page, show it
    // - Otherwise, show login page
    // CRITICAL: Don't render children at all when not authenticated
    if (!isAuthenticated) {
        if (publicPages.includes(currentPage)) {
            return <>{children}</>;
        }
        return <LoginPage />;
    }

    // User is authenticated, show the app
    return <>{children}</>;
}
