// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/footer-data');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /footer-data
 * http://localhost:9999/api/footer-data
 */


router.post('/add-footer-data',checkIpWhitelist,checkAdminAuth, controller.addFooterData);
router.get('/get-all-footer-data', controller.getFooterData);
router.put('/update-footer-data',checkIpWhitelist,checkAdminAuth, controller.updateFooterData);

// Export All router..
module.exports = router;


// const footerDataRoutes = require('./routes/footer-data');
