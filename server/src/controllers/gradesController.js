const db = require('../config/db');

const gradesController = {
    // Get grades for a class
    async getGrades(req, res) {
        try {
            const { classId } = req.query;

            if (!classId) {
                return res.status(400).json({ error: 'classId is required' });
            }

            // Verify class ownership
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists) {
                return res.status(404).json({ error: 'Class not found' });
            }

            if (classDoc.data().user_id !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const snapshot = await db.collection('grades').where('class_id', '==', classId).get();
            const grades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.json({ grades });
        } catch (error) {
            console.error('Get grades error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Save grade
    async saveGrade(req, res) {
        try {
            const { classId, studentId, score, comment, type } = req.body;

            if (!classId || !studentId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Verify class ownership
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists) {
                return res.status(404).json({ error: 'Class not found' });
            }

            if (classDoc.data().user_id !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Get student name to denormalize
            const studentDoc = await db.collection('students').doc(studentId).get();
            if (!studentDoc.exists) {
                return res.status(404).json({ error: 'Student not found' });
            }
            const studentName = studentDoc.data().name;

            // Upsert grade
            const gradesRef = db.collection('grades');
            const snapshot = await gradesRef
                .where('class_id', '==', classId)
                .where('student_id', '==', studentId)
                .where('type', '==', type || 'regular')
                .get();

            let grade;
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                await doc.ref.update({
                    score,
                    comment,
                    student_name: studentName, // Update name just in case
                    updated_at: new Date()
                });
                grade = { id: doc.id, ...doc.data(), score, comment, student_name: studentName };
            } else {
                const newGrade = {
                    class_id: classId,
                    student_id: studentId,
                    student_name: studentName,
                    score,
                    comment,
                    type: type || 'regular',
                    created_at: new Date(),
                    updated_at: new Date()
                };
                const docRef = await gradesRef.add(newGrade);
                grade = { id: docRef.id, ...newGrade };
            }

            res.json({ success: true, grade });
        } catch (error) {
            console.error('Save grade error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = gradesController;
