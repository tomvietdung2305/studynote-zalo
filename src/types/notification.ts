export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: 'message' | 'grade' | 'attendance' | 'event' | 'general';
  data?: Record<string, any>;
}
