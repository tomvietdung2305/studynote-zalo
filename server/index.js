const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const classRoutes = require('./src/routes/classes');
const attendanceRoutes = require('./src/routes/attendance');
const gradesRoutes = require('./src/routes/grades');
const notificationRoutes = require('./src/routes/notifications');
const parentRoutes = require('./src/routes/parents');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/parents', parentRoutes);

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
