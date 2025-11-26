import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Select } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { statisticsService } from '@/services/statisticsService';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { ExportButton } from '@/components/statistics/ExportButton';
import type { DashboardStats } from '@/types/statistics';

const { Option } = Select;

function StatisticsPage() {
    const { navigateTo } = useAppNavigation();
    const { classes, loading: classesLoading } = useClasses();
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-select first class
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].id);
        }
    }, [classes]);

    // Load statistics when class changes
    useEffect(() => {
        if (selectedClassId) {
            loadStats();
        }
    }, [selectedClassId]);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await statisticsService.getDashboardStats(selectedClassId);
            setStats(data);
        } catch (error) {
            console.error('Load stats error:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedClass = classes.find(c => c.id === selectedClassId);

    // Prepare data for charts
    const attendanceChartData = stats?.attendance_trend?.map(item => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        'Có mặt': item.present,
        'Vắng': item.absent,
        'Tỷ lệ %': item.rate
    })) || [];

    const gradeChartData = stats?.grade_distribution ? [
        { name: 'Xuất sắc (9-10)', value: stats.grade_distribution.excellent, color: '#10b981' },
        { name: 'Giỏi (7-8.9)', value: stats.grade_distribution.good, color: '#3b82f6' },
        { name: 'Khá (5-6.9)', value: stats.grade_distribution.average, color: '#f59e0b' },
        { name: 'Yếu (0-4.9)', value: stats.grade_distribution.poor, color: '#ef4444' }
    ] : [];

    if (classesLoading) {
        return (
            <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
                <Box className="flex items-center justify-center h-screen">
                    <Text className="text-gray-500">Đang tải...</Text>
                </Box>
            </Page>
        );
    }

    if (classes.length === 0) {
        return (
            <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
                <Box className="p-6">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <Text.Title className="mb-2">Chưa có dữ liệu</Text.Title>
                        <Text className="text-gray-600 mb-6">
                            Hãy tạo lớp học và bắt đầu ghi nhận dữ liệu
                        </Text>
                        <Button onClick={() => navigateTo('class-management')}>
                            Tạo lớp học
                        </Button>
                    </div>
                </Box>
            </Page>
        );
    }

    return (
        <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
            {/* Header */}
            <Box className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-b-3xl shadow-lg mb-4">
                <Text.Title className="text-white mb-4">📊 Thống kê & Báo cáo</Text.Title>

                {/* Class Selector */}
                <Select
                    value={selectedClassId}
                    onChange={(value) => setSelectedClassId(value as string)}
                    className="mb-3"
                >
                    {classes.map(cls => (
                        <Option key={cls.id} value={cls.id} title={cls.name} />
                    ))}
                </Select>

                {selectedClass && stats && (
                    <ExportButton
                        classId={selectedClassId}
                        className={selectedClass.name}
                        stats={stats}
                    />
                )}
            </Box>

            {loading ? (
                <Box className="p-6">
                    <Text className="text-center text-gray-500">Đang tải thống kê...</Text>
                </Box>
            ) : stats ? (
                <>
                    {/* Summary Cards */}
                    <Box className="px-4 mb-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.total_students}</div>
                                <div className="text-xs text-gray-600 mt-1">Học sinh</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.attendance_rate}%</div>
                                <div className="text-xs text-gray-600 mt-1">Điểm danh</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                                <div className="text-2xl font-bold text-purple-600">{stats.average_grade}</div>
                                <div className="text-xs text-gray-600 mt-1">Điểm TB</div>
                            </div>
                        </div>
                    </Box>

                    {/* Attendance Trend Chart */}
                    <Box className="px-4 mb-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <Text.Title size="small" className="mb-3">
                                Xu hướng điểm danh (7 ngày)
                            </Text.Title>
                            {attendanceChartData.length > 0 ? (
                                <LineChart
                                    data={attendanceChartData}
                                    xKey="date"
                                    lines={[
                                        { dataKey: 'Có mặt', name: 'Có mặt', color: '#10b981' },
                                        { dataKey: 'Vắng', name: 'Vắng', color: '#ef4444' },
                                    ]}
                                    height={250}
                                />
                            ) : (
                                <Text className="text-center text-gray-500 py-8">
                                    Chưa có dữ liệu điểm danh
                                </Text>
                            )}
                        </div>
                    </Box>

                    {/* Grade Distribution Chart */}
                    <Box className="px-4 mb-20">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <Text.Title size="small" className="mb-3">
                                Phân bố điểm
                            </Text.Title>
                            {gradeChartData.some(item => item.value > 0) ? (
                                <PieChart data={gradeChartData} height={280} />
                            ) : (
                                <Text className="text-center text-gray-500 py-8">
                                    Chưa có dữ liệu điểm số
                                </Text>
                            )}
                        </div>
                    </Box>
                </>
            ) : (
                <Box className="p-6">
                    <Text className="text-center text-gray-500">Chọn lớp để xem thống kê</Text>
                </Box>
            )}
        </Page>
    );
}

export default StatisticsPage;
