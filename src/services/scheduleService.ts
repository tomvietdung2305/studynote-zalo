import { api } from './api';
import type { Exam } from '@/types/schedule';

export const scheduleService = {
    // Get all exams
    async getExams(classId?: string, startDate?: string, endDate?: string): Promise<Exam[]> {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const query = params.toString();
        const response = await api.get<{ exams: Exam[] }>(`/schedule${query ? '?' + query : ''}`);
        return response.exams;
    },

    // Get single exam
    async getExam(id: string): Promise<Exam> {
        const response = await api.get<{ exam: Exam }>(`/schedule/${id}`);
        return response.exam;
    },

    // Create new exam
    async createExam(data: {
        classId: string;
        title: string;
        date: string;
        type?: 'quiz' | 'midterm' | 'final' | 'other';
        duration?: number;
        notes?: string;
    }): Promise<Exam> {
        const response = await api.post<{ exam: Exam }>('/schedule', data);
        return response.exam;
    },

    // Update exam
    async updateExam(id: string, data: {
        title?: string;
        date?: string;
        type?: 'quiz' | 'midterm' | 'final' | 'other';
        duration?: number;
        notes?: string;
    }): Promise<{ success: boolean }> {
        return await api.put(`/schedule/${id}`, data);
    },

    // Delete exam
    async deleteExam(id: string): Promise<{ success: boolean }> {
        return await api.delete(`/schedule/${id}`);
    }
};
