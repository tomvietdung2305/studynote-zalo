import { useState, useEffect } from 'react';
import { Page, Text, Box, Button } from 'zmp-ui';
import { useAppNavigation } from '@/context/AppContext';
import { useClasses } from '@/hooks/useApi';
import { Greeting } from '@/components/shared/Greeting';
import { FollowOABanner } from '@/components/shared/FollowOABanner';
import { StatsCard } from '@/components/shared/StatsCard';
import { ActionGrid, ActionItem } from '@/components/shared/ActionGrid';
import { StreakBadge } from '@/components/shared/StreakBadge';
import { apiService } from '@/services/apiService';

function DashboardPage() {
  const { navigateTo } = useAppNavigation();
  const { classes, loading } = useClasses();
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [showFollowOA, setShowFollowOA] = useState(true);

  // Get user info from localStorage
  useEffect(() => {
    const loadUser = () => {
      // Get user from localStorage (set by AuthWrapper)
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback to mock data
        setUser({ name: 'Giáo viên', role: 'teacher' });
      }

      // Mock streak for demo (would come from backend)
      setStreak(Math.floor(Math.random() * 15) + 1);
    };
    loadUser();
  }, []);

  // Calculate total students
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.total_students || 0), 0);
  const totalClasses = classes.length;

  // Action buttons
  const actions: ActionItem[] = [
    {
      id: 'statistics',
      icon: 'zi-chart-bar',
      label: 'Thống kê',
      onClick: () => navigateTo('statistics'),
      color: 'blue',
    },
    {
      id: 'homework',
      icon: 'zi-note',
      label: 'Bài tập',
      onClick: () => navigateTo('homework'),
      color: 'orange',
    },
    {
      id: 'schedule',
      icon: 'zi-calendar',
      label: 'Lịch thi',
      onClick: () => navigateTo('schedule'),
      color: 'purple',
    },
    {
      id: 'attendance',
      icon: 'zi-check-circle',
      label: 'Điểm danh',
      onClick: () => navigateTo('quick-attendance'),
      color: 'green',
    },
  ];

  if (loading) {
    return (
      <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
        <Box className="flex items-center justify-center h-screen">
          <Text className="text-gray-500">Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (!user) {
    return (
      <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
        <Box className="flex items-center justify-center h-screen">
          <Text className="text-gray-500">Đang tải thông tin...</Text>
        </Box>
      </Page>
    );
  }

  // First time setup - no classes
  if (totalClasses === 0) {
    return (
      <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
        <Box className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <Text.Title className="mb-2">Chào mừng đến với Sổ Liên Lạc!</Text.Title>
            <Text className="text-gray-600 mb-6">
              Hãy bắt đầu bằng cách tạo lớp học đầu tiên của bạn
            </Text>
            <Button
              size="large"
              onClick={() => navigateTo('class-management')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Tạo lớp học đầu tiên
            </Button>
          </div>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50" style={{ marginTop: '44px' }}>
      {/* Gradient Header */}
      <Box className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-b-3xl shadow-lg mb-4">
        <div className="flex items-center justify-between mb-4">
          <Greeting userName={user.name || 'Giáo viên'} userRole="teacher" />
        </div>
        <div className="flex justify-center">
          <StreakBadge days={streak} size="medium" variant="compact" />
        </div>
      </Box>

      {/* Follow OA Banner */}
      {showFollowOA && (
        <Box className="px-4">
          <FollowOABanner
            variant="inline"
            message="Quan tâm OA để nhận thông báo tự động khi có cập nhật mới"
            onFollow={() => {
              console.log('Followed OA');
              setShowFollowOA(false);
            }}
            onDismiss={() => setShowFollowOA(false)}
          />
        </Box>
      )}

      {/* Quick Actions */}
      <Box className="px-4 mb-4">
        <Text.Title size="small" className="mb-3 text-gray-900">
          Quản lý nhanh
        </Text.Title>
        <ActionGrid actions={actions} columns={4} size="medium" />
      </Box>

      {/* Stats Section */}
      <Box className="px-4 mb-4">
        <Text.Title size="small" className="mb-3 text-gray-900">
          Thống kê hôm nay
        </Text.Title>
        <div className="grid grid-cols-3 gap-3">
          <StatsCard
            icon="zi-list-1"
            value={totalClasses}
            label="Lớp học"
            color="blue"
          />
          <StatsCard
            icon="zi-user"
            value={totalStudents}
            label="Học sinh"
            color="green"
          />
          <StatsCard
            icon="zi-check-circle"
            value={0}
            label="Đã điểm danh"
            color="purple"
          />
        </div>
      </Box>

      {/* Recent Activity */}
      <Box className="px-4 mb-20">
        <div className="flex items-center justify-between mb-3">
          <Text.Title size="small" className="text-gray-900">
            Lớp học của bạn
          </Text.Title>
          <Text
            size="small"
            className="text-blue-500"
            onClick={() => navigateTo('class-management')}
          >
            Xem tất cả →
          </Text>
        </div>
        <div className="space-y-3">
          {classes.slice(0, 3).map((cls) => (
            <Box
              key={cls.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-98 transition-transform"
              onClick={() => navigateTo('quick-attendance')}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-1">
                    {cls.name}
                  </Text>
                  <Text size="xSmall" className="text-gray-500">
                    {cls.total_students || 0} học sinh
                    {cls.schedules && cls.schedules.length > 0 &&
                      ` • ${cls.schedules.length} buổi/tuần`
                    }
                  </Text>
                </div>
                <div className="bg-blue-50 rounded-full p-2">
                  <Text className="text-blue-600">→</Text>
                </div>
              </div>
            </Box>
          ))}
        </div>
      </Box>
    </Page>
  );
}

export default DashboardPage;
