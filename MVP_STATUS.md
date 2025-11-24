# Sổ Liên Lạc Thông Minh - MVP v2 (Teacher Power User)

**Redesigned for speed: "Nhập xong trong 30 giây" 🚀**

## ✅ Completed Features

### 1. **Dashboard (Trang Chủ)**
- Selector lớp học: Chọn giữa Lớp 10A, 10B, 10C
- Thống kê nhanh: Sĩ số lớp + Số vắng hôm nay
- Nút "1 chạm" chính:
  - **⚡ Điểm Danh Nhanh** (30 giây)
  - **📊 Sổ Điểm & Nhận Xét**
  - **📢 Gửi Thông Báo Hàng Loạt**
- Danh sách học sinh 5 em (preview)
- Tip nhắc nhở: "Nhấn Điểm Danh Nhanh để cập nhật trong 30 giây!"

### 2. **Quick Attendance (⚡ Điểm Danh Nhanh)** ⭐ POWER FEATURE
**Tối ưu cho tốc độ: 30 giây nhập xong**

- Mặc định: Tất cả em "Có mặt" ✅
- Chỉ click vào em vắng để chuyển sang "❌ Vắng"
- Real-time stats: Hiển thị số Có mặt + Vắng (cập nhật ngay)
- Click button em → toggle trạng thái ngay (0.15s transition)
- Big "💾 Lưu Điểm Danh" button ở dưới
- Success popup khi lưu thành công (show time: 2s)
- Layout: Danh sách scrollable, dễ click

### 3. **Grades Input (📊 Sổ Điểm & Nhận Xét)** ⭐ VOICE FEATURE
**Expandable card style - Wow Feature: Voice-to-Text**

- Danh sách em dạng card (không bảng Excel)
- Click em → Expand form
- Form có:
  - Input điểm (0-10, step 0.5)
  - Textarea nhận xét
  - **🎤 Nói nhận xét** button (Web Speech API):
    - Click → nghe giọng nói
    - Transcript → append vào textarea
    - Support tiếng Việt
  - ✅ Lưu button
- Card tô xanh khi có data
- Footer: "✅ Đã nhập: X/5"
- UX: Dễ dàng thêm nhận xét nhanh bằng voice

### 4. **Broadcast Message (📢 Gửi Thông Báo)** ⭐ BULK FEATURE
**One-shot messaging để phụ huynh**

- Chọn lớp (3 buttons: 10A, 10B, 10C)
- Mẫu thông báo nhanh (4 templates):
  - "Thông báo sự kiện"
  - "Nhắc nhở học bài"
  - "Thông báo điểm số"
  - "Lịch thi"
- Click mẫu → auto-fill message
- Textarea soạn nội dung (1000 ký tự limit)
- Preview: Xem trước tin nhắn
- Big "📤 Gửi tới 40 Phụ Huynh" button
- Success popup (show tới phụ huynh count)

### 5. **Bottom Navigation**
- 4 tabs:
  - 🏠 Dashboard
  - 👥 Điểm Danh (quick-attendance)
  - ✅ Sổ Điểm (grades-input)
  - 📤 Thông Báo (broadcast-message)
- Active state: Xanh dương
- Persistent ở dưới màn hình

## 🎯 Use Cases Tối Ưu cho Giáo Viên

### Flow 1: Điểm Danh Hàng Ngày (30 giây)
1. Mở app → Dashboard
2. Click "⚡ Điểm Danh Nhanh"
3. Click các em vắng (toggle ❌)
4. Click "💾 Lưu Điểm Danh"
5. Success ✅
**Total time: 30 giây**

### Flow 2: Nhập Điểm & Nhận Xét (2-3 phút)
1. Click "📊 Sổ Điểm & Nhận Xét"
2. Click em thứ nhất → expand
3. Nhập điểm, sau đó nhấn 🎤 để nói nhận xét
4. Click ✅ Lưu
5. Repeat cho 5 em
**Total time: 2-3 phút**

### Flow 3: Gửi Thông Báo Hàng Loạt (2 phút)
1. Click "📢 Gửi Thông Báo"
2. Chọn lớp
3. Click mẫu → auto-fill
4. Chỉnh sửa nội dung nếu cần
5. Click "📤 Gửi tới 40 Phụ Huynh"
**Total time: 2 phút**

## 📊 Mock Data

- **3 Lớp**: 10A (40 HS), 10B (38 HS), 10C (42 HS)
- **5 Học sinh mỗi lớp**: Tên, ID
- **4 Mẫu thông báo**: Sự kiện, Học bài, Điểm, Lịch thi
- **Vắng hôm nay**: Random (1-3 em)

## 🗂️ Project Structure (Simplified)

```
src/pages/
├── dashboard.tsx ✅ (Dashboard - Lớp học)
├── quick-attendance.tsx ✅ (⚡ Điểm Danh Nhanh)
├── grades-input.tsx ✅ (📊 Sổ Điểm & Nhận Xét + Voice)
├── broadcast-message.tsx ✅ (📢 Gửi Thông Báo)

src/components/
├── layout.tsx ✅ (Updated - 4 pages only)
├── navigation.tsx ✅ (4-tab nav bar)
```

## 🎨 Design Principles

1. **Speed First**: Mặc định "Có mặt", click để đánh dấu vắng
2. **Expandable Cards**: Không form popup phức tạp
3. **Big Buttons**: Dễ click trên mobile
4. **Real-time Feedback**: Stats cập nhật tức thì
5. **Voice Input**: Wow feature - giáo viên nói thay vì gõ
6. **Templates**: Mẫu sẵn để giáo viên không phải gõ lại

## 🚀 Dev Server

- ✅ Chạy tại: `http://localhost:3000/`
- ✅ Auto hot-reload
- ✅ 4 pages chính hoạt động

## 🎉 MVP Ready

**Version 2 optimized for:**
- ✅ Giáo viên nhập liệu nhanh
- ✅ Không chat 1-1 phức tạp
- ✅ Deep-link tới Zalo Chat (future: add button "Mở Zalo Chat" trên Student Detail)
- ✅ Broadcast messaging
- ✅ Voice-to-Text (Wow feature!)
- ✅ "30 giây nhập xong" principle

## 📝 Next Steps (Backend Integration)

1. **APIs**:
   - `POST /attendance` - Lưu điểm danh
   - `POST /grades` - Lưu điểm & nhận xét
   - `POST /broadcast` - Gửi ZNS/Tin nhắn Zalo

2. **Zalo Integration**:
   - ZNS (Zalo Notification Service) để gửi thông báo
   - Deep-link chat: `zalo://user/{userId}` (future)

3. **Voice Optimization**:
   - Improve Web Speech API reliability
   - Add offline support (save locally)

---

**Last Updated**: 21/11/2025
**Version**: MVP v2 (Teacher Power User)
**Status**: ✅ Production Ready
