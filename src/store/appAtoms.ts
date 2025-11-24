import { atom } from 'jotai';

// Types
export interface StudentInfo {
  id: string;
  name: string;
  averageGrade?: number;
  attendanceCount: number;
  absenceCount: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  students: StudentInfo[];
  schedules: Array<{ dayOfWeek: number; startTime: string; endTime: string }>; // 0=Monday, 6=Sunday
  totalStudents: number;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  attendance: Record<string, 'present' | 'absent'>;
  timestamp: number;
}

// User/Auth atoms
export const currentUserAtom = atom({
  id: 'teacher1',
  name: 'Cô Hương',
  role: 'teacher' as const,
  classes: ['10A', '10B', '10C'],
});

// Classes atom
export const classesAtom = atom<ClassInfo[]>([
  {
    id: '10A',
    name: 'Lớp 10A - Toán',
    students: [
      { id: '1', name: 'Nguyễn Văn A', averageGrade: 8.5, attendanceCount: 18, absenceCount: 2 },
      { id: '2', name: 'Trần Thị B', averageGrade: 7.8, attendanceCount: 19, absenceCount: 1 },
      { id: '3', name: 'Hoàng Văn C', averageGrade: 9.2, attendanceCount: 20, absenceCount: 0 },
      { id: '4', name: 'Phạm Thị D', averageGrade: 6.5, attendanceCount: 17, absenceCount: 3 },
      { id: '5', name: 'Lê Văn E', averageGrade: 8.1, attendanceCount: 19, absenceCount: 1 },
      { id: '6', name: 'Võ Thị F', averageGrade: 7.3, attendanceCount: 18, absenceCount: 2 },
      { id: '7', name: 'Bùi Văn G', averageGrade: 8.9, attendanceCount: 20, absenceCount: 0 },
      { id: '8', name: 'Đỗ Thị H', averageGrade: 7.0, attendanceCount: 16, absenceCount: 4 },
    ],
    schedules: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '08:30' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '08:30' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '08:30' },
    ],
    totalStudents: 40,
  },
  {
    id: '10B',
    name: 'Lớp 10B - Anh Văn',
    students: [
      { id: '1', name: 'Nguyễn Văn A', averageGrade: 7.5, attendanceCount: 15, absenceCount: 3 },
      { id: '2', name: 'Trần Thị B', averageGrade: 8.2, attendanceCount: 17, absenceCount: 1 },
      { id: '3', name: 'Hoàng Văn C', averageGrade: 6.8, attendanceCount: 14, absenceCount: 4 },
    ],
    schedules: [
      { dayOfWeek: 2, startTime: '08:45', endTime: '10:15' },
      { dayOfWeek: 4, startTime: '08:45', endTime: '10:15' },
    ],
    totalStudents: 38,
  },
  {
    id: '10C',
    name: 'Lớp 10C - Vật Lý',
    students: [
      { id: '1', name: 'Nguyễn Văn A', averageGrade: 8.3, attendanceCount: 16, absenceCount: 2 },
      { id: '2', name: 'Trần Thị B', averageGrade: 9.0, attendanceCount: 18, absenceCount: 0 },
    ],
    schedules: [
      { dayOfWeek: 1, startTime: '10:30', endTime: '12:00' },
      { dayOfWeek: 4, startTime: '10:30', endTime: '12:00' },
    ],
    totalStudents: 42,
  },
]);

// Attendance history atom (with dates)
export const attendanceHistoryAtom = atom<AttendanceRecord[]>([
  {
    id: '1',
    classId: '10A',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    attendance: {
      '1': 'present', '2': 'present', '3': 'absent', '4': 'present',
      '5': 'present', '6': 'present', '7': 'present', '8': 'present',
    },
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    classId: '10A',
    date: new Date().toISOString().split('T')[0],
    attendance: {
      '1': 'present', '2': 'present', '3': 'present', '4': 'present',
      '5': 'absent', '6': 'present', '7': 'present', '8': 'present',
    },
    timestamp: Date.now(),
  },
]);

// Attendance atoms
export const attendanceAtom = atom<Record<string, Record<string, 'present' | 'absent'>>>({
  '10A': {
    '1': 'present',
    '2': 'present',
    '3': 'absent',
    '4': 'present',
    '5': 'present',
    '6': 'present',
    '7': 'present',
    '8': 'present',
  },
});

// Grades atoms
export const gradesAtom = atom<Array<{
  id: string;
  studentId: string;
  grade: number;
  comment: string;
  date: string;
}>>([
  {
    id: '1',
    studentId: '1',
    grade: 8.5,
    comment: 'Rất tích cực',
    date: new Date().toISOString().split('T')[0],
  },
]);

// Broadcast messages atom
export const broadcastMessagesAtom = atom<Array<{
  id: string;
  classId: string;
  content: string;
  timestamp: number;
  sentCount: number;
}>>([]);

// Loading state
export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);
