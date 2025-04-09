const pool = require('../db');
const axios = require('axios');

const createTransaction = async (req, res) => {
  const { customer_id, total_amount, payment_method } = req.body;

  if (!customer_id || !total_amount || !payment_method) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const customerCheck = await pool.query('SELECT * FROM customers WHERE id = $1', [customer_id]);
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const transactionResult = await pool.query(
      `INSERT INTO transactions (customer_id, total_amount, payment_method)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [customer_id, total_amount, payment_method]
    );
    const transaction = transactionResult.rows[0];
    const transaction_id = transaction.id;

    const points_earned = Math.floor(total_amount / 10000);

    await pool.query(
      `INSERT INTO points (customer_id, transaction_id, points_earned, total_points)
       VALUES ($1, $2, $3, $3)`,
      [customer_id, transaction_id, points_earned]
    );

    const [posRes, erpRes, crmRes] = await Promise.all([
      axios.post('http://localhost:3001/pos/transactions', { transaction }),
      axios.post('http://localhost:3001/erp/invoices', { transaction }),
      axios.post('http://localhost:3001/crm/points', {
        customer_id,
        transaction_id,
        points_earned,
      }),
    ]);

    await pool.query(
      `UPDATE transactions
       SET pos_transaction_id = $1, erp_invoice_id = $2, crm_point_id = $3
       WHERE id = $4`,
      [posRes.data.pos_transaction_id, erpRes.data.invoice_id, crmRes.data.point_id, transaction_id]
    );

    await pool.query(
      `UPDATE customers
       SET pos_id = COALESCE(pos_id, $1),
           erp_id = COALESCE(erp_id, $2),
           crm_id = COALESCE(crm_id, $3)
       WHERE id = $4`,
      [posRes.data.customer_id, erpRes.data.customer_id, crmRes.data.customer_id, customer_id]
    );

    // 📝 Simpan log sinkronisasi ke semua sistem
    await pool.query(
      `INSERT INTO sync_logs (source_system, target_system, action, status, payload, response)
       VALUES 
       ('MIDDLEWARE', 'POS', 'CREATE_TRANSACTION', 'success', $1, $2),
       ('MIDDLEWARE', 'ERP', 'CREATE_INVOICE', 'success', $3, $4),
       ('MIDDLEWARE', 'CRM', 'UPDATE_POINT', 'success', $5, $6)`,
      [
        JSON.stringify(transaction), JSON.stringify(posRes.data),
        JSON.stringify(transaction), JSON.stringify(erpRes.data),
        JSON.stringify({ customer_id, transaction_id, points_earned }), JSON.stringify(crmRes.data)
      ]
    );

    return res.status(201).json({
      message: 'Transaction created successfully',
      data: {
        transaction_id,
        customer_id,
        total_amount,
        payment_method,
        points_earned,
        pos_transaction_id: posRes.data.pos_transaction_id,
        erp_invoice_id: erpRes.data.invoice_id,
        crm_point_id: crmRes.data.point_id,
      }
    });

  } catch (err) {
    console.error('Transaction error:', err.message);
    return res.status(500).json({ message: 'Error creating transaction', error: err.message });
  }
};

module.exports = { createTransaction };
