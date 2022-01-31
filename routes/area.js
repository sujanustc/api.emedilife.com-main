// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/area');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /area
 * http://localhost:9999/api/area
 */

// http://localhost:9999/api/web/area

 router.post('/add-area-info',checkIpWhitelist,checkAdminAuth, controller.addArea);
 router.get('/get-all-area-info', controller.getAllAreas);
 router.post('/get-all-area-by-district', controller.getAllAreaByDistrict);
 router.get('/get-all-area-by-district-for-request-medicine', controller.getAllAreaByDistrictForRequestMedicine);
 router.get('/get-area-info-by-area-info-id/:areaId', controller.getAreaByAreaId);
 router.put('/edit-area-info-by-area-info',checkIpWhitelist,checkAdminAuth, controller.editAreaData);
 router.delete('/delete-area-info-by-id/:areaId/:districtId',checkIpWhitelist,checkAdminAuth, controller.deleteAreaByAreaId);
 router.get('/get-all-area-info-by-admin', controller.getAllAreasForAdmin);

 // Export All router..
 module.exports = router;
