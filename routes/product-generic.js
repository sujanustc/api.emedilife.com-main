const express = require('express');

// Created Require Files..
const controller = require('../controller/product-generic');
// const inputValidator = require('../validation/product');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/generic
 * http://localhost:9999/api/generic
 */

// TAG
router.post('/add-single-generic',checkIpWhitelist,checkAdminAuth, controller.addSingleGeneric);
router.get('/get-all-tags', controller.getAllGenerics);
router.get('/get-all-tags-with-count',checkAdminAuth, controller.getAllGenericsWithCount);
router.post('/add-multiple-generic',checkIpWhitelist,checkAdminAuth, controller.insertManyGeneric);
router.get('/get-generic-by-generic-id/:tagId', controller.getGenericByGenericId);
router.put('/edit-generic-by-generic',checkIpWhitelist,checkAdminAuth, controller.editGenericData);
router.delete('/delete-generic-by-id/:tagId',checkIpWhitelist,checkAdminAuth, controller.deleteGenericByGenericId);
// router.delete('/delete-generic-by-id2/:tagId',checkIpWhitelist, controller.deleteGenericByGenericId2);
router.post('/get-tags-by-search', controller.getGenericsBySearch);
router.get('/get-tags-by-search-with-count',checkAdminAuth, controller.getGenericsBySearchWithCount) //sd


// http://localhost:9999/api/app/generic
router.get('/get-all-generic-for-filter', controller.getAllGenericsForFilter)



// Export All router..
module.exports = router;
