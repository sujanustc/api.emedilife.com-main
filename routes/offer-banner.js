// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/offer-banner');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /offer-banner
 * http://localhost:9999/api/offer-banner
 */


router.post('/add-offer-banner',checkIpWhitelist,checkAdminAuth, controller.addBanner);
router.get('/get-all-offer-banners', controller.getAllBanners);
router.post('/get-offer-banner-by-tag', controller.getBannerByTag);
router.put('/update-offer-banner',checkIpWhitelist,checkAdminAuth, controller.updateBanner);
router.delete('/delete-offer-banner',checkIpWhitelist,checkAdminAuth, controller.deleteBanner);

// Export All router..
module.exports = router;
