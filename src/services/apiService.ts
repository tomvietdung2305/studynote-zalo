const API_BASE_URL = 'http://localhost:3001/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const apiService = {
    // Classes
    async getClasses() {
        const response = await fetch(`${API_BASE_URL}/classes`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch classes');
        return response.json();
    },

    async createClass(classData: { name: string; schedules: any[]; students?: any[] }) {
        const response = await fetch(`${API_BASE_URL}/classes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(classData),
        });
        if (!response.ok) throw new Error('Failed to create class');
        return response.json();
    },

    async updateClass(id: string, classData: { name: string; schedules: any[]; students?: any[] }) {
        const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(classData),
        });
        if (!response.ok) throw new Error('Failed to update class');
        return response.json();
    },

    async deleteClass(id: string) {
        const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete class');
        return response.json();
    },

    async getClassStudents(id: string) {
        const response = await fetch(`${API_BASE_URL}/classes/${id}/students`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch students');
        return response.json();
    },

    // Attendance
    async getAttendance(classId: string, date: string) {
        const response = await fetch(
            `${API_BASE_URL}/attendance?classId=${classId}&date=${date}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch attendance');
        return response.json();
    },

    async saveAttendance(classId: string, date: string, attendance: any) {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ classId, date, attendance }),
        });
        if (!response.ok) throw new Error('Failed to save attendance');
        return response.json();
    },

    async getAttendanceHistory(classId: string) {
        const response = await fetch(`${API_BASE_URL}/attendance/history/${classId}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch attendance history');
        return response.json();
    },

    async sendNotification(data: { classId: string; message: string }) {
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
        const response = await fetch(`${API_BASE_URL}/classes/${classId}/generate-codes`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to generate codes');
        return response.json();
    },

    async connectParent(code: string) {
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
        const response = await fetch(`${API_BASE_URL}/parents/children`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch children');
        return response.json();
    },

    // Grades
    async getGrades(classId: string) {
        const response = await fetch(
            `${API_BASE_URL}/grades?classId=${classId}`,
            { headers: getAuthHeaders() }
        );
        if (!response.ok) throw new Error('Failed to fetch grades');
        return response.json();
    },

    async saveGrade(classId: string, studentId: string, score: number, comment: string) {
        const response = await fetch(`${API_BASE_URL}/grades`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ classId, studentId, score, comment }),
        });
        if (!response.ok) throw new Error('Failed to save grade');
        return response.json();
    },
};
