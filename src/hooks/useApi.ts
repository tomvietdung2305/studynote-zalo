import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

export function useClasses() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await apiService.getClasses();
            setClasses(data.classes);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch classes:', err);
            setError('Không thể tải danh sách lớp');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const createClass = async (classData: any) => {
        try {
            await apiService.createClass(classData);
            await fetchClasses(); // Refresh list
            return { success: true };
        } catch (err) {
            console.error('Failed to create class:', err);
            throw err;
        }
    };

    const updateClass = async (id: string, classData: any) => {
        try {
            await apiService.updateClass(id, classData);
            await fetchClasses(); // Refresh list
            return { success: true };
        } catch (err) {
            console.error('Failed to update class:', err);
            throw err;
        }
    };

    const deleteClass = async (id: string) => {
        try {
            await apiService.deleteClass(id);
            await fetchClasses(); // Refresh list
            return { success: true };
        } catch (err) {
            console.error('Failed to delete class:', err);
            throw err;
        }
    };

    return {
        classes,
        loading,
        error,
        fetchClasses,
        createClass,
        updateClass,
        deleteClass,
    };
}

export function useClassStudents(classId: string) {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!classId) {
                setStudents([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await apiService.getClassStudents(classId);
                setStudents(data.students || []);
            } catch (err) {
                console.error('Failed to fetch students:', err);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [classId]);

    return { students, loading };
}

export function useAttendance(classId: string, date: string) {
    const [attendance, setAttendance] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        if (!classId || !date) return;

        try {
            setLoading(true);
            const data = await apiService.getAttendance(classId, date);
            setAttendance(data.attendance || {});
        } catch (err) {
            console.error('Failed to fetch attendance:', err);
            setAttendance({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [classId, date]);

    const saveAttendance = async (attendanceData: any) => {
        try {
            await apiService.saveAttendance(classId, date, attendanceData);
            return { success: true };
        } catch (err) {
            console.error('Failed to save attendance:', err);
            throw err;
        }
    };

    const toggleStudent = (studentId: string) => {
        setAttendance((prev: any) => ({
            ...prev,
            [studentId]: prev[studentId] === 'absent' ? 'present' : 'absent',
        }));
    };

    return {
        attendance,
        loading,
        saveAttendance,
        toggleStudent,
    };
}

export function useAttendanceHistory(classId: string) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!classId) return;
            try {
                setLoading(true);
                const data = await apiService.getAttendanceHistory(classId);
                setHistory(data.history || []);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [classId]);

    return { history, loading };
}

export function useGrades(classId: string) {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGrades = async () => {
        if (!classId) return;
        try {
            setLoading(true);
            const data = await apiService.getGrades(classId);
            setGrades(data.grades || []);
        } catch (err) {
            console.error('Failed to fetch grades:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, [classId]);

    const saveGrade = async (studentId: string, score: number, comment: string) => {
        try {
            await apiService.saveGrade(classId, studentId, score, comment);
            await fetchGrades(); // Refresh
            return { success: true };
        } catch (err) {
            console.error('Failed to save grade:', err);
            throw err;
        }
    };

    return { grades, loading, saveGrade };
}
