// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/product-brand');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /brand
 * http://localhost:9999/api/brand
 */


router.post('/add-brand', checkIpWhitelist, checkAdminAuth, controller.addBrand);
router.post('/add-multiple-brand', checkIpWhitelist, checkAdminAuth, controller.insertManyBrand);
router.get('/get-all-brands', controller.getAllBrands);
router.get('/get-all-brands-with-count', checkAdminAuth, controller.getAllBrandsWithCount);//sd
router.get('/get-brand-by-brand-id/:brandId', checkAdminAuth, controller.getBrandByBrandId);
router.put('/edit-brand-by-brand', checkIpWhitelist, checkAdminAuth, controller.editBrandData);
router.post('/get-brands-by-search', controller.getParentCategoriesBySearch);
router.get('/get-brands-by-search-with-count', checkAdminAuth, controller.getBrandsBySearchWithCount); //sd
router.delete('/delete-brand-by-id2', checkAdminAuth, controller.deleteBrandByBrandId2)//sd
router.delete('/delete-brand-by-id/:brandId', checkIpWhitelist, checkAdminAuth, controller.deleteBrandByBrandId);

// http://localhost:9999/api/app/brand
router.get('/get-all-brands-for-app', controller.getAllBrandsForApp)
router.get('/get-all-brand-list', controller.getAllBrandListForFilter)

// Export All router..
module.exports = router;
