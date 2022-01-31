const express = require('express');

// Imports
const controller = require('../controller/category-menu');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
// Get Express Router Function..
const router = express.Router();

/**
 * /api/category-menu
 * http://localhost:9999/api/category-menu
 */

router.post('/add-new-category-menu',checkIpWhitelist,checkAdminAuth, controller.addNewCategoryMenu);
router.get('/get-all-category-menu', controller.getAllCategoryMenu);
router.delete('/delete-category-menu-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteCategoryMenuById);
router.get('/get-category-menu-by-id/:id', controller.getCategoryMenuById);
router.put('/update-category-menu-item',checkIpWhitelist,checkAdminAuth, controller.updateCategoryMenu);


// Export router class..
module.exports = router;
