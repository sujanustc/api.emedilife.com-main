const express = require('express');

// Created Require Files..
const controller = require('../controller/product-tag');
// const inputValidator = require('../validation/product');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/tag
 * http://localhost:9999/api/tag
 */

// TAG
router.post('/add-single-tag',checkIpWhitelist,checkAdminAuth, controller.addSingleTag);
router.get('/get-all-tags', controller.getAllTags);
router.post('/add-multiple-tag',checkIpWhitelist,checkAdminAuth, controller.insertManyTag);
router.get('/get-tag-by-tag-id/:tagId', controller.getTagByTagId);
router.put('/edit-tag-by-tag',checkIpWhitelist,checkAdminAuth, controller.editTagData);
router.delete('/delete-tag-by-id/:tagId',checkIpWhitelist,checkAdminAuth, controller.deleteTagByTagId);
router.post('/get-tags-by-search', controller.getTagsBySearch);



// Export All router..
module.exports = router;
