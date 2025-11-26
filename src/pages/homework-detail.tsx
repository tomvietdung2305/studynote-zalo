import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Sheet } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { homeworkService } from '@/services/homeworkService';
import { SubmissionList } from '@/components/homework/SubmissionList';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { HomeworkWithSubmissions } from '@/types/homework';

function HomeworkDetailPage() {
    const { params, goBack, navigateTo } = useAppNavigation();
    const [data, setData] = useState<HomeworkWithSubmissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const homeworkId = params?.homeworkId;

    useEffect(() => {
        if (homeworkId) {
            loadHomework();
        }
    }, [homeworkId]);

    const loadHomework = async () => {
        setLoading(true);
        try {
            const result = await homeworkService.getHomework(homeworkId);
            setData(result);
        } catch (error) {
            console.error('Load homework error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
            try {
                await homeworkService.deleteHomework(homeworkId);
                alert('Đã xóa bài tập');
                goBack();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Có lỗi xảy ra');
            }
        }
    };

    const handleToggleStatus = async () => {
        if (!data) return;

        const newStatus = data.homework.status === 'active' ? 'closed' : 'active';
        try {
            await homeworkService.updateHomework(homeworkId, { status: newStatus });
            setData(prev => prev ? {
                ...prev,
                homework: { ...prev.homework, status: newStatus }
            } : null);
            alert(`Đã ${newStatus === 'closed' ? 'đóng' : 'mở'} bài tập`);
            setShowMenu(false);
        } catch (error) {
            console.error('Toggle status error:', error);
            alert('Có lỗi xảy ra');
        }
    };

    const handleGrade = async (submissionId: string, grade: number, feedback: string) => {
        try {
            await homeworkService.gradeSubmission(submissionId, grade, feedback);
            loadHomework(); // Reload to show updated grades
        } catch (error) {
            console.error('Grade error:', error);
            alert('Có lỗi khi chấm điểm');
        }
    };

    if (loading) {
        return (
            <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
                <Box className="flex items-center justify-center h-screen">
                    <Text className="text-gray-500">Đang tải...</Text>
                </Box>
            </Page>
        );
    }

    if (!data) {
        return (
            <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
                <Box className="p-6">
                    <Text>Không tìm thấy bài tập</Text>
                    <Button onClick={goBack}>Quay lại</Button>
                </Box>
            </Page>
        );
    }

    const { homework, submissions } = data;
    const dueDate = new Date(homework.due_date);
    const formattedDate = format(dueDate, 'dd/MM/yyyy HH:mm', { locale: vi });
    const isOverdue = dueDate < new Date() && homework.status === 'active';

    const submittedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
    const gradedCount = submissions.filter(s => s.status === 'graded').length;
    const totalCount = submissions.length;

    return (
        <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
            {/* Header */}
            <Box className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-b-3xl shadow-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={goBack} className="text-white text-xl">
                        ←
                    </button>
                    <button onClick={() => setShowMenu(true)} className="text-white text-xl">
                        ⋯
                    </button>
                </div>

                <Text.Title className="text-white mb-2">{homework.title}</Text.Title>

                <div className="flex items-center gap-2 mb-3">
                    <div className={`px-3 py-1 rounded-full text-xs ${homework.status === 'active' ? 'bg-white text-orange-600' : 'bg-gray-200 text-gray-700'
                        }`}>
                        {homework.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                    </div>
                    {isOverdue && (
                        <div className="px-3 py-1 rounded-full text-xs bg-red-500 text-white">
                            Quá hạn!
                        </div>
                    )}
                </div>

                <Text className="text-white text-sm">📅 Hạn nộp: {formattedDate}</Text>
            </Box>

            {/* Description */}
            {homework.description && (
                <Box className="px-4 mb-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <Text className="font-semibold mb-2">Mô tả</Text>
                        <Text className="text-gray-700">{homework.description}</Text>
                    </div>
                </Box>
            )}

            {/* Statistics */}
            <Box className="px-4 mb-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <Text className="font-semibold mb-3">Thống kê nộp bài</Text>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                            <div className="text-xs text-gray-600">Tổng số</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{submittedCount}</div>
                            <div className="text-xs text-gray-600">Đã nộp</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{gradedCount}</div>
                            <div className="text-xs text-gray-600">Đã chấm</div>
                        </div>
                    </div>
                </div>
            </Box>

            {/* Submissions */}
            <Box className="px-4 mb-20">
                <Text className="font-semibold mb-3">Danh sách học sinh</Text>
                <SubmissionList submissions={submissions} onGrade={handleGrade} />
            </Box>

            {/* Action Menu */}
            <Sheet
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box className="p-6">
                    <Text.Title className="mb-4">Thao tác</Text.Title>
                    <div className="space-y-3">
                        <Button
                            fullWidth
                            onClick={() => {
                                setShowMenu(false);
                                navigateTo('homework-create', { homeworkId });
                            }}
                        >
                            ✏️ Sửa bài tập
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleToggleStatus}
                        >
                            {homework.status === 'active' ? '🔒 Đóng bài tập' : '🔓 Mở bài tập'}
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleDelete}
                            className="bg-red-500 text-white"
                        >
                            🗑️ Xóa bài tập
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => setShowMenu(false)}
                        >
                            Hủy
                        </Button>
                    </div>
                </Box>
            </Sheet>
        </Page>
    );
}

export default HomeworkDetailPage;
