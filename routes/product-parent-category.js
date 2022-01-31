// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/product-parent-category');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /product-parent-category
 * http://localhost:9999/api/product-parent-category
 */


router.post('/add-parent-category',checkIpWhitelist,checkAdminAuth, controller.addParentCategory);
router.get('/get-all-parent-categories', controller.getAllParentCategory);
router.get('/get-parentcategory-by-parentcategory-id/:parentCategoryId', controller.getParentCategoryByParentCategoryId);
router.post('/get-parentcategory-by-search', controller.getParentCategoriesBySearch);

// Export All router..
module.exports = router;