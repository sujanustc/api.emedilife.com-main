// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/product-category');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /product-category
 * http://localhost:9999/api/product-category
 */


router.post('/add-category',checkIpWhitelist,checkAdminAuth, controller.addCategory);
router.post('/add-multiple-category',checkIpWhitelist,checkAdminAuth, controller.insertManyCategory);
router.get('/get-all-categories', controller.getAllCategory);
router.get('/get-all-categories-with-count',checkAdminAuth, controller.getAllCategoryWithCount);
router.get('/get-category-by-category-id/:categoryId',checkAdminAuth, controller.getCategoryByCategoryId);
router.put('/edit-category-by-category',checkIpWhitelist,checkAdminAuth, controller.editCategoryData);
router.post('/get-categories-by-search',checkAdminAuth, controller.getCategoriesBySearch);
router.get('/get-categories-by-search-with-count',checkAdminAuth, controller.getCategoriesBySearchWithCount)//sd
router.get('/get-category-by-category-slug/:categorySlug', controller.getCategoryByCategorySlug);
router.delete('/delete-category-by-id/:categoryId',checkIpWhitelist,checkAdminAuth, controller.deleteCategoryByCategoryId);
// router.delete('/delete-category-by-id2/:categoryId',checkIpWhitelist, controller.deleteCategoryByCategoryId2);


// http://localhost:9999/api/app/category
router.get("/get-all-category-for-app", controller.getAllCategoryForApp)
router.get("/get-all-category-list-for-filter", controller.getAllCategoryListForFilter)

// Export All router..
module.exports = router;
