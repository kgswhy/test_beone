const express = require('express');
const router = express.Router();
const { getSyncLogs } = require('../controllers/syncController');

router.get('/sync-logs', getSyncLogs);

module.exports = router;
