import React from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';

interface ReportInputProps {
    note: string;
    setNote: (note: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
    tone: string;
    setTone: (tone: string) => void;
    onGenerate: () => void;
    generating: boolean;
}

const TAG_CATEGORIES = [
    {
        name: 'Học tập',
        tags: ['Tiến bộ nhanh', 'Chăm chỉ', 'Tiếp thu tốt', 'Cần tập trung hơn', 'Giỏi Toán', 'Văn hay']
    },
    {
        name: 'Thái độ',
        tags: ['Ngoan ngoãn', 'Lễ phép', 'Hòa đồng', 'Hay nói chuyện', 'Tích cực phát biểu']
    },
    {
        name: 'Kỹ năng',
        tags: ['Chữ đẹp', 'Làm việc nhóm tốt', 'Tự giác', 'Cần rèn chữ']
    }
];

export const ReportInput: React.FC<ReportInputProps> = ({
    note, setNote, tags, setTags, tone, setTone, onGenerate, generating
}) => {

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    return (
        <Box p={4}>
            {/* 1. Tone Selection */}
            <Box className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <Text.Title size="small" className="mb-3 flex items-center gap-2">
                    <span>🎭</span> Giọng văn báo cáo
                </Text.Title>
                <div className="flex gap-2">
                    {[
                        { value: 'encouraging', label: '🌟 Khích lệ', desc: 'Nhẹ nhàng, động viên' },
                        { value: 'professional', label: '👔 Trang trọng', desc: 'Nghiêm túc, chuẩn mực' },
                        { value: 'strict', label: '⚡️ Nghiêm khắc', desc: 'Thẳng thắn, kỷ luật' }
                    ].map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setTone(t.value)}
                            className={`flex-1 p-2 rounded-lg border text-center transition-all ${tone === t.value
                                ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                                : 'bg-white border-gray-200 text-gray-600'
                                }`}
                        >
                            <div className="text-sm">{t.label}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{t.desc}</div>
                        </button>
                    ))}
                </div>
            </Box>

            {/* 2. Quick Tags */}
            <Box className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <Text.Title size="small" className="mb-3 flex items-center gap-2">
                    <span>🏷️</span> Đặc điểm nổi bật
                </Text.Title>

                <div className="space-y-4">
                    {TAG_CATEGORIES.map((cat) => (
                        <div key={cat.name}>
                            <Text size="xSmall" className="text-gray-500 mb-2 font-medium uppercase tracking-wider">
                                {cat.name}
                            </Text>
                            <div className="flex flex-wrap gap-2">
                                {cat.tags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${tags.includes(tag)
                                            ? 'bg-blue-500 border-blue-500 text-white shadow-md transform scale-105'
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Box>

            {/* 3. Teacher Note */}
            <Box className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <Text.Title size="small" className="mb-2 flex items-center gap-2">
                    <span>📝</span> Ghi chú thêm (Tùy chọn)
                </Text.Title>
                <textarea
                    placeholder="VD: Em cần chú ý hơn trong giờ Toán..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-colors"
                    rows={3}
                />
            </Box>

            {/* Generate Button */}
            <Button
                fullWidth
                size="large"
                onClick={onGenerate}
                disabled={generating || (tags.length === 0 && note.length < 5)}
                className={`mb-4 transition-all ${generating ? 'opacity-80' : 'hover:shadow-lg'}`}
                style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    border: 'none'
                }}
            >
                {generating ? 'Đang phân tích...' : '✨ Tạo báo cáo AI'}
            </Button>

            <Text size="xxSmall" className="text-center text-gray-400">
                AI sẽ kết hợp các thẻ và ghi chú để tạo báo cáo hoàn chỉnh
            </Text>
        </Box>
    );
};
