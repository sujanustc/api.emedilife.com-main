const express = require('express');

// Imports
const controller = require('../controller/offer-product');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/offer-product
 * http://localhost:9999/api/offer-product
 */

router.post('/add-new-offer-product',checkIpWhitelist,checkAdminAuth, controller.addNewOfferProduct);
router.get('/get-all-offer-product-list', controller.getAllOfferProduct);
router.get('/get-offer-product-by-id/:id', controller.getSingleOfferProductById);
router.get('/get-offer-product-by-slug/:slug', controller.getOfferProductBySlug);
router.delete('/delete-offer-product-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteOfferProductById);
router.put('/edit-offer-product-by-id',checkIpWhitelist,checkAdminAuth, controller.editOfferProduct);


// Export router class..
module.exports = router;
