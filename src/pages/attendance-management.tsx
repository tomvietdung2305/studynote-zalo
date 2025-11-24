import { useState } from 'react';
import { useAppNavigation } from '@/context/AppContext';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
}

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Nguyễn Văn A',
    date: '2025-11-20',
    status: 'present',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Trần Thị B',
    date: '2025-11-20',
    status: 'present',
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Lê Văn C',
    date: '2025-11-20',
    status: 'absent',
    reason: 'Bệnh',
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Phạm Thị D',
    date: '2025-11-19',
    status: 'late',
  },
];

const mockStudents = [
  { id: '1', name: 'Nguyễn Văn A' },
  { id: '2', name: 'Trần Thị B' },
  { id: '3', name: 'Lê Văn C' },
  { id: '4', name: 'Phạm Thị D' },
  { id: '5', name: 'Hoàng Văn E' },
];

function AttendanceManagementPage() {
  const { navigateTo } = useAppNavigation();
  const [records, setRecords] = useState(mockAttendanceRecords);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    studentId: '',
    status: 'present' as const,
    reason: '',
  });

  const todayRecords = records.filter((r) => r.date === selectedDate);
  const statusEmojis = {
    present: '✅',
    absent: '❌',
    late: '⏰',
    excused: '📝',
  };

  const statusLabels = {
    present: 'Có mặt',
    absent: 'Vắng mặt',
    late: 'Muộn',
    excused: 'Vắng có phép',
  };

  const handleAddAttendance = () => {
    if (newAttendance.studentId) {
      const student = mockStudents.find((s) => s.id === newAttendance.studentId);
      const attendance: AttendanceRecord = {
        id: String(records.length + 1),
        studentId: newAttendance.studentId,
        studentName: student?.name || '',
        date: selectedDate,
        status: newAttendance.status,
        reason: newAttendance.reason || undefined,
      };
      setRecords([...records, attendance]);
      setNewAttendance({ studentId: '', status: 'present', reason: '' });
      setShowForm(false);
    }
  };

  const absentCount = todayRecords.filter((r) => r.status === 'absent').length;
  const lateCount = todayRecords.filter((r) => r.status === 'late').length;
  const presentCount = todayRecords.filter((r) => r.status === 'present').length;

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px', paddingBottom: '96px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>👥 Quản Lý Điểm Danh</h2>

      {/* Date Selector */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '6px',
          border: '1px solid #ddd',
          marginBottom: '16px',
          fontSize: '14px',
        }}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>{presentCount}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Có mặt</div>
        </div>
        <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>{absentCount}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Vắng</div>
        </div>
        <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706' }}>{lateCount}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Muộn</div>
        </div>
      </div>

      {/* Add Attendance Button */}
      <button
        onClick={() => setShowForm(!showForm)}
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
        {showForm ? '✖ Hủy' : '➕ Thêm Điểm Danh'}
      </button>

      {/* Add Attendance Form */}
      {showForm && (
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #ddd',
          }}
        >
          <select
            value={newAttendance.studentId}
            onChange={(e) => setNewAttendance({ ...newAttendance, studentId: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            <option value="">Chọn học sinh</option>
            {mockStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={newAttendance.status}
            onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value as any })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          >
            <option value="present">✅ Có mặt</option>
            <option value="absent">❌ Vắng mặt</option>
            <option value="late">⏰ Muộn</option>
            <option value="excused">📝 Vắng có phép</option>
          </select>
          {newAttendance.status !== 'present' && (
            <input
              type="text"
              placeholder="Lý do (tùy chọn)"
              value={newAttendance.reason}
              onChange={(e) => setNewAttendance({ ...newAttendance, reason: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
            />
          )}
          <button
            onClick={handleAddAttendance}
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
            Lưu Điểm Danh
          </button>
        </div>
      )}

      {/* Attendance List */}
      <div>
        {todayRecords.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '40px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Không có dữ liệu điểm danh</div>
          </div>
        ) : (
          todayRecords.map((record) => (
            <div
              key={record.id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid #ddd',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{record.studentName}</div>
                  {record.reason && <div style={{ fontSize: '12px', color: '#999' }}>Lý do: {record.reason}</div>}
                </div>
                <div style={{ fontSize: '24px' }}>
                  {statusEmojis[record.status]}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>{statusLabels[record.status]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AttendanceManagementPage;
