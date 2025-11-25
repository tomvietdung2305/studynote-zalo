import { useAppNavigation } from '@/context/AppContext';

// Mock data - grades and attendance history
const mockGrades = [
  { subject: 'Toán', score: 8.5, date: '2025-11-20' },
  { subject: 'Văn', score: 7.8, date: '2025-11-19' },
  { subject: 'Anh', score: 9.0, date: '2025-11-18' },
  { subject: 'Lý', score: 7.5, date: '2025-11-15' },
  { subject: 'Hóa', score: 8.2, date: '2025-11-14' },
];

const mockAttendance = [
  { date: '2025-11-20', status: 'present', note: 'Đầy đủ' },
  { date: '2025-11-19', status: 'present', note: 'Đầy đủ' },
  { date: '2025-11-18', status: 'absent', note: 'Vắng (xin phép)' },
  { date: '2025-11-17', status: 'present', note: 'Đầy đủ' },
  { date: '2025-11-16', status: 'present', note: 'Đầy đủ' },
];

const mockComments = [
  {
    id: '1',
    teacher: 'Cô Hương',
    subject: 'Toán',
    comment: 'Con em học tập rất tích cực, tham gia bài làm nhóm tốt',
    date: '2025-11-15',
  },
  {
    id: '2',
    teacher: 'Thầy Minh',
    subject: 'Tiếng Anh',
    comment: 'Cần cải thiện kỹ năng phát âm, hãy luyện tập thêm ở nhà',
    date: '2025-11-12',
  },
];

function StudentDetailPage() {
  const { goBack, navigateTo, params } = useAppNavigation();
  const student = params?.student || { id: '1', name: 'Nguyễn Văn A', class: '10A', gradeAverage: 8.5, attendanceRate: 95 };

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px', paddingBottom: '96px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={goBack}
          style={{
            background: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ← Quay lại
        </button>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Thông tin học sinh</h2>
        <div style={{ width: '60px' }} />
      </div>

      {/* Student Info Card */}
      <div style={{ background: 'white', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '48px' }}>👤</div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{student.name}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Lớp {student.class}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#eff6ff', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{student.gradeAverage}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Điểm trung bình</div>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{student.attendanceRate}%</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Điểm danh</div>
          </div>
        </div>
      </div>

      {/* Grades Section */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>📊 Điểm số gần đây</h3>
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
          {mockGrades.map((grade, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: idx !== mockGrades.length - 1 ? '1px solid #eee' : 'none',
              }}
            >
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{grade.subject}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{grade.date}</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{grade.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Section */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>👥 Điểm danh gần đây</h3>
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
          {mockAttendance.map((att, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: idx !== mockAttendance.length - 1 ? '1px solid #eee' : 'none',
              }}
            >
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{att.date}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{att.note}</div>
              </div>
              <div style={{ fontSize: '20px' }}>
                {att.status === 'present' ? '✅' : '❌'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>💬 Bình luận từ giáo viên</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockComments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
                border: '1px solid #ddd',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{comment.teacher}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{comment.subject}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>{comment.date}</div>
              </div>
              <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{comment.comment}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => {
            navigateTo('student-report', { studentId: student.id });
          }}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ✨ Báo cáo AI
        </button>
        <button
          style={{
            flex: 1,
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          💬 Tin nhắn
        </button>
      </div>
    </div>
  );
}

export default StudentDetailPage;
