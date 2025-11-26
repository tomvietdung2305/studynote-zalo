import { api } from './api';
import type { Homework, HomeworkSubmission, HomeworkWithSubmissions } from '@/types/homework';

export const homeworkService = {
    // Get all homework for current teacher
    async getAllHomework(classId?: string, status?: 'active' | 'closed'): Promise<Homework[]> {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (status) params.append('status', status);

        const query = params.toString();
        const response = await api.get<{ homework: Homework[] }>(`/homework${query ? '?' + query : ''}`);
        return response.homework;
    },

    // Get single homework with submissions
    async getHomework(id: string): Promise<HomeworkWithSubmissions> {
        return await api.get<HomeworkWithSubmissions>(`/homework/${id}`);
    },

    // Create new homework
    async createHomework(data: {
        classId: string;
        title: string;
        description: string;
        dueDate: string;
        attachments?: string[];
    }): Promise<{ homework: Homework; submissions: HomeworkSubmission[] }> {
        return await api.post('/homework', data);
    },

    // Update homework
    async updateHomework(id: string, data: {
        title?: string;
        description?: string;
        dueDate?: string;
        status?: 'active' | 'closed';
        attachments?: string[];
    }): Promise<{ success: boolean }> {
        return await api.put(`/homework/${id}`, data);
    },

    // Delete homework
    async deleteHomework(id: string): Promise<{ success: boolean }> {
        return await api.delete(`/homework/${id}`);
    },

    // Get submissions for a homework
    async getSubmissions(homeworkId: string): Promise<HomeworkSubmission[]> {
        const response = await api.get<{ submissions: HomeworkSubmission[] }>(`/homework/submissions?homeworkId=${homeworkId}`);
        return response.submissions;
    },

    // Grade a submission
    async gradeSubmission(submissionId: string, grade?: number, feedback?: string): Promise<{ success: boolean }> {
        return await api.post('/homework/submissions/grade', {
            submissionId,
            grade,
            feedback
        });
    }
};
