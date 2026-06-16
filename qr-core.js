/*
 * qr-core.js — shared helpers for QR Code Studio
 * ------------------------------------------------------------------
 * พวกฟังก์ชันที่ "เหมือนกันเป๊ะ" ระหว่าง qr-generator.html และ vcard.html
 * ถูกย้ายมารวมไว้ที่นี่ที่เดียว เพื่อลดโค้ดซ้ำ
 *
 * ไฟล์นี้ประกาศฟังก์ชันแบบ global (top-level function declarations) เพื่อให้
 * สคริปต์เดิมในแต่ละหน้าเรียกใช้ได้โดยไม่ต้องแก้วิธีเรียก
 *
 * วิธี wire (ทำตอนเทสต์ในเบราว์เซอร์ได้):
 *   1. ใส่ <script src="qr-core.js"></script> ต่อจาก <script src="qrcode.js"></script>
 *      ในทั้ง qr-generator.html และ vcard.html
 *   2. ลบฟังก์ชัน 6 ตัวด้านล่างนี้ออกจาก <script> เดิมของแต่ละหน้า
 *      (escapeXml, debounce, triggerDownload, roundRectPath,
 *       drawLogoOnCanvas, buildLogoSVG)
 *   3. เทสต์: เปิดแต่ละหน้า → generate QR → download PNG + SVG →
 *      เปิด/ปิด logo และ frame → ต้องทำงานได้ปกติทุกอย่าง
 * ------------------------------------------------------------------
 */

// HTML/attribute-safe escaping (ใช้ตอนแทรกข้อความลงใน DOM / SVG)
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// หน่วงการเรียกฟังก์ชัน (กันยิงถี่ตอนพิมพ์ / ปรับ setting)
function debounce(fn, delay) {
  var t;
  return function () {
    var args = arguments, ctx = this;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(ctx, args); }, delay);
  };
}

// สั่งดาวน์โหลดไฟล์จาก object URL / data URL
function triggerDownload(href, filename) {
  var a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// path สี่เหลี่ยมมุมมน (ใช้วาดพื้นหลัง/คลิปโลโก้)
function roundRectPath(ctx, x, y, w, h, r) {
  if (r > w / 2) r = w / 2;
  if (r > h / 2) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// วาดโลโก้ตรงกลาง QR ลงบน canvas (PNG)
function drawLogoOnCanvas(ctx, logo, qrAreaSize, qrOffsetX, qrOffsetY) {
  if (!logo.enabled) return;
  var size = qrAreaSize * (logo.sizePercent / 100);
  var pad = size * 0.06;
  var cx = qrOffsetX + qrAreaSize / 2;
  var cy = qrOffsetY + qrAreaSize / 2;
  var x = cx - size / 2;
  var y = cy - size / 2;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  if (logo.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2 + pad, 0, Math.PI * 2);
    ctx.fill();
  } else {
    var bgR = (size + pad * 2) * 0.18;
    roundRectPath(ctx, x - pad, y - pad, size + pad * 2, size + pad * 2, bgR);
    ctx.fill();
  }
  if (logo.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.clip();
  } else {
    roundRectPath(ctx, x, y, size, size, size * 0.16);
    ctx.clip();
  }
  var img = logo.image;
  var dx = x, dy = y, dw = size, dh = size;
  if (img.width !== img.height) {
    var imgRatio = img.width / img.height;
    if (imgRatio > 1) { dw = size * imgRatio; dx = x - (dw - size) / 2; }
    else { dh = size / imgRatio; dy = y - (dh - size) / 2; }
  }
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

// สร้าง markup โลโก้สำหรับ SVG export
function buildLogoSVG(logo, qrAreaSize, qrOffset) {
  if (!logo.enabled || !logo.dataUrl) return '';
  var size = qrAreaSize * (logo.sizePercent / 100);
  var pad = size * 0.06;
  var cx = qrOffset + qrAreaSize / 2;
  var cy = qrOffset + qrAreaSize / 2;
  var x = cx - size / 2;
  var y = cy - size / 2;
  var clipId = 'logoClip_' + Math.floor(Math.random() * 1e9).toString(36);
  var bg, clipShape;
  if (logo.shape === 'circle') {
    bg = '<circle cx="' + cx.toFixed(3) + '" cy="' + cy.toFixed(3) + '" r="' + (size / 2 + pad).toFixed(3) + '" fill="#ffffff"/>';
    clipShape = '<circle cx="' + cx.toFixed(3) + '" cy="' + cy.toFixed(3) + '" r="' + (size / 2).toFixed(3) + '"/>';
  } else {
    var bgR = (size + pad * 2) * 0.18;
    bg = '<rect x="' + (x - pad).toFixed(3) + '" y="' + (y - pad).toFixed(3) +
         '" width="' + (size + pad * 2).toFixed(3) + '" height="' + (size + pad * 2).toFixed(3) +
         '" rx="' + bgR.toFixed(3) + '" fill="#ffffff"/>';
    clipShape = '<rect x="' + x.toFixed(3) + '" y="' + y.toFixed(3) +
                '" width="' + size.toFixed(3) + '" height="' + size.toFixed(3) +
                '" rx="' + (size * 0.16).toFixed(3) + '"/>';
  }
  return '<defs><clipPath id="' + clipId + '">' + clipShape + '</clipPath></defs>' +
         bg +
         '<image href="' + logo.dataUrl + '" x="' + x.toFixed(3) + '" y="' + y.toFixed(3) +
         '" width="' + size.toFixed(3) + '" height="' + size.toFixed(3) +
         '" clip-path="url(#' + clipId + ')" preserveAspectRatio="xMidYMid slice"/>';
}
