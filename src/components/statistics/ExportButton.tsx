import React, { useState } from 'react';
import { Button, Box, Sheet, Text } from 'zmp-ui';
import { statisticsService } from '@/services/statisticsService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
    classId: string;
    className: string;
    stats: any;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ classId, className, stats }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleExportPDF = async () => {
        setLoading(true);
        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(18);
            doc.text(`Báo cáo thống kê - ${className}`, 14, 20);

            doc.setFontSize(12);
            doc.text(`Ngày: ${new Date().toLocaleDateString('vi-VN')}`, 14, 30);

            // Stats summary
            doc.setFontSize(14);
            doc.text('Tổng quan', 14, 45);

            const summaryData = [
                ['Tổng số học sinh', stats.total_students],
                ['Tỷ lệ điểm danh', `${stats.attendance_rate}%`],
                ['Điểm trung bình', stats.average_grade]
            ];

            autoTable(doc, {
                startY: 50,
                head: [['Chỉ số', 'Giá trị']],
                body: summaryData,
            });

            // Grade distribution
            doc.setFontSize(14);
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            doc.text('Phân bố điểm', 14, finalY);

            const gradeData = [
                ['Xuất sắc (9-10)', stats.grade_distribution?.excellent || 0],
                ['Giỏi (7-8.9)', stats.grade_distribution?.good || 0],
                ['Khá (5-6.9)', stats.grade_distribution?.average || 0],
                ['Yếu (0-4.9)', stats.grade_distribution?.poor || 0]
            ];

            autoTable(doc, {
                startY: finalY + 5,
                head: [['Xếp loại', 'Số lượng']],
                body: gradeData,
            });

            // Save PDF
            doc.save(`bao-cao-${className}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Export PDF error:', error);
            alert('Có lỗi khi xuất PDF');
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    const handleExportExcel = async () => {
        setLoading(true);
        try {
            // Create workbook
            const wb = XLSX.utils.book_new();

            // Summary sheet
            const summaryData = [
                ['Báo cáo thống kê', ''],
                ['Lớp', className],
                ['Ngày', new Date().toLocaleDateString('vi-VN')],
                ['', ''],
                ['Tổng số học sinh', stats.total_students],
                ['Tỷ lệ điểm danh', `${stats.attendance_rate}%`],
                ['Điểm trung bình', stats.average_grade],
                ['', ''],
                ['Phân bố điểm', ''],
                ['Xuất sắc (9-10)', stats.grade_distribution?.excellent || 0],
                ['Giỏi (7-8.9)', stats.grade_distribution?.good || 0],
                ['Khá (5-6.9)', stats.grade_distribution?.average || 0],
                ['Yếu (0-4.9)', stats.grade_distribution?.poor || 0]
            ];

            const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

            // Attendance trend sheet
            if (stats.attendance_trend && stats.attendance_trend.length > 0) {
                const trendData = [
                    ['Ngày', 'Có mặt', 'Vắng', 'Tỷ lệ (%)'],
                    ...stats.attendance_trend.map((item: any) => [
                        item.date,
                        item.present,
                        item.absent,
                        item.rate
                    ])
                ];

                const ws2 = XLSX.utils.aoa_to_sheet(trendData);
                XLSX.utils.book_append_sheet(wb, ws2, 'Xu hướng điểm danh');
            }

            // Save Excel
            XLSX.writeFile(wb, `bao-cao-${className}-${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Export Excel error:', error);
            alert('Có lỗi khi xuất Excel');
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    };

    return (
        <>
            <Button
                size="small"
                onClick={() => setShowMenu(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
                📊 Xuất báo cáo
            </Button>

            <Sheet
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                autoHeight
                mask
                handler
                swipeToClose
            >
                <Box className="p-6">
                    <Text.Title className="mb-4">Chọn định dạng xuất</Text.Title>

                    <div className="space-y-3">
                        <Button
                            fullWidth
                            size="large"
                            onClick={handleExportPDF}
                            disabled={loading}
                            className="bg-red-500 text-white"
                        >
                            {loading ? 'Đang xuất...' : '📄 Xuất PDF'}
                        </Button>

                        <Button
                            fullWidth
                            size="large"
                            onClick={handleExportExcel}
                            disabled={loading}
                            className="bg-green-500 text-white"
                        >
                            {loading ? 'Đang xuất...' : '📊 Xuất Excel'}
                        </Button>

                        <Button
                            fullWidth
                            size="medium"
                            onClick={() => setShowMenu(false)}
                        >
                            Hủy
                        </Button>
                    </div>
                </Box>
            </Sheet>
        </>
    );
};
