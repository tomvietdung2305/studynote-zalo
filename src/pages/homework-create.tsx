import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Input, Select } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { homeworkService } from '@/services/homeworkService';

const { Option } = Select;
const { TextArea } = Input;

function HomeworkCreatePage() {
    const { navigateTo, params, goBack } = useAppNavigation();
    const { classes, loading: classesLoading } = useClasses();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        classId: '',
        title: '',
        description: '',
        dueDate: ''
    });

    const homeworkId = params?.homeworkId;
    const isEdit = !!homeworkId;

    useEffect(() => {
        if (classes.length > 0 && !formData.classId) {
            setFormData(prev => ({ ...prev, classId: classes[0].id }));
        }
    }, [classes]);

    useEffect(() => {
        if (isEdit && homeworkId) {
            loadHomework();
        }
    }, [homeworkId]);

    const loadHomework = async () => {
        try {
            const data = await homeworkService.getHomework(homeworkId);
            const dueDate = new Date(data.homework.due_date);
            const formattedDate = dueDate.toISOString().slice(0, 16);

            setFormData({
                classId: data.homework.class_id,
                title: data.homework.title,
                description: data.homework.description,
                dueDate: formattedDate
            });
        } catch (error) {
            console.error('Load homework error:', error);
        }
    };

    const handleSubmit = async () => {
        if (!formData.classId || !formData.title || !formData.dueDate) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await homeworkService.updateHomework(homeworkId, {
                    title: formData.title,
                    description: formData.description,
                    dueDate: new Date(formData.dueDate).toISOString()
                });
                alert('Cập nhật bài tập thành công!');
            } else {
                await homeworkService.createHomework({
                    classId: formData.classId,
                    title: formData.title,
                    description: formData.description,
                    dueDate: new Date(formData.dueDate).toISOString()
                });
                alert('Tạo bài tập thành công!');
            }
            goBack();
        } catch (error) {
            console.error('Save homework error:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
            {/* Header */}
            <Box className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-b-3xl shadow-lg mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={goBack} className="text-white">
                        ←
                    </button>
                    <Text.Title className="text-white">
                        {isEdit ? 'Sửa bài tập' : 'Tạo bài tập mới'}
                    </Text.Title>
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
                            disabled={isEdit}
                        >
                            {classes.map(cls => (
                                <Option key={cls.id} value={cls.id} title={cls.name} />
                            ))}
                        </Select>
                    </div>

                    {/* Title */}
                    <div>
                        <Text className="font-semibold mb-2">Tiêu đề *</Text>
                        <Input
                            type="text"
                            placeholder="Nhập tiêu đề bài tập..."
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Text className="font-semibold mb-2">Mô tả</Text>
                        <TextArea
                            placeholder="Nhập yêu cầu chi tiết..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={5}
                        />
                    </div>

                    {/* Due Date */}
                    {/* Due Date */}
                    <div>
                        <Text className="font-semibold mb-2">Hạn nộp *</Text>
                        <Input
                            type="text"
                            placeholder="YYYY-MM-DDTHH:MM"
                            value={formData.dueDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                        <Text size="xSmall" className="text-gray-500 mt-1">
                            Định dạng: 2025-12-01T15:00
                        </Text>
                    </div>


                    {/* Submit Button */}
                    <Button
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    >
                        {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật bài tập' : 'Tạo bài tập')}
                    </Button>
                </div>
            </Box>
        </Page>
    );
}

export default HomeworkCreatePage;
