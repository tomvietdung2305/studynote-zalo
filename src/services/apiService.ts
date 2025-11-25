// API Base URL - Uses env var in production, localhost in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Check if we're in offline mode
const isOfflineMode = () => {
    return false; // FORCE ONLINE MODE for Firestore integration
    // const token = localStorage.getItem('auth_token');
    // return token === 'offline_dev_token';
};

// Mock data storage for offline mode
const offlineStorage = {
    getClasses: () => {
        const stored = localStorage.getItem('offline_classes');
        return stored ? JSON.parse(stored) : [];
    },
    setClasses: (classes: any[]) => {
        localStorage.setItem('offline_classes', JSON.stringify(classes));
    },
    getStudents: (classId: string) => {
        const stored = localStorage.getItem(`offline_students_${classId}`);
        return stored ? JSON.parse(stored) : [];
    },
    setStudents: (classId: string, students: any[]) => {
        localStorage.setItem(`offline_students_${classId}`, JSON.stringify(students));
    },
};

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = 'offline_dev_token'; // Force dev token
    // const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        // 'Bypass-Tunnel-Reminder': 'true', // Not needed for localhost
        'Authorization': `Bearer ${token || 'offline_dev_token'}`,
    };
};

export const apiService = {
    // Classes
    async getClasses() {
        if (isOfflineMode()) {
            return { classes: offlineStorage.getClasses() };
        }
        const response = await fetch(`${API_BASE_URL}/classes`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch classes');
        return response.json();
    },

    async createClass(classData: { name: string; schedules: any[]; students?: any[] }) {
        if (isOfflineMode()) {
            const classes = offlineStorage.getClasses();
            const newClass = {
                id: `offline_${Date.now()}`,
                ...classData,
                user_id: 'dev_teacher_001',
                total_students: classData.students?.length || 0,
                created_at: new Date().toISOString(),
            };
            classes.push(newClass);
            offlineStorage.setClasses(classes);

            // Store students if provided
            if (classData.students && classData.students.length > 0) {
                offlineStorage.setStudents(newClass.id, classData.students.map((s, i) => ({
                    id: `student_${i}`,
                    name: s.name,
                    class_id: newClass.id,
                    parent_zalo_id: null,
                    connection_code: null,
                })));
            }

            return { success: true, class: newClass };
        }
        const response = await fetch(`${API_BASE_URL}/classes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(classData),
        });
        if (!response.ok) throw new Error('Failed to create class');
        return response.json();
    },

    async updateClass(id: string, classData: { name: string; schedules: any[]; students?: any[] }) {
        if (isOfflineMode()) {
            const classes = offlineStorage.getClasses();
            const index = classes.findIndex((c: any) => c.id === id);
            if (index !== -1) {
                classes[index] = { ...classes[index], ...classData, updated_at: new Date().toISOString() };
                offlineStorage.setClasses(classes);

                // Update students if provided
                if (classData.students) {
                    offlineStorage.setStudents(id, classData.students.map((s: any, i: number) => ({
                        id: s.id || `student_${i}`,
                        name: s.name,
                        class_id: id,
                        parent_zalo_id: s.parent_zalo_id || null,
                        connection_code: s.connection_code || null,
                    })));
                }
            }
            return { success: true };
        }
        const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(classData),
        });
        if (!response.ok) throw new Error('Failed to update class');
        return response.json();
    },

    async deleteClass(id: string) {
        if (isOfflineMode()) {
            const classes = offlineStorage.getClasses();
            const filtered = classes.filter((c: any) => c.id !== id);
            offlineStorage.setClasses(filtered);
            localStorage.removeItem(`offline_students_${id}`);
            return { success: true };
        }
        const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete class');
        return response.json();
    },

    async getClassStudents(id: string) {
        if (isOfflineMode()) {
            return { students: offlineStorage.getStudents(id) };
        }
        const response = await fetch(`${API_BASE_URL}/classes/${id}/students`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch students');
        return response.json();
    },

    // Attendance
    async getAttendance(classId: string, date: string) {
        if (isOfflineMode()) {
            const key = `offline_attendance_${classId}_${date}`;
            const stored = localStorage.getItem(key);
            return { attendance: stored ? JSON.parse(stored) : {} };
        }
        const response = await fetch(
            `${API_BASE_URL}/attendance?classId=${classId}&date=${date}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch attendance');
        return response.json();
    },

    async saveAttendance(classId: string, date: string, attendance: any) {
        if (isOfflineMode()) {
            const key = `offline_attendance_${classId}_${date}`;
            localStorage.setItem(key, JSON.stringify(attendance));
            return { success: true };
        }
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ classId, date, attendance }),
        });
        if (!response.ok) throw new Error('Failed to save attendance');
        return response.json();
    },

    async getAttendanceHistory(classId: string) {
        if (isOfflineMode()) {
            return { history: [] };
        }
        const response = await fetch(`${API_BASE_URL}/attendance/history/${classId}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch attendance history');
        return response.json();
    },

    async sendNotification(data: { classId: string; message: string }) {
        if (isOfflineMode()) {
            console.log('[Offline Mode] Notification would be sent:', data);
            return { success: true, message: 'Offline mode - notification not sent' };
        }
        const response = await fetch(`${API_BASE_URL}/notifications/send`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send notification');
        }
        return response.json();
    },

    // Parent Connection
    async generateCodes(classId: string) {
        if (isOfflineMode()) {
            const students = offlineStorage.getStudents(classId);
            const updated = students.map((s: any) => ({
                ...s,
                connection_code: s.connection_code || Math.random().toString(36).substring(2, 8).toUpperCase(),
            }));
            offlineStorage.setStudents(classId, updated);
            return { success: true, message: 'Đã tạo mã kết nối (Offline)' };
        }
        const response = await fetch(`${API_BASE_URL}/classes/${classId}/generate-codes`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to generate codes');
        return response.json();
    },

    async connectParent(code: string) {
        if (isOfflineMode()) {
            throw new Error('Không thể kết nối phụ huynh ở chế độ Offline');
        }
        const response = await fetch(`${API_BASE_URL}/parents/connect`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to connect');
        }
        return response.json();
    },

    async getChildren() {
        if (isOfflineMode()) {
            return { children: [] };
        }
        const response = await fetch(`${API_BASE_URL}/parents/children`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch children');
        return response.json();
    },

    // Grades
    async getGrades(classId: string) {
        if (isOfflineMode()) {
            const key = `offline_grades_${classId}`;
            const stored = localStorage.getItem(key);
            return { grades: stored ? JSON.parse(stored) : [] };
        }
        const response = await fetch(
            `${API_BASE_URL}/grades?classId=${classId}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch grades');
        return response.json();
    },

    async saveGrade(classId: string, studentId: string, score: number, comment: string) {
        if (isOfflineMode()) {
            const key = `offline_grades_${classId}`;
            const stored = localStorage.getItem(key);
            const grades = stored ? JSON.parse(stored) : [];
            grades.push({
                id: `grade_${Date.now()}`,
                student_id: studentId,
                score,
                comment,
                created_at: new Date().toISOString(),
            });
            localStorage.setItem(key, JSON.stringify(grades));
            return { success: true };
        }
        const response = await fetch(`${API_BASE_URL}/grades`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ classId, studentId, score, comment }),
        });
        if (!response.ok) throw new Error('Failed to save grade');
        return response.json();
    },

    // AI Reports
    async generateReport(data: {
        studentId: string;
        teacherNote?: string; // Optional if tags are used
        tags?: string[];
        tone?: string;
        options?: any;
    }) {
        const response = await fetch(`${API_BASE_URL}/reports/generate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate report');
        return response.json();
    },

    async getStudentReports(studentId: string, limit = 10) {
        const response = await fetch(`${API_BASE_URL}/reports/student/${studentId}?limit=${limit}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to get reports');
        return response.json();
    },

    async getReportById(reportId: string) {
        const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to get report');
        return response.json();
    },

    async sendReportToParent(reportId: string) {
        const response = await fetch(`${API_BASE_URL}/reports/${reportId}/send`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({}), // Empty body for POST
        });
        if (!response.ok) throw new Error('Failed to send report');
        return response.json();
    },

    async updateReport(reportId: string, data: { enhancedReport: string; sections: any }) {
        const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update report');
        return response.json();
    },

    async getStudentById(studentId: string) {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to get student');
        return response.json();
    },
};
