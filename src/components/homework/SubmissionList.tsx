import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import type { HomeworkSubmission } from '@/types/homework';

interface SubmissionListProps {
    submissions: HomeworkSubmission[];
    onGrade: (submissionId: string, grade: number, feedback: string) => void;
}

export const SubmissionList: React.FC<SubmissionListProps> = ({ submissions, onGrade }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'graded':
                return 'bg-green-100 text-green-700';
            case 'submitted':
                return 'bg-blue-100 text-blue-700';
            case 'late':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'graded':
                return 'Đã chấm';
            case 'submitted':
                return 'Đã nộp';
            case 'late':
                return 'Nộp trễ';
            default:
                return 'Chưa nộp';
        }
    };

    return (
        <div className="space-y-3">
            {submissions.map((submission) => (
                <Box key={submission.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <Text className="font-semibold text-gray-900">{submission.student_name}</Text>
                        <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                            {getStatusText(submission.status)}
                        </div>
                    </div>

                    {submission.status === 'graded' && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Text size="small" className="font-semibold text-purple-600">
                                    Điểm: {submission.grade}/10
                                </Text>
                            </div>
                            {submission.feedback && (
                                <Text size="xSmall" className="text-gray-600">
                                    Nhận xét: {submission.feedback}
                                </Text>
                            )}
                        </div>
                    )}

                    {submission.status === 'submitted' && (
                        <Text size="xSmall" className="text-gray-600 mb-2">
                            Nộp lúc: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString('vi-VN') : ''}
                        </Text>
                    )}
                </Box>
            ))}

            {submissions.length === 0 && (
                <div className="text-center py-8">
                    <Text className="text-gray-500">Chưa có học sinh nào</Text>
                </div>
            )}
        </div>
    );
};
