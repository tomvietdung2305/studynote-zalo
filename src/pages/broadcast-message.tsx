import { useState, useEffect } from 'react';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { Page, Header, Box, Text, Button, Icon, useSnackbar } from 'zmp-ui';
import { zaloAdapter } from '@/adapters';

const broadcastTemplates = [
  { id: '1', title: 'Thông báo sự kiện', text: 'Thân gửi phụ huynh, lớp của chúng ta có sự kiện...' },
  { id: '2', title: 'Nhắc nhở học bài', text: 'Các em vui lòng học bài và làm bài tập được giao...' },
  { id: '3', title: 'Thông báo điểm số', text: 'Kết quả kiểm tra cuối kỳ đã được cập nhật...' },
  { id: '4', title: 'Lịch thi', text: 'Lịch thi cuối kỳ như sau...' },
];

function BroadcastMessagePage() {
  const { goBack } = useAppNavigation();
  const { classes } = useClasses();
  const { openSnackbar } = useSnackbar();
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Set first class as default
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<{ time: string; count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Get user info via adapter (handles both Zalo and Web)
    zaloAdapter.getUserInfo()
      .then((data) => {
        setUserId(data.id);
      })
      .catch((err) => {
        console.warn('Failed to get user info:', err);
        setUserId('unknown_user');
      });
  }, []);

  const applyTemplate = (text: string) => {
    setMessage(text);
  };

  const handleFollowOA = async () => {
    try {
      await zaloAdapter.followOA();
      openSnackbar({
        text: "Đã gửi yêu cầu quan tâm OA",
        type: "success"
      });
    } catch (error) {
      console.error('Follow OA error:', error);
      openSnackbar({
        text: "Lỗi khi quan tâm OA",
        type: "error"
      });
    }
  };

  const handleSend = async () => {
    if (!selectedClassId) {
      setError('Vui lòng chọn lớp học');
      return;
    }
    if (!message.trim()) {
      setError('Vui lòng nhập nội dung tin nhắn');
      return;
    }

    setLoading(true);
    setError(null);
    setSent(null);

    try {
      // Call Backend API
      const result = await import('@/services/apiService').then(m => m.apiService.sendNotification({
        classId: selectedClassId,
        message: message
      }));

      setSent({ time: new Date().toLocaleTimeString('vi-VN'), count: result.sent });
      setTimeout(() => setSent(null), 3000);
      setMessage('');
    } catch (err: any) {
      console.error('Send failed:', err);
      setError(err.message || 'Gửi tin nhắn thất bại');
    } finally {
      setLoading(false);
    }
  };

  const selectedClassData = classes.find((c) => c.id === selectedClassId);

  return (
    <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
      <Header title="Gửi Thông Báo" showBackIcon={true} onBackClick={goBack} />

      <Box p={4} className="pb-24">
        {/* Class Selector */}
        <Box className="mb-6">
          <Text.Title size="small" className="mb-3">Chọn lớp:</Text.Title>
          <div className="grid grid-cols-3 gap-2">
            {classes.map((cls) => (
              <Box
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-3 border rounded-xl cursor-pointer transition-all ${selectedClassId === cls.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white'
                  }`}
              >
                <Text className="font-semibold text-sm mb-1">{cls.name}</Text>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon icon="zi-user" size={12} />
                  <span>{cls.total_students || 0}</span>
                </div>
              </Box>
            ))}
          </div>
        </Box>

        {/* Templates */}
        <Box className="mb-6">
          <Text.Title size="small" className="mb-3">Mẫu thông báo nhanh:</Text.Title>
          <div className="flex flex-col gap-2">
            {broadcastTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => applyTemplate(template.text)}
                className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all"
              >
                <div className="font-medium text-sm mb-1">
                  📋 {template.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {template.text}
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* Message Composer */}
        <Box className="mb-6">
          <Text.Title size="small" className="mb-3">Soạn nội dung:</Text.Title>
          <textarea
            placeholder="Nhập nội dung thông báo..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 text-sm min-h-[120px] focus:outline-none focus:border-blue-500 mb-2"
          />
          <div className="text-xs text-gray-500 text-right">
            Ký tự: {message.length}/1000
          </div>
        </Box>

        {/* Preview */}
        {
          message && (
            <Box className="mb-6 bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="text-xs font-bold text-blue-800 mb-2">
                📱 Xem trước (Tin nhắn Zalo):
              </div>
              <div className="bg-white rounded-lg p-3 text-sm leading-relaxed border border-blue-100">
                {message}
              </div>
            </Box>
          )
        }

        {/* Debug Section */}
        <Box className="mb-6 bg-gray-200 p-4 rounded-lg">
          <Text.Title size="small" className="mb-2">🛠 Debug Info</Text.Title>
          <div className="flex flex-col gap-2">
            <div className="text-xs font-mono bg-white p-2 rounded border border-gray-300 break-all">
              User ID: {userId || 'Loading...'}
            </div>
            <Button
              size="small"
              variant="secondary"
              onClick={handleFollowOA}
            >
              Quan tâm OA (Để nhận tin nhắn)
            </Button>
          </div>
        </Box>

        {/* Send Button */}
        <Box className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
          <Button
            fullWidth
            size="large"
            onClick={handleSend}
            loading={loading}
            className="bg-yellow-500"
          >
            {loading ? '⏳ Đang gửi...' : `📤 Gửi tới ${selectedClassData?.total_students || 0} Phụ Huynh`}
          </Button>
        </Box>

        {/* Success Message */}
        {
          sent && (
            <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
              <div className="bg-green-600 text-white px-8 py-6 rounded-xl shadow-2xl text-center animate-bounce">
                <div className="text-2xl font-bold mb-2">✅ Đã Gửi!</div>
                <div className="text-sm">Tới {sent.count} phụ huynh</div>
              </div>
            </div>
          )
        }

        {/* Error Message */}
        {
          error && (
            <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
              <div className="bg-red-600 text-white px-8 py-6 rounded-xl shadow-2xl text-center">
                <div className="text-xl font-bold">❌ {error}</div>
              </div>
            </div>
          )
        }
      </Box >
    </Page >
  );
}

export default BroadcastMessagePage;
