export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
}
