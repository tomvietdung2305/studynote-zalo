import { useState, useEffect } from 'react';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses, useAttendanceHistory, useClassStudents } from '@/hooks/useApi';
import { Page, Header, Box, Text, Icon } from 'zmp-ui';

function AttendanceHistoryPage() {
  const { goBack } = useAppNavigation();
  const { classes } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Set first class as default
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { history, loading: loadingHistory } = useAttendanceHistory(selectedClassId);
  const { students } = useClassStudents(selectedClassId);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  // Get student names map
  const studentNamesMap: Record<string, string> = {};
  students.forEach(s => {
    studentNamesMap[s.id] = s.name;
  });

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    const dayOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][date.getDay()];
    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  const getStats = (record: any) => {
    const present = Object.values(record.data || {}).filter(s => s === 'present').length;
    const absent = Object.values(record.data || {}).filter(s => s === 'absent').length;
    return { present, absent };
  };

  return (
    <Page className="bg-gray-100">
      <Header title="Lịch Sử Điểm Danh" showBackIcon={true} onBackClick={goBack} />

      <Box p={4} className="pt-20 pb-24">
        {/* Class Selection */}
        <Box className="mb-4">
          <Text.Title size="small" className="mb-2">Chọn Lớp:</Text.Title>
          <Box className="overflow-x-auto whitespace-nowrap pb-2">
            {classes.map(classItem => (
              <div
                key={classItem.id}
                onClick={() => setSelectedClassId(classItem.id)}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  marginRight: '8px',
                  borderRadius: '20px',
                  background: selectedClassId === classItem.id ? '#006AF5' : 'white',
                  color: selectedClassId === classItem.id ? 'white' : '#333',
                  border: selectedClassId === classItem.id ? 'none' : '1px solid #ddd',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {classItem.name}
              </div>
            ))}
          </Box>
        </Box>

        {/* Attendance Records */}
        {loadingHistory ? (
          <Text className="text-center text-gray-500 mt-8">Đang tải lịch sử...</Text>
        ) : history.length > 0 ? (
          <div>
            <Text className="text-gray-500 mb-4 text-sm">
              Tổng cộng: <strong>{history.length}</strong> ngày điểm danh
            </Text>

            {history.map(record => {
              const stats = getStats(record);
              const isExpanded = expandedRecord === record.id;

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-xl mb-3 border border-gray-200 overflow-hidden"
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                    className={`p-4 cursor-pointer flex justify-between items-center transition-colors ${isExpanded ? 'bg-gray-50' : 'bg-white'
                      }`}
                  >
                    <div>
                      <div className="font-bold text-base mb-2">
                        📅 {formatDate(record.date)}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600 font-medium">✅ {stats.present} Có mặt</span>
                        <span className="text-red-600 font-medium">❌ {stats.absent} Vắng</span>
                      </div>
                    </div>
                    <div className="text-xl text-gray-400">{isExpanded ? '▼' : '▶'}</div>
                  </div>

                  {/* Details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(record.data || {}).map(([studentId, status]) => (
                          <div
                            key={studentId}
                            className={`p-3 rounded-lg text-sm ${status === 'present' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                              }`}
                          >
                            <div className="font-medium mb-1 truncate">
                              {studentNamesMap[studentId] || `Học sinh ${studentId.substring(0, 6)}...`}
                            </div>
                            <div className={status === 'present' ? 'text-green-600' : 'text-red-600'}>
                              {status === 'present' ? '✅ Có mặt' : '❌ Vắng'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center pt-10 text-gray-400">
            <div className="text-5xl mb-2">📋</div>
            <div className="font-bold text-base">Chưa có lịch sử điểm danh</div>
            <div className="text-sm mt-1">Hãy thực hiện điểm danh để tạo lịch sử</div>
          </div>
        )}
      </Box>
    </Page>
  );
}

export default AttendanceHistoryPage;
