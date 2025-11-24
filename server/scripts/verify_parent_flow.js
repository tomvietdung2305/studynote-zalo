require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const API_URL = 'http://localhost:3001/api';

async function request(method, path, token, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    return { status: response.status, data };
}

async function run() {
    try {
        console.log('Starting verification...');

        // 1. Create Teacher User
        const teacherRes = await pool.query(
            "INSERT INTO users (zalo_id, name) VALUES ($1, $2) RETURNING id",
            ['teacher_zalo_123', 'Teacher Test']
        );
        const teacherId = teacherRes.rows[0].id;
        const teacherToken = jwt.sign({ userId: teacherId, zaloId: 'teacher_zalo_123' }, process.env.JWT_SECRET);
        console.log('Teacher created. Token generated.');

        // 2. Create Parent User
        const parentRes = await pool.query(
            "INSERT INTO users (zalo_id, name) VALUES ($1, $2) RETURNING id",
            ['parent_zalo_456', 'Parent Test']
        );
        const parentId = parentRes.rows[0].id;
        const parentToken = jwt.sign({ userId: parentId, zaloId: 'parent_zalo_456' }, process.env.JWT_SECRET);
        console.log('Parent created. Token generated.');

        // 3. Create Class (Teacher)
        const classRes = await request('POST', '/classes', teacherToken, {
            name: 'Verification Class',
            schedules: [{ dayOfWeek: 1, startTime: '08:00', endTime: '10:00' }],
            students: [{ name: 'Student A' }]
        });
        if (!classRes.data.success) throw new Error(`Create class failed: ${JSON.stringify(classRes.data)}`);
        const classId = classRes.data.class.id;
        console.log('Class created:', classId);

        // 4. Generate Codes (Teacher)
        const genRes = await request('POST', `/classes/${classId}/generate-codes`, teacherToken);
        if (genRes.status !== 200) throw new Error(`Generate codes failed: ${JSON.stringify(genRes.data)}`);
        console.log('Codes generated:', genRes.data.message);

        // 5. Get Student Code (Teacher)
        const studentsRes = await request('GET', `/classes/${classId}/students`, teacherToken);
        const student = studentsRes.data.students[0];
        const code = student.connection_code;
        if (!code) throw new Error('Student has no code');
        console.log(`Student ${student.name} has code: ${code}`);

        // 6. Connect Parent (Parent)
        const connectRes = await request('POST', '/parents/connect', parentToken, { code });
        if (connectRes.status !== 200) throw new Error(`Connect parent failed: ${JSON.stringify(connectRes.data)}`);
        console.log('Parent connected:', connectRes.data.message);

        // 7. Verify Connection (Parent)
        const childrenRes = await request('GET', '/parents/children', parentToken);
        if (childrenRes.data.length !== 1 || childrenRes.data[0].name !== 'Student A') {
            throw new Error('Verify children failed');
        }
        console.log('Verification successful! Child found:', childrenRes.data[0].name);

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        // Cleanup
        await pool.query("DELETE FROM users WHERE zalo_id IN ('teacher_zalo_123', 'parent_zalo_456')");
        await pool.end();
    }
}

run();
