export interface Homework {
    id: string;
    class_id: string;
    teacher_id: string;
    title: string;
    description: string;
    due_date: Date | string;
    attachments?: string[];
    status: 'active' | 'closed';
    created_at: Date | string;
    updated_at: Date | string;
}

export interface HomeworkSubmission {
    id: string;
    homework_id: string;
    student_id: string;
    student_name: string;
    status: 'pending' | 'submitted' | 'graded' | 'late';
    submitted_at?: Date | string;
    grade?: number;
    feedback?: string;
    attachments?: string[];
    created_at: Date | string;
    updated_at: Date | string;
}

export interface HomeworkWithSubmissions {
    homework: Homework;
    submissions: HomeworkSubmission[];
}
