# Homework & Schedule Schema Extensions

This document extends the main schema with collections for homework management, exam scheduling, and statistics caching.

## 8. Homework Collection (`homework`)
Stores homework assignments created by teachers.

- **Collection:** `homework`
- **Document ID:** Auto-generated
- **Fields:**
  - `class_id` (string): Reference to `classes` document
  - `teacher_id` (string): Reference to `users` document (teacher who created it)
  - `title` (string): Homework title (e.g., "Chapter 5 Exercises")
  - `description` (string): Detailed instructions
  - `due_date` (timestamp): Deadline for submission
  - `attachments` (array): URLs to attached files (optional)
  - `status` (string): 'active' | 'closed'
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 9. Homework Submissions Collection (`homework_submissions`)
Tracks student submissions for homework assignments.

- **Collection:** `homework_submissions`
- **Document ID:** Auto-generated
- **Fields:**
  - `homework_id` (string): Reference to `homework` document
  - `student_id` (string): Reference to `students` document
  - `student_name` (string): Denormalized for easier display
  - `status` (string): 'pending' | 'submitted' | 'graded' | 'late'
  - `submitted_at` (timestamp): When student submitted (nullable)
  - `grade` (number): Score 0-10 (nullable until graded)
  - `feedback` (string): Teacher's feedback (nullable)
  - `attachments` (array): URLs to submitted files (optional)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

**Note:** Initial implementation will auto-create submission records for all students when homework is created with status 'pending'.

## 10. Exams Collection (`exams`)
Stores exam schedules for classes.

- **Collection:** `exams`
- **Document ID:** Auto-generated
- **Fields:**
  - `class_id` (string): Reference to `classes` document
  - `teacher_id` (string): Reference to `users` document
  - `title` (string): Exam name (e.g., "Midterm Math Test")
  - `date` (timestamp): Exam date and time
  - `type` (string): 'quiz' | 'midterm' | 'final' | 'other'
  - `duration` (number): Duration in minutes
  - `notes` (string): Additional information
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## 11. Statistics Cache Collection (`statistics`)
Caches pre-calculated statistics for performance optimization.

- **Collection:** `statistics`
- **Document ID:** `{teacher_id}_{class_id}_{date}` or `{teacher_id}_overall_{date}`
- **Fields:**
  - `teacher_id` (string): Reference to `users` document
  - `class_id` (string): Reference to `classes` document (or 'overall' for all classes)
  - `date` (string): ISO date string (YYYY-MM-DD)
  - `total_students` (number): Total number of students
  - `attendance_rate` (number): Percentage 0-100
  - `average_grade` (number): Class average 0-10
  - `attendance_trend` (array): Last 7 days attendance data
    - `{ date: string, present: number, absent: number, rate: number }`
  - `grade_distribution` (map): Grade ranges
    - `excellent` (number): Count of grades 9-10
    - `good` (number): Count of grades 7-8.9
    - `average` (number): Count of grades 5-6.9
    - `poor` (number): Count of grades 0-4.9
  - `calculated_at` (timestamp): When stats were calculated
  - `expires_at` (timestamp): Cache expiration (24 hours)

---

## Indexing Strategy

For optimal query performance, create these Firestore indexes:

1. **homework**: 
   - Composite: `class_id ASC, due_date DESC`
   - Composite: `teacher_id ASC, status ASC, due_date DESC`

2. **homework_submissions**:
   - Composite: `homework_id ASC, status ASC`
   - Composite: `student_id ASC, submitted_at DESC`

3. **exams**:
   - Composite: `class_id ASC, date ASC`
   - Composite: `teacher_id ASC, date ASC`

4. **statistics**:
   - Single field: `teacher_id ASC`
   - Single field: `expires_at ASC` (for cleanup)

---

## Data Flow Examples

### Creating Homework
1. Teacher creates homework via API
2. Backend creates `homework` document
3. Backend queries all students in the class
4. Backend creates `homework_submissions` documents for each student with status 'pending'

### Submitting Homework (Future: Parent View)
1. Parent/student submits homework via API
2. Backend updates corresponding `homework_submissions` document
3. Set status to 'submitted', add timestamp and attachments

### Grading Homework
1. Teacher grades submission via API
2. Backend updates `homework_submissions` document
3. Set status to 'graded', add grade and feedback

### Generating Statistics
1. Teacher views dashboard
2. Backend checks `statistics` cache
3. If expired or missing, calculate fresh stats from `attendance_records` and `grades`
4. Save to cache and return
5. If valid cache exists, return immediately
