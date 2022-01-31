// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/coupon');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');


const router = express.Router();

/**
 * /api/coupon
 * http://localhost:9999/api/admin/coupon
 */


router.post('/add-coupon', checkIpWhitelist, checkAdminAuth, controller.addCoupon);
router.get('/get-all-coupons', checkIpWhitelist, checkAdminAuth, controller.getAllCoupons);
router.get('/get-coupon-by-coupon-id/:couponId', checkIpWhitelist, checkAdminAuth, controller.getCouponCouponId);
router.get('/check-coupon-for-user-apply/:couponCode', checkAuth, controller.checkCouponForApply);
router.get('/use-coupon/:couponCode', checkAuth, controller.useCoupon);
router.put('/edit-coupon', checkIpWhitelist, checkAdminAuth, controller.editCouponData);
router.delete('/delete-coupon-by-id/:couponId', checkIpWhitelist, checkAdminAuth, controller.deleteCoupon);
router.put('/coupon-used', checkAuth, controller.couponUsed);
router.post('/check-coupon-for-admin-apply', controller.checkCouponForAdminApply)


// Export router class..
module.exports = router;
