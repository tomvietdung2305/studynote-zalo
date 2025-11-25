# Hướng dẫn Cấu hình Firestore Database

Hiện tại tính năng Báo cáo AI đang chạy ở chế độ **Demo (Mock Data)** do chưa kết nối được với Firestore Database thật của Google Cloud. Để kết nối thật, bạn cần thực hiện các bước sau:

## 1. Nguyên nhân lỗi
Lỗi `PERMISSION_DENIED` xuất hiện vì:
1.  **Firestore API chưa được bật** trong Google Cloud Project.
2.  **Service Account** chưa có quyền truy cập Firestore.
3.  Hoặc **Firestore Database chưa được tạo** trong project.

## 2. Các bước khắc phục

### Bước 1: Bật Firestore API
1.  Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2.  Chọn project `studynote-zalo` (hoặc project bạn đang dùng).
3.  Vào menu **APIs & Services** > **Library**.
4.  Tìm kiếm "Google Cloud Firestore API".
5.  Nhấn **Enable** (Bật).

### Bước 2: Tạo Firestore Database
1.  Trong Google Cloud Console, tìm kiếm "Firestore".
2.  Nếu chưa có database, nhấn **Create Database**.
3.  Chọn chế độ **Native Mode** (khuyến nghị).
4.  Chọn Location (ví dụ: `asia-southeast1` cho Singapore để nhanh hơn ở VN).
5.  Nhấn **Create**.

### Bước 3: Cấu hình Service Account (Quan trọng)
Server cần một file "chìa khóa" để truy cập database.

1.  Vào **IAM & Admin** > **Service Accounts**.
2.  Nhấn **Create Service Account**.
    *   Name: `studynote-backend`
    *   Nhấn **Create and Continue**.
3.  Cấp quyền (Role):
    *   Chọn role: **Cloud Datastore User** (hoặc `Firestore Service Agent`).
    *   Nhấn **Continue** > **Done**.
4.  Tạo Key:
    *   Bấm vào Service Account vừa tạo (email).
    *   Vào tab **Keys**.
    *   Nhấn **Add Key** > **Create new key**.
    *   Chọn **JSON**.
    *   File JSON sẽ tự động tải về máy.

### Bước 4: Cài đặt Key vào Server
1.  Đổi tên file JSON vừa tải về thành `service-account.json`.
2.  Copy file này vào thư mục `server/config/` của dự án (tạo thư mục `config` nếu chưa có).
3.  Mở file `server/.env` và thêm/sửa dòng sau:
    ```env
    GOOGLE_APPLICATION_CREDENTIALS=./config/service-account.json
    ```

### Bước 5: Cấp quyền cho Service Account (QUAN TRỌNG)
Nếu bạn gặp lỗi `PERMISSION_DENIED`, hãy làm thêm bước này:

1. Trong Google Cloud Console, vào menu **IAM & Admin** > **IAM**.
2. Tìm email của Service Account (ví dụ: `firebase-adminsdk-xxx@...`).
3. Nhấn vào biểu tượng bút chì (Edit Principal).
4. Nhấn **+ ADD ANOTHER ROLE**.
5. Tìm và chọn role **"Firebase Admin"** (hoặc "Cloud Datastore User").
6. Nhấn **Save**.

### Bước 6: Khởi động lại Server
Sau khi cấu hình xong, hãy khởi động lại server để áp dụng thay đổi:

```bash
cd server
npm run dev
```

## 3. Kiểm tra
Sau khi làm xong các bước trên, server sẽ tự động kết nối với Firestore thật.
- Dữ liệu báo cáo sẽ được lưu vĩnh viễn trên Cloud.
- Bạn có thể xem dữ liệu tại Firestore Console.

---
**Lưu ý:** Trong lúc chờ cấu hình, tính năng vẫn hoạt động bình thường ở chế độ Demo (dữ liệu không lưu vào DB thật).
