// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/promo-page');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /promo-page
 * http://localhost:3000/api/promo-page
 */


router.post('/add-promo-page-info',checkIpWhitelist,checkAdminAuth, controller.addPromoPage);
router.get('/get-all-promo-page-info', controller.getPromoPage);
router.put('/update-promo-page-info',checkIpWhitelist,checkAdminAuth, controller.updatePromoPageInfo);
router.delete('/delete-promo-page-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deletePromoPage);

// Export All router..
module.exports = router;
