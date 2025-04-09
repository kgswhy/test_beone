const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CRM endpoint
app.post('/crm/points', (req, res) => {
  console.log('[CRM] Received:', req.body);
  res.json({ crm_id: 'crm_' + Date.now() });
});

// ERP endpoint
app.post('/erp/invoices', (req, res) => {
  console.log('[ERP] Received:', req.body);
  res.json({ erp_id: 'erp_' + Date.now() });
});

// POS endpoint
app.post('/pos/transactions', (req, res) => {
  console.log('[POS] Received:', req.body);
  res.json({ pos_id: 'pos_' + Date.now() });
});


app.listen(3001, () => {
  console.log('Mock service (POS, ERP, CRM) running at http://localhost:3001');
});
