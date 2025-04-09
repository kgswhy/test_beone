const pool = require('../db');

const getSyncLogs = async (req, res) => {
  try {
    const query = `
 SELECT 
  s.*, 
  c.name AS customer_name, 
  c.phone AS customer_phone
FROM sync_logs s
LEFT JOIN customers c 
  ON (s.payload->>'customer_id')::uuid = c.id

`;

    
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching sync logs:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSyncLogs,
};
