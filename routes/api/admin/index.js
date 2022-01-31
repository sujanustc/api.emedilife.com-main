// Main Module Required..
const express = require("express");

// Created Require Files..
const controller = require("../../../controller/admin");
const inputValidator = require("../../../validation/admin");
const checkAdminAuth = require("../../../middileware/check-admin-auth");
const checkIpWhitelist = require("../../../middileware/check-ip-whitelist");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/admin
 * http://localhost:9999/api/admin
 */

router.get("/", (req, res, next) => {
    res.json({ status: true, message: "Admin index router" });
});
router.post("/registration", controller.adminSignUp);
router.put("/login", controller.adminLogin);
router.get("/get-logged-in-admin-info", checkIpWhitelist, checkAdminAuth, controller.getLoginAdminInfo);
router.put("/edit-logged-in-admin-info", checkIpWhitelist, checkAdminAuth, controller.editAdminOwnProfileInfo);
router.put("/change-logged-in-admin-password", checkIpWhitelist, checkAdminAuth, controller.changeAdminOwnPassword);
router.get("/get-logged-in-admin-role", checkAdminAuth, controller.getLoginAdminRole);
router.get("/get-all-admin-list", controller.getAdminLists);
router.get("/get-single-admin-by-id/:id", controller.getSingleAdminById);
// Modify
router.delete("/delete-admin-by-id/:id", checkIpWhitelist, checkAdminAuth, controller.deleteAdminById);
router.put("/edit-admin-info/:id", checkIpWhitelist, checkAdminAuth, controller.editAdmin);
router.post("/update-admin-images", checkIpWhitelist, checkAdminAuth, controller.updateAdminImageField);

// Role
router.post("/add-admin-role", checkIpWhitelist, controller.addAdminRole);
router.get("/get-all-admin-roles", checkAdminAuth, controller.getRolesData);
router.get("/get-admin-role-by-id/:id", checkAdminAuth, controller.getSingleRoleById);
router.delete("/delete-admin-role-by-id/:id", checkIpWhitelist, checkAdminAuth, controller.deleteAdminRoleById);
router.put("/edit-admin-role", checkIpWhitelist, checkAdminAuth, controller.editAdminRole);

// DEFAULT DATA
router.post("/add-default-data", controller.insertDefaultDocuments);

// Counts
router.get("/deshboard-data", checkAdminAuth, controller.getDashboardData);

//HeaderMenu
router.use("/header-menu", checkAdminAuth, require("../../header-menu"));

//Notifications
router.use("/notification", require("../../notification"))
router.use("/saved-notification", require("../../savedNotification"))
router.use("/minimum-amount", require("../../minimumAmount"))
router.use("/order", require("../../order"))
router.use("/product", require("../../product"))
router.use("/cronjob", require("../../cronJob"))
router.use("/app-version", require("../../appVersion"))
router.use("/shipping-charge", require("../../shipping-charge"))
router.use("/user", require("../../user"))
router.use("/backup-restore", require("../../backup-restore"))


router.use("/footer-link-header", require("../../footerLinkHeader"))
router.use("/area", require("../../area"))
router.use("/district", require("../../district"))
router.use("/coupon", require("../../coupon"))
router.use("/global-discount", require("../../globalDiscount"))
router.use("/discount-coupon", require("../../discountCoupon"))
router.use("/bulk-sms", require("../../bulk-sms"))
router.use("/request-medicine", require("../../requestMedicine"))
router.use("/brand", require("../../product-brand"))
router.use("/generic", require("../../product-generic"))
router.use("/category", require("../../product-category"))
router.use("/sub-category", require("../../product-sub-category"))
router.use("/product", require("../../product"))
router.use("/delivery-address", require("../../deliveryAddress"))
// Export All router..
module.exports = router;
