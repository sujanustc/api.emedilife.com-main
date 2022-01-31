const express = require('express');

// Created Require Files..
const controller = require('../controller/warranty');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/warranty
 * http://localhost:3000/api/warranty
 */

// TAG
router.post('/add-single-warranty',checkIpWhitelist, checkAdminAuth, controller.addSingleWarranty);
router.get('/get-all-warranty',checkIpWhitelist, checkAdminAuth, controller.getAllWarranty);
router.post('/add-multiple-warranty',checkIpWhitelist, checkAdminAuth, controller.insertManyWarranty);
router.get('/get-warranty-by-warranty-id/:warrantyId',checkIpWhitelist, checkAdminAuth, controller.getWarrantyByWarrantyId);
router.post('/get-warranty-data-by-customer', checkAuth, controller.getWarrantDataByCustomer);
router.post('/track-warranty-download-history', checkAuth, controller.trackWarrantDownloadHistory);
router.post('/check-warranty-data-by-customer-phone-no', checkAuth, controller.checkWarrantByCustomerPhoneNo);
router.put('/edit-warranty-by-warranty',checkIpWhitelist, checkAdminAuth, controller.editWarrantyData);
router.delete('/delete-warranty-by-id/:warrantyId',checkIpWhitelist, checkAdminAuth, controller.deleteWarrantyByWarrantyId);
router.post('/get-warranty-by-search',checkIpWhitelist, checkAdminAuth, controller.getWarrantyBySearch);



// Export All router..
module.exports = router;
