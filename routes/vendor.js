// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/vendor');
// const inputValidator = require('../validation/vendor');
// const checkAuth = require('../middileware/check-vendor-auth');

const router = express.Router();

/**
 * /api/vendor
 * http://localhost:3000/api/vendor
 */


router.post('/registration', controller.vendorRegistration);
router.put('/login', controller.vendorLogin);
router.get('/logged-in-vendor-data', controller.getLoginVendorInfo);
router.get('/get-all-vendor-list', controller.getVendorLists);

// Export All router..
module.exports = router;
