const express = require('express');
const router = express.Router();

const controller = require('../controller/deliveryAddress');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkAuth = require("../middileware/check-user-auth")

// http://localhost:9999/api/web/delivery-address
// http://localhost:9999/api/app/delivery-address
// http://localhost:9999/api/admin/delivery-address

router.post("/add-delivery-address", checkAuth, controller.addDeliveryAddress)
router.get("/get-all-delivery-address", checkAuth, controller.getAllDeliveryAddressByUser)
router.get("/get-delivery-address-by-id", checkAuth, controller.getDeliveryAddressById)
router.post("/edit-delivery-address-by-id", checkAuth, controller.editDeliveryAddressById)
router.post("/set-as-default-delivery-address", checkAuth, controller.setAsDefaultDeliveryAddress)
router.post("/delete-delivery-address-by-id", checkAuth, controller.deleteDeliveryAddressById)


// Export router class..
module.exports = router;
