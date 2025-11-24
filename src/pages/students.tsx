import { useState } from 'react';
import { useAppNavigation } from '@/context/AppContext';

const mockStudents = [
  { id: '1', name: 'Nguyễn Văn A', class: '10A', gradeAverage: 8.5, attendanceRate: 95 },
  { id: '2', name: 'Trần Thị B', class: '10A', gradeAverage: 9.0, attendanceRate: 98 },
  { id: '3', name: 'Lê Văn C', class: '10B', gradeAverage: 7.5, attendanceRate: 90 },
  { id: '4', name: 'Phạm Thị D', class: '10B', gradeAverage: 8.8, attendanceRate: 100 },
  { id: '5', name: 'Hoàng Văn E', class: '10C', gradeAverage: 7.0, attendanceRate: 85 },
];

function StudentListPage() {
  const { navigateTo } = useAppNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading] = useState(false);

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px', paddingBottom: '96px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Danh sách học sinh</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên hoặc lớp..."
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '6px',
          border: '1px solid #ddd',
          marginBottom: '16px',
          fontSize: '14px'
        }}
      />

      {filteredStudents.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '40px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔍</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Không tìm thấy học sinh</div>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>Thử tìm kiếm với từ khóa khác</div>
        </div>
      ) : (
        <div>
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => navigateTo('student-detail', { studentId: student.id, student })}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{student.name}</div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Lớp {student.class}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ fontSize: '12px', background: '#dbeafe', color: '#2563eb', padding: '4px 8px', borderRadius: '4px' }}>
                  Điểm TB: {student.gradeAverage}
                </div>
                <div style={{ fontSize: '12px', background: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '4px' }}>
                  Điểm danh: {student.attendanceRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentListPage;
