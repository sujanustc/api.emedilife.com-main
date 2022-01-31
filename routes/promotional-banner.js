// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/promotional-banner');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /promotional-banner
 * http://localhost:3000/api/promotional-banner
 */


router.post('/add-promotional-banner',checkIpWhitelist,checkAdminAuth, controller.addBanner);
router.get('/get-all-promotional-banners', controller.getAllBanners);
router.post('/get-promotional-banner-by-tag', controller.getBannerByTag);
router.put('/update-promotional-banner',checkIpWhitelist,checkAdminAuth, controller.updateBanner);
router.delete('/delete-promotional-banner',checkIpWhitelist,checkAdminAuth, controller.deleteBanner);

// Export All router..
module.exports = router;
