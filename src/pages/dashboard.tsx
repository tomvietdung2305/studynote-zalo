import { useState, useEffect } from 'react';
import { Page, Header, Text, Box, Button, List, Icon, useSnackbar } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses, useClassStudents } from '@/hooks/useApi';
import { requestSendNotification } from 'zmp-sdk';

const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function DashboardPage() {
  const { navigateTo } = useAppNavigation();
  const { classes, loading } = useClasses();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const { openSnackbar } = useSnackbar();

  const requestNotificationPerm = async () => {
    try {
      await requestSendNotification({});
      openSnackbar({
        text: "Đã cấp quyền nhận thông báo!",
        type: "success"
      });
    } catch (error) {
      console.error(error);
      openSnackbar({
        text: "Lỗi cấp quyền hoặc người dùng từ chối",
        type: "error"
      });
    }
  };

  // Fetch students for selected class
  const { students } = useClassStudents(selectedClass);

  // Set first class as selected when classes are loaded
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  const selectedClassData = classes.find(c => c.id === selectedClass) || classes[0];

  if (loading) {
    return (
      <Page className="bg-gray-100">
        <Header title="Sổ Liên Lạc Thông Minh" showBackIcon={false} />
        <Box p={4} className="bg-white">
          <Text>Đang tải dữ liệu...</Text>
        </Box>
      </Page>
    );
  }

  if (!selectedClassData) {
    return (
      <Page className="bg-gray-100">
        <Header title="Sổ Liên Lạc Thông Minh" showBackIcon={false} />
        <Box p={4} className="bg-white">
          <Text>Chưa có lớp học nào. Hãy tạo lớp mới!</Text>
          <Button onClick={() => navigateTo('class-management')} className="mt-4">
            Tạo lớp học
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-100">
      <Header title="Sổ Liên Lạc Thông Minh" showBackIcon={false} />

      <Box p={4} className="bg-white mb-4 pt-20">
        <Text.Title size="small" className="mb-4">Quản lý nhanh</Text.Title>
        <Box className="grid grid-cols-2 gap-4">
          <div onClick={() => navigateTo('class-management')} className="bg-blue-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Icon icon="zi-list-1" />
            </div>
            <span className="font-medium text-sm text-blue-800">Lớp Học</span>
          </div>
          <div onClick={() => navigateTo('quick-attendance')} className="bg-green-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
              <Icon icon="zi-check-circle" />
            </div>
            <span className="font-medium text-sm text-green-800">Điểm Danh</span>
          </div>
          <div onClick={() => navigateTo('grades-input')} className="bg-orange-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm">
              <Icon icon="zi-star" />
            </div>
            <span className="font-medium text-sm text-orange-800">Nhập Điểm</span>
          </div>
          <div onClick={() => navigateTo('broadcast-message')} className="bg-purple-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
              <Icon icon="zi-chat" />
            </div>
            <span className="font-medium text-sm text-purple-800">Gửi Tin</span>
          </div>
          {/* Debug Button for Notification Permission */}
          <div onClick={requestNotificationPerm} className="col-span-2 bg-gray-100 p-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform mt-2">
            <Icon icon="zi-info-circle" className="text-gray-600" />
            <span className="text-xs font-medium text-gray-600">Bật thông báo (Test)</span>
          </div>
        </Box>
      </Box>

      <Box p={4} className="mb-4">
        <Text.Title size="small" className="mb-2">Chọn lớp học</Text.Title>
        <Box flex flexDirection="row" style={{ gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: selectedClass === cls.id ? '#006AF5' : 'white',
                color: selectedClass === cls.id ? 'white' : '#333',
                border: selectedClass === cls.id ? 'none' : '1px solid #ddd',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cls.name} ({cls.total_students || 0})
            </div>
          ))}
        </Box>
      </Box>

      {selectedClassData && (
        <Box p={4} className="bg-white mb-4 mx-4 rounded-lg shadow-sm">
          <Text.Title size="small" className="mb-2">📅 Lịch Dạy Hôm Nay</Text.Title>
          {(() => {
            const today = new Date().getDay();
            const todaySchedules = selectedClassData.schedules.filter(s => s.dayOfWeek === today);

            if (todaySchedules.length === 0) {
              return <Text size="small" className="text-gray-500">Không có lịch dạy hôm nay ({dayNames[today]})</Text>;
            }

            return (
              <Box>
                {todaySchedules.map((schedule, idx) => (
                  <Box key={idx} className="bg-blue-50 p-3 rounded-md mb-2 border-l-4 border-blue-500">
                    <Text className="text-blue-600 font-bold">
                      🕐 {schedule.startTime} - {schedule.endTime}
                    </Text>
                  </Box>
                ))}
              </Box>
            );
          })()}
        </Box>
      )}

      <Box p={4} className="mb-4">
        <Box flex flexDirection="row" style={{ gap: 12 }}>
          <Box className="bg-white p-4 rounded-lg flex-1 text-center shadow-sm">
            <Text.Title size="large" className="text-blue-600">{selectedClassData?.total_students || 0}</Text.Title>
            <Text size="xxSmall" className="text-gray-500">Sĩ số lớp</Text>
          </Box>
          <Box className="bg-red-50 p-4 rounded-lg flex-1 text-center shadow-sm border border-red-100">
            <Text.Title size="large" className="text-red-600">0</Text.Title>
            <Text size="xxSmall" className="text-gray-500">Vắng hôm nay</Text>
          </Box>
        </Box>
      </Box>

      <Box p={4} className="mb-4">
        <Button
          fullWidth
          size="large"
          className="mb-3 bg-green-600 shadow-lg shadow-green-200"
          onClick={() => navigateTo('quick-attendance')}
          prefixIcon={<Icon icon="zi-check-circle" />}
        >
          ⚡ Điểm Danh Nhanh (30s)
        </Button>
      </Box>

      {/* Student List */}
      {students.length > 0 && (
        <Box className="bg-white mt-2 mb-4">
          <Box p={4} pb={0}>
            <Text.Title size="small">📋 Danh sách học sinh ({students.length})</Text.Title>
          </Box>
          <List>
            {students.map((student) => (
              <List.Item
                key={student.id}
                title={
                  <div className="flex items-center justify-between">
                    <span>{student.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${student.parent_zalo_id
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                      {student.parent_zalo_id ? '✅ Đã kết nối' : '⏳ Chưa kết nối'}
                    </span>
                  </div>
                }
                subTitle={`ID: ${student.id.substring(0, 8)}`}
              />
            ))}
          </List>
        </Box>
      )}

      <Box p={4} className="pb-8">
        <Button
          fullWidth
          variant="tertiary"
          className="text-red-500 bg-red-50"
          onClick={async () => {
            const { authService } = await import('@/services/authService');
            authService.logout();
            window.location.reload(); // Reload to trigger auth check and redirect to login
          }}
        >
          Đăng xuất
        </Button>
      </Box>
    </Page>
  );
}

export default DashboardPage;
