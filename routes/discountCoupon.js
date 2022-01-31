const express = require('express');
const router = express.Router();

const { addDiscountCoupon,
    editDiscountCouponById,
    getAllDiscountCouponByAdmin,
    deleteDiscountCouponByAdmin,
    getDiscountCouponById,
    applyCoupon,
    calculateDiscount } = require('../controller/discountCouponController');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkAuth = require('../middileware/check-user-auth');

// http://localhost:9999/api/admin/discount-coupon

router.post("/add-discount-coupon", checkAdminAuth, addDiscountCoupon)
router.post("/edit-discount-coupon-by-admin", checkAdminAuth, editDiscountCouponById)
router.get("/get-all-discount-coupon-by-admin", checkAdminAuth, getAllDiscountCouponByAdmin)
router.post("/delete-discount-coupon-by-admin", checkAdminAuth, deleteDiscountCouponByAdmin)
router.get("/get-discount-coupon-by-id", checkAdminAuth, getDiscountCouponById)

// http://localhost:9999/api/web/discount-coupon
router.post("/apply-coupon", applyCoupon)
router.post("/calculate-discount", checkAuth, calculateDiscount)

// Export router class..
module.exports = router;
