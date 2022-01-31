// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/product-sub-category');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /product-category
 * http://localhost:9999/api/product-sub-category
 */


router.post('/add-sub-category',checkIpWhitelist,checkAdminAuth, controller.addSubCategory);
router.post('/add-multiple-sub-category',checkIpWhitelist,checkAdminAuth, controller.insertManySubCategory);
router.get('/get-all-sub-categories', controller.getAllSubCategory);
router.get('/get-all-sub-categories-with-count', controller.getAllSubCategoryWithCount);
router.get('/get-sub-category-by-sub-category-id/:subCategoryId', controller.getSubCategoryBySubCategoryId);
router.put('/edit-sub-category-by-sub-category',checkIpWhitelist,checkAdminAuth, controller.editSubCategoryData);
router.post('/get-sub-categories-by-search', controller.getSubCategoriesBySearch);
router.get('/get-sub-categories-by-search-with-count',checkAdminAuth, controller.getSubCategoriesBySearchWithCount);//sd
router.get('/get-sub-category-by-category-id/:categoryId', controller.getSubCategoryByCategoryId);
router.get('/get-sub-category-by-sub-category-slug/:subCategorySlug', controller.getSubCategoryBySubCategorySlug);
router.delete('/delete-sub-category-by-id/:subCategoryId',checkIpWhitelist,checkAdminAuth, controller.deleteSubCategoryBySubCategoryId);
// router.delete('/delete-sub-category-by-id2/:subCategoryId',checkIpWhitelist, controller.deleteSubCategoryBySubCategoryId2);

// http://localhost:9999/api/app/sub-category
router.get("/get-sub-category-list-with-search", controller.getAllSubCategoryListForFilter)

// Export All router..
module.exports = router;
