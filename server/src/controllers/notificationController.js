const db = require('../config/db');

const notificationController = {
    // Send notification to class parents
    async sendNotification(req, res) {
        try {
            const { classId, message } = req.body;

            // 1. Verify ownership of class
            const classDoc = await db.collection('classes').doc(classId).get();

            if (!classDoc.exists) {
                return res.status(404).json({ error: 'Class not found' });
            }

            if (classDoc.data().user_id !== req.userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // 2. Get students with parent_zalo_id
            // Firestore allows != null query but it's tricky with other filters without composite index.
            // Since class size is small, we fetch all students for class and filter.
            const studentsSnapshot = await db.collection('students').where('class_id', '==', classId).get();

            const recipients = studentsSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(s => s.parent_zalo_id);

            if (recipients.length === 0) {
                return res.status(400).json({ error: 'No students with linked Zalo account found in this class' });
            }

            // 3. Send notifications via Zalo Open API (Mini App Notification)
            // ... (Same logic as before for sending)

            const MINI_APP_ID = process.env.ZALO_APP_ID;
            const SECRET_KEY = process.env.ZALO_SECRET_KEY;

            let successCount = 0;
            let failCount = 0;

            // We'll send sequentially for now to avoid rate limits
            for (const recipient of recipients) {
                try {
                    // Mocking the send for now because we don't have a Template ID.
                    console.log(`[Mock Send] To ${recipient.name} (${recipient.parent_zalo_id}): ${message}`);
                    successCount++;
                } catch (err) {
                    console.error(`Failed to send to ${recipient.name}:`, err.message);
                    failCount++;
                }
            }

            res.json({
                success: true,
                sent: successCount,
                failed: failCount,
                message: `Simulated sending to ${successCount} parents.`
            });

        } catch (error) {
            console.error('Send notification error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = notificationController;
