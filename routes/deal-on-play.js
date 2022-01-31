const express = require('express');

// Imports
const controller = require('../controller/deal-on-play');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


// Get Express Router Function..
const router = express.Router();

/**
 * /api/deal-on-play
 * http://localhost:9999/api/deal-on-play
 */

router.post('/add-new-deal-on-play',checkIpWhitelist,checkAdminAuth, controller.addNewDealOnPlay);
router.get('/get-all-deal-on-play-list', controller.getAllDealOnPlay);
router.get('/get-deal-on-play-by-id/:id', controller.getSingleDealOnPlayById);
router.delete('/delete-deal-on-play-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteDealOnPlayById);
router.put('/edit-deal-on-play-by-id',checkIpWhitelist,checkAdminAuth, controller.editDealOnPlay);


// Export router class..
module.exports = router;
