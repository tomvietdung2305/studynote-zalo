import { useState } from 'react';
import { Page, Header, Text, Box, Button, List, Icon, useSnackbar } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useAttendance, useClasses, useClassStudents } from '@/hooks/useApi';

function QuickAttendancePage() {
  const { goBack } = useAppNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  // Get classes from API
  const { classes } = useClasses();
  const currentClass = classes[0]; // For now, use first class
  const classId = currentClass?.id || '';

  // Get students from API
  const { students, loading: loadingStudents } = useClassStudents(classId);

  // Get attendance from API
  const { attendance, toggleStudent, saveAttendance: saveAttendanceApi } = useAttendance(classId, selectedDate);
  const { openSnackbar } = useSnackbar();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveAttendanceApi(attendance);

      openSnackbar({
        icon: true,
        text: "Đã lưu điểm danh thành công!",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error('Save failed:', err);
      openSnackbar({
        text: "Lưu điểm danh thất bại",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
  };

  const isScheduledDay = (dateStr: string) => {
    if (!currentClass) return false;
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0-6
    return currentClass.schedules.some(s => s.dayOfWeek === dayOfWeek);
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  // If attendance record doesn't exist for a student, they are present by default in UI logic below,
  // but for count we need to be careful.
  // Actually, the UI defaults to 'present' if not in attendance map.
  // So we should calculate based on students list.
  const currentPresentCount = students.filter(s => (attendance[s.id] || 'present') === 'present').length;
  const currentAbsentCount = students.filter(s => attendance[s.id] === 'absent').length;

  return (
    <Page className="bg-gray-100">
      <Header title="Điểm Danh Nhanh" showBackIcon={true} onBackClick={goBack} />

      <Box p={4} className="bg-white mb-4 pt-20">
        <Box flex flexDirection="row" justifyContent="space-between" alignItems="center" className="mb-4">
          <Box>
            <Text size="xSmall" className="text-gray-500">Ngày điểm danh</Text>
            <Box flex flexDirection="row" alignItems="center" style={{ gap: 8 }}>
              <Text size="large" className="font-bold">{getDayName(selectedDate)}</Text>
              {isScheduledDay(selectedDate) && (
                <Box className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                  Theo lịch
                </Box>
              )}
            </Box>
          </Box>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: 140,
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              outline: 'none'
            }}
          />
        </Box>

        <Box flex flexDirection="row" style={{ gap: 12 }}>
          <Box className="bg-green-50 p-3 rounded-lg flex-1 text-center border border-green-100">
            <Text.Title size="large" className="text-green-600">{currentPresentCount}</Text.Title>
            <Text size="xxSmall" className="text-gray-500">Có mặt</Text>
          </Box>
          <Box className="bg-red-50 p-3 rounded-lg flex-1 text-center border border-red-100">
            <Text.Title size="large" className="text-red-600">{currentAbsentCount}</Text.Title>
            <Text size="xxSmall" className="text-gray-500">Vắng</Text>
          </Box>
        </Box>
      </Box>

      <Box className="mb-20">
        <Box p={4} pb={0}>
          <Text size="xSmall" className="text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
            💡 Click vào học sinh để đổi trạng thái (Có mặt / Vắng)
          </Text>
        </Box>
        {loadingStudents ? (
          <Box p={4} className="text-center text-gray-500">Đang tải danh sách học sinh...</Box>
        ) : (
          <List>
            {students.map((student) => {
              const status = attendance[student.id] || 'present';
              return (
                <div
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className="cursor-pointer"
                >
                  <List.Item
                    prefix={<Icon icon="zi-user" className={status === 'present' ? 'text-green-600' : 'text-red-600'} />}
                    title={student.name}
                    subTitle={status === 'present' ? 'Có mặt' : 'Vắng'}
                    suffix={
                      status === 'present' ?
                        <Icon icon="zi-check-circle-solid" className="text-green-500" /> :
                        <Icon icon="zi-close-circle-solid" className="text-red-500" />
                    }
                    className={status === 'absent' ? 'bg-red-50' : ''}
                  />
                </div>
              );
            })}
          </List>
        )}
      </Box>

      <Box
        style={{ position: 'fixed', bottom: 64, left: 0, right: 0, zIndex: 50 }}
        p={4}
        className="bg-white border-t border-gray-200"
      >
        <Button
          fullWidth
          size="large"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving}
        >
          Lưu Điểm Danh
        </Button>
      </Box>
    </Page>
  );
}

export default QuickAttendancePage;
