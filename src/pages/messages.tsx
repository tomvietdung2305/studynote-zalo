import { useState } from 'react';
import { formatRelativeTime } from '@/utils';
import { useAppNavigation } from '@/context/AppContext';

// Mock conversations
const mockConversations = [
  {
    id: '1',
    participantName: 'Phụ huynh Nguyễn Văn A',
    participantAvatar: '👨‍👩‍👧',
    lastMessage: 'Cảm ơn thầy/cô về thông tin học tập của con',
    lastMessageTime: Date.now() - 300000,
    unreadCount: 2,
  },
  {
    id: '2',
    participantName: 'Phụ huynh Trần Thị B',
    participantAvatar: '👩‍👧‍👦',
    lastMessage: 'Con đang có vấn đề gì không thầy/cô?',
    lastMessageTime: Date.now() - 3600000,
    unreadCount: 0,
  },
  {
    id: '3',
    participantName: 'Phụ huynh Lê Văn C',
    participantAvatar: '👨‍👩‍👧',
    lastMessage: 'Bé có được chọn vào đội tuyển không?',
    lastMessageTime: Date.now() - 86400000,
    unreadCount: 1,
  },
];

function MessagesPage() {
  const { navigateTo } = useAppNavigation();
  const [loading] = useState(false);

  return (
    <div style={{ background: '#f3f4f6', width: '100%', minHeight: '100vh', padding: '16px', paddingBottom: '96px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Tin nhắn</h2>
      {mockConversations.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '40px', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>💬</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Không có cuộc trò chuyện</div>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>Hãy bắt đầu giao tiếp với phụ huynh</div>
        </div>
      ) : (
        <div>
          {mockConversations.map((conversation) => (
            <div
              key={conversation.id}
              // onClick={() => navigateTo('conversation-detail', { conversationId: conversation.id, conversation })} // Removed in MVP redesign
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget) {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{conversation.participantName}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {conversation.unreadCount > 0 && (
                    <div style={{ background: '#ef4444', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                      {conversation.unreadCount}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {formatRelativeTime(conversation.lastMessageTime || Date.now())}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>{conversation.lastMessage || 'Không có tin nhắn'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessagesPage;
