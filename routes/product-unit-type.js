const express = require('express');

// Created Require Files..
const controller = require('../controller/product-unit-type');
// const inputValidator = require('../validation/product');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/unit-type
 * http://localhost:3000/api/unit-type
 */

// TAG
router.post('/add-single-unit-type', checkIpWhitelist, checkAdminAuth, controller.addSingleUnitType);
router.get('/get-all-unit-types', controller.getAllUnitTypes);
router.post('/add-multiple-unit-type', checkIpWhitelist, checkAdminAuth, controller.insertManyUnitType);
router.get('/get-unit-type-by-unit-type-id/:id',checkAdminAuth, controller.getUnitTypeByUnitTypeId);
router.put('/edit-unit-type-by-unit-type', checkIpWhitelist, checkAdminAuth, controller.editUnitTypeData);
router.delete('/delete-unit-type-by-id/:id', checkIpWhitelist, checkAdminAuth, controller.deleteUnitTypeByUnitTypeId);
router.post('/get-unit-types-by-search', controller.getUnitTypesBySearch);


// Export All router..
module.exports = router;
