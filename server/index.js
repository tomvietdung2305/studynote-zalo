const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Simple CORS Configuration - Allow all origins for now
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder', 'ngrok-skip-browser-warning']
}));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const classRoutes = require('./src/routes/classes');
const studentRoutes = require('./src/routes/students');
const attendanceRoutes = require('./src/routes/attendance');
const gradesRoutes = require('./src/routes/grades');
const notificationRoutes = require('./src/routes/notifications');
const parentRoutes = require('./src/routes/parents');
const webhookRoutes = require('./src/routes/webhook');
const reportRoutes = require('./src/routes/reports');
const homeworkRoutes = require('./src/routes/homework');
const scheduleRoutes = require('./src/routes/schedule');
const statisticsRoutes = require('./src/routes/statistics');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/webhook', webhookRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'StudyNote API is running' });
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
