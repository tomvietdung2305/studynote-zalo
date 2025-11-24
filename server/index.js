const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - Allow frontend origins
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost for development
        if (origin.includes('localhost')) return callback(null, true);

        // Allow Vercel deployments
        if (origin.includes('vercel.app')) return callback(null, true);

        // Allow specific domains
        const allowedOrigins = [
            'https://studynote-frontend-18p0r6ykg-justtoms-projects.vercel.app',
            'https://studynote-frontend.vercel.app'
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for now
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const classRoutes = require('./src/routes/classes');
const attendanceRoutes = require('./src/routes/attendance');
const gradesRoutes = require('./src/routes/grades');
const notificationRoutes = require('./src/routes/notifications');
const parentRoutes = require('./src/routes/parents');
const webhookRoutes = require('./src/routes/webhook');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/parents', parentRoutes);
app.use('/webhook', webhookRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'StudyNote API is running' });
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
