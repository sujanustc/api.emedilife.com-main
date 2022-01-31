const express = require('express');

// Imports
const controller = require('../controller/deals-of-the-day');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/deals-of-the-day
 * http://localhost:9999/api/deals-of-the-day
 */

router.post('/add-new-deals-of-the-day',checkIpWhitelist,checkAdminAuth, controller.addNewDealsOfTheDay);
router.get('/get-all-deals-of-the-day-list', controller.getAllDealsOfTheDay);
router.get('/get-deals-of-the-day-by-id/:id', controller.getSingleDealsOfTheDayById);
router.delete('/delete-deals-of-the-day-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteDealsOfTheDayById);
router.put('/edit-deals-of-the-day-by-id',checkIpWhitelist,checkAdminAuth, controller.editDealsOfTheDay);


// Export router class..
module.exports = router;
