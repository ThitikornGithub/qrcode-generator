# QR Code Generator

เครื่องมือสร้าง QR Code หลายอันพร้อมกันจาก URL / text
รองรับการตั้งชื่อ, import CSV, ปรับ Error Correction, Quiet Zone, กรอบ, ชื่อใต้ QR
และ Export เป็น PNG / SVG / ZIP

## การใช้งาน

เปิดไฟล์ `qr-generator.html` ด้วยเว็บเบราว์เซอร์

### รูปแบบ input ที่รองรับ (ต่อบรรทัด)

```
Name 1 | https://example1.com
Name 2, https://example2.com
https://example3.com
```

- `ชื่อ | URL` — ใช้ชื่อเป็น filename
- `ชื่อ, URL` — รูปแบบ CSV
- `URL` เปล่า ๆ — ใช้ URL เป็น filename

### ฟีเจอร์

- ใส่ URL ได้หลายอันพร้อมกัน — บรรทัดละ 1 รายการ
- Import จาก CSV file (`.csv` / `.txt` / `.tsv`)
- Preview รายการที่ parse แล้ว ลบทีละรายการได้ก่อน generate
- ตั้งชื่อไฟล์รายตัวได้หลัง generate ก่อน download
- ปรับขนาด, สี, Error Correction (L/M/Q/H), Quiet Zone
- Toggle กรอบและ/หรือชื่อใต้ QR แยกกันอิสระ
- Download ทีละรายการ (PNG / SVG) หรือ Download All (ZIP)
- Copy รูป QR ลง clipboard ได้โดยตรง
- ปุ่ม × ลบการ์ดออกจาก batch
- Ctrl/Cmd + Enter ในช่อง input เพื่อ Generate ทันที

## License

ส่วนเครื่องมือในไฟล์ `qr-generator.html` เขียนขึ้นภายใต้ MIT License
ส่วน `qrcode.js` ซึ่งเป็น dependency ยังคงไว้ตาม upstream license
(ดูรายละเอียดในไฟล์ `LICENSE`)
