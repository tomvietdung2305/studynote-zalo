import { useState, useEffect } from 'react';
import { Page, Header, Text, Box, Button, Input, useSnackbar, Icon } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { requestSendNotification } from 'zmp-sdk';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '@/store/authAtoms';
import { authService } from '@/services/authService';

function ParentConnectPage() {
    const { goBack, navigateTo } = useAppNavigation();
    const { openSnackbar } = useSnackbar();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectedStudent, setConnectedStudent] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

    const handleConnect = async () => {
        if (!code || code.length < 6) {
            openSnackbar({ text: 'Vui lòng nhập mã kết nối hợp lệ', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const result = await import('@/services/apiService').then(m => m.apiService.connectParent(code));
            setConnectedStudent(result.student);
            openSnackbar({ text: 'Kết nối thành công!', type: 'success' });

            // Request Notification Permission immediately
            try {
                await requestSendNotification({});
                openSnackbar({ text: 'Đã đăng ký nhận thông báo', type: 'success' });
            } catch (e) {
                console.error('Permission denied', e);
            }

        } catch (error: any) {
            openSnackbar({ text: error.message || 'Kết nối thất bại', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const result = await authService.login();
            setIsAuthenticated(true);
            openSnackbar({ text: 'Đăng nhập thành công', type: 'success' });
        } catch (error) {
            openSnackbar({ text: 'Đăng nhập thất bại', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDevLogin = async () => {
        try {
            setLoading(true);
            const result = await authService.devLogin();
            setIsAuthenticated(true);
            openSnackbar({ text: 'Dev Login thành công', type: 'success' });
        } catch (error) {
            openSnackbar({ text: 'Dev Login thất bại', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-white">
            <Header title="Kết Nối Phụ Huynh" showBackIcon={true} onBackClick={goBack} />

            <Box p={4} className="pt-20 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Icon icon="zi-group" className="text-4xl text-blue-600" />
                </div>

                <Text.Title className="mb-2 text-center">Kết nối với con của bạn</Text.Title>
                <Text className="text-gray-500 text-center mb-8">
                    Nhập mã kết nối gồm 6 chữ số do giáo viên cung cấp để nhận thông báo về tình hình học tập của con.
                </Text>

                {!isAuthenticated ? (
                    <div className="w-full space-y-4">
                        <Box className="bg-orange-50 p-4 rounded-lg mb-4 border border-orange-100">
                            <Text size="small" className="text-orange-800 text-center">
                                Bạn cần đăng nhập để thực hiện kết nối.
                            </Text>
                        </Box>
                        <Button fullWidth size="large" onClick={handleLogin} loading={loading}>
                            Đăng nhập với Zalo
                        </Button>
                        <Button fullWidth variant="secondary" onClick={handleDevLogin} loading={loading}>
                            🔧 Dev Login (Test)
                        </Button>
                    </div>
                ) : (
                    !connectedStudent ? (
                        <div className="w-full space-y-4">
                            <Input
                                placeholder="Nhập mã kết nối (VD: 123456)"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="text-center text-lg tracking-widest"
                                type="number"
                            />
                            <Button fullWidth size="large" onClick={handleConnect} loading={loading}>
                                Kết Nối Ngay
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon icon="zi-check" className="text-3xl text-green-600" />
                            </div>
                            <Text.Title size="small" className="mb-2 text-green-800">Đã kết nối thành công!</Text.Title>
                            <Text className="text-green-700 mb-4">
                                Bạn đã kết nối với học sinh <strong>{connectedStudent.name}</strong>
                            </Text>
                            <Button fullWidth variant="secondary" onClick={() => navigateTo('parent-dashboard')}>
                                Về Trang Chủ
                            </Button>
                        </div>
                    )
                )}
            </Box>
        </Page>
    );
}

export default ParentConnectPage;
