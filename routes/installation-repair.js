const express = require('express');

// Imports
const controller = require('../controller/installation-repair');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/installation-and-repair
 * http://localhost:9999/api/installation-and-repair
 */

router.post('/add-new-installation-and-repair',checkIpWhitelist,checkAdminAuth, controller.addNewInstallationRepair);
router.get('/get-all-installation-and-repair-list', controller.getAllInstallationRepair);
router.get('/get-installation-and-repair-by-id/:id', controller.getSingleInstallationRepairById);
router.get('/get-installation-and-repair-by-slug/:slug', controller.getInstallationRepairBySlug);
router.delete('/delete-installation-and-repair-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteInstallationRepairById);
router.put('/edit-installation-and-repair-by-id',checkIpWhitelist,checkAdminAuth, controller.editInstallationRepair);


// Export router class..
module.exports = router;
