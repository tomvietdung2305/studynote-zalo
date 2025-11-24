import { useAtom } from 'jotai';
import { useState, useCallback } from 'react';
import { attendanceAtom, gradesAtom, broadcastMessagesAtom, loadingAtom, errorAtom } from '@/store/appAtoms';
import { attendanceAPI, gradesAPI, broadcastAPI } from '@/services/mockAPI';

// Attendance Hook
export function useAttendance(classId: string) {
  const [attendance, setAttendance] = useAtom(attendanceAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAttendance = useCallback(
    async (data: Record<string, 'present' | 'absent'>) => {
      try {
        setLoading(true);
        setError(null);
        const result = await attendanceAPI.bulkSaveAttendance(classId, data);
        setAttendance((prev) => ({ ...prev, [classId]: data }));
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi khi lưu điểm danh';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [classId, setAttendance]
  );

  const toggleStudent = useCallback(
    (studentId: string) => {
      setAttendance((prev) => {
        const classAttendance = prev[classId] || {};
        const currentStatus = classAttendance[studentId] || 'present';
        return {
          ...prev,
          [classId]: {
            ...classAttendance,
            [studentId]: currentStatus === 'present' ? 'absent' : 'present',
          },
        };
      });
    },
    [classId, setAttendance]
  );

  return {
    attendance: attendance[classId] || {},
    loading,
    error,
    saveAttendance,
    toggleStudent,
  };
}

// Grades Hook
export function useGrades() {
  const [grades, setGrades] = useAtom(gradesAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGrade = useCallback(
    async (classId: string, studentId: string, grade: number, comment: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await gradesAPI.saveGrade({ classId, studentId, grade, comment });
        setGrades((prev) => [...prev, result.data]);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi khi lưu điểm';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setGrades]
  );

  return {
    grades,
    loading,
    error,
    saveGrade,
  };
}

// Broadcast Hook
export function useBroadcast() {
  const [messages, setMessages] = useAtom(broadcastMessagesAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendBroadcast = useCallback(
    async (classId: string, content: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await broadcastAPI.sendBroadcast({ classId, content });
        const message = {
          id: String(messages.length + 1),
          classId,
          content,
          timestamp: Date.now(),
          sentCount: result.sentCount,
        };
        setMessages((prev) => [...prev, message]);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi khi gửi thông báo';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [messages, setMessages]
  );

  return {
    messages,
    loading,
    error,
    sendBroadcast,
  };
}
