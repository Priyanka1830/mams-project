const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_military_key_2026';

// 1. LOGIN ENDPOINT
app.post('/api/v1/auth/login', (req, res) => {
  const { username } = req.body;
  const role = username?.includes('admin') ? 'ADMIN' : 
               username?.includes('cmd') ? 'BASE_COMMANDER' : 'LOGISTICS_OFFICER';

  const user = { id: 1, username: username || 'admin.supreme', role, base_id: 1 };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });

  return res.json({ token, user });
});

// 2. DASHBOARD METRICS ENDPOINT
app.get('/api/v1/dashboard/metrics', (req, res) => {
  res.json({
    opening_balance: 1200,
    closing_balance: 980,
    assigned: 150,
    expended: 70,
    net_movement: 40,
    purchases: 100,
    transfers_in: 30,
    transfers_out: 90
  });
});

// 3. PURCHASES ENDPOINT
app.post('/api/v1/purchases', (req, res) => {
  return res.status(201).json({ 
    success: true, 
    message: 'Purchase logged successfully' 
  });
});

// 4. TRANSFERS ENDPOINT (Accepts both likely paths)
app.post('/api/v1/transfers/initiate', (req, res) => {
  return res.status(201).json({ 
    success: true, 
    message: 'Transfer request dispatched successfully' 
  });
});

app.post('/api/v1/transfers', (req, res) => {
  return res.status(201).json({ 
    success: true, 
    message: 'Transfer request dispatched successfully' 
  });
});

// 5. ASSIGNMENTS ENDPOINT
app.post('/api/v1/assignments', (req, res) => {
  return res.status(200).json({ 
    success: true, 
    message: 'Asset assigned successfully' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MAMS Ready on Port ${PORT}`));