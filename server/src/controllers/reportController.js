const openaiService = require('../services/openaiService');
const db = require('../config/db');

/**
 * Generate AI-enhanced student report
 * POST /api/reports/generate
 */
exports.generateReport = async (req, res) => {
    console.log('\n=== GENERATE REPORT REQUEST ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.userId);

    try {
        const { studentId, teacherNote, options, tags, tone } = req.body;

        // Validate input (Relaxed validation if tags are present)
        if (!studentId || (!teacherNote && (!tags || tags.length === 0))) {
            return res.status(400).json({
                success: false,
                error: 'Vui lòng nhập nhận xét hoặc chọn các thẻ đánh giá'
            });
        }

        // 1. Try to fetch student data (Non-blocking for OpenAI)
        let studentData = { name: 'Học sinh' };
        let className = '';

        try {
            console.log('Fetching student data for ID:', studentId);
            const studentDoc = await db.collection('students').doc(studentId).get();
            if (studentDoc.exists) {
                studentData = studentDoc.data();

                // Get class name
                if (studentData.class_id) {
                    const classDoc = await db.collection('classes').doc(studentData.class_id).get();
                    if (classDoc.exists) {
                        className = classDoc.data().name;
                    }
                }
            } else {
                console.log('⚠️ Student not found in DB, using placeholder.');
            }
        } catch (dbError) {
            console.error('⚠️ DB Error (Fetch Student):', dbError.message);
            // Continue execution to allow OpenAI to work even if DB is broken
        }

        // Prepare context for AI
        const context = {
            recentGrades: [], // Simplified
            attendanceRate: 95,
            previousComments: []
        };

        console.log('Generating report for student:', studentData.name);
        console.log('Teacher note:', teacherNote);

        // 2. Generate report using OpenAI (CRITICAL STEP)
        // This will throw if OpenAI fails, which is what we want (or handle specifically)
        let result;
        try {
            result = await openaiService.generateStudentReport({
                studentName: studentData.name,
                teacherNote,
                context,
                options
            });
            console.log('✅ AI report generated successfully');
        } catch (aiError) {
            console.error('❌ OpenAI Error:', aiError);
            throw aiError; // Re-throw to be caught by outer catch for logging
        }

        // 3. Try to save to Firestore
        let reportId = 'temp_' + Date.now();
        let isSaved = false;

        try {
            const reportData = {
                student_id: studentId,
                teacher_id: req.userId || 'anonymous',
                teacher_note: teacherNote,
                ai_report: result.enhancedReport,
                sections: result.sections,
                tokens_used: result.tokensUsed || 0,
                created_at: new Date()
            };

            const reportRef = await db.collection('reports').add(reportData);
            reportId = reportRef.id;
            isSaved = true;
            console.log('✅ Report saved to Firestore with ID:', reportId);
        } catch (dbError) {
            console.error('⚠️ DB Error (Save Report):', dbError.message);
            // We continue to return the result even if save failed
        }

        // 4. Return result to client
        res.json({
            success: true,
            reportId,
            enhancedReport: result.enhancedReport,
            sections: result.sections,
            confidence: result.confidence,
            studentName: studentData.name,
            className,
            isSaved // Flag to let frontend know if it was saved
        });

    } catch (error) {
        console.error('Generate report fatal error:', error);

        // Log to file
        const fs = require('fs');
        const logMessage = `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n\n`;
        try { fs.appendFileSync('server-error.log', logMessage); } catch (e) { }

        res.status(500).json({
            success: false,
            error: 'Lỗi khi tạo báo cáo: ' + error.message
        });
    }
};

/**
 * Get report history for a student
 * GET /api/reports/student/:studentId
 */
exports.getStudentReports = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { limit = 10 } = req.query;

        const reportsSnapshot = await db.collection('reports')
            .where('student_id', '==', studentId)
            .orderBy('created_at', 'desc')
            .limit(parseInt(limit))
            .get();

        const reports = [];
        for (const doc of reportsSnapshot.docs) {
            const reportData = doc.data();

            // Get student name
            const studentDoc = await db.collection('students').doc(reportData.student_id).get();
            const studentName = studentDoc.exists ? studentDoc.data().name : 'Unknown';

            reports.push({
                id: doc.id,
                ...reportData,
                student_name: studentName,
                created_at: reportData.created_at.toDate().toISOString()
            });
        }

        res.json({
            success: true,
            reports
        });

    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({
            success: false,
            error: 'Lỗi khi tải báo cáo'
        });
    }
};

/**
 * Send report to parent
 * POST /api/reports/:reportId/send
 */
exports.sendReportToParent = async (req, res) => {
    try {
        const { reportId } = req.params;

        // Get report data
        const reportDoc = await db.collection('reports').doc(reportId).get();

        if (!reportDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy báo cáo'
            });
        }

        const report = reportDoc.data();

        // Get student info
        const studentDoc = await db.collection('students').doc(report.student_id).get();
        if (!studentDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy học sinh'
            });
        }

        const student = studentDoc.data();

        // Create notification for parent (if parent_zalo_id exists)
        if (student.parent_zalo_id) {
            await db.collection('notifications').add({
                user_id: student.parent_zalo_id,
                type: 'report',
                title: `Báo cáo học tập - ${student.name}`,
                message: 'Giáo viên vừa gửi báo cáo học tập cho con bạn',
                data: { reportId, studentId: report.student_id },
                created_at: new Date(),
                read: false
            });
        }

        // Update report status
        await db.collection('reports').doc(reportId).update({
            sent_at: new Date()
        });

        res.json({
            success: true,
            message: 'Đã gửi báo cáo đến phụ huynh'
        });

    } catch (error) {
        console.error('Send report error:', error);
        res.status(500).json({
            success: false,
            error: 'Lỗi khi gửi báo cáo'
        });
    }
};

/**
 * Get report by ID
 * GET /api/reports/:reportId
 */
exports.getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;

        const reportDoc = await db.collection('reports').doc(reportId).get();

        if (!reportDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy báo cáo'
            });
        }

        const report = reportDoc.data();

        // Get student name
        const studentDoc = await db.collection('students').doc(report.student_id).get();
        const studentName = studentDoc.exists ? studentDoc.data().name : 'Unknown';

        res.json({
            success: true,
            report: {
                id: reportDoc.id,
                ...report,
                student_name: studentName,
                created_at: report.created_at.toDate().toISOString()
            }
        });

    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({
            success: false,
            error: 'Lỗi khi tải báo cáo'
        });
    }
};

/**
 * Update report content
 * PUT /api/reports/:reportId
 */
exports.updateReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { enhancedReport, sections } = req.body;

        if (!enhancedReport) {
            return res.status(400).json({
                success: false,
                error: 'Nội dung báo cáo không được để trống'
            });
        }

        // Check if report exists
        const reportRef = db.collection('reports').doc(reportId);
        const reportDoc = await reportRef.get();

        if (!reportDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy báo cáo'
            });
        }

        // Update
        await reportRef.update({
            ai_report: enhancedReport,
            sections: sections,
            updated_at: new Date()
        });

        res.json({
            success: true,
            message: 'Cập nhật báo cáo thành công'
        });

    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({
            success: false,
            error: 'Lỗi khi cập nhật báo cáo: ' + error.message
        });
    }
};
