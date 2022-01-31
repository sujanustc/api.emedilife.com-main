// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/store-info');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /store-info
 * http://localhost:3000/api/store-info
 */

 router.post('/add-store-info',checkIpWhitelist,checkAdminAuth, controller.addStoreInfo);
 router.get('/get-all-store-info', controller.getAllStoresInfo);
 router.get('/get-store-info-by-store-info-id/:storeInfoId', controller.getStoreInfoByStoreInfoId);
 router.put('/edit-store-info-by-store-info',checkIpWhitelist,checkAdminAuth, controller.editStoreInfo);
 router.post('/get-store-info-by-search', controller.getStoreInfoBySearch);
 router.delete('/delete-store-info-by-id/:storeInfoId',checkIpWhitelist,checkAdminAuth, controller.deleteStoreInfoByStoreInfoId);
 
 // Export All router..
 module.exports = router;