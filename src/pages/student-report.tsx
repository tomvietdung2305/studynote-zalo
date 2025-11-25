import { useState, useEffect } from 'react';
import { Page, Header, Box, Text, Avatar, Icon } from 'zmp-ui';
import { apiService } from '@/services/apiService';
import { useAppNavigation } from '@/context/AppContext';

// New Components
import { ReportInput } from '@/components/report/ReportInput';
import { ReportLoader } from '@/components/report/ReportLoader';
import { ReportResult } from '@/components/report/ReportResult';

// Types
interface Student {
    id: string;
    name: string;
    className: string;
}

interface Report {
    reportId: string;
    enhancedReport: string;
    sections: any;
    isSaved?: boolean;
}

interface ReportHistory {
    id: string;
    teacher_note: string;
    created_at: string;
    isSaved?: boolean;
}

function StudentReportPage() {
    const { goBack, params } = useAppNavigation();
    const studentId = params?.studentId;

    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    // Report State
    const [generating, setGenerating] = useState(false);
    const [note, setNote] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tone, setTone] = useState('encouraging');
    const [report, setReport] = useState<Report | null>(null);

    // History
    const [recentReports, setRecentReports] = useState<ReportHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);

    // Load student data
    useEffect(() => {
        if (studentId) {
            loadStudentData();
            loadRecentReports();
        }
    }, [studentId]);

    const loadStudentData = async () => {
        if (!studentId) return;
        try {
            setLoading(true);
            const data = await apiService.getStudentById(studentId);
            setStudent(data);
        } catch (error) {
            console.error('Load student error:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRecentReports = async () => {
        if (!studentId) return;
        try {
            const data = await apiService.getStudentReports(studentId, 3);
            setRecentReports(data.reports || []);
        } catch (error) {
            console.error('Load reports error:', error);
        }
    };

    const handleGenerate = async () => {
        if (!studentId) return;

        try {
            setGenerating(true);
            // Artificial delay to show off the loader (min 3s)
            const startTime = Date.now();

            const result = await apiService.generateReport({
                studentId,
                teacherNote: note,
                tags,
                tone,
                options: {
                    includeActionPlan: true
                }
            });

            const elapsed = Date.now() - startTime;
            if (elapsed < 3000) {
                await new Promise(r => setTimeout(r, 3000 - elapsed));
            }

            setReport(result);
            // Don't clear inputs yet, in case they want to regenerate with tweaks
        } catch (error) {
            console.error('Generate error:', error);
            alert('Lỗi khi tạo báo cáo. Vui lòng thử lại.');
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!report) return;

        if (report.reportId.startsWith('temp_')) {
            alert('Không thể lưu bản nháp tạm thời do lỗi kết nối Database ban đầu.');
            return;
        }

        try {
            await apiService.updateReport(report.reportId, {
                enhancedReport: report.enhancedReport,
                sections: report.sections
            });
            alert('Báo cáo đã được lưu thành công!');
            setReport({ ...report, isSaved: true });
            loadRecentReports();
        } catch (error) {
            console.error('Save error:', error);
            alert('Lỗi khi lưu báo cáo.');
        }
    };

    const handleSendToParent = async () => {
        if (!report) return;
        try {
            await apiService.sendReportToParent(report.reportId);
            alert('Đã gửi báo cáo đến phụ huynh!');
        } catch (error) {
            console.error('Send error:', error);
            alert('Lỗi khi gửi báo cáo');
        }
    };

    if (loading) {
        return (
            <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
                <Header title="Báo cáo học tập" showBackIcon onBackClick={goBack} />
                <Box className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </Box>
            </Page>
        );
    }

    return (
        <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
            <Header title="Báo cáo học tập" showBackIcon onBackClick={goBack} />

            <Box className="pb-24">
                {/* Student Info Header */}
                <Box className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 mb-4 rounded-b-[30px] shadow-lg">
                    <div className="flex items-center gap-4">
                        <Avatar size={64} className="border-4 border-white/20 bg-white shadow-xl">
                            <span className="text-blue-600 text-2xl font-bold">
                                {student?.name?.[0]}
                            </span>
                        </Avatar>
                        <div className="flex-1 text-white">
                            <Text.Title className="text-xl font-bold mb-1">
                                {student?.name}
                            </Text.Title>
                            <div className="flex items-center gap-2 opacity-90">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                    Lớp {student?.className}
                                </span>
                                <span className="text-xs">
                                    • ID: {student?.id.slice(0, 6)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Box>

                {/* Main Content Area */}
                <div className="animate-fade-in">
                    {generating ? (
                        <ReportLoader />
                    ) : report ? (
                        <ReportResult
                            report={report}
                            isSaved={!!report.isSaved}
                            onSave={handleSave}
                            onSend={handleSendToParent}
                            onEdit={() => setIsEditing(true)} // TODO: Implement full edit mode
                            onClose={() => setReport(null)}
                        />
                    ) : (
                        <>
                            <ReportInput
                                note={note}
                                setNote={setNote}
                                tags={tags}
                                setTags={setTags}
                                tone={tone}
                                setTone={setTone}
                                onGenerate={handleGenerate}
                                generating={generating}
                            />

                            {/* Recent History Strip */}
                            {recentReports.length > 0 && (
                                <Box p={4} className="mt-4">
                                    <Text.Title size="small" className="text-gray-500 mb-3 uppercase text-xs font-bold tracking-wider">
                                        Gần đây
                                    </Text.Title>
                                    <div className="space-y-3">
                                        {recentReports.map(r => (
                                            <div key={r.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <div className="text-xs text-gray-400 mb-1">
                                                        {new Date(r.created_at).toLocaleDateString('vi-VN')}
                                                    </div>
                                                    <div className="text-sm text-gray-700 line-clamp-1">
                                                        {r.teacher_note || 'Báo cáo tự động'}
                                                    </div>
                                                </div>
                                                <Icon icon="zi-chevron-right" className="text-gray-300" />
                                            </div>
                                        ))}
                                    </div>
                                </Box>
                            )}
                        </>
                    )}
                </div>
            </Box>
        </Page>
    );
}

export default StudentReportPage;
