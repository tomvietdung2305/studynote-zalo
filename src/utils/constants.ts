// API endpoints
export const API_ENDPOINTS = {
  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,
  STUDENT_GRADES: (id: string) => `/students/${id}/grades`,
  STUDENT_ATTENDANCE: (id: string) => `/students/${id}/attendance`,
  STUDENT_SCHEDULE: (id: string) => `/students/${id}/schedule`,

  // Messages
  CONVERSATIONS: '/messages/conversations',
  CONVERSATION_MESSAGES: (id: string) => `/messages/conversations/${id}`,
  SEND_MESSAGE: (id: string) => `/messages/conversations/${id}`,
  MARK_READ: (id: string) => `/messages/${id}/read`,
  MARK_CONVERSATION_READ: (id: string) => `/messages/conversations/${id}/read`,
  UNREAD_COUNT: '/messages/unread-count',

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/mark-all-read',

  // Auth
  PROFILE: '/auth/profile',
  LOGOUT: '/auth/logout',
  VERIFY: '/auth/verify',
};

// Status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  MESSAGES: 5000,
  NOTIFICATIONS: 10000,
  STUDENTS: 30000,
};

// Role constants
export const ROLES = {
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin',
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};

// Notification types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  GRADE: 'grade',
  ATTENDANCE: 'attendance',
  EVENT: 'event',
  GENERAL: 'general',
};
