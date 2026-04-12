# Quy trình Git Workflow - Hệ thống Demo và Admin

> **Repository Demo:** https://github.com/NguyenDang182005/Demo.git
> **Repository Admin:** https://github.com/NguyenDang182005/admin.git
> **Nhánh chính:** `main`
> **Thành viên:** Nguyen Hai Dang, Kiet Nguyen

---

## Sơ đồ Git Workflow

```
  main         feature/xxx        nhánh-ngày
   │                │                  │
   │   ① clone/pull │                  │
   │◄───────────────│                  │
   │                │                  │
   │   ② tạo nhánh  │                  │
   │───────────────►│                  │
   │                │                  │
   │                │ ③ code & commit  │
   │                │─────────►        │
   │                │                  │
   │                │ ④ push lên remote│
   │                │─────────────────►│
   │                │                  │
   │   ⑤ pull main  │                  │
   │───────────────►│                  │
   │                │                  │
   │   ⑥ merge vào  │                  │
   │◄───────────────│                  │
   │                │                  │
   │   ⑦ push main  │                  │
   │───────────────►│                  │
   │                ▼                  ▼
```

---

## Phần 1: Kéo code về máy (Lần đầu)

Nếu **chưa có** project trên máy:

```bash
# Repo dành cho user
git clone https://github.com/NguyenDang182005/Demo.git demo

# Repo dành cho admin
git clone https://github.com/NguyenDang182005/admin.git admin
```

---

## Phần 2: Kéo code mới nhất về (Đã có project)

### Bước 1 — Kiểm tra nhánh hiện tại
```bash
git branch
```
Đảm bảo bạn đang ở nhánh `main` (có dấu `*` phía trước).

### Bước 2 — Lưu code đang làm dở (nếu có)
Nếu bạn đang code dở và chưa muốn commit:
```bash
git stash
```
> 💡 Lệnh này sẽ tạm cất code chưa commit sang một chỗ riêng.

### Bước 3 — Chuyển về nhánh main và kéo code mới
```bash
git checkout main
git pull origin main
```

### Bước 4 — Lấy lại code đang làm dở (nếu đã stash)
```bash
git stash pop
```
> ⚠️ Nếu có **conflict** (xung đột), xem phần xử lý conflict bên dưới.

---

## Phần 3: Kéo code từ nhánh khác về

### Trường hợp 1 — Kéo nhánh của người khác về xem
```bash
# Cập nhật danh sách nhánh từ remote
git fetch origin

# Xem tất cả các nhánh
git branch -a

# Chuyển sang nhánh muốn xem
git checkout dang
# hoặc
git checkout feature/search-timeline
# hoặc
git checkout 2026-03-24
```

### Trường hợp 2 — Gộp code từ nhánh khác vào main
```bash
# Về main trước
git checkout main
git pull origin main

# Gộp nhánh muốn lấy
git merge feature/search-timeline

# Đẩy lên remote
git push origin main
```

---

## Phần 4: Lưu code theo ngày (Backup)

### Bước 1 — Tạo nhánh mới theo ngày
```bash
git checkout -b 2026-03-27
```

### Bước 2 — Lưu và đẩy lên
```bash
git add .
git commit -m "Backup code 27/03/2026"
git push origin 2026-03-27
```

### Bước 3 — Đồng bộ về nhánh chính
```bash
git checkout main
git pull origin main
git merge 2026-03-27
git push origin main
```

---

## Phần 5: Xử lý Conflict (Xung đột code)

Khi 2 người cùng sửa 1 file, Git sẽ báo conflict. File bị conflict sẽ có dạng:

```
<<<<<<< HEAD
// Code của bạn trên main
String name = "Dang";
=======
// Code từ nhánh kia
String name = "Kiet";
>>>>>>> feature/search-timeline
```

### Cách xử lý:
1. **Mở file bị conflict** và chọn giữ code nào (hoặc gộp cả hai)
2. **Xóa** các dòng `<<<<<<<`, `=======`, `>>>>>>>`
3. **Lưu file** và commit lại:

```bash
git add .
git commit -m "Fix: Resolve merge conflicts"
git push origin main
```

---

## Phần 6: Các nhánh hiện tại của dự án

| Nhánh | Mô tả | Người tạo |
|-------|--------|-----------|
| `main` | Nhánh chính, code ổn định | Team |
| `dang` | Nhánh dev của Dang | Nguyen Hai Dang |
| `feature/search-timeline` | Tính năng tìm kiếm theo thời gian | Nguyen Hai Dang |
| `2026-03-24` | Backup code ngày 24/03 | Nguyen Hai Dang |
| `dang-260321` | Backup code Dang ngày 21/03 | Nguyen Hai Dang |

---

## Tóm tắt nhanh — Các lệnh thường dùng

| Việc cần làm | Lệnh |
|-------------|-------|
| Kéo code mới nhất | `git pull origin main` |
| Xem nhánh hiện tại | `git branch` |
| Chuyển nhánh | `git checkout <tên-nhánh>` |
| Tạo nhánh mới | `git checkout -b <tên-nhánh>` |
| Lưu code | `git add . && git commit -m "message"` |
| Đẩy code lên | `git push origin <tên-nhánh>` |
| Gộp nhánh | `git merge <tên-nhánh>` |
| Cất code tạm | `git stash` |
| Lấy code tạm ra | `git stash pop` |
| Xem lịch sử | `git log --oneline --graph` |
| Xem trạng thái | `git status` |

---

> 📌 **Quy tắc chung:**
> - Luôn `git pull origin main` **trước khi** bắt đầu code mới
> - Luôn tạo **nhánh riêng** để code, không code trực tiếp trên `main`
> - Commit message nên rõ ràng, ví dụ: `feat: thêm tìm kiếm khách sạn`
> - Khi xong tính năng, merge về `main` và push lên
