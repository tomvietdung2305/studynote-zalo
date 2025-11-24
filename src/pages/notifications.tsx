import { useState } from 'react';
import { formatDateTime } from '@/utils';

const mockNotifications = [
  {
    id: '1',
    title: 'Cập nhật điểm số',
    content: 'Điểm kiểm tra Toán của lớp 10A đã được cập nhật',
    timestamp: Date.now() - 600000,
    read: false,
    type: 'grade',
  },
  {
    id: '2',
    title: 'Sự kiện thi đua',
    content: 'Cuộc thi tài năng toàn trường sắp diễn ra',
    timestamp: Date.now() - 3600000,
    read: false,
    type: 'event',
  },
  {
    id: '3',
    title: 'Điểm danh',
    content: 'Lớp 10A có 2 học sinh vắng hôm nay',
    timestamp: Date.now() - 86400000,
    read: true,
    type: 'attendance',
  },
  {
    id: '4',
    title: 'Thông báo chung',
    content: 'Hôm nay là ngày hết hạn nộp đơn xin học bổng',
    timestamp: Date.now() - 172800000,
    read: true,
    type: 'general',
  },
];

const typeEmoji: Record<string, string> = {
  grade: '✅',
  attendance: '👥',
  event: '📅',
  message: '💬',
  general: 'ℹ️',
};

function NotificationsPage() {
  const [loading] = useState(false);

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px', paddingBottom: '96px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Thông báo</h2>
      {mockNotifications.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '40px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔔</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Không có thông báo</div>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>Tất cả đều yên tĩnh</div>
        </div>
      ) : (
        <div>
          {mockNotifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                opacity: notif.read ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ fontSize: '20px', marginTop: '4px' }}>{typeEmoji[notif.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{notif.title}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{notif.content}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{formatDateTime(notif.timestamp)}</div>
                </div>
                {!notif.read && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', marginTop: '8px' }} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
