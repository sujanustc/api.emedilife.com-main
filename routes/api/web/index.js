const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.json({ message: "Web index router" });
});

// http://localhost:9999/api/web
router.use("/header-menu", require("../../header-menu"));
router.use("/order", require("../../order"))
router.use("/prescription", require("../../prescription"));
router.use("/shipping-charge", require("../../shipping-charge"))
router.use("/user", require('../../user'))
router.use("/global-discount", require("../../globalDiscount"))
router.use("/request-medicine", require("../../requestMedicine"))
router.use("/discount-coupon", require("../../discountCoupon"))
router.use("/district", require("../../district"))
router.use("/area", require("../../area"))
router.use("/sub-category", require("../../product-sub-category"))
router.use("/delivery-address", require("../../deliveryAddress"))


module.exports = router;
