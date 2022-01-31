const express = require('express');

// Imports
const controller = require('../controller/promotional-offer');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/promotional-offer
 * http://localhost:3000/api/promotional-offer
 */

router.post('/add-new-promotional-offer',checkIpWhitelist,checkAdminAuth, controller.addNewPromotionalOffer);
router.post('/add-new-promotional-offer-multi',checkIpWhitelist,checkAdminAuth, controller.addNewPromotionalOfferMulti);
router.get('/get-all-promotional-offer-list', controller.getAllPromotionalOffer);
router.get('/get-promotional-offer-details-by-id/:id', controller.getSinglePromotionalOfferById);
router.get('/get-promotional-offer-details-by-slug/:slug', controller.getSinglePromotionalOfferBySlug);
router.delete('/delete-promotional-offer-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deletePromotionalOfferById);
router.post('/delete-promotional-offer-multi',checkIpWhitelist,checkAdminAuth, controller.deletePromotionalOfferMulti);
router.put('/edit-promotional-offer-by-id',checkIpWhitelist,checkAdminAuth, controller.editPromotionalOfferData);


// Export router class..
module.exports = router;
