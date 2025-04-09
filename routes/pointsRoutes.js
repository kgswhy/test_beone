const express = require('express')
const router = express.Router()
const { getCustomerPointsWithTransactions } = require('../controllers/pointsController')

router.get('/', getCustomerPointsWithTransactions)

module.exports = router
