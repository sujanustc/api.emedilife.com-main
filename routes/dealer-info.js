// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/dealer-info');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /dealer-info
 * http://localhost:9999/api/dealer-info
 */

 router.post('/add-dealer-info',checkIpWhitelist,checkAdminAuth, controller.addDealerInfo);
 router.get('/get-all-dealer-info', controller.getAllDealersInfo);
 router.get('/get-dealer-info-by-dealer-info-id/:dealerInfoId', controller.getDealerInfoByDealerInfoId);
 router.put('/edit-dealer-info-by-dealer-info',checkIpWhitelist,checkAdminAuth, controller.editDealerInfo);
 router.post('/get-dealer-info-by-search', controller.getDealerInfoBySearch);
 router.delete('/delete-dealer-info-by-id/:dealerInfoId',checkIpWhitelist,checkAdminAuth, controller.deleteDealerInfoByDealerInfoId);
 
 // Export All router..
 module.exports = router;