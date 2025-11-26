const db = require('../config/db');

const scheduleController = {
    // Get all exams for a teacher (optionally filter by class or date range)
    async getExams(req, res) {
        try {
            const { classId, startDate, endDate } = req.query;
            const teacherId = req.userId;

            let query = db.collection('exams').where('teacher_id', '==', teacherId);

            if (classId) {
                query = query.where('class_id', '==', classId);
            }

            // Note: Firestore doesn't support range queries on non-indexed fields easily
            // For start/end date filtering, we'll fetch all and filter in memory
            const snapshot = await query.orderBy('date', 'asc').get();
            let exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter by date range if provided
            if (startDate || endDate) {
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                exams = exams.filter(exam => {
                    const examDate = exam.date.toDate ? exam.date.toDate() : new Date(exam.date);
                    if (start && examDate < start) return false;
                    if (end && examDate > end) return false;
                    return true;
                });
            }

            res.json({ exams });
        } catch (error) {
            console.error('Get exams error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get single exam
    async getExam(req, res) {
        try {
            const { id } = req.params;
            const teacherId = req.userId;

            const examDoc = await db.collection('exams').doc(id).get();

            if (!examDoc.exists) {
                return res.status(404).json({ error: 'Exam not found' });
            }

            const examData = examDoc.data();

            // Verify ownership
            if (examData.teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json({ exam: { id: examDoc.id, ...examData } });
        } catch (error) {
            console.error('Get exam error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create new exam
    async createExam(req, res) {
        try {
            const { classId, title, date, type, duration, notes } = req.body;
            const teacherId = req.userId;

            if (!classId || !title || !date) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Verify class ownership
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists) {
                return res.status(404).json({ error: 'Class not found' });
            }

            if (classDoc.data().user_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const examData = {
                class_id: classId,
                teacher_id: teacherId,
                title,
                date: new Date(date),
                type: type || 'other',
                duration: duration || 60,
                notes: notes || '',
                created_at: new Date(),
                updated_at: new Date()
            };

            const examRef = await db.collection('exams').add(examData);

            res.json({
                success: true,
                exam: { id: examRef.id, ...examData }
            });
        } catch (error) {
            console.error('Create exam error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update exam
    async updateExam(req, res) {
        try {
            const { id } = req.params;
            const { title, date, type, duration, notes } = req.body;
            const teacherId = req.userId;

            const examDoc = await db.collection('exams').doc(id).get();

            if (!examDoc.exists) {
                return res.status(404).json({ error: 'Exam not found' });
            }

            if (examDoc.data().teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const updateData = {
                updated_at: new Date()
            };

            if (title) updateData.title = title;
            if (date) updateData.date = new Date(date);
            if (type) updateData.type = type;
            if (duration !== undefined) updateData.duration = duration;
            if (notes !== undefined) updateData.notes = notes;

            await db.collection('exams').doc(id).update(updateData);

            res.json({ success: true });
        } catch (error) {
            console.error('Update exam error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete exam
    async deleteExam(req, res) {
        try {
            const { id } = req.params;
            const teacherId = req.userId;

            const examDoc = await db.collection('exams').doc(id).get();

            if (!examDoc.exists) {
                return res.status(404).json({ error: 'Exam not found' });
            }

            if (examDoc.data().teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await db.collection('exams').doc(id).delete();

            res.json({ success: true });
        } catch (error) {
            console.error('Delete exam error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = scheduleController;
