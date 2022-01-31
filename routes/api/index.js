const express = require('express')
const router = express.Router()


router.use("/web", require("./web"))
router.use("/app", require("./app"))
router.use("/admin", require("./admin"));


router.use("/user", require("../user"));
router.use("/upload", require("../upload"));
router.use("/top-brands", require("../top-brands"));
router.use("/unit-type", require("../product-unit-type"));
router.use("/homepage-lists", require("../homepage-lists"));
router.use("/product-attribute", require("../product-attribute"));
router.use("/product-parent-category", require("../product-parent-category"));
router.use("/product-category", require("../product-category"));
router.use("/product-sub-category", require("../product-sub-category"));
router.use("/product", require("../product"));
router.use("/cart", require("../cart"));
router.use("/offer-banner", require("../offer-banner"));
router.use("/promotional-banner", require("../promotional-banner"));
router.use("/shop-info", require("../shop-info"));
router.use("/newsletter", require("../newsletter"));
router.use("/gallery", require("../gallery"));
router.use("/image-folder", require("../image-folder"));
router.use("/brand", require("../product-brand"));
router.use("/generic", require("../product-generic"));
router.use("/customization", require("../customization"));
router.use("/deal-on-play", require("../deal-on-play"));
router.use("/deals-of-the-day", require("../deals-of-the-day"));
router.use("/flash-sale", require("../flash-sale"));
router.use("/coupon", require("../coupon"));
router.use("/store-info", require("../store-info"));
router.use("/dealer-info", require("../dealer-info"));
router.use("/featured-product", require("../featured-product"));
router.use("/featured-category", require("../featured-category"));
router.use("/category-menu", require("../category-menu"));
router.use("/shipping-charge", require("../shipping-charge"));
router.use("/review-control", require("../review-control"));
router.use("/banner", require("../banner"));
router.use("/order", require("../order"));
router.use("/prescription-order", require("../prescription-order"));
router.use("/order-temporary", require("../order-temporary"));
router.use("/promotional-offer", require("../promotional-offer"));
router.use("/offer-product", require("../offer-product"));
router.use("/payment-ssl", require("../payment-ssl"));
router.use("/contact-us", require("../contact-us"));
router.use("/blog", require("../blog"));
router.use("/wishlist", require("../wishlist"));
router.use("/installation-and-repair", require("../installation-repair"));
router.use("/bulk-sms", require("../bulk-sms"));
router.use("/discussion", require("../discussion"));
router.use("/installation-and-repair-type", require("../installation-repair-type"));
router.use("/about-us", require("../about-us"));
router.use("/warranty", require("../warranty"));
router.use("/product-authenticator", require("../product-authenticator"));
router.use("/footer-data", require("../footer-data"));
router.use("/career-esquire", require("../career-esquire"));
router.use("/promo-page", require("../promo-page"));
router.use("/faq", require("../faq"));
router.use("/area", require("../area"));
router.use("/district", require("../district"));
router.use("/backup-restore", require("../backup-restore"));


module.exports = router