const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) => {
    res.json({ message: "App index router" });
});

// http://localhost:9999/api/app

router.use("/header-menu", require("../../header-menu"));
router.use('/user', require("../../user"))
router.use('/home', require("./home"))
router.use('/category', require("../../product-category"))
router.use('/brand', require("../../product-brand"))
router.use('/product', require("../../product"))
router.use('/featured-product', require("../../featured-product"))
router.use('/generic', require("../../product-generic"))
router.use('/district', require("../../district"))
router.use("/sub-category", require("../../product-sub-category"))
router.use("/prescription", require("../../prescription"))
router.use("/cart", require("../../cart"))
router.use("/order", require("../../order"))
router.use("/delivery-address", require("../../deliveryAddress"))


module.exports = router;
