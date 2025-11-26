import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Input, Select } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { scheduleService } from '@/services/scheduleService';

const { Option } = Select;
const { TextArea } = Input;

function ExamCreatePage() {
    const { goBack } = useAppNavigation();
    const { classes } = useClasses();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        classId: '',
        title: '',
        date: '',
        type: 'quiz' as 'quiz' | 'midterm' | 'final' | 'other',
        duration: 60,
        notes: ''
    });

    useEffect(() => {
        if (classes.length > 0 && !formData.classId) {
            setFormData(prev => ({ ...prev, classId: classes[0].id }));
        }
    }, [classes]);

    const handleSubmit = async () => {
        if (!formData.classId || !formData.title || !formData.date) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            await scheduleService.createExam({
                classId: formData.classId,
                title: formData.title,
                date: new Date(formData.date).toISOString(),
                type: formData.type,
                duration: formData.duration,
                notes: formData.notes
            });
            alert('Tạo lịch thi thành công!');
            goBack();
        } catch (error) {
            console.error('Create exam error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
            {/* Header */}
            <Box className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-b-3xl shadow-lg mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={goBack} className="text-white">
                        ←
                    </button>
                    <Text.Title className="text-white">Tạo lịch thi mới</Text.Title>
                </div>
            </Box>

            {/* Form */}
            <Box className="px-4 mb-20">
                <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                    {/* Class Selector */}
                    <div>
                        <Text className="font-semibold mb-2">Lớp học *</Text>
                        <Select
                            value={formData.classId}
                            onChange={(value) => setFormData(prev => ({ ...prev, classId: value as string }))}
                        >
                            {classes.map(cls => (
                                <Option key={cls.id} value={cls.id} title={cls.name} />
                            ))}
                        </Select>
                    </div>

                    {/* Title */}
                    <div>
                        <Text className="font-semibold mb-2">Tên bài thi *</Text>
                        <Input
                            type="text"
                            placeholder="Nhập tên bài thi..."
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <Text className="font-semibold mb-2">Loại *</Text>
                        <Select
                            value={formData.type}
                            onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                        >
                            <Option value="quiz" title="Kiểm tra" />
                            <Option value="midterm" title="Giữa kỳ" />
                            <Option value="final" title="Cuối kỳ" />
                            <Option value="other" title="Khác" />
                        </Select>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <Text className="font-semibold mb-2">Ngày & Giờ *</Text>
                        <Input
                            type="text"
                            placeholder="YYYY-MM-DDTHH:MM"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                        <Text size="xSmall" className="text-gray-500 mt-1">
                            Định dạng: 2025-12-15T09:00
                        </Text>
                    </div>
                    {/* Duration */}
                    <div>
                        <Text className="font-semibold mb-2">Thời gian (phút)</Text>
                        <Input
                            type="number"
                            placeholder="60"
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <Text className="font-semibold mb-2">Ghi chú</Text>
                        <TextArea
                            placeholder="Nhập ghi chú về bài thi..."
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={4}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                        {loading ? 'Đang lưu...' : 'Tạo lịch thi'}
                    </Button>
                </div>
            </Box>
        </Page>
    );
}

export default ExamCreatePage;
