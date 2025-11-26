const db = require('../config/db');

const homeworkController = {
    // Get all homework for a teacher (optionally filter by class)
    async getAllHomework(req, res) {
        try {
            const { classId, status } = req.query;
            const teacherId = req.userId;

            let query = db.collection('homework').where('teacher_id', '==', teacherId);

            if (classId) {
                query = query.where('class_id', '==', classId);
            }

            if (status) {
                query = query.where('status', '==', status);
            }

            const snapshot = await query.orderBy('due_date', 'desc').get();
            const homework = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.json({ homework });
        } catch (error) {
            console.error('Get homework error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get single homework with submissions
    async getHomework(req, res) {
        try {
            const { id } = req.params;
            const teacherId = req.userId;

            const homeworkDoc = await db.collection('homework').doc(id).get();

            if (!homeworkDoc.exists) {
                return res.status(404).json({ error: 'Homework not found' });
            }

            const homeworkData = homeworkDoc.data();

            // Verify ownership
            if (homeworkData.teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Get submissions
            const submissionsSnapshot = await db.collection('homework_submissions')
                .where('homework_id', '==', id)
                .get();

            const submissions = submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.json({
                homework: { id: homeworkDoc.id, ...homeworkData },
                submissions
            });
        } catch (error) {
            console.error('Get homework error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create new homework
    async createHomework(req, res) {
        try {
            const { classId, title, description, dueDate, attachments } = req.body;
            const teacherId = req.userId;

            if (!classId || !title || !dueDate) {
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

            // Create homework
            const homeworkData = {
                class_id: classId,
                teacher_id: teacherId,
                title,
                description: description || '',
                due_date: new Date(dueDate),
                attachments: attachments || [],
                status: 'active',
                created_at: new Date(),
                updated_at: new Date()
            };

            const homeworkRef = await db.collection('homework').add(homeworkData);

            // Get all students in the class
            const studentsSnapshot = await db.collection('students')
                .where('class_id', '==', classId)
                .get();

            // Create submission records for all students
            const batch = db.batch();
            const submissions = [];

            studentsSnapshot.docs.forEach(studentDoc => {
                const studentData = studentDoc.data();
                const submissionRef = db.collection('homework_submissions').doc();
                const submissionData = {
                    homework_id: homeworkRef.id,
                    student_id: studentDoc.id,
                    student_name: studentData.name,
                    status: 'pending',
                    submitted_at: null,
                    grade: null,
                    feedback: null,
                    attachments: [],
                    created_at: new Date(),
                    updated_at: new Date()
                };
                batch.set(submissionRef, submissionData);
                submissions.push({ id: submissionRef.id, ...submissionData });
            });

            await batch.commit();

            res.json({
                success: true,
                homework: { id: homeworkRef.id, ...homeworkData },
                submissions
            });
        } catch (error) {
            console.error('Create homework error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update homework
    async updateHomework(req, res) {
        try {
            const { id } = req.params;
            const { title, description, dueDate, status, attachments } = req.body;
            const teacherId = req.userId;

            const homeworkDoc = await db.collection('homework').doc(id).get();

            if (!homeworkDoc.exists) {
                return res.status(404).json({ error: 'Homework not found' });
            }

            if (homeworkDoc.data().teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const updateData = {
                updated_at: new Date()
            };

            if (title) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (dueDate) updateData.due_date = new Date(dueDate);
            if (status) updateData.status = status;
            if (attachments) updateData.attachments = attachments;

            await db.collection('homework').doc(id).update(updateData);

            res.json({ success: true });
        } catch (error) {
            console.error('Update homework error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete homework
    async deleteHomework(req, res) {
        try {
            const { id } = req.params;
            const teacherId = req.userId;

            const homeworkDoc = await db.collection('homework').doc(id).get();

            if (!homeworkDoc.exists) {
                return res.status(404).json({ error: 'Homework not found' });
            }

            if (homeworkDoc.data().teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Delete homework and all submissions
            const batch = db.batch();
            batch.delete(db.collection('homework').doc(id));

            // Delete all submissions
            const submissionsSnapshot = await db.collection('homework_submissions')
                .where('homework_id', '==', id)
                .get();

            submissionsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            res.json({ success: true });
        } catch (error) {
            console.error('Delete homework error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get submissions for a homework
    async getSubmissions(req, res) {
        try {
            const { homeworkId } = req.query;
            const teacherId = req.userId;

            if (!homeworkId) {
                return res.status(400).json({ error: 'homeworkId is required' });
            }

            // Verify homework ownership
            const homeworkDoc = await db.collection('homework').doc(homeworkId).get();

            if (!homeworkDoc.exists) {
                return res.status(404).json({ error: 'Homework not found' });
            }

            if (homeworkDoc.data().teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const snapshot = await db.collection('homework_submissions')
                .where('homework_id', '==', homeworkId)
                .get();

            const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            res.json({ submissions });
        } catch (error) {
            console.error('Get submissions error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Grade a submission
    async gradeSubmission(req, res) {
        try {
            const { submissionId, grade, feedback } = req.body;
            const teacherId = req.userId;

            if (!submissionId) {
                return res.status(400).json({ error: 'submissionId is required' });
            }

            const submissionDoc = await db.collection('homework_submissions').doc(submissionId).get();

            if (!submissionDoc.exists) {
                return res.status(404).json({ error: 'Submission not found' });
            }

            const submissionData = submissionDoc.data();

            // Verify homework ownership
            const homeworkDoc = await db.collection('homework').doc(submissionData.homework_id).get();

            if (!homeworkDoc.exists || homeworkDoc.data().teacher_id !== teacherId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const updateData = {
                status: 'graded',
                updated_at: new Date()
            };

            if (grade !== undefined) updateData.grade = grade;
            if (feedback !== undefined) updateData.feedback = feedback;

            await db.collection('homework_submissions').doc(submissionId).update(updateData);

            res.json({ success: true });
        } catch (error) {
            console.error('Grade submission error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = homeworkController;
