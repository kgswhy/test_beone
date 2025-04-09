const pool = require('../db');

const getCustomerPointsWithTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id AS customer_id,
        c.name AS customer_name,
        c.phone,
        COALESCE(SUM(p.total_points), 0) AS total_points,
        JSON_AGG(DISTINCT t.id) AS transaction_ids
      FROM customers c
      LEFT JOIN points p ON c.id = p.customer_id
      LEFT JOIN transactions t ON p.transaction_id = t.id
      GROUP BY c.id, c.name, c.phone
      ORDER BY total_points DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching customer points with transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getCustomerPointsWithTransactions };
