const express = require('express');

// Imports
const controller = require('../controller/featured-category');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


// Get Express Router Function..
const router = express.Router();

/**
 * /api/featured-category
 * http://localhost:9999/api/featured-category
 */

router.post('/add-new-featured-category',checkIpWhitelist,checkAdminAuth, controller.addNewFeaturedCategory);
router.get('/get-all-featured-category-list', controller.getAllFeaturedCategory);
router.get('/get-featured-category-by-id/:id', controller.getSingleFeaturedCategoryById);
router.delete('/delete-featured-category-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteFeaturedCategoryById);
router.put('/edit-featured-category-by-id',checkIpWhitelist,checkAdminAuth, controller.editFeaturedCategory);


// Export router class..
module.exports = router;
