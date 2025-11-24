import { useEffect, useState } from 'react';
import { Student } from '@/types';
import { studentService } from '@/services/student.service';

interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useStudents(): UseStudentsReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch students'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, error, refetch: fetchStudents };
}
