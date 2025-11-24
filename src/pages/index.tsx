import { useAppNavigation } from "@/context/AppContext";

function HomePage() {
  const { navigateTo } = useAppNavigation();

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px 16px 96px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        Sổ Liên Lạc Thông Minh
      </h1>
      <p style={{ marginBottom: '24px', color: '#999' }}>
        Xin chào, Giáo viên!
      </p>

      {/* Welcome Section */}
      <div style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: '8px', padding: '24px', marginBottom: '24px', color: 'white' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Xin chào! 👋</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
          Quản lý thông tin học tập của học sinh một cách dễ dàng
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Thống kê</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#dbeafe', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px' }}>24</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Học sinh</div>
          </div>
          <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>12</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Tin nhắn</div>
          </div>
          <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706', marginBottom: '4px' }}>5</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Thông báo</div>
          </div>
          <div style={{ background: '#e9d5ff', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '4px' }}>95%</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Điểm danh</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Hành động nhanh</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => navigateTo('students')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            📋 Danh sách học sinh
          </button>
          <button
            onClick={() => navigateTo('messages')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            💬 Tin nhắn
          </button>
          <button
            onClick={() => navigateTo('notifications')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            🔔 Thông báo
          </button>
          <button
            onClick={() => navigateTo('grade-management')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            📊 Quản lý điểm
          </button>
          <button
            onClick={() => navigateTo('attendance-management')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            👥 Điểm danh
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Hoạt động gần đây</h3>
        <div style={{ background: 'white', borderRadius: '8px', padding: '16px', border: '1px solid #ddd' }}>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: '20px' }}>💬</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Tin nhắn từ phụ huynh</div>
              <div style={{ fontSize: '12px', color: '#999' }}>5 phút trước</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Cập nhật điểm số</div>
              <div style={{ fontSize: '12px', color: '#999' }}>2 giờ trước</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Thông báo sự kiện</div>
              <div style={{ fontSize: '12px', color: '#999' }}>1 ngày trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
