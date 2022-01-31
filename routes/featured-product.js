const express = require('express');

// Imports
const controller = require('../controller/featured-product');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');



// Get Express Router Function..
const router = express.Router();

/**
 * /api/featured-product
 * http://localhost:9999/api/featured-product
 */

router.post('/add-new-featured-product',checkIpWhitelist,checkAdminAuth, controller.addNewFeaturedProduct);
router.get('/get-all-featured-product-list', controller.getAllFeaturedProduct);
router.get('/get-featured-product-by-id/:slug', controller.getSingleFeaturedProductById);
router.delete('/delete-featured-product-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteFeaturedProductById);
router.put('/edit-featured-product-by-id',checkIpWhitelist,checkAdminAuth, controller.editFeaturedProduct);


// http://localhost:9999/api/app/featured-product

router.get('/get-products-by-featured-product-id', controller.getProductsByFeaturedProductId)

// Export router class..
module.exports = router;
