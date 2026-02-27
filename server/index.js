const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API cho người dùng (User)
app.get('/api/user', (req, res) => {
    res.json({ message: "Chào mừng khách hàng đến với PC Store!" });
});

// API cho quản trị (Admin)
app.get('/api/admin', (req, res) => {
    res.json({ message: "Khu vực quản trị hệ thống." });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});