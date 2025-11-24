import { useState, useEffect } from 'react';
import { Page, Header, Text, Box, Button, Icon, Input, useSnackbar } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';

function ClassManagementPage() {
  const { goBack } = useAppNavigation();
  const { classes, loading, createClass, updateClass, deleteClass } = useClasses();
  const { openSnackbar } = useSnackbar();

  // View state: 'list', 'create', 'edit'
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Form state
  const [className, setClassName] = useState('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [studentNames, setStudentNames] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleEdit = async (cls: any) => {
    setSelectedClass(cls.id);
    setClassName(cls.name);
    setSchedules(cls.schedules || []);
    setStudentNames('');
    setStudents([]);
    setView('edit');

    try {
      setLoadingStudents(true);
      const data = await import('@/services/apiService').then(m => m.apiService.getClassStudents(cls.id));
      setStudents(data.students);
      setStudentNames(data.students.map((s: any) => s.name).join('\n'));
    } catch (err) {
      console.error('Failed to fetch students:', err);
      openSnackbar({ text: 'Lỗi tải danh sách học sinh', type: 'error' });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleCreate = async () => {
    if (!className) {
      openSnackbar({ text: 'Vui lòng nhập tên lớp', type: 'error' });
      return;
    }

    const studentsToCreate = studentNames.split('\n').filter(n => n.trim()).map((name) => ({
      name: name.trim(),
      parent_zalo_id: null,
    }));

    try {
      setActionLoading(true);
      await createClass({
        name: className,
        schedules: schedules,
        students: studentsToCreate.length > 0 ? studentsToCreate : undefined,
      });
      openSnackbar({ text: 'Tạo lớp thành công', type: 'success' });
      setView('list');
      resetForm();
    } catch (err) {
      openSnackbar({ text: 'Tạo lớp thất bại', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedClass || !className) return;

    // For update, we might need to handle students differently (add/remove).
    // The backend updateClass logic handles syncing students based on names.
    const studentsToUpdate = studentNames.split('\n').filter(n => n.trim()).map((name) => ({
      name: name.trim(),
    }));

    try {
      setActionLoading(true);
      await updateClass(selectedClass, {
        name: className,
        schedules: schedules,
        students: studentsToUpdate,
      });
      openSnackbar({ text: 'Cập nhật lớp thành công', type: 'success' });
      setView('list');
      resetForm();
    } catch (err) {
      openSnackbar({ text: 'Cập nhật lớp thất bại', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa lớp này?')) return;

    try {
      setActionLoading(true);
      await deleteClass(selectedClass);
      openSnackbar({ text: 'Đã xóa lớp', type: 'success' });
      setView('list');
      resetForm();
    } catch (err) {
      openSnackbar({ text: 'Xóa lớp thất bại', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateCodes = async () => {
    if (!selectedClass) return;
    try {
      setActionLoading(true);
      const result = await import('@/services/apiService').then(m => m.apiService.generateCodes(selectedClass));
      openSnackbar({ text: result.message, type: 'success' });

      // Refresh students
      const data = await import('@/services/apiService').then(m => m.apiService.getClassStudents(selectedClass));
      setStudents(data.students);
    } catch (error: any) {
      openSnackbar({ text: error.message || 'Tạo mã thất bại', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setClassName('');
    setSchedules([]);
    setStudentNames('');
    setStudents([]);
    setSelectedClass(null);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { dayOfWeek: 1, startTime: '09:00', endTime: '10:00' }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <Page className="bg-gray-100">
      <Header title="Quản Lý Lớp Học" showBackIcon={true} onBackClick={goBack} />

      <Box p={4} className="pt-20 pb-32">
        {/* List View */}
        {view === 'list' && (
          <Box>
            <div className="flex justify-between items-center mb-4">
              <Text.Title size="small">Danh sách lớp</Text.Title>
              <Button size="small" icon={<Icon icon="zi-plus" />} onClick={() => { resetForm(); setView('create'); }}>
                Thêm lớp
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => handleEdit(cls)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-95 transition-transform flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-lg text-blue-800">{cls.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      📅 {cls.schedules && cls.schedules.length > 0
                        ? `${cls.schedules.length} buổi/tuần`
                        : 'Chưa có lịch'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {cls.total_students || 0} HS
                    </div>
                    <Icon icon="zi-chevron-right" className="text-gray-400" />
                  </div>
                </div>
              ))}
              {classes.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-8">Chưa có lớp học nào</div>
              )}
            </div>
          </Box>
        )}

        {/* Create View */}
        {view === 'create' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Text.Title className="mb-6">Tạo lớp mới</Text.Title>
            <div className="space-y-4">
              <div>
                <Text className="mb-2 font-medium">Tên lớp</Text>
                <Input
                  placeholder="Ví dụ: Lớp Piano K12"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text className="font-medium">Lịch học</Text>
                  <Button size="small" variant="tertiary" onClick={addSchedule}>
                    <Icon icon="zi-plus" /> Thêm lịch
                  </Button>
                </div>
                {schedules.length === 0 ? (
                  <div className="text-center text-gray-400 py-4 border border-dashed rounded-lg">
                    Chưa có lịch học. Nhấn "Thêm lịch" để thêm.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedules.map((sched, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div>
                            <Text size="xSmall" className="text-gray-600 mb-1">Thứ</Text>
                            <select
                              className="w-full p-2 border rounded text-sm"
                              value={sched.dayOfWeek}
                              onChange={(e) => updateSchedule(idx, 'dayOfWeek', parseInt(e.target.value))}
                            >
                              {dayNames.map((day, i) => (
                                <option key={i} value={i}>{day}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Text size="xSmall" className="text-gray-600 mb-1">Từ</Text>
                            <input
                              type="time"
                              value={sched.startTime}
                              onChange={(e) => updateSchedule(idx, 'startTime', e.target.value)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                          <div>
                            <Text size="xSmall" className="text-gray-600 mb-1">Đến</Text>
                            <input
                              type="time"
                              value={sched.endTime}
                              onChange={(e) => updateSchedule(idx, 'endTime', e.target.value)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          size="small"
                          variant="tertiary"
                          className="text-red-600"
                          onClick={() => removeSchedule(idx)}
                        >
                          <Icon icon="zi-delete" /> Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Text className="mb-2 font-medium">Danh sách học sinh</Text>
                <textarea
                  className="w-full p-3 border rounded-lg min-h-[150px] text-sm"
                  placeholder="Nhập tên học sinh, mỗi tên một dòng"
                  value={studentNames}
                  onChange={(e) => setStudentNames(e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" fullWidth onClick={() => setView('list')}>Hủy</Button>
                <Button fullWidth onClick={handleCreate} loading={actionLoading}>Tạo lớp</Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit View */}
        {view === 'edit' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <Text.Title>Chi tiết lớp học</Text.Title>
              <Button size="small" variant="tertiary" onClick={() => setView('list')}>Đóng</Button>
            </div>

            <div className="space-y-6">
              <div>
                <Text className="mb-2 font-medium">Tên lớp</Text>
                <Input value={className} onChange={(e) => setClassName(e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text className="font-medium">Lịch học</Text>
                  <Button size="small" variant="tertiary" onClick={addSchedule}>
                    <Icon icon="zi-plus" /> Thêm lịch
                  </Button>
                </div>
                {schedules.length === 0 ? (
                  <div className="text-center text-gray-400 py-4 border border-dashed rounded-lg">
                    Chưa có lịch học. Nhấn "Thêm lịch" để thêm.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedules.map((sched, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <div>
                            <Text size="xSmall" className="text-gray-600 mb-1">Thứ</Text>
                            <select
                              className="w-full p-2 border rounded text-sm"
                              value={sched.dayOfWeek}
                              onChange={(e) => updateSchedule(idx, 'dayOfWeek', parseInt(e.target.value))}
                            >
                              {dayNames.map((day, i) => (
                                <option key={i} value={i}>{day}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Text size="xSmall" className="text-gray-600 mb-1">Từ</Text>
                            <input
                              type="time"
                              value={sched.startTime}
                              onChange={(e) => updateSchedule(idx, 'startTime', e.target.value)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                          <div>
                            <Text size="xSmall" className="text-gray-600 mb-1">Đến</Text>
                            <input
                              type="time"
                              value={sched.endTime}
                              onChange={(e) => updateSchedule(idx, 'endTime', e.target.value)}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          size="small"
                          variant="tertiary"
                          className="text-red-600"
                          onClick={() => removeSchedule(idx)}
                        >
                          <Icon icon="zi-delete" /> Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text className="font-medium">Danh sách học sinh ({students.length})</Text>
                  <Button size="small" onClick={handleGenerateCodes} loading={actionLoading}>
                    Tạo mã kết nối
                  </Button>
                </div>

                {loadingStudents ? (
                  <div className="text-center py-4 text-gray-500">Đang tải danh sách...</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-2 max-h-60 overflow-y-auto border border-gray-200">
                    {students.map((student: any) => (
                      <div key={student.id} className="flex justify-between items-center p-2 border-b border-gray-200 last:border-0">
                        <div>
                          <div className="font-medium text-sm">{student.name}</div>
                          {student.parent_zalo_id && <div className="text-xs text-green-600">✅ Đã kết nối</div>}
                        </div>
                        <div className="text-right">
                          {student.connection_code ? (
                            <div className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                              {student.connection_code}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">Chưa có mã</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && <div className="text-center text-gray-400 py-2">Chưa có học sinh</div>}
                  </div>
                )}

                <div className="mt-4">
                  <Text className="mb-2 font-medium">Chỉnh sửa nhanh (Thêm/Xóa tên)</Text>
                  <textarea
                    className="w-full p-3 border rounded-lg min-h-[100px] font-mono text-sm"
                    placeholder="Nhập tên học sinh, mỗi tên một dòng"
                    value={studentNames}
                    onChange={(e) => setStudentNames(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                <Button fullWidth variant="secondary" className="bg-red-50 text-red-600 border-red-100" onClick={handleDelete}>
                  Xóa lớp
                </Button>
                <Button fullWidth onClick={handleSave} loading={actionLoading}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Page>
  );
}

export default ClassManagementPage;
