// Mock API Service - Replace with real API calls later
const API_DELAY = 300; // Simulate network delay

interface AttendancePayload {
  classId: string;
  studentId: string;
  status: 'present' | 'absent';
  date: string;
}

interface GradePayload {
  classId: string;
  studentId: string;
  grade: number;
  comment: string;
}

interface BroadcastPayload {
  classId: string;
  content: string;
}

// Simulated database
let attendanceDB: Record<string, Record<string, 'present' | 'absent'>> = {
  '10A': {
    '1': 'present',
    '2': 'present',
    '3': 'absent',
    '4': 'present',
    '5': 'present',
  },
  '10B': {
    '1': 'present',
    '2': 'present',
    '3': 'present',
    '4': 'absent',
    '5': 'present',
  },
};

let gradesDB: Array<{
  id: string;
  studentId: string;
  classId: string;
  grade: number;
  comment: string;
  date: string;
}> = [];

let broadcastDB: Array<{
  id: string;
  classId: string;
  content: string;
  timestamp: number;
  sentCount: number;
}> = [];

export const attendanceAPI = {
  // Get attendance for a class
  async getAttendance(classId: string) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return attendanceDB[classId] || {};
  },

  // Save attendance
  async saveAttendance(payload: AttendancePayload) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    if (!attendanceDB[payload.classId]) {
      attendanceDB[payload.classId] = {};
    }
    attendanceDB[payload.classId][payload.studentId] = payload.status;
    console.log('✅ Attendance saved:', payload);
    return { success: true, message: 'Đã lưu điểm danh' };
  },

  // Bulk save attendance
  async bulkSaveAttendance(classId: string, data: Record<string, 'present' | 'absent'>) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    attendanceDB[classId] = data;
    console.log('✅ Bulk attendance saved:', { classId, count: Object.keys(data).length });
    return { success: true, message: `Đã lưu điểm danh ${Object.keys(data).length} em` };
  },
};

export const gradesAPI = {
  // Get all grades for a student
  async getStudentGrades(studentId: string) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return gradesDB.filter((g) => g.studentId === studentId);
  },

  // Save grade
  async saveGrade(payload: GradePayload) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const grade = {
      id: String(gradesDB.length + 1),
      studentId: payload.studentId,
      classId: payload.classId,
      grade: payload.grade,
      comment: payload.comment,
      date: new Date().toISOString().split('T')[0],
    };
    gradesDB.push(grade);
    console.log('✅ Grade saved:', grade);
    return { success: true, data: grade };
  },

  // Get all grades for class
  async getClassGrades(classId: string) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return gradesDB.filter((g) => g.classId === classId);
  },
};

export const broadcastAPI = {
  // Send broadcast message
  async sendBroadcast(payload: BroadcastPayload) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY * 2)); // Simulate sending to all
    
    // Get parent count (mock)
    const parentCount = {
      '10A': 40,
      '10B': 38,
      '10C': 42,
    }[payload.classId] || 0;

    const message = {
      id: String(broadcastDB.length + 1),
      classId: payload.classId,
      content: payload.content,
      timestamp: Date.now(),
      sentCount: parentCount,
    };
    broadcastDB.push(message);
    console.log('✅ Broadcast sent:', message);
    return { success: true, sentCount: parentCount };
  },

  // Get broadcast history
  async getBroadcastHistory(classId: string) {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return broadcastDB.filter((m) => m.classId === classId);
  },
};

// Export database for debugging
export const debugAPI = {
  getDB() {
    return { attendanceDB, gradesDB, broadcastDB };
  },
  resetDB() {
    attendanceDB = {
      '10A': { '1': 'present', '2': 'present', '3': 'absent', '4': 'present', '5': 'present' },
      '10B': { '1': 'present', '2': 'present', '3': 'present', '4': 'absent', '5': 'present' },
    };
    gradesDB = [];
    broadcastDB = [];
    console.log('✅ DB reset');
  },
};
