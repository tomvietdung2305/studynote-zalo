const db = require('../config/db');

const statisticsController = {
    // Get dashboard statistics
    async getDashboardStats(req, res) {
        try {
            const { classId } = req.query;
            const teacherId = req.userId;

            const today = new Date().toISOString().split('T')[0];
            const cacheKey = classId ? `${teacherId}_${classId}_${today}` : `${teacherId}_overall_${today}`;

            // Check cache first
            const cacheDoc = await db.collection('statistics').doc(cacheKey).get();

            if (cacheDoc.exists) {
                const cacheData = cacheDoc.data();
                const expiresAt = cacheData.expires_at.toDate ? cacheData.expires_at.toDate() : new Date(cacheData.expires_at);

                if (expiresAt > new Date()) {
                    return res.json({ stats: cacheData, cached: true });
                }
            }

            // Calculate fresh stats
            const stats = await calculateStats(teacherId, classId);

            // Save to cache (expires in 24 hours)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);

            const cacheData = {
                ...stats,
                teacher_id: teacherId,
                class_id: classId || 'overall',
                date: today,
                calculated_at: new Date(),
                expires_at: expiresAt
            };

            await db.collection('statistics').doc(cacheKey).set(cacheData);

            res.json({ stats: cacheData, cached: false });
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get attendance statistics (trends over time)
    async getAttendanceStats(req, res) {
        try {
            const { classId, days = 7 } = req.query;
            const teacherId = req.userId;

            if (!classId) {
                return res.status(400).json({ error: 'classId is required' });
            }

            // Verify class ownership
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists || classDoc.data().user_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Get attendance records for the last N days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(days));

            const snapshot = await db.collection('attendance_records')
                .where('class_id', '==', classId)
                .orderBy('date', 'desc')
                .limit(parseInt(days))
                .get();

            const attendanceTrend = snapshot.docs.map(doc => {
                const data = doc.data();
                const attendanceData = data.data || {};
                const total = Object.keys(attendanceData).length;
                const present = Object.values(attendanceData).filter(status => status === 'present').length;
                const absent = Object.values(attendanceData).filter(status => status === 'absent').length;
                const late = Object.values(attendanceData).filter(status => status === 'late').length;

                return {
                    date: data.date,
                    present,
                    absent,
                    late,
                    total,
                    rate: total > 0 ? Math.round((present / total) * 100) : 0
                };
            });

            res.json({ attendanceTrend });
        } catch (error) {
            console.error('Get attendance stats error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get grade distribution
    async getGradeDistribution(req, res) {
        try {
            const { classId } = req.query;
            const teacherId = req.userId;

            if (!classId) {
                return res.status(400).json({ error: 'classId is required' });
            }

            // Verify class ownership
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists || classDoc.data().user_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const snapshot = await db.collection('grades')
                .where('class_id', '==', classId)
                .get();

            const distribution = {
                excellent: 0, // 9-10
                good: 0,      // 7-8.9
                average: 0,   // 5-6.9
                poor: 0       // 0-4.9
            };

            snapshot.docs.forEach(doc => {
                const score = doc.data().score;
                if (score >= 9) distribution.excellent++;
                else if (score >= 7) distribution.good++;
                else if (score >= 5) distribution.average++;
                else distribution.poor++;
            });

            res.json({ distribution });
        } catch (error) {
            console.error('Get grade distribution error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get class comparison (for teachers with multiple classes)
    async getClassComparison(req, res) {
        try {
            const teacherId = req.userId;

            // Get all classes for this teacher
            const classesSnapshot = await db.collection('classes')
                .where('user_id', '==', teacherId)
                .get();

            const comparisons = [];

            for (const classDoc of classesSnapshot.docs) {
                const classId = classDoc.id;
                const className = classDoc.data().name;

                // Get stats for this class
                const stats = await calculateStats(teacherId, classId);

                comparisons.push({
                    classId,
                    className,
                    ...stats
                });
            }

            res.json({ comparisons });
        } catch (error) {
            console.error('Get class comparison error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

// Helper function to calculate statistics
async function calculateStats(teacherId, classId = null) {
    let classQuery = db.collection('classes').where('user_id', '==', teacherId);

    if (classId) {
        classQuery = db.collection('classes').where('user_id', '==', teacherId);
    }

    const classesSnapshot = classId
        ? await db.collection('classes').doc(classId).get()
        : await classQuery.get();

    const classIds = classId
        ? [classId]
        : classesSnapshot.docs.map(doc => doc.id);

    // Get total students
    let totalStudents = 0;
    for (const cId of classIds) {
        const studentsSnapshot = await db.collection('students')
            .where('class_id', '==', cId)
            .get();
        totalStudents += studentsSnapshot.size;
    }

    // Calculate attendance rate (last 7 days)
    const attendanceTrend = [];
    let totalAttendanceRate = 0;
    let attendanceDays = 0;

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        let dayPresent = 0;
        let dayTotal = 0;

        for (const cId of classIds) {
            const attendanceSnapshot = await db.collection('attendance_records')
                .where('class_id', '==', cId)
                .where('date', '==', dateStr)
                .limit(1)
                .get();

            if (!attendanceSnapshot.empty) {
                const attendanceData = attendanceSnapshot.docs[0].data().data || {};
                const present = Object.values(attendanceData).filter(s => s === 'present').length;
                const total = Object.keys(attendanceData).length;

                dayPresent += present;
                dayTotal += total;
            }
        }

        const rate = dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100) : 0;

        attendanceTrend.unshift({
            date: dateStr,
            present: dayPresent,
            absent: dayTotal - dayPresent,
            rate
        });

        if (dayTotal > 0) {
            totalAttendanceRate += rate;
            attendanceDays++;
        }
    }

    const attendanceRate = attendanceDays > 0 ? Math.round(totalAttendanceRate / attendanceDays) : 0;

    // Calculate average grade
    let totalGrades = 0;
    let gradeCount = 0;
    const distribution = {
        excellent: 0,
        good: 0,
        average: 0,
        poor: 0
    };

    for (const cId of classIds) {
        const gradesSnapshot = await db.collection('grades')
            .where('class_id', '==', cId)
            .get();

        gradesSnapshot.docs.forEach(doc => {
            const score = doc.data().score;
            totalGrades += score;
            gradeCount++;

            if (score >= 9) distribution.excellent++;
            else if (score >= 7) distribution.good++;
            else if (score >= 5) distribution.average++;
            else distribution.poor++;
        });
    }

    const averageGrade = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(2) : 0;

    return {
        total_students: totalStudents,
        attendance_rate: attendanceRate,
        average_grade: parseFloat(averageGrade),
        attendance_trend: attendanceTrend,
        grade_distribution: distribution
    };
}

module.exports = statisticsController;
