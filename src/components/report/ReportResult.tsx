import React, { useState } from 'react';
import { Box, Text, Button, Icon } from 'zmp-ui';

interface ReportResultProps {
    report: any;
    isSaved: boolean;
    onSave: () => void;
    onSend: () => void;
    onEdit: () => void;
    onClose: () => void;
}

export const ReportResult: React.FC<ReportResultProps> = ({
    report, isSaved, onSave, onSend, onEdit, onClose
}) => {
    const [activeTab, setActiveTab] = useState('overview');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show toast here
    };

    return (
        <Box p={4}>
            <Box className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <Text.Title size="small" className="text-white mb-1">Báo cáo hoàn tất ✨</Text.Title>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    {new Date().toLocaleDateString('vi-VN')}
                                </span>
                                {isSaved ? (
                                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Icon icon="zi-check" size={12} /> Đã lưu
                                    </span>
                                ) : (
                                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                                        Chưa lưu
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={onEdit} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                <Icon icon="zi-edit" size={20} />
                            </button>
                            <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                <Icon icon="zi-close" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    {[
                        { id: 'overview', label: 'Tổng quan' },
                        { id: 'details', label: 'Chi tiết' },
                        { id: 'action', label: 'Hành động' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-4 min-h-[300px]">
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Text className="font-bold text-blue-800 flex items-center gap-2">
                                        <span>📝</span> Nhận xét chung
                                    </Text>
                                    <button onClick={() => copyToClipboard(report.sections.general)} className="text-blue-400 hover:text-blue-600">
                                        <Icon icon="zi-copy" size={16} />
                                    </button>
                                </div>
                                <Text className="text-sm text-blue-900 leading-relaxed">
                                    {report.sections.general}
                                </Text>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="animate-fade-in space-y-4">
                            {/* Strengths */}
                            {report.sections.strengths?.length > 0 && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <Text className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                        <span>✨</span> Điểm mạnh
                                    </Text>
                                    <ul className="space-y-2">
                                        {report.sections.strengths.map((item: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-700 flex gap-2">
                                                <span className="text-green-500 mt-0.5">✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Improvements */}
                            {report.sections.improvements?.length > 0 && (
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <Text className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                                        <span>⚠️</span> Cần cải thiện
                                    </Text>
                                    <ul className="space-y-2">
                                        {report.sections.improvements.map((item: string, idx: number) => (
                                            <li key={idx} className="text-sm text-gray-700 flex gap-2">
                                                <span className="text-orange-500 mt-0.5">!</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'action' && (
                        <div className="animate-fade-in space-y-4">
                            {/* Student Plan */}
                            {report.sections.actionPlan?.forStudent?.length > 0 && (
                                <div>
                                    <Text className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span>📚</span> Cho học sinh
                                    </Text>
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <ul className="space-y-2">
                                            {report.sections.actionPlan.forStudent.map((item: string, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                                    <span className="font-medium text-gray-400">{idx + 1}.</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Parent Plan */}
                            {report.sections.actionPlan?.forParent?.length > 0 && (
                                <div>
                                    <Text className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span>👨‍👩‍👧</span> Cho phụ huynh
                                    </Text>
                                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                        <ul className="space-y-2">
                                            {report.sections.actionPlan.forParent.map((item: string, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                                    <span className="font-medium text-purple-400">{idx + 1}.</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-gray-50 border-t flex gap-3">
                    <Button
                        onClick={onSave}
                        disabled={isSaved}
                        className={`flex-1 ${isSaved ? 'bg-gray-300' : 'bg-blue-600'}`}
                    >
                        {isSaved ? 'Đã lưu' : 'Lưu báo cáo'}
                    </Button>
                    <Button
                        onClick={onSend}
                        className="flex-1 bg-purple-600"
                    >
                        Gửi phụ huynh
                    </Button>
                </div>
            </Box>
        </Box>
    );
};
