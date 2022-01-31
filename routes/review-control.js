// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/review-control');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');
const router = express.Router();

/**
 * /brand
 * http://localhost:3000/api/review-control
 */

router.post('/add-review', checkAuth, controller.addReview);
router.post('/get-all-review-by-query', controller.getAllReviewsByQuery);
router.get('/get-all-review', controller.getAllReviews);
router.get('/get-review-by-review-id/:reviewId', controller.getReviewByReviewId);
router.put('/edit-review',checkIpWhitelist,checkAdminAuth, controller.editReview);
router.delete('/delete-review-by-id/:reviewId',checkIpWhitelist,checkAdminAuth, controller.deleteReviewByReviewId);

// Export All router..
module.exports = router;
