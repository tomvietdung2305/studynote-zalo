const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authController = {
    // Login with Zalo access token
    async zaloLogin(req, res) {
        try {
            const { accessToken, userInfo } = req.body;

            if (!accessToken || !userInfo || !userInfo.id) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const zaloId = userInfo.id;
            const name = userInfo.name || 'User';
            const avatar = userInfo.avatar || '';

            // Check if user exists
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('zalo_id', '==', zaloId).get();

            let user;
            let userId;

            if (!snapshot.empty) {
                // User exists, update info
                const userDoc = snapshot.docs[0];
                userId = userDoc.id;
                await userDoc.ref.update({
                    name,
                    avatar,
                    updated_at: new Date()
                });
                user = { id: userId, ...userDoc.data(), name, avatar };
            } else {
                // Create new user
                const newUser = {
                    zalo_id: zaloId,
                    name,
                    avatar,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                const docRef = await usersRef.add(newUser);
                userId = docRef.id;
                user = { id: userId, ...newUser };
            }

            // Generate JWT
            const token = jwt.sign(
                { userId: userId, zaloId: zaloId },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get current user info
    async getCurrentUser(req, res) {
        try {
            const userDoc = await db.collection('users').doc(req.userId).get();

            if (!userDoc.exists) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userData = userDoc.data();
            res.json({
                user: {
                    id: userDoc.id,
                    ...userData
                }
            });
        } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authController;
