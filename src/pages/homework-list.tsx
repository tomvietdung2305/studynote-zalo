import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Select } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { homeworkService } from '@/services/homeworkService';
import { HomeworkCard } from '@/components/homework/HomeworkCard';
import type { Homework } from '@/types/homework';

const { Option } = Select;

function HomeworkListPage() {
    const { navigateTo } = useAppNavigation();
    const { classes, loading: classesLoading } = useClasses();
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
    const [homework, setHomework] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(false);

    // Auto-select first class
    useEffect(() => {
        if (classes.length > 0 && selectedClassId === 'all') {
            setSelectedClassId(classes[0].id);
        }
    }, [classes]);

    // Load homework when class or status changes
    useEffect(() => {
        if (selectedClassId && selectedClassId !== 'all') {
            loadHomework();
        }
    }, [selectedClassId, statusFilter]);

    const loadHomework = async () => {
        setLoading(true);
        try {
            const data = await homeworkService.getAllHomework(
                selectedClassId !== 'all' ? selectedClassId : undefined,
                statusFilter !== 'all' ? statusFilter : undefined
            );
            setHomework(data);
        } catch (error) {
            console.error('Load homework error:', error);
        } finally {
            setLoading(false);
        }
    };

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
                        <div className="text-6xl mb-4">📝</div>
                        <Text.Title className="mb-2">Chưa có lớp học</Text.Title>
                        <Text className="text-gray-600 mb-6">
                            Hãy tạo lớp học trước khi giao bài tập
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
            <Box className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-b-3xl shadow-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                    <Text.Title className="text-white">📝 Quản lý bài tập</Text.Title>
                    <Button
                        size="small"
                        onClick={() => navigateTo('homework-create')}
                        className="bg-white text-orange-600"
                    >
                        + Thêm bài tập
                    </Button>
                </div>

                {/* Filters */}
                <div className="space-y-2">
                    <Select
                        value={selectedClassId}
                        onChange={(value) => setSelectedClassId(value as string)}
                    >
                        <Option value="all" title="Tất cả lớp" />
                        {classes.map(cls => (
                            <Option key={cls.id} value={cls.id} title={cls.name} />
                        ))}
                    </Select>

                    <Select
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value as 'all' | 'active' | 'closed')}
                    >
                        <Option value="all" title="Tất cả trạng thái" />
                        <Option value="active" title="Đang mở" />
                        <Option value="closed" title="Đã đóng" />
                    </Select>
                </div>
            </Box>

            {/* Homework List */}
            <Box className="px-4 mb-20">
                {loading ? (
                    <Text className="text-center text-gray-500 py-8">Đang tải...</Text>
                ) : homework.length > 0 ? (
                    <div className="space-y-3">
                        {homework.map((hw) => (
                            <HomeworkCard
                                key={hw.id}
                                homework={hw}
                                onClick={() => navigateTo('homework-detail', { homeworkId: hw.id })}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <Text.Title className="mb-2">Chưa có bài tập</Text.Title>
                        <Text className="text-gray-600 mb-6">
                            Tạo bài tập đầu tiên cho lớp học của bạn
                        </Text>
                        <Button onClick={() => navigateTo('homework-create')}>
                            Tạo bài tập mới
                        </Button>
                    </div>
                )}
            </Box>
        </Page>
    );
}

export default HomeworkListPage;
