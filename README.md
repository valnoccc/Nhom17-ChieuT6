# Nhóm 17 - Xây dựng website kinh đoanh đồ gia dụng

Đồ án môn học Lập trình Web của Nhóm 17 - Chiều Thứ 6. Hệ thống sử dụng mô hình Monorepo để quản lý cả Frontend và Backend trong một kho lưu trữ duy nhất.

## Công nghệ sử dụng
* **Frontend:** HTML5, CSS3, JavaScript, React (Fetch API).
* **Backend:** Node.js, Express.js.
* **Database:** TiDB Cloud (MySQL Compatible).

## Cấu trúc thư mục
```text
NHOM17_LTW/
├── client/                 # Giao diện người dùng (Deploy: Netlify)
│   ├── admin/              # Trang quản trị (Thêm, Sửa, Xóa)
│   └── user/               # Trang hiển thị danh sách
├── server/                 # Mã nguồn Backend (Deploy: Render)
│   ├── controller/         # Xử lý logic nghiệp vụ (Admin & User)
│   ├── routes/             # Định nghĩa các luồng API
│   ├── .env                # Biến môi trường (Không push lên GitHub)
│   └── index.js            # Điểm khởi đầu của Server
└── .gitignore              # Loại bỏ node_modules và các tệp nhạy cảm
