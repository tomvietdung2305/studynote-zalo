import { useState } from 'react';
import { useAppNavigation } from '@/context/AppContext';

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  comment?: string;
}

const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Nguyễn Văn A',
    subject: 'Toán',
    score: 8.5,
    maxScore: 10,
    date: '2025-11-20',
    comment: 'Tốt',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Trần Thị B',
    subject: 'Văn',
    score: 9.0,
    maxScore: 10,
    date: '2025-11-20',
    comment: 'Xuất sắc',
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Lê Văn C',
    subject: 'Anh',
    score: 7.5,
    maxScore: 10,
    date: '2025-11-19',
  },
];

function GradeManagementPage() {
  const { navigateTo } = useAppNavigation();
  const [grades, setGrades] = useState(mockGrades);
  const [filterSubject, setFilterSubject] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentName: '',
    subject: '',
    score: '',
    comment: '',
  });

  const filteredGrades = filterSubject
    ? grades.filter((g) => g.subject === filterSubject)
    : grades;

  const subjects = ['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa'];

  const handleAddGrade = () => {
    if (newGrade.studentName && newGrade.subject && newGrade.score) {
      const grade: Grade = {
        id: String(grades.length + 1),
        studentId: '0',
        studentName: newGrade.studentName,
        subject: newGrade.subject,
        score: parseFloat(newGrade.score),
        maxScore: 10,
        date: new Date().toISOString().split('T')[0],
        comment: newGrade.comment || undefined,
      };
      setGrades([...grades, grade]);
      setNewGrade({ studentName: '', subject: '', score: '', comment: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px', paddingBottom: '96px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>📊 Quản Lý Điểm</h2>

      {/* Add Grade Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {showAddForm ? '✖ Hủy' : '➕ Thêm Điểm Mới'}
      </button>

      {/* Add Grade Form */}
      {showAddForm && (
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #ddd',
          }}
        >
          <input
            type="text"
            placeholder="Tên học sinh"
            value={newGrade.studentName}
            onChange={(e) => setNewGrade({ ...newGrade, studentName: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          />
          <select
            value={newGrade.subject}
            onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            <option value="">Chọn môn học</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Điểm (0-10)"
            value={newGrade.score}
            onChange={(e) => setNewGrade({ ...newGrade, score: e.target.value })}
            min="0"
            max="10"
            step="0.5"
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          />
          <input
            type="text"
            placeholder="Nhận xét (tùy chọn)"
            value={newGrade.comment}
            onChange={(e) => setNewGrade({ ...newGrade, comment: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          />
          <button
            onClick={handleAddGrade}
            style={{
              width: '100%',
              padding: '10px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Lưu Điểm
          </button>
        </div>
      )}

      {/* Filter */}
      <select
        value={filterSubject}
        onChange={(e) => setFilterSubject(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '6px',
          border: '1px solid #ddd',
          marginBottom: '16px',
          fontSize: '14px',
        }}
      >
        <option value="">Tất cả môn học</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Grades List */}
      <div>
        {filteredGrades.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '40px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Không có điểm số</div>
          </div>
        ) : (
          filteredGrades.map((grade) => (
            <div
              key={grade.id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid #ddd',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{grade.studentName}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{grade.subject}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>{grade.score}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{grade.date}</div>
                </div>
              </div>
              {grade.comment && (
                <div style={{ fontSize: '14px', color: '#666', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                  💬 {grade.comment}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GradeManagementPage;
