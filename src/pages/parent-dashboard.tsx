import { useState, useEffect } from 'react';
import { Page, Header, Text, Box, List, Icon, Avatar, Button } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { apiService } from '@/services/apiService';
import { FollowOABanner } from '@/components/shared/FollowOABanner';
import { StatsCard } from '@/components/shared/StatsCard';

function ParentDashboardPage() {
    const { navigateTo } = useAppNavigation();
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<any>(null);
    const [showFollowOA, setShowFollowOA] = useState(true);

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
            <Page className="bg-gray-100" style={{ marginTop: '44px' }}>
                <Header title="Phụ Huynh" showBackIcon={false} />
                <Box p={4} className="flex justify-center">
                    <Text>Đang tải dữ liệu...</Text>
                </Box>
            </Page>
        );
    }

    if (children.length === 0) {
        return (
            <Page className="bg-gray-100" style={{ marginTop: '44px' }}>
                <Header title="Phụ Huynh" showBackIcon={false} />
                <Box p={4} className="flex flex-col items-center">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔗</div>
                        <Text.Title className="mb-2">Chưa có kết nối</Text.Title>
                        <Text className="text-gray-600 mb-6">
                            Hãy kết nối với giáo viên để theo dõi con bạn
                        </Text>
                        <Button
                            size="large"
                            onClick={() => navigateTo('parent-connect')}
                        >
                            Kết nối ngay
                        </Button>
                    </div>
                </Box>
            </Page>
        );
    }

    return (
        <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
            <Header title="Sổ Liên Lạc" showBackIcon={false} />

            <Box className="pb-20">
                {/* Student Header Card */}
                <Box className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 pb-12 rounded-b-3xl shadow-lg text-white">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={64}
                            src={selectedChild?.avatar || ""}
                            className="border-2 border-white bg-blue-400"
                        >
                            {selectedChild?.name?.charAt(0)}
                        </Avatar>
                        <div className="flex-1">
                            <Text.Title className="text-white mb-1">
                                {selectedChild?.name}
                            </Text.Title>
                            <Text size="small" className="text-blue-100">
                                Mã HS: {selectedChild?.connection_code}
                            </Text>
                        </div>
                    </div>
                </Box>

                {/* Stats Overview */}
                <Box className="mx-4 -mt-8 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                        <StatsCard
                            icon="zi-check-circle"
                            value="95%"
                            label="Chuyên cần"
                            color="green"
                        />
                        <StatsCard
                            icon="zi-star"
                            value="8.5"
                            label="Điểm TB"
                            color="orange"
                        />
                    </div>
                </Box>

                {/* Follow OA Banner */}
                {showFollowOA && (
                    <Box className="px-4 mb-4">
                        <FollowOABanner
                            variant="inline"
                            message="Nhận thông báo điểm danh & điểm số ngay lập tức"
                            onFollow={() => setShowFollowOA(false)}
                            onDismiss={() => setShowFollowOA(false)}
                        />
                    </Box>
                )}

                {/* Today's Attendance */}
                <Box className="px-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <Text.Title size="small">Điểm danh hôm nay</Text.Title>
                    </div>
                    <Box className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-full p-3">
                                <Icon icon="zi-check-circle" className="text-green-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <Text className="font-semibold text-gray-900">Có mặt</Text>
                                <Text size="small" className="text-gray-500">
                                    {new Date().toLocaleDateString('vi-VN')}
                                </Text>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                    </Box>
                </Box>

                {/* Today's Schedule */}
                <Box className="px-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <Text.Title size="small">📅 Lịch học hôm nay</Text.Title>
                    </div>
                    <Box className="bg-white rounded-xl shadow-sm p-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
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
                        </div>
                    </Box>
                </Box>

                {/* Recent Grades */}
                <Box className="px-4 mb-4">
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
                <Box className="px-4 mb-4">
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

                <Box p={4}>
                    <Button
                        fullWidth
                        variant="tertiary"
                        className="text-red-500"
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
