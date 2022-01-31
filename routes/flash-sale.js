const express = require('express');

// Imports
const controller = require('../controller/flash-sale');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


// Get Express Router Function..
const router = express.Router();

/**
 * /api/flash-sale
 * http://localhost:9999/api/flash-sale
 */

router.post('/add-new-flash-sale',checkIpWhitelist,checkAdminAuth, controller.addNewFlashSale);
router.get('/get-all-flash-sale-list', controller.getAllFlashSale);
router.get('/get-flash-sale-by-id/:id', controller.getSingleFlashSaleById);
router.delete('/delete-flash-sale-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteFlashSaleById);
router.put('/edit-flash-sale',checkIpWhitelist,checkAdminAuth, controller.editFlashSale);


// Export router class..
module.exports = router;
