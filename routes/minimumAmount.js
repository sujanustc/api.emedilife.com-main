const express = require('express');

// Imports
const checkAdminAuth = require('../middileware/check-admin-auth');
const { addMinimumAmount,
    editMinimumAmountById,
    deleteMinimumAmountById,
    getAllMinimumAmount } = require('../controller/minimiumAmountController')

/*
http://localhost:9999/api/admin/minimum-amount
*/

// Get Express Router Function..
const router = express.Router();

router.post('/add-minimum-amount', checkAdminAuth, addMinimumAmount)
router.post('/edit-minimum-amount-by-id', checkAdminAuth, editMinimumAmountById)
router.delete('/delete-minimum-amount-by-id', checkAdminAuth, deleteMinimumAmountById)
router.get('/get-all-mimimum-amount-list', checkAdminAuth, getAllMinimumAmount)

// Export router class..
module.exports = router;