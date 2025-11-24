const db = require('../config/db');

const parentController = {
    // Connect parent to student via code
    async connectParent(req, res) {
        try {
            const { code } = req.body;
            const parentZaloId = req.userId; // From auth middleware
            const parentName = req.user?.name || 'Phụ huynh'; // Assuming auth middleware populates user info

            if (!code) {
                return res.status(400).json({ error: 'Vui lòng nhập mã kết nối' });
            }

            // 1. Find student by code
            const studentsRef = db.collection('students');
            const snapshot = await studentsRef.where('connection_code', '==', code).get();

            if (snapshot.empty) {
                return res.status(404).json({ error: 'Mã kết nối không hợp lệ' });
            }

            const studentDoc = snapshot.docs[0];
            const student = studentDoc.data();

            // 2. Check if already connected
            if (student.parent_zalo_id) {
                if (student.parent_zalo_id === parentZaloId) {
                    return res.status(200).json({
                        message: 'Bạn đã kết nối với học sinh này rồi',
                        student: { id: studentDoc.id, ...student }
                    });
                }
                return res.status(400).json({ error: 'Học sinh này đã được kết nối với tài khoản khác' });
            }

            // 3. Update student with parent info
            await studentDoc.ref.update({
                parent_zalo_id: parentZaloId,
                parent_name: parentName,
                updated_at: new Date()
            });

            res.json({
                success: true,
                message: 'Kết nối thành công!',
                student: {
                    id: studentDoc.id,
                    ...student,
                    parent_zalo_id: parentZaloId,
                    parent_name: parentName
                }
            });

        } catch (error) {
            console.error('Connect parent error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get list of connected children
    async getChildren(req, res) {
        try {
            const parentZaloId = req.userId;

            const snapshot = await db.collection('students')
                .where('parent_zalo_id', '==', parentZaloId)
                .get();

            const children = [];
            for (const doc of snapshot.docs) {
                const studentData = doc.data();
                // Fetch class name
                const classDoc = await db.collection('classes').doc(studentData.class_id).get();
                const className = classDoc.exists ? classDoc.data().name : 'Unknown Class';

                children.push({
                    id: doc.id,
                    ...studentData,
                    class_name: className
                });
            }

            res.json(children);
        } catch (error) {
            console.error('Get children error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = parentController;
