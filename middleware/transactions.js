const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');
const axios = require('axios');

// Helpers kirim ke sistem lain
const sendToPOS = async (transaction) => {
  const res = await axios.post('http://localhost:3002/pos/transactions', transaction);
  return res.data;
};

const sendToERP = async (transaction) => {
  const res = await axios.post('http://localhost:3003/erp/invoices', transaction);
  return res.data;
};

const sendToCRM = async (transaction) => {
  const res = await axios.post('http://localhost:3001/crm/points', transaction);
  return res.data;
};

// Buat transaction + sinkronisasi ke POS, ERP, CRM
router.post('/middleware/transactions', async (req, res) => {
  try {
    const { customer_id, amount, method } = req.body;

    // 1. Simpan transaksi awal
    const newTransaction = await prisma.transactions.create({
      data: {
        customer_id,
        amount,
        method,
      }
    });

    // 2. Kirim ke POS
    const posRes = await sendToPOS({
      transaction_id: newTransaction.id,
      customer_id,
      amount,
      method
    });

    // 3. Kirim ke ERP
    const erpRes = await sendToERP({
      transaction_id: newTransaction.id,
      customer_id,
      amount,
      method
    });

    // 4. Kirim ke CRM (untuk perhitungan point)
    const crmRes = await sendToCRM({
      transaction_id: newTransaction.id,
      customer_id,
      amount
    });

    // 5. Update transaksi dengan ID dari masing-masing sistem
    const updatedTransaction = await prisma.transactions.update({
      where: { id: newTransaction.id },
      data: {
        pos_transaction_id: posRes.pos_transaction_id,
        erp_invoice_id: erpRes.invoice_id,
        crm_point_id: crmRes.point_id,
      }
    });

    // 6. Catat di sync_logs
    await prisma.sync_logs.create({
      data: {
        transaction_id: updatedTransaction.id,
        pos_status: 'success',
        erp_status: 'success',
        crm_status: 'success'
      }
    });

    res.status(201).json({
      message: 'Transaction created and synced successfully',
      data: updatedTransaction
    });

  } catch (err) {
    console.error('Error creating transaction middleware:', err);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

module.exports = router;
