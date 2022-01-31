// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/contact-us');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


const router = express.Router();

/**
 * /contact-us
 * http://localhost:9999/api/contact-us
 */

router.post('/add-contact-us',checkIpWhitelist,checkAdminAuth, controller.addContactUs);
router.post('/add-submit-complaint', controller.addSubmitComplaint);
router.post('/add-after-sale-support', controller.addAfterSaleSupport);
router.get('/get-all-contact-us', controller.getAllContactUs);
router.get('/get-contact-us-by-id/:id', controller.getContactUsById);
router.put('/edit-contact-us-by-id',checkIpWhitelist,checkAdminAuth, controller.editContactUs);
router.delete('/delete-contact-us-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteContactUsById);

// Node Mailer
router.post('/sent-mail-by-node-mailer', controller.sentMailByNodemailer);

// Export All router..
module.exports = router;
