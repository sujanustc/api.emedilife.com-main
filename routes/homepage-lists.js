const express = require('express');

// Created Require Files..
const controller = require('../controller/homepage-lists');
// const inputValidator = require('../validation/product');
// const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/product
 * http://localhost:9999/api/product
 */

router.post('/add-list',checkIpWhitelist,checkAdminAuth, controller.addList);
router.get('/get-all-lists', controller.getAllLists);
router.post('/edit-list-by-list-id/:listId',checkIpWhitelist,checkAdminAuth, controller.editListByListId);
router.delete('/delete-list-by-list-name/:listName',checkIpWhitelist,checkAdminAuth, controller.deleteListByListName);


// Export All router..
module.exports = router;
