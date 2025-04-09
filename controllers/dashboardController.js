const pool = require('../db');

const getDashboardData = async (req, res) => {
  try {
    const revenueResult = await pool.query('SELECT SUM(total_amount) AS total FROM transactions');
    const newCustomerResult = await pool.query("SELECT COUNT(*) AS total FROM customers WHERE created_at >= NOW() - INTERVAL '30 days'");
    const activeAccountsResult = await pool.query('SELECT COUNT(*) AS total FROM customers');
    const growthRate = ((parseFloat(revenueResult.rows[0].total) || 0) / 100000) * 100; // dummy growth calc

    const data = {
      totalRevenue: revenueResult.rows[0].total || 0,
      newCustomers: newCustomerResult.rows[0].total || 0,
      activeAccounts: activeAccountsResult.rows[0].total || 0,
      growthRate: growthRate.toFixed(2),
    };

    res.json(data);
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDashboardData };
