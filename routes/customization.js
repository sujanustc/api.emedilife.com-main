// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/customization');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();


/**
 * /brand
 * http://localhost:9999/api/customization
 */


router.post('/add-new-carousel', checkIpWhitelist, checkAdminAuth, controller.addNewCarousel);
router.get('/get-all-carousel', controller.getAllCarousel);
router.delete('/delete-carousel-by-id/:id', checkIpWhitelist, checkAdminAuth, controller.deleteCarouselById);
router.get('/get-single-carousel-by-id/:id', checkAdminAuth, controller.getSingleCarouselById);
router.put('/edit-carousel-by-id', checkIpWhitelist, checkAdminAuth, controller.editCarouselById);

// Page Info
router.post('/add-page-info', checkIpWhitelist, checkAdminAuth, controller.addNewPageInfo);
router.get('/get-page-info/:slug', controller.getPageInfoBySlug);

// Export All router..
module.exports = router;
