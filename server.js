const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoute = require('./routes/dashboardRoutes')
const syncRoutes = require('./routes/syncRoute');
const pointsRoutes = require('./routes/pointsRoutes')




app.use(cors({
    origin: 'http://localhost:3005', // ganti sesuai frontend kamu
    credentials: true,
  }));
app.use(express.json());


// Routes
app.use('/api/middleware/v1/customers', authRoutes);
app.use('/api/pos', transactionRoutes);
app.use('/api', dashboardRoute);
app.use('/api', syncRoutes);
app.use('/api/points', pointsRoutes)




app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
