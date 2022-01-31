const express = require('express');

// Imports
const controller = require('../controller/banner');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


// Get Express Router Function..
const router = express.Router();

/**
 * /api/banner
 * http://localhost:3000/api/banner
 */

router.post('/add-new-banner', checkIpWhitelist, checkAdminAuth, controller.addNewBanner);
router.get('/get-all-banner-list', controller.getAllBanner);
router.get('/get-banner-by-id/:id',checkAdminAuth, controller.getSingleBannerById);
router.delete('/delete-banner-by-id/:id', checkIpWhitelist, checkAdminAuth, controller.deleteBannerById);
router.put('/edit-banner', checkIpWhitelist, checkAdminAuth, controller.editBanner);
router.get('/get-banner-by-banner-type', controller.getBannerByType);


// Export router class..
module.exports = router;
