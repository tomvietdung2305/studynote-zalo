export interface Exam {
    id: string;
    class_id: string;
    teacher_id: string;
    title: string;
    date: Date | string;
    type: 'quiz' | 'midterm' | 'final' | 'other';
    duration: number; // in minutes
    notes: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface Schedule {
    dayOfWeek: number; // 0=Monday, 6=Sunday
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    subject?: string;
}
