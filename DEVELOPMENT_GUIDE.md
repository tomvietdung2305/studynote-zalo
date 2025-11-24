# Sổ Liên Lạc Thông Minh - Zalo Mini App

Ứng dụng giao tiếp thông tin học tập giữa phụ huynh, giáo viên và học sinh.

## 📁 Cấu Trúc Dự Án

```
src/
├── types/              # TypeScript type definitions
├── services/           # API services
├── hooks/              # Custom React hooks
├── store/              # Jotai state management
├── utils/              # Helper functions
├── components/
│   ├── shared/         # Shared components (Header, EmptyState)
│   └── [existing]      # Existing components
└── pages/
    ├── index.tsx       # Home/Dashboard
    ├── students.tsx    # Student list
    ├── messages.tsx    # Conversations
    └── notifications.tsx # Notifications
```

## 🚀 Bước Tiếp Theo

### 1. **Setup Backend API**
Cần tạo backend API với các endpoints:

```
GET  /api/students              # Danh sách học sinh
GET  /api/students/:id          # Chi tiết học sinh
GET  /api/students/:id/grades   # Điểm số
GET  /api/students/:id/attendance # Điểm danh

GET  /api/messages/conversations # Danh sách cuộc trò chuyện
GET  /api/messages/conversations/:id # Messages trong cuộc trò chuyện
POST /api/messages/conversations/:id # Gửi tin nhắn

GET  /api/notifications         # Danh sách thông báo
PUT  /api/notifications/:id/read # Đánh dấu đã đọc

GET  /api/auth/profile          # Lấy thông tin user
POST /api/auth/logout           # Đăng xuất
```

### 2. **Tạo Routing System**
Hiện tại app chỉ có 1 page. Cần setup routing để chuyển trang:

```bash
npm install wouter
```

Tạo file `src/router.tsx`:
```tsx
import { Switch, Route } from 'wouter';
import HomePage from '@/pages/index';
import StudentListPage from '@/pages/students';
import MessagesPage from '@/pages/messages';
import NotificationsPage from '@/pages/notifications';

export function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/students" component={StudentListPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/notifications" component={NotificationsPage} />
    </Switch>
  );
}
```

### 3. **Tạo Navigation Component**
Tạo file `src/components/navigation.tsx` để hiển thị menu dưới cùng.

### 4. **Implement Real-time Updates**
- Setup WebSocket cho messages
- Polling cho notifications
- Refresh data theo intervals

### 5. **Testing & Deployment**
```bash
npm run start    # Dev mode
npm run deploy   # Deploy lên Zalo Mini App Platform
```

## 🔧 Cách Sử Dụng Hooks & Services

### Ví dụ: Lấy danh sách học sinh
```tsx
import { useStudents } from '@/hooks';

function MyComponent() {
  const { students, loading, error, refetch } = useStudents();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {students.map(s => <div key={s.id}>{s.name}</div>)}
    </div>
  );
}
```

### Ví dụ: Sử dụng State Management (Jotai)
```tsx
import { useAtom } from 'jotai';
import { currentUserAtom, studentsAtom } from '@/store';

function MyComponent() {
  const [user, setUser] = useAtom(currentUserAtom);
  const [students] = useAtom(studentsAtom);
  
  return <div>{user?.name}</div>;
}
```

## 📝 Danh Sách Công Việc Tiếp Theo

- [ ] Setup routing system
- [ ] Tạo navigation component
- [ ] Implement authentication flow
- [ ] Tạo dashboard page
- [ ] Tạo chi tiết học sinh page
- [ ] Tạo chat/messaging component
- [ ] Setup WebSocket for real-time
- [ ] Implement notifications
- [ ] Setup offline storage
- [ ] Testing
- [ ] Deployment

## 💡 Gợi Ý Phát Triển

1. **Database**: Sử dụng MongoDB/PostgreSQL cho backend
2. **Authentication**: Zalo SDK để lấy token
3. **Real-time**: Socket.io hoặc Firebase Realtime DB
4. **Notifications**: Push notifications qua Zalo
5. **Analytics**: Tracking user behavior

## 📚 Resources

- Zalo Mini App SDK: https://mini.zalo.me/
- ZaUI Components: https://zaui.io/
- Jotai State Management: https://jotai.org/
- Zalo Documentation: https://mini.zalo.me/docs/

---

**Tiếp theo, bạn nên:**
1. Tạo routing system
2. Setup backend API mock/real
3. Test các components
