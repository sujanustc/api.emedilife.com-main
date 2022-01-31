// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/district');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /district
 * http://localhost:9999/api/admin/district
 */

// http://localhost:9999/api/web/district
router.get('/get-all-districts', controller.getAllDistricts);
router.get("/get-all-districts-for-request-medicine", controller.getAllDistrictsForRequestMedicine)

router.post('/add-district',checkIpWhitelist,checkAdminAuth, controller.addDistrict);
router.get('/get-district-by-district-id/:districtId', controller.getDistrictByDistrictId);
router.put('/edit-district-by-district',checkIpWhitelist,checkAdminAuth, controller.editDistrictData);
router.delete('/delete-district-by-id/:districtId',checkIpWhitelist,checkAdminAuth, controller.deleteDistrictByDistrictId);
router.get('/get-all-districts-by-admin', controller.getAllDistrictsForAdmin);
router.post("/one-time", controller.oneTimeDistrictApi)

// http://localhost:9999/api/app/district
router.get("/get-all-district-list-with-search", controller.getAllDistrictList)


// Export All router..
module.exports = router;