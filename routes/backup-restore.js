const express = require('express');

// Created Require Files..
const controller = require('../controller/backup-restore');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/backup-restore
 * http://localhost:9999/api/admin/backup-restore
 */
router.post('/collection-backup',checkIpWhitelist,checkAdminAuth, controller.backupCollection);
router.post('/collection-restore',checkIpWhitelist,checkAdminAuth, controller.restoreCollection);
router.get('/get-all-collections',checkIpWhitelist,checkAdminAuth, controller.getCollectionList);
router.get('/backup-all', controller.backupAll);
// Export All router..
module.exports = router;
