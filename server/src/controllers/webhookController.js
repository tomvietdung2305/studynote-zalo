// Webhook controller for Zalo events
const webhookController = {
    // Handle Zalo webhook events
    async handleZaloWebhook(req, res) {
        try {
            console.log('Received Zalo webhook:', JSON.stringify(req.body, null, 2));

            const { event_name, data } = req.body;

            // Handle different event types
            switch (event_name) {
                case 'follow':
                    console.log('User followed OA:', data);
                    break;
                case 'unfollow':
                    console.log('User unfollowed OA:', data);
                    break;
                case 'user_send_text':
                    console.log('User sent message:', data);
                    break;
                default:
                    console.log('Unknown event:', event_name);
            }

            // Always return success to Zalo
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(200).json({ success: true }); // Still return success to prevent retry
        }
    },

    // Verification endpoint for webhook setup
    async verifyWebhook(req, res) {
        try {
            // Zalo may send verification request
            const { challenge } = req.query;
            if (challenge) {
                return res.status(200).send(challenge);
            }
            res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Webhook verification error:', error);
            res.status(500).json({ error: 'Verification failed' });
        }
    }
};

module.exports = webhookController;
