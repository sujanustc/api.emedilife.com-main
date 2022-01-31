const express = require('express');

// Imports
const controller = require('../controller/image-folder');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/image-folder
 * http://localhost:9999/api/image-folder
 */

router.post('/add-new-image-folder',checkIpWhitelist,checkAdminAuth, controller.addNewImageFolder);
router.post('/add-new-image-folder-multi',checkIpWhitelist,checkAdminAuth, controller.addNewImageFolderMulti);
router.get('/get-all-image-folder-list',checkIpWhitelist,checkAdminAuth, controller.getAllImageFolder);
router.get('/get-image-folder-details-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.getSingleImageFolderById);
router.delete('/delete-image-folder-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteImageFolderById);
router.post('/delete-image-folder-images-multi',checkIpWhitelist,checkAdminAuth, controller.deleteImageFolderMulti);
router.put('/edit-image-folder-by-id',checkIpWhitelist,checkAdminAuth, controller.editImageFolderData);


// Export router class..
module.exports = router;
