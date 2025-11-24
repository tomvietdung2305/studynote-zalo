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
                    console.log('No token found');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Clear invalid token
                authService.logout();
                setIsAuthenticated(false);
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
