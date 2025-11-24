import { api } from './api';
import { Student } from '@/types';

export const studentService = {
  // Get all students
  getStudents(): Promise<Student[]> {
    return api.get<Student[]>('/students');
  },

  // Get single student
  getStudent(id: string): Promise<Student> {
    return api.get<Student>(`/students/${id}`);
  },

  // Search students
  searchStudents(query: string): Promise<Student[]> {
    return api.get<Student[]>(`/students/search?q=${encodeURIComponent(query)}`);
  },

  // Get student grades
  getStudentGrades(studentId: string) {
    return api.get(`/students/${studentId}/grades`);
  },

  // Get student attendance
  getStudentAttendance(studentId: string) {
    return api.get(`/students/${studentId}/attendance`);
  },

  // Get student schedule
  getStudentSchedule(studentId: string) {
    return api.get(`/students/${studentId}/schedule`);
  },
};
