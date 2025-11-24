import { useState } from 'react';
import { useAppNavigation } from '@/context/AppContext';

// Mock messages data
const mockMessages = [
  {
    id: '1',
    sender: 'teacher',
    content: 'Xin chào, con em bạn học tập như thế nào?',
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    sender: 'parent',
    content: 'Xin chào thầy cô, con em học bài rất tích cực',
    timestamp: Date.now() - 86000000,
  },
  {
    id: '3',
    sender: 'teacher',
    content: 'Rất tốt! Con em có một số điểm cần cải thiện ở môn Anh',
    timestamp: Date.now() - 85000000,
  },
  {
    id: '4',
    sender: 'parent',
    content: 'Dạ, chúng tôi sẽ giúp con em luyện tập thêm ở nhà',
    timestamp: Date.now() - 84000000,
  },
  {
    id: '5',
    sender: 'teacher',
    content: 'Cảm ơn bạn, đó là rất tốt. Con em có thể giỏi hơn nữa!',
    timestamp: Date.now() - 3600000,
  },
];

function ConversationDetailPage() {
  const { goBack, params } = useAppNavigation();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  
  const conversation = params?.conversation || { participantName: 'Phụ huynh Nguyễn Văn A' };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: String(messages.length + 1),
        sender: 'teacher',
        content: newMessage,
        timestamp: Date.now(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ background: '#f3f4f6', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={goBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{conversation.participantName}</div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingBottom: '80px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'teacher' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '75%',
                background: msg.sender === 'teacher' ? '#2563eb' : 'white',
                color: msg.sender === 'teacher' ? 'white' : '#333',
                padding: '12px 16px',
                borderRadius: '12px',
                border: msg.sender === 'teacher' ? 'none' : '1px solid #ddd',
              }}
            >
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</div>
              <div
                style={{
                  fontSize: '11px',
                  marginTop: '8px',
                  opacity: 0.7,
                }}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid #ddd',
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

export default ConversationDetailPage;
