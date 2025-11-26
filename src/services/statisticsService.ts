import { api } from './api';
import type { DashboardStats, AttendanceTrendItem, GradeDistribution, ClassComparison } from '@/types/statistics';

export const statisticsService = {
    // Get dashboard statistics
    async getDashboardStats(classId?: string): Promise<DashboardStats> {
        const query = classId ? `?classId=${classId}` : '';
        const response = await api.get<{ stats: DashboardStats }>(`/statistics/dashboard${query}`);
        return response.stats;
    },

    // Get attendance statistics (trends)
    async getAttendanceStats(classId: string, days: number = 7): Promise<AttendanceTrendItem[]> {
        const response = await api.get<{ attendanceTrend: AttendanceTrendItem[] }>(
            `/statistics/attendance?classId=${classId}&days=${days}`
        );
        return response.attendanceTrend;
    },

    // Get grade distribution
    async getGradeDistribution(classId: string): Promise<GradeDistribution> {
        const response = await api.get<{ distribution: GradeDistribution }>(
            `/statistics/grades?classId=${classId}`
        );
        return response.distribution;
    },

    // Get class comparison (all classes)
    async getClassComparison(): Promise<ClassComparison[]> {
        const response = await api.get<{ comparisons: ClassComparison[] }>('/statistics/comparison');
        return response.comparisons;
    },

    // Export statistics (returns blob for download)
    async exportStats(classId: string, format: 'pdf' | 'excel', startDate?: string, endDate?: string): Promise<Blob> {
        const params = new URLSearchParams({ classId, format });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`/statistics/export?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Export failed');
        }

        return await response.blob();
    }
};
