const db = require('../config/db');

const studentController = {
    // Get student by ID
    async getStudentById(req, res) {
        try {
            const { id } = req.params;

            const studentDoc = await db.collection('students').doc(id).get();

            if (!studentDoc.exists) {
                return res.status(404).json({ error: 'Student not found' });
            }

            const studentData = studentDoc.data();

            // Get class name
            let className = '';
            if (studentData.class_id) {
                const classDoc = await db.collection('classes').doc(studentData.class_id).get();
                if (classDoc.exists) {
                    className = classDoc.data().name;
                }
            }

            res.json({
                id: studentDoc.id,
                ...studentData,
                className
            });
        } catch (error) {
            console.error('Get student error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get all students (across all classes for the teacher)
    async getAllStudents(req, res) {
        try {
            // Get all classes for this teacher
            const classesSnapshot = await db.collection('classes')
                .where('user_id', '==', req.userId)
                .get();

            const classIds = classesSnapshot.docs.map(doc => doc.id);
            const classMap = {};
            classesSnapshot.docs.forEach(doc => {
                classMap[doc.id] = doc.data().name;
            });

            if (classIds.length === 0) {
                return res.json({ students: [] });
            }

            // Get all students from these classes
            const students = [];
            for (const classId of classIds) {
                const studentsSnapshot = await db.collection('students')
                    .where('class_id', '==', classId)
                    .get();

                studentsSnapshot.docs.forEach(doc => {
                    students.push({
                        id: doc.id,
                        ...doc.data(),
                        className: classMap[classId]
                    });
                });
            }

            res.json({ students });
        } catch (error) {
            console.error('Get all students error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = studentController;
