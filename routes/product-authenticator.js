const express = require('express');

// Created Require Files..
const controller = require('../controller/product-authenticator');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
// Get Express Router Function..
const router = express.Router();

/**
 * /api/product-authenticator
 * http://localhost:9999/api/product-authenticator
 */

// TAG
router.post('/add-single-product-authenticator',checkIpWhitelist, checkAdminAuth, controller.addSingleProductAuthenticator);
router.get('/get-all-product-authenticator',checkIpWhitelist, checkAdminAuth, controller.getAllProductAuthenticator);
router.post('/add-multiple-product-authenticator',checkIpWhitelist, checkAdminAuth, controller.insertManyProductAuthenticator);
router.get('/get-product-authenticator-by-id/:id',checkAdminAuth, controller.getProductAuthenticatorByProductAuthenticatorId);
router.post('/check-product-authenticator-data', controller.checkProductAuthenticate);
router.put('/edit-product-authenticator-by-product-authenticator',checkIpWhitelist, checkAdminAuth, controller.editProductAuthenticatorData);
router.delete('/delete-product-authenticator-by-id/:id',checkIpWhitelist, checkAdminAuth, controller.deleteProductAuthenticatorByProductAuthenticatorId);
router.post('/get-product-authenticator-by-search', checkAdminAuth, controller.getProductAuthenticatorBySearch);



// Export All router..
module.exports = router;
