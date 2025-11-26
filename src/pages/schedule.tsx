import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Select } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { scheduleService } from '@/services/scheduleService';
import { ExamCard } from '@/components/calendar/ExamCard';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Exam } from '@/types/schedule';

const { Option } = Select;

function SchedulePage() {
    const { navigateTo } = useAppNavigation();
    const { classes, loading: classesLoading } = useClasses();
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (classes.length > 0 && selectedClassId === 'all') {
            setSelectedClassId(classes[0].id);
        }
    }, [classes]);

    useEffect(() => {
        loadExams();
    }, [selectedClassId, currentMonth]);

    const loadExams = async () => {
        setLoading(true);
        try {
            const startDate = startOfMonth(currentMonth).toISOString();
            const endDate = endOfMonth(currentMonth).toISOString();

            const data = await scheduleService.getExams(
                selectedClassId !== 'all' ? selectedClassId : undefined,
                startDate,
                endDate
            );
            setExams(data);
        } catch (error) {
            console.error('Load exams error:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupExamsByDate = () => {
        const grouped: Record<string, Exam[]> = {};
        exams.forEach(exam => {
            const dateKey = format(new Date(exam.date), 'yyyy-MM-dd');
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(exam);
        });
        return grouped;
    };

    const groupedExams = groupExamsByDate();
    const sortedDates = Object.keys(groupedExams).sort();

    // Get upcoming exams (next 3)
    const now = new Date();
    const upcomingExams = exams
        .filter(exam => new Date(exam.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

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
                        <div className="text-6xl mb-4">📅</div>
                        <Text.Title className="mb-2">Chưa có lớp học</Text.Title>
                        <Text className="text-gray-600 mb-6">
                            Hãy tạo lớp học trước khi tạo lịch thi
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
            <Box className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-b-3xl shadow-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                    <Text.Title className="text-white">📅 Lịch thi</Text.Title>
                    <Button
                        size="small"
                        onClick={() => navigateTo('exam-create')}
                        className="bg-white text-purple-600"
                    >
                        + Thêm lịch thi
                    </Button>
                </div>

                {/* Class Selector */}
                <Select
                    value={selectedClassId}
                    onChange={(value) => setSelectedClassId(value as string)}
                    className="mb-3"
                >
                    <Option value="all" title="Tất cả lớp" />
                    {classes.map(cls => (
                        <Option key={cls.id} value={cls.id} title={cls.name} />
                    ))}
                </Select>

                {/* Month Navigator */}
                <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="text-white text-xl px-3"
                    >
                        ←
                    </button>
                    <Text className="text-white font-semibold">
                        {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                    </Text>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="text-white text-xl px-3"
                    >
                        →
                    </button>
                </div>
            </Box>

            {/* Upcoming Exams */}
            {upcomingExams.length > 0 && (
                <Box className="px-4 mb-4">
                    <Text className="font-semibold mb-3">Sắp tới</Text>
                    <div className="space-y-3">
                        {upcomingExams.map(exam => (
                            <ExamCard key={exam.id} exam={exam} onClick={() => { }} />
                        ))}
                    </div>
                </Box>
            )}

            {/* Exams by Date */}
            <Box className="px-4 mb-20">
                <Text className="font-semibold mb-3">
                    Tất cả lịch thi - {format(currentMonth, 'MM/yyyy')}
                </Text>

                {loading ? (
                    <Text className="text-center text-gray-500 py-8">Đang tải...</Text>
                ) : sortedDates.length > 0 ? (
                    <div className="space-y-4">
                        {sortedDates.map(dateKey => (
                            <div key={dateKey}>
                                <Text className="text-sm font-semibold text-gray-700 mb-2">
                                    {format(new Date(dateKey), 'EEEE, dd/MM/yyyy', { locale: vi })}
                                </Text>
                                <div className="space-y-2">
                                    {groupedExams[dateKey].map(exam => (
                                        <ExamCard key={exam.id} exam={exam} onClick={() => { }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <Text.Title className="mb-2">Chưa có lịch thi</Text.Title>
                        <Text className="text-gray-600 mb-6">
                            Tạo lịch thi đầu tiên cho lớp học của bạn
                        </Text>
                        <Button onClick={() => navigateTo('exam-create')}>
                            Tạo lịch thi mới
                        </Button>
                    </div>
                )}
            </Box>
        </Page>
    );
}

export default SchedulePage;
