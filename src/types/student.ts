export interface Student {
  id: string;
  name: string;
  class: string;
  avatar?: string;
  parentId: string;
  gradeAverage?: number;
  attendanceRate?: number;
  lastUpdate?: number;
}
