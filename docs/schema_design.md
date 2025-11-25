# Firestore Database Schema Design

This document outlines the database structure for the StudyNote application. Firestore is a NoSQL document database, so data is stored in collections and documents.

## 1. Users Collection (`users`)
Stores teacher and parent profiles.

- **Collection:** `users`
- **Document ID:** `userId` (from Auth or Zalo ID)
- **Fields:**
  - `name` (string): Display name
  - `email` (string): Email address
  - `role` (string): 'teacher' | 'parent'
  - `avatar` (string): URL to avatar image
  - `zalo_id` (string): Zalo User ID (if applicable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 2. Classes Collection (`classes`)
Stores class information created by teachers.

- **Collection:** `classes`
- **Document ID:** Auto-generated
- **Fields:**
  - `user_id` (string): ID of the teacher who owns the class
  - `name` (string): Class name (e.g., "Lớp 5A")
  - `schedules` (array): List of schedule objects
    - `day` (string): "Monday", "Tuesday", etc.
    - `subjects` (array): List of subject names
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 3. Students Collection (`students`)
Stores student profiles linked to classes.

- **Collection:** `students`
- **Document ID:** Auto-generated
- **Fields:**
  - `class_id` (string): Reference to `classes` document
  - `name` (string): Student full name
  - `parent_zalo_id` (string): ID of the connected parent (nullable)
  - `connection_code` (string): 6-digit code for parent connection
  - `avatar` (string): URL to avatar (optional)
  - `created_at` (timestamp)

## 4. Attendance Collection (`attendance_records`)
Stores daily attendance records for a class.

- **Collection:** `attendance_records`
- **Document ID:** Auto-generated
- **Fields:**
  - `class_id` (string): Reference to `classes` document
  - `date` (string): ISO date string (YYYY-MM-DD)
  - `data` (map): Map of student IDs to status
    - Key: `studentId`
    - Value: `status` ('present' | 'absent' | 'late')
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 5. Grades Collection (`grades`)
Stores scores and comments for students.

- **Collection:** `grades`
- **Document ID:** Auto-generated
- **Fields:**
  - `class_id` (string): Reference to `classes` document
  - `student_id` (string): Reference to `students` document
  - `student_name` (string): Denormalized name for easier display
  - `type` (string): 'regular' | 'midterm' | 'final'
  - `score` (number): 0-10
  - `comment` (string): Teacher's comment
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 6. Reports Collection (`reports`)
Stores AI-generated student reports.

- **Collection:** `reports`
- **Document ID:** Auto-generated
- **Fields:**
  - `student_id` (string): Reference to `students` document
  - `teacher_id` (string): Reference to `users` document
  - `teacher_note` (string): Original input from teacher
  - `ai_report` (string): Full generated report text (Markdown)
  - `sections` (map): Parsed sections
    - `general` (string)
    - `strengths` (array)
    - `improvements` (array)
    - `actionPlan` (map)
    - `resources` (array)
  - `tokens_used` (number): Usage tracking
  - `sent_at` (timestamp): When report was sent to parent (nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 7. Notifications Collection (`notifications`)
Stores notifications for users.

- **Collection:** `notifications`
- **Document ID:** Auto-generated
- **Fields:**
  - `user_id` (string): Recipient ID
  - `type` (string): 'report' | 'attendance' | 'system'
  - `title` (string)
  - `message` (string)
  - `data` (map): Metadata (e.g., `{ reportId: '...' }`)
  - `read` (boolean): Read status
  - `created_at` (timestamp)

---

## Migration Plan
To ensure all application data is synchronized with Firestore:

1.  **Frontend Update:** Modify `apiService.ts` to remove "Offline Mode" fallbacks. All data operations will now target the backend API endpoints.
2.  **Backend Verification:** Ensure all controllers correctly handle the `dev_teacher_123` user ID for testing purposes until full authentication is implemented.
3.  **Data Cleanup:** Clear any stale local storage data to prevent confusion.
