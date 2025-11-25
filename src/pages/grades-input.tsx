import { useState, useEffect } from 'react';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses, useClassStudents, useGrades } from '@/hooks/useApi';
import { Page, Header, Box, Text, Button, Icon, Input } from 'zmp-ui';
import { useAppToast } from '@/components/ToastProvider';

interface StudentGradeForm {
  id: string;
  name: string;
  grade: string;
  comment: string;
  showForm: boolean;
  saved: boolean;
}

function GradesInputPage() {
  const { goBack } = useAppNavigation();
  const { openSnackbar } = useAppToast();

  // API Hooks
  const { classes } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Set first class as default
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { students: classStudents, loading: loadingStudents } = useClassStudents(selectedClassId);
  const { grades, loading: loadingGrades, saveGrade } = useGrades(selectedClassId);

  const [students, setStudents] = useState<StudentGradeForm[]>([]);
  const [listening, setListening] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Initialize student list with grades when data is loaded
  useEffect(() => {
    if (classStudents.length > 0) {
      const formattedStudents = classStudents.map(s => {
        const existingGrade = grades.find(g => g.student_id === s.id);
        return {
          id: s.id,
          name: s.name,
          grade: existingGrade ? String(existingGrade.score) : '',
          comment: existingGrade ? existingGrade.comment : '',
          showForm: false,
          saved: false,
        };
      });
      setStudents(formattedStudents);
    }
  }, [classStudents, grades]);

  // Voice-to-Text using Web Speech API
  const startVoiceInput = (studentId: string, fieldType: 'comment') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn không hỗ trợ Voice-to-Text. Vui lòng gõ tay.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;

    setListening(true);
    setCurrentStudentId(studentId);

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setStudents(
        students.map((s) =>
          s.id === studentId
            ? { ...s, comment: s.comment + (s.comment ? ' ' : '') + transcript }
            : s
        )
      );
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      alert('Lỗi: ' + event.error);
    };

    recognition.onend = () => {
      setListening(false);
      setCurrentStudentId(null);
    };

    recognition.start();
  };

  const toggleForm = (studentId: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, showForm: !s.showForm } : s
      )
    );
  };

  const updateStudent = (studentId: string, field: 'grade' | 'comment', value: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSaveStudent = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student && (student.grade || student.comment)) {
      try {
        setSavingId(studentId);
        await saveGrade(
          studentId,
          student.grade ? parseFloat(student.grade) : 0,
          student.comment
        );

        setStudents(
          students.map((s) =>
            s.id === studentId ? { ...s, saved: true, showForm: false } : s
          )
        );

        openSnackbar({
          text: 'Đã lưu điểm thành công',
          type: 'success',
        });

        // Reset saved state after 2s
        setTimeout(() => {
          setStudents((prev) =>
            prev.map((s) => (s.id === studentId ? { ...s, saved: false } : s))
          );
        }, 2000);
      } catch (err) {
        console.error('Failed to save grade:', err);
        openSnackbar({
          text: 'Lưu thất bại',
          type: 'error',
        });
      } finally {
        setSavingId(null);
      }
    }
  };

  return (
    <Page className="bg-gray-100" style={{ marginTop: '44px' }}>
      <Header title="Sổ Điểm & Nhận Xét" showBackIcon={true} onBackClick={goBack} />

      <Box p={4} className="pt-20 pb-24">
        {/* Class Selector */}
        <Box className="mb-4 overflow-x-auto whitespace-nowrap pb-2">
          {classes.map(cls => (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                marginRight: '8px',
                borderRadius: '20px',
                background: selectedClassId === cls.id ? '#006AF5' : 'white',
                color: selectedClassId === cls.id ? 'white' : '#333',
                border: selectedClassId === cls.id ? 'none' : '1px solid #ddd',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {cls.name}
            </div>
          ))}
        </Box>

        {/* Info Box */}
        <Box className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
          <Text size="small" className="text-blue-800">
            🎤 <strong>Wow Feature:</strong> Nhấn 🎤 để nói nhận xét (Voice-to-Text)
          </Text>
        </Box>

        {loadingStudents ? (
          <Text className="text-center text-gray-500 mt-8">Đang tải danh sách học sinh...</Text>
        ) : students.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">Lớp chưa có học sinh nào.</Text>
        ) : (
          /* Students List */
          <div className="flex flex-col gap-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  onClick={() => toggleForm(student.id)}
                  className={`p-4 cursor-pointer flex justify-between items-center transition-colors ${student.saved ? 'bg-green-50' : student.grade ? 'bg-blue-50' : 'bg-white'
                    }`}
                >
                  <div>
                    <div className="font-medium text-base">
                      {student.saved && '✅ '}{student.name}
                    </div>
                    {student.grade && (
                      <div className="text-xs text-gray-500 mt-1">
                        📝 Điểm: {student.grade} {student.comment && '| Có nhận xét'}
                      </div>
                    )}
                  </div>
                  <div className="text-xl text-gray-400">
                    {student.showForm ? '▲' : '▼'}
                  </div>
                </div>

                {/* Card Body */}
                {student.showForm && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    {/* Grade Input */}
                    <Input
                      type="number"
                      placeholder="Nhập điểm (0-10)"
                      value={student.grade}
                      onChange={(e) => updateStudent(student.id, 'grade', e.target.value)}
                      className="mb-3 bg-white"
                    />

                    {/* Comment Section */}
                    <div className="mb-3">
                      <Text size="small" className="font-medium mb-2 text-gray-600">Nhận xét:</Text>
                      <textarea
                        placeholder="Gõ nhận xét hoặc dùng 🎤"
                        value={student.comment}
                        onChange={(e) => updateStudent(student.id, 'comment', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 text-sm min-h-[80px] focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Voice Button */}
                    <button
                      onClick={() => startVoiceInput(student.id, 'comment')}
                      disabled={listening && currentStudentId !== student.id}
                      className={`w-full p-2.5 rounded-lg text-sm font-bold mb-3 transition-all ${listening && currentStudentId === student.id
                        ? 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {listening && currentStudentId === student.id ? '🎤 Đang nghe...' : '🎤 Nói nhận xét'}
                    </button>

                    {/* Save Button */}
                    <Button
                      fullWidth
                      onClick={() => handleSaveStudent(student.id)}
                      loading={savingId === student.id}
                      className={savingId === student.id ? 'bg-gray-400' : 'bg-green-600'}
                    >
                      {savingId === student.id ? 'Đang lưu...' : 'Lưu Điểm & Nhận Xét'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          ✅ Đã nhập: {students.filter((s) => s.grade || s.comment).length}/{students.length}
        </div>
      </Box>
    </Page>
  );
}

export default GradesInputPage;
