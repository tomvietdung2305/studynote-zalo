import { useState, useEffect } from 'react';
import { Page, Header, Text, Box, List, Icon, Avatar, Button } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { apiService } from '@/services/apiService';

function ParentDashboardPage() {
    const { navigateTo } = useAppNavigation();
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<any>(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const result = await apiService.getChildren();
            setChildren(result);
            if (result.length > 0) {
                setSelectedChild(result[0]);
            }
        } catch (error) {
            console.error('Failed to fetch children:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Page className="bg-gray-100">
                <Header title="Phụ Huynh" showBackIcon={false} />
                <Box p={4} className="pt-20 flex justify-center">
                    <Text>Đang tải dữ liệu...</Text>
                </Box>
            </Page>
        );
    }

    if (children.length === 0) {
        return (
            <Page className="bg-gray-100">
                <Header title="Phụ Huynh" showBackIcon={false} />
                <Box p={4} className="pt-20 flex flex-col items-center">
                    <Text className="text-center mb-4">Chưa có học sinh nào được kết nối.</Text>
                    <Button onClick={() => navigateTo('parent-connect')}>Kết nối ngay</Button>
                </Box>
            </Page>
        );
    }

    return (
        <Page className="bg-gray-50">
            <Header title="Sổ Liên Lạc" showBackIcon={false} />

            <Box className="pt-16 pb-20">
                {/* Student Header Card */}
                <Box className="bg-blue-600 p-6 pb-12 rounded-b-3xl shadow-lg text-white relative">
                    <div className="flex items-center gap-4">
                        <Avatar size={64} src={selectedChild?.avatar || ""} className="border-2 border-white bg-blue-400">
                            {selectedChild?.name?.charAt(0)}
                        </Avatar>
                        <div>
                            <Text.Title className="text-white">{selectedChild?.name}</Text.Title>
                            <Text size="small" className="text-blue-100">Mã HS: {selectedChild?.connection_code}</Text>
                        </div>
                    </div>
                </Box>

                {/* Stats Overview */}
                <Box className="mx-4 -mt-8 bg-white rounded-xl shadow-md p-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                        <Text size="xSmall" className="text-gray-500 mb-1">Chuyên cần</Text>
                        <Text.Title size="large" className="text-green-600">95%</Text.Title>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <Text size="xSmall" className="text-gray-500 mb-1">Điểm TB</Text>
                        <Text.Title size="large" className="text-orange-600">8.5</Text.Title>
                    </div>
                </Box>

                {/* Today's Schedule */}
                <Box className="mt-6 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <Text.Title size="small">📅 Lịch học hôm nay</Text.Title>
                    </div>
                    <Box className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                            <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <Text className="font-medium">Toán học</Text>
                                <Text size="small" className="text-gray-500">08:00 - 09:30</Text>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-12 bg-purple-500 rounded-full"></div>
                            <div className="flex-1">
                                <Text className="font-medium">Tiếng Việt</Text>
                                <Text size="small" className="text-gray-500">09:45 - 11:15</Text>
                            </div>
                        </div>
                    </Box>
                </Box>

                {/* Recent Grades */}
                <Box className="mt-6 px-4">
                    <div className="flex items-center justify-between mb-3">
                        <Text.Title size="small">🏆 Điểm số mới nhất</Text.Title>
                        <Text size="small" className="text-blue-600">Xem tất cả</Text>
                    </div>
                    <Box className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <List>
                            <List.Item
                                prefix={<Icon icon="zi-star" className="text-yellow-500" />}
                                title="Kiểm tra 15 phút Toán"
                                subTitle="10/10 - Làm bài tốt!"
                            />
                            <List.Item
                                prefix={<Icon icon="zi-star" className="text-blue-500" />}
                                title="Viết chính tả"
                                subTitle="9/10 - Chữ viết đẹp"
                            />
                        </List>
                    </Box>
                </Box>

                {/* Attendance History */}
                <Box className="mt-6 px-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <Text.Title size="small">✅ Điểm danh gần đây</Text.Title>
                    </div>
                    <Box className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <List>
                            <List.Item
                                prefix={<Icon icon="zi-check-circle" className="text-green-500" />}
                                title="21/11/2025"
                                subTitle="Có mặt"
                            />
                            <List.Item
                                prefix={<Icon icon="zi-check-circle" className="text-green-500" />}
                                title="20/11/2025"
                                subTitle="Có mặt"
                            />
                        </List>
                    </Box>
                </Box>

                <Box p={4} className="pb-8">
                    <Button
                        fullWidth
                        variant="tertiary"
                        className="text-red-500 bg-red-50"
                        onClick={async () => {
                            const { authService } = await import('@/services/authService');
                            authService.logout();
                            window.location.reload();
                        }}
                    >
                        Đăng xuất
                    </Button>
                </Box>
            </Box>
        </Page>
    );
}

export default ParentDashboardPage;
