const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');
const { syncDB } = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const cropRoutes = require('./src/routes/cropRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files if needed

// Connect and Sync Database
connectDB().then(() => syncDB());

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Alias to support raw /auth/register and /auth/login endpoints
app.use('/api/crops', cropRoutes);
app.use('/api/ai', aiRoutes);

// Placeholder for MoMo Payment Initializer
app.post('/api/payments/momo-init', (req, res) => {
    const { phone, amount, orderId, provider } = req.body;
    console.log(`[MoMo] Push request sent to ${phone} for ${amount} FCFA via ${provider}`);
    res.json({ message: "Payment push request initiated successfully.", status: "PENDING" });
});

app.get('/api/health', (req, res) => {
    res.json({ message: 'AgroConnect API is running smoothly' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
