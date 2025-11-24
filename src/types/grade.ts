export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  maxScore?: number;
  comment?: string;
  date: number;
  semester?: number;
}
