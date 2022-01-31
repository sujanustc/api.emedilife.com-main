// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/shop-info');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /shop-info
 * http://localhost:3000/api/shop-info
 */


router.post('/add-shop-info',checkIpWhitelist,checkAdminAuth, controller.addShopInfo);
router.get('/get-all-shop-info', controller.getShopInfo);
router.put('/update-shop-info',checkIpWhitelist,checkAdminAuth, controller.updateShopInfo);

// Export All router..
module.exports = router;
