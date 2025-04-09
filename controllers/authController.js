const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const axios = require('axios')

// Register

const register = async (req, res) => {
    const { email, password, confirmPassword, name, phone } = req.body;
  
    if (!email || !password || !confirmPassword || !name || !phone)
      return res.status(400).json({ message: 'All fields are required' });
  
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });
  
    try {
      const existingUser = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
      if (existingUser.rows.length > 0)
        return res.status(400).json({ message: 'User already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Simulasi integrasi ke sistem eksternal untuk mendapatkan ID
      // Simulasi integrasi ke sistem eksternal untuk mendapatkan ID
const [crmRes, erpRes, posRes] = await Promise.all([
    axios.post('http://localhost:3001/crm/points', { name, phone, email }),
    axios.post('http://localhost:3001/erp/invoices', { name, phone, email }),
    axios.post('http://localhost:3001/pos/transactions', { name, phone, email }),
  ]);
  
  
  const crm_id = crmRes.data.point_id;
  const erp_id = erpRes.data.invoice_id;
  const pos_id = posRes.data.pos_transaction_id;
  
  const newUser = await pool.query(
    `INSERT INTO customers (email, password_hash, name, phone, crm_id, erp_id, pos_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, name, phone`,
    [email, hashedPassword, name, phone, crm_id, erp_id, pos_id]
  );
  
  
      res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
  
    } catch (err) {
      console.error('Register error:', err.message);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const userQuery = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (userQuery.rows.length === 0)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        is_active: user.is_active
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { register, login };
