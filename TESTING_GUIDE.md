# 🧪 Testing Guide - Teacher Power User MVP

## **Server Status**
✅ Dev server running at: **http://localhost:3000/**

---

## **📋 Test Scenarios**

### **Test 1: Dashboard - Class Selection** ⏱️ 10 giây
**Mục tiêu:** Kiểm tra chọn lớp học và xem thống kê sĩ số

1. Mở app ở đường dẫn http://localhost:3000/
2. Thấy Dashboard với 3 lớp: `10A (40 sĩ)`, `10B (38 sĩ)`, `10C (42 sĩ)`
3. Click vào **Lớp 10A**
4. ✅ **Kỳ vọng:** Lớp được highlight, hiển thị thống kê:
   - `Sĩ số: 40`
   - `Vắng hôm nay: 0`

**Các nút action xuất hiện:**
- ⚡ Điểm Danh Nhanh
- 📊 Sổ Điểm
- 📢 Thông Báo
- 👥 Nhận Xét

---

### **Test 2: Quick Attendance (⚡ Điểm Danh)** ⏱️ 30 giây
**Mục tiêu:** Nhanh chóng đánh dấu học sinh vắng (theo nguyên tắc: cơ sở là có mặt, click để đánh dấu vắng)

**Bước 1:** Từ Dashboard 10A, click **⚡ Điểm Danh Nhanh** hoặc tab **Điểm Danh** (bottom nav)

**Bước 2:** Kiểm tra danh sách học sinh
- ✅ Thấy ~8 học sinh (hoặc danh sách full 40 nếu scroll)
- Mỗi hàng: `[Tên học sinh] [Có mặt]` (nền xanh)

**Bước 3:** Click vào 2-3 học sinh để đánh dấu vắng
- ✅ Nút đổi thành `❌ Vắng` (nền đỏ)

**Bước 4:** Kiểm tra counter ở dưới
- ✅ Hiển thị: `35 Có mặt | 5 Vắng` (hay tương tự)

**Bước 5:** Click **💾 LƯU ĐIỂM DANH**
- ✅ Nút disable, hiển thị `⏳ Đang lưu...` (300ms delay)
- ✅ Sau đó hiệp thành công: `✅ Đã Lưu!`
- ✅ Counter reset, data lưu vào state

**Tiêu chí thành công:** Hoàn thành trong < 30 giây (từ mở tới lưu)

---

### **Test 3: Grades Input (📊 Sổ Điểm)** ⏱️ 2-3 phút
**Mục tiêu:** Nhập điểm + Sử dụng voice-to-text để nhập nhận xét

**Bước 1:** Từ Dashboard, click **📊 Sổ Điểm** hoặc tab **Sổ Điểm**

**Bước 2:** Kiểm tra giao diện
- ✅ Danh sách học sinh dạng **card** (có thể mở rộng)
- ✅ Mỗi card: `[Tên học sinh]` - Click để mở rộng

**Bước 3:** Click card đầu tiên để mở rộng
- ✅ Hiển thị:
  - Input: `Điểm` (ô nhập số)
  - Textarea: `Nhận xét` (ô nhập text)
  - Nút: `🎤 Ghi Âm` (voice button)
  - Nút: `💾 Lưu Học Sinh Này`

**Bước 4:** Nhập dữ liệu (2 cách)

**Cách 1 - Gõ bàn phím:**
- Click input Điểm → Nhập `8.5`
- Click textarea Nhận xét → Nhập `Học sinh chăm chỉ`
- Click **💾 Lưu Học Sinh Này**

**Cách 2 - Voice-to-Text (Thử nghiệm):**
- Click **🎤 Ghi Âm**
- ✅ Kỳ vọng: Mic bắt đầu, nút thay đổi thành `🎤 Đang nghe...`
- Nói ví dụ: "Học sinh rất tích cực trong lớp"
- ✅ Kỳ vọng: Văn bản xuất hiện trong textarea (nếu trình duyệt hỗ trợ)

**Bước 5:** Kiểm tra progress bar
- ✅ Hiển thị: `✅ 1/8 Đã nhập` (hoặc số lượng học sinh)

**Bước 6:** Save thành công
- ✅ Nút disable → `⏳ Đang lưu...` (300ms)
- ✅ Success message
- ✅ Data lưu vào state

**Tiêu chí thành công:** Hoàn thành 3-4 học sinh trong < 3 phút (với voice feature)

---

### **Test 4: Broadcast Message (📢 Thông Báo)** ⏱️ 1-2 phút
**Mục tiêu:** Gửi thông báo template cho phụ huynh

**Bước 1:** Từ Dashboard, click **📢 Thông Báo** hoặc tab **Thông Báo**

**Bước 2:** Kiểm tra giao diện
- ✅ Class selector: `Lớp 10A (40 phụ huynh)`
- ✅ 4 template buttons:
  1. `📋 Thông báo sự kiện`
  2. `📝 Nhắc nhở học bài`
  3. `📊 Thông báo điểm số`
  4. `📅 Lịch thi`

**Bước 3:** Click template #1
- ✅ Nội dung template xuất hiện trong textarea

**Bước 4:** (Optional) Chỉnh sửa nội dung
- Textarea có thể edit, thêm/xóa text

**Bước 5:** Click **📤 Gửi tới 40 Phụ Huynh**
- ✅ Nút disable → `⏳ Đang gửi...` (500ms delay)
- ✅ Success popup: `✅ Đã Gửi! Tới 40 phụ huynh`
- ✅ Message saved to state

**Bước 6:** Switch template
- Click template #2
- ✅ Nội dung thay đổi
- Gửi lần nữa

**Tiêu chí thành công:** Gửi thành công, hiệp success message

---

### **Test 5: Bottom Navigation** ⏱️ 30 giây
**Mục tiêu:** Kiểm tra navigation giữa 4 pages

**Các bước:**
1. Click tab **🏠 Trang Chủ** → Dashboard
2. Click tab **👥 Điểm Danh** → Quick Attendance
3. Click tab **📊 Sổ Điểm** → Grades Input
4. Click tab **🔔 Thông Báo** → Broadcast Message
5. Back to tab **🏠**

- ✅ Các tab có highlight (active tab xanh)
- ✅ Page thay đổi khi click
- ✅ Không mất state khi navigate (data persist)

---

### **Test 6: State Persistence** ⏱️ 1 phút
**Mục tiêu:** Kiểm tra data được lưu khi navigate

1. Từ Dashboard, chọn class 10B
2. Đi sang **Điểm Danh**, đánh dấu 2 học sinh vắng
3. Click tab **Sổ Điểm**
4. Click tab **Thông Báo**
5. Quay lại **Điểm Danh** (tab)
6. ✅ Kỳ vọng: Những học sinh vắng vẫn còn đánh dấu ❌ (data persist)

---

## **🧠 Lỗi Thường Gặp & Cách Xử Lý**

| Lỗi | Nguyên nhân | Giải pháp |
|-----|----------|---------|
| Trang trắng, không load | Server chưa sẵn sàng | Chờ 5-10 giây, refresh `Ctrl+R` |
| Nút không response | State chưa update | Check console (F12), xem error |
| Voice không hoạt động | Trình duyệt không hỗ trợ | Dùng Chrome/Edge, cho phép mic access |
| Data mất khi reload | Chưa implement localStorage | Normal, đây là MVP in-memory |
| Port 3000 bận | Ứng dụng khác chiếm port | `lsof -ti:3000 \| xargs kill -9` |

---

## **✅ Test Checklist**

- [ ] Dashboard: Chọn lớp + Thấy thống kê sĩ số
- [ ] Điểm Danh: Toggle học sinh, lưu < 30s
- [ ] Sổ Điểm: Mở card, nhập điểm/nhận xét, save
- [ ] Thông Báo: Chọn template, gửi thông báo
- [ ] Voice: Nút 🎤 hoạt động (nếu browser hỗ trợ)
- [ ] Navigation: 4 tab hoạt động
- [ ] State: Data persist khi navigate

---

## **📝 Ghi Chú Tester**

**Nếu gặp vấn đề:**
1. Mở DevTools: `F12` → Console
2. Kiểm tra error messages
3. Xem Network tab nếu API bị fail
4. Check Jotai state (nếu cài Redux DevTools extension)

**Nếu muốn test real API sau:**
- Replace `mockAPI.ts` calls với `fetch()` thật
- Setup backend server (Node/Python/etc)
- Update endpoints trong hooks

---

## **🚀 Sau khi test OK:**

1. **Zalo SDK Integration:**
   - Connect ZNS (Zalo Notification Service) để gửi real messages
   - Test trên Zalo app (không phải browser)

2. **Real Backend:**
   - Setup database (PostgreSQL, MongoDB, etc)
   - Create API endpoints
   - Deploy backend server

3. **Performance Optimization:**
   - Lazy load pages
   - Optimize re-renders
   - Cache data locally

---

**Bắt đầu test ngay bằng cách:**
1. Mở http://localhost:3000/ trên trình duyệt
2. Làm theo các test scenario trên
3. Báo lại kết quả ✅ hoặc ❌

Good luck! 🎉
