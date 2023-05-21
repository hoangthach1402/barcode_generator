const express = require('express');
const bwipjs = require('bwip-js');
const qrcode = require('qrcode');

const app = express();
const port = 3000;

// Định nghĩa API endpoint
app.get('/barcode', (req, res) => {
  const url = req.query.url; // Lấy URL từ tham số truy vấn

  // Kiểm tra nếu URL không được cung cấp hoặc không hợp lệ
  if (!url) {
    res.status(400).json({ error: 'Vui lòng cung cấp URL hợp lệ.' });
    return;
  }

  // Tạo hình ảnh mã vạch
  bwipjs.toBuffer(
    {
      bcid: 'code128', // Loại mã vạch (ở đây là Code 128)
      text: url, // Nội dung mã vạch dựa trên URL đầu vào
      scale: 3, // Tùy chỉnh tỷ lệ hình ảnh
      height: 10, // Chiều cao của mã vạch
    },
    (err, png) => {
      if (err) {
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tạo mã vạch.' });
        return;
      }

      // Trả về hình ảnh mã vạch dưới dạng phản hồi
      res.set({ 'Content-Type': 'image/png' });
      res.send(png);
    }
  );
});
app.get('/qrcode', (req, res) => {
  const qrContent = req.query.content; // Lấy nội dung từ tham số truy vấn

  // Kiểm tra nếu nội dung không được cung cấp hoặc không hợp lệ
  if (!qrContent) {
    res.status(400).json({ error: 'Vui lòng cung cấp nội dung hợp lệ.' });
    return;
  }

  // Tạo mã QR
  qrcode.toDataURL(qrContent, (err, qrDataUrl) => {
    if (err) {
      res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tạo mã QR.' });
      return;
    }

    // Trả về hình ảnh mã QR dưới dạng phản hồi
    res.send(`<img src="${qrDataUrl}" alt="QR Code">`);
  });
});


app.listen(port, () => {
    console.log(`API đang lắng nghe tại http://localhost:${port}`);
  });
