const db = require('../config/db');

const attendanceController = {
    // Get attendance records
    async getAttendance(req, res) {
        try {
            const { classId, date } = req.query;

            if (!classId || !date) {
                return res.status(400).json({ error: 'classId and date are required' });
            }

            // Verify class ownership
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists) {
                return res.status(404).json({ error: 'Class not found' });
            }

            if (classDoc.data().user_id !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const snapshot = await db.collection('attendance_records')
                .where('class_id', '==', classId)
                .where('date', '==', date)
                .get();

            if (snapshot.empty) {
                return res.json({ attendance: {} });
            }

            res.json({ attendance: snapshot.docs[0].data().data });
        } catch (error) {
            console.error('Get attendance error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Save attendance
    async saveAttendance(req, res) {
        try {
            const { classId, date, attendance } = req.body;

            if (!classId || !date || !attendance) {
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

            // Upsert attendance record
            const recordsRef = db.collection('attendance_records');
            const snapshot = await recordsRef
                .where('class_id', '==', classId)
                .where('date', '==', date)
                .get();

            let record;
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                await doc.ref.update({
                    data: attendance,
                    updated_at: new Date()
                });
                record = { id: doc.id, ...doc.data(), data: attendance };
            } else {
                const newRecord = {
                    class_id: classId,
                    date,
                    data: attendance,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                const docRef = await recordsRef.add(newRecord);
                record = { id: docRef.id, ...newRecord };
            }

            res.json({ success: true, record });
        } catch (error) {
            console.error('Save attendance error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get attendance history
    async getAttendanceHistory(req, res) {
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

            const snapshot = await db.collection('attendance_records')
                .where('class_id', '==', classId)
                .orderBy('date', 'desc')
                .limit(30)
                .get();

            const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.json({ history });
        } catch (error) {
            console.error('Get attendance history error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = attendanceController;
