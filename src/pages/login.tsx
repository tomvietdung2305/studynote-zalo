import { useState } from 'react';
import { Page, Box, Button, Text } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { authService } from '@/services/authService';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom, currentUserAtom } from '@/store/authAtoms';

function LoginPage() {
    const { navigateTo } = useAppNavigation();
    const [loading, setLoading] = useState(false);
    const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
    const [, setCurrentUser] = useAtom(currentUserAtom);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.login();

            setIsAuthenticated(true);
            setCurrentUser(result.user);

            // Navigate to dashboard
            navigateTo('dashboard');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDevLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.devLogin();

            setIsAuthenticated(true);
            setCurrentUser(result.user);

            // Navigate to dashboard
            navigateTo('dashboard');
        } catch (err) {
            console.error('Dev login failed:', err);
            setError('Dev login thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-gradient-to-br from-blue-500 to-purple-600">
            <Box
                className="flex flex-col items-center justify-center"
                style={{ minHeight: '100vh', padding: '24px' }}
            >
                <Box className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    {/* Logo/Icon */}
                    <Box className="flex justify-center mb-6">
                        <Box className="bg-blue-100 rounded-full p-6">
                            <svg
                                className="w-16 h-16 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </Box>
                    </Box>

                    {/* Title */}
                    <Text.Title className="text-center text-2xl font-bold text-gray-800 mb-2">
                        StudyNote
                    </Text.Title>
                    <Text className="text-center text-gray-500 mb-8">
                        Sổ Liên Lạc Thông Minh
                    </Text>

                    {/* Description */}
                    <Box className="bg-blue-50 rounded-lg p-4 mb-6">
                        <Text size="small" className="text-gray-700 text-center">
                            Đăng nhập để quản lý lớp học, điểm danh và giao tiếp với phụ huynh một cách dễ dàng
                        </Text>
                    </Box>

                    {/* Error Message */}
                    {error && (
                        <Box className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <Text size="small" className="text-red-600 text-center">
                                {error}
                            </Text>
                        </Box>
                    )}

                    {/* Login Button */}
                    <Button
                        fullWidth
                        size="large"
                        onClick={handleLogin}
                        loading={loading}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập với Zalo
                    </Button>

                    <div className="mt-8 text-center">
                        <Text size="small" className="text-gray-500 mb-2">Bạn là phụ huynh?</Text>
                        <Button
                            variant="tertiary"
                            size="small"
                            onClick={() => navigateTo('parent-connect')}
                        >
                            Nhập mã kết nối
                        </Button>
                    </div>

                    {/* Dev Login Button (Only for localhost) */}
                    <Button
                        fullWidth
                        size="medium"
                        onClick={handleDevLogin}
                        loading={loading}
                        disabled={loading}
                        variant="secondary"
                        className="mt-3"
                    >
                        🔧 Dev Login (Demo Mode)
                    </Button>

                    {/* Footer */}
                    <Text size="xxSmall" className="text-center text-gray-400 mt-6">
                        Bằng cách đăng nhập, bạn đồng ý với Điều khoản sử dụng
                    </Text>
                </Box>
            </Box>
        </Page>
    );
}

export default LoginPage;
