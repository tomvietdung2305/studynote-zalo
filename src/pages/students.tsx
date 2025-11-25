import { useState, useEffect } from 'react';
import { Page, Header, Box, Text, Input, Icon } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { apiService } from '@/services/apiService';

function StudentsPage() {
  const { goBack, navigateTo } = useAppNavigation();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Get all classes first
      const classesData = await apiService.getClasses();

      // Get students from all classes
      const allStudents: any[] = [];
      for (const cls of classesData.classes || []) {
        try {
          const studentsData = await apiService.getClassStudents(cls.id);
          const studentsWithClass = (studentsData.students || []).map((s: any) => ({
            ...s,
            className: cls.name,
            classId: cls.id
          }));
          allStudents.push(...studentsWithClass);
        } catch (err) {
          console.error(`Failed to load students for class ${cls.id}:`, err);
        }
      }

      setStudents(allStudents);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.className?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
      <Header title="Danh sách học sinh" showBackIcon onBackClick={goBack} />

      <Box className="p-4">
        {/* Search */}
        <Box className="mb-4">
          <Input
            placeholder="Tìm kiếm học sinh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white"
            prefix={<Icon icon="zi-search" />}
          />
        </Box>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Text className="text-gray-600">Đang tải...</Text>
          </div>
        )}

        {/* Student List */}
        {!loading && filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👥</div>
            <Text className="text-gray-600">
              {searchQuery ? 'Không tìm thấy học sinh' : 'Chưa có học sinh nào'}
            </Text>
            <Text size="xSmall" className="text-gray-500 mt-1">
              Thêm học sinh từ trang Quản lý lớp
            </Text>
          </div>
        )}

        {!loading && filteredStudents.length > 0 && (
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <Box
                key={student.id}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  navigateTo('student-detail', { student });
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-1">
                      {student.name}
                    </Text>
                    <Text size="xSmall" className="text-gray-600">
                      Lớp {student.className}
                    </Text>
                  </div>
                  <Icon icon="zi-chevron-right" className="text-gray-400" />
                </div>
              </Box>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && students.length > 0 && (
          <Box className="mt-4 bg-blue-50 rounded-xl p-3">
            <Text size="xSmall" className="text-blue-800 text-center">
              📊 Tổng số: {students.length} học sinh
              {searchQuery && ` • Tìm thấy: ${filteredStudents.length}`}
            </Text>
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default StudentsPage;
