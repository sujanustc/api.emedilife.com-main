// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/product-attribute');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /product-attribute
 * http://localhost:9999/api/product-attribute
 */


router.post('/add-attribute',checkIpWhitelist, checkAdminAuth, controller.addAttribute);
router.post('/add-multiple-attribute',checkIpWhitelist, checkAdminAuth, controller.insertManyAttribute);
router.get('/get-all-attributes', controller.getAllAttributes);
router.get('/get-attribute-by-attribute-id/:attributeId', controller.getAttributeByAttributeId);
router.put('/edit-attribute-by-attribute',checkIpWhitelist,checkAdminAuth, controller.editAttributeData);
router.post('/get-attributes-by-search', controller.getAttributesBySearch);
router.delete('/delete-attributes-by-id/:attributeId',checkIpWhitelist,checkAdminAuth, controller.deleteAttributeByAttributeId);

// Export All router..
module.exports = router;
