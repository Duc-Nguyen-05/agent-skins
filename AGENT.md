# Agent-Skins — Instructions for the AI Assistant Installing Themes

Your user handed you this repository and wants to install a custom live theme/skin for their AI Agent application. Follow these instructions step by step. Talk to the user in their own language (Vietnamese by default if the user communicates in Vietnamese).

---

## Step 0 — Information Gathering & Interactive Clarification (MANDATORY)

Never guess or assume when information is missing. Follow these two checks:

### Check 1: Has the user specified which Theme they want?
If **NO** (e.g. they only said *"Cài theme cho mình"* or *"Install a theme"*):
You **MUST** present the complete catalog below, including **clickable links to preview images** so the user can click and view each theme immediately:

```markdown
Chào bạn! Mình có thể giúp bạn cài đặt các giao diện động tuyệt đẹp sau đây:

| STT | Theme | Mô tả phong cách & Hiệu ứng tương tác | Xem trước hình ảnh |
| :---: | :--- | :--- | :---: |
| 1 | **Koi Pond** | Hồ cá Koi bơi lội dưới làn nước sáng sớm trong veo, phản chiếu tia nắng và gợn sóng lấp lánh | 🖼️ [Xem ảnh Koi Pond](file:///D:/2_Projects/Personal/agent-skins/themes/koi/preview.png) |
| 2 | **Autumn Koi** | Hồ cá mùa thu thanh tịnh với lá phong Nhật đỏ rực và lá bạch quả vàng rơi bồng bềnh | 🖼️ [Xem ảnh Autumn Koi](file:///D:/2_Projects/Personal/agent-skins/themes/autumn/preview.png) |
| 3 | **Sumi Ink** | Tranh thủy mặc sơn thủy hữu tình, thuyền nan trôi, đàn chim bay lượn và rặng trúc thanh bình | 🖼️ [Xem ảnh Sumi Ink](file:///D:/2_Projects/Personal/agent-skins/themes/sumi/preview.png) |
| 4 | **Earth Glass** | Kính mờ Liquid Glass tone màu đất ấm áp, tối giản, sang trọng và dịu mắt | 🖼️ [Xem ảnh Earth Glass](file:///D:/2_Projects/Personal/agent-skins/themes/earth/preview.png) |
| 5 | **Cyber HUD** | Giao diện viễn tưởng Sci-Fi công nghệ cao, tâm ngắm reticle, radar quét và sóng dao động | 🖼️ [Xem ảnh Cyber HUD](file:///D:/2_Projects/Personal/agent-skins/themes/cyber/preview.png) |
| 6 | **Motion** | Đồ họa chuyển động Flat Motion hiện đại, phản hồi nhịp nhàng theo trạng thái AI suy nghĩ | 🖼️ [Xem ảnh Motion](file:///D:/2_Projects/Personal/agent-skins/themes/motion/preview.png) |
| 7 | **Slay** | Typography nghệ thuật động kinetic pop-up cá tính, thời thượng và năng động | 🖼️ [Xem ảnh Slay](file:///D:/2_Projects/Personal/agent-skins/themes/slay/preview.png) |
| 8 | **Attention** | Mặt giấy ấm áp mộc mạc, các sợi liên kết từ ngữ trôi dạt đa ngôn ngữ | 🖼️ [Xem ảnh Attention](file:///D:/2_Projects/Personal/agent-skins/themes/attention/preview.png) |

👉 **Bạn muốn chọn Theme nào trong danh sách trên?**
```

### Check 2: Has the user specified which Agent Application they want to skin?
If **NO** (e.g. they only said *"Cài theme koi cho mình"*):
You **MUST** ask the user:
> *"Bạn muốn áp dụng theme này cho **Google Antigravity App** hay **Claude Desktop**?"*

*(Gợi ý: Agent có thể tự động kiểm tra xem tiến trình `%APPDATA%\Antigravity\DevToolsActivePort` có tồn tại không hoặc cổng `127.0.0.1:9229` có đang mở không để chủ động gợi ý cho người dùng).*

---

## Step 1 — Automatic Execution Once Information Is Clear

Once the user has confirmed **both** the Theme `<theme>` and the Target App `<agent>`, the Agent **automatically carries out the installation** as follows:

### Route A: Target is Google Antigravity App
*(Áp dụng cho các theme có thư mục `themes/<theme>/antigravity/`, tiêu biểu là `koi`)*:

1. **Kiểm tra tiến trình Antigravity**:
   - Đọc file `%APPDATA%\Antigravity\DevToolsActivePort`.
   - Nếu không tìm thấy file: Báo người dùng hãy mở Antigravity App trước.
2. **Tự động chạy script nạp theme**:
   - Chạy lệnh:
     ```powershell
     node themes/<theme>/antigravity/inject.mjs
     ```
3. **Xác nhận kết quả**:
   - Kiểm tra log hiển thị `[SUCCESS] Applied ...`.
   - Thông báo cho người dùng theme đã được nạp trực tiếp vào Antigravity đang mở.
4. **Cung cấp phím tắt điều khiển cho người dùng**:
   - `Ctrl + Alt + Up / Down`: Tăng / giảm độ mờ kính (từ 0% trong vắt đến 90%).
   - `Ctrl + Alt + Left / Right`: Tăng / giảm độ sáng hồ nước (0.4x đến 1.8x).
   - `Ctrl + Alt + G`: Bật / Tắt hiệu ứng theme.
   - Chuột: Rê chuột để cá bơi lại gần, click chuột để tạo sóng nước.
   - Tự khởi động cùng máy: Chạy `themes/<theme>/antigravity/autostart-on.bat`.
   - Gỡ bỏ: Chạy `node themes/<theme>/antigravity/off.mjs` (hoặc `uninstall.bat`).

---

### Route B: Target is Claude Desktop App
*(Áp dụng cho mọi theme trong thư mục `themes/<theme>/claude/`)*:

1. **Kiểm tra điều kiện tiên quyết**:
   - Node.js phiên bản 22 trở lên (`node -v`).
   - Claude Desktop phải đang đặt ở giao diện **Sáng (Light Mode)**.
2. **Hướng dẫn người dùng bật cổng Debug (Người dùng làm thủ công vì lý do bảo mật)**:
   - Nhắc người dùng vào Claude: Mở menu (☰ góc trên bên trái) → **Developer** → Tích chọn **Enable Main Process Debugger**.
   - Giải thích bảo mật: *Cổng này chỉ mở tạm thời trong vài giây để cài theme và sẽ được tắt ngay lập tức.*
3. **Tự động chạy script nạp theme**:
   - Chạy lệnh:
     ```powershell
     node themes/<theme>/claude/inject.mjs
     ```
4. **Kiểm tra trạng thái**:
   - Trạng thái `"state": "on"`: Đã nạp thành công.
   - Trạng thái `"state": "ROLLED-BACK"`: Kiểm toán tương phản tự động thu hồi vì làm mờ chữ.
5. **Nhắc người dùng tắt ngay Debugger**:
   - Bỏ tích **Developer → Enable Main Process Debugger** để bảo mật an toàn.
6. **Cung cấp phím tắt điều khiển**:
   - `Ctrl + Alt + G`: Bật / Tắt theme.
   - `Ctrl + Alt + Up / Down`: Tăng / giảm độ mờ kính (20% – 90%).
   - Tự khởi động: Chạy `themes/<theme>/claude/autostart-on.bat`.
   - Gỡ bỏ: Chạy `node themes/<theme>/claude/off.mjs` hoặc khởi động lại Claude.

---

## Hard Rules for the AI Assistant
1. **Never guess**: When missing the theme name or target app, always present the visual catalog with clickable image links and ask.
2. **No binary patching**: Never touch binary files (`app.asar`, `.exe`, etc.). All themes inject cleanly in memory.
3. **Strictly local**: No network requests, no analytics, no external CDN downloads. Everything runs locally in code.
4. **No unauthorized UI clicks**: Never simulate mouse clicks to turn on debuggers on the user's behalf.
