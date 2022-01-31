// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/top-brands');

const router = express.Router();

/**
 * /top-brands
 * http://localhost:3000/api/top-brands
 */


// router.post('/add-top-brands', controller.getAllBrands);
router.get('/get-all-promotional-brands', controller.getPromotionalBrands);
router.get('/get-all-brands', controller.getAllBrands);
// router.post('/get-offer-banner-by-tag', controller.getBannerByTag);
// router.put('/update-offer-banner', controller.updateBanner);
// router.delete('/delete-offer-banner', controller.deleteBanner);
// router.get('/get-brand-by-brand-id/:brandId', controller.getBrandByBrandId);
// router.post('/get-brands-by-search', controller.getBrandsBySearch);

// Export All router..
module.exports = router;
