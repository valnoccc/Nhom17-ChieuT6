const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const MOCK_API = "https://698591166964f10bf2539592.mockapi.io/SinhVien";

// Lấy danh sách (Dùng chung cho cả User và Admin)
app.get('/api/sinhvien', async (req, res) => {
    try {
        const response = await axios.get(MOCK_API);
        res.json(response.data);
    } catch (error) { res.status(500).send("Lỗi kết nối API"); }
});

// Các chức năng ghi dữ liệu (Thường dành cho Admin)
app.post('/api/sinhvien', async (req, res) => {
    const response = await axios.post(MOCK_API, req.body);
    res.json(response.data);
});

app.delete('/api/sinhvien/:id', async (req, res) => {
    await axios.delete(`${MOCK_API}/${req.params.id}`);
    res.json({ success: true });
});

app.listen(port, () => console.log(`Server live at port ${port}`));