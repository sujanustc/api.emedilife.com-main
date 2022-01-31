const express = require('express');

// Imports
const controller = require('../controller/installation-repair-type');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


// Get Express Router Function..
const router = express.Router();

/**
 * /api/installation-and-repair-type
 * http://localhost:9999/api/installation-and-repair-type
 */

router.post('/add-new-installation-and-repair-type',checkIpWhitelist,checkAdminAuth, controller.addNewInstallationRepairType);
router.post('/add-new-installation-and-repair-type-multi',checkIpWhitelist,checkAdminAuth, controller.addNewInstallationRepairTypeMulti);
router.get('/get-all-installation-and-repair-type-list', controller.getAllInstallationRepairType);
router.get('/get-installation-and-repair-type-details-by-id/:id', controller.getSingleInstallationRepairTypeById);
router.get('/get-installation-and-repair-type-details-by-slug/:slug', controller.getSingleInstallationRepairTypeBySlug);
router.delete('/delete-installation-and-repair-type-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteInstallationRepairTypeById);
router.post('/delete-installation-and-repair-type-multi',checkIpWhitelist,checkAdminAuth, controller.deleteInstallationRepairTypeMulti);
router.put('/edit-installation-and-repair-type-by-id',checkIpWhitelist,checkAdminAuth, controller.editInstallationRepairTypeData);


// Export router class..
module.exports = router;
