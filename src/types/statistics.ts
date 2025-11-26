export interface DashboardStats {
    total_students: number;
    attendance_rate: number;
    average_grade: number;
    attendance_trend: AttendanceTrendItem[];
    grade_distribution: GradeDistribution;
    calculated_at?: Date | string;
}

export interface AttendanceTrendItem {
    date: string;
    present: number;
    absent: number;
    late?: number;
    total?: number;
    rate: number;
}

export interface GradeDistribution {
    excellent: number; // 9-10
    good: number;      // 7-8.9
    average: number;   // 5-6.9
    poor: number;      // 0-4.9
}

export interface ClassComparison {
    classId: string;
    className: string;
    total_students: number;
    attendance_rate: number;
    average_grade: number;
    attendance_trend: AttendanceTrendItem[];
    grade_distribution: GradeDistribution;
}

export interface StatisticsCache {
    teacher_id: string;
    class_id: string;
    date: string;
    total_students: number;
    attendance_rate: number;
    average_grade: number;
    attendance_trend: AttendanceTrendItem[];
    grade_distribution: GradeDistribution;
    calculated_at: Date | string;
    expires_at: Date | string;
}
