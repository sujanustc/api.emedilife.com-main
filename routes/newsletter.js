// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/newsletter');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

const router = express.Router();

/**
 * /newsletter
 * http://localhost:9999/api/newsletter
 */


router.post('/add-newsletter', controller.addNewsletter);
router.get('/get-all-newsletter',checkIpWhitelist,checkAdminAuth, controller.getNewsletters);
router.put('/update-newsletter', controller.updateNewsletter);
router.delete('/delete-newsletter/:id',checkIpWhitelist,checkAdminAuth, controller.deleteNewsletter);

// Export All router..
module.exports = router;
