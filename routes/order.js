const express = require('express');

// Imports
const controller = require('../controller/order');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/order
 * http://localhost:9999/api/web/order
 */

// USER

router.post('/place-order', checkAuth, controller.placeOrder);
router.post('/placed-prescription-order', checkAuth, controller.placePrescriptionOrder)//sd
router.get('/get-all-prescription-order-by-user', checkAuth, controller.getAllPrescriptionOrderByUser)//sd
router.get('/get-all-orders-by-user', checkAuth, controller.getAllOrdersByUser);

router.get('/get-order-details/:id', controller.getOrderDetailsById);
router.get('/get-all-transactions-by-user', checkAuth, controller.getAllTransactionByUser);
router.get("/get-single-order-by-user/:orderId", checkAuth, controller.getSingleOrderByUser);
router.get("/get-single-order-by-user-admin/:orderId", checkIpWhitelist, checkAdminAuth, controller.getSingleOrderByUser);
router.put('/cancel-order-by-user/:orderId', checkAuth, controller.cancelOrderByUser);
router.post('/place-prescription-reorder', checkAuth, controller.placePrescriptionReorder) //sd

// ADMIN
/*
http://localhost:9999/api/admin/order
*/

router.get("/get-single-order-by-admin/:orderId", checkIpWhitelist, checkAdminAuth, controller.getSingleOrderByAdmin);//sd
router.get('/get-all-prescription-order-by-admin', checkAdminAuth, controller.getAllPrescriptionOrderByAdmin); //sd
router.post('/get-all-orders-by-admin', checkIpWhitelist, checkAdminAuth, controller.getAllOrdersByAdmin);
router.get('/get-all-transaction-by-admin', checkIpWhitelist, checkAdminAuth, controller.getAllTransactionByAdmin);
router.get("/get-all-orders-by-userId/:userId", checkIpWhitelist, checkAdminAuth, controller.getUserOrdersByAmin);
router.get('/get-all-canceled-orders', checkIpWhitelist, checkAdminAuth, controller.getAllCanceledOrdersByAdmin);
router.get('/get-all-orders-by-admin-no-paginate', checkIpWhitelist, checkAdminAuth, controller.getAllOrdersByAdminNoPaginate);
router.get("/get-all-orders-by-admin-for-filtered-excel", checkAdminAuth, controller.getAllOrdersByAdminForFilteredExcel)
router.put('/change-order-status', checkIpWhitelist, checkAdminAuth, controller.changeDeliveryStatus);
router.delete('/delete-order-by-admin/:orderId', checkIpWhitelist, checkAdminAuth, controller.deleteOrderByAdmin);
router.post('/get-orders-by-filter-data/:deliveryStatus', checkIpWhitelist, checkAdminAuth, controller.filterByDynamicFilters);
router.post('/get-orders-by-date-range-data/:startDate/:endDate', checkIpWhitelist, checkAdminAuth, controller.filterByDateRange);
router.get('/sent-test-ssl-message', controller.testSslSmsApi);
router.post('/confirm-prescription-order', checkAdminAuth, controller.confirmPrescriptionOrder);
router.post('/place-telemedicine-order', checkAdminAuth, controller.placeTelemedicineOrder);
router.post('/cancel-prescription-order-by-admin', checkAdminAuth, controller.canclePrescriptionOrderByAdmin)
router.post('/edit-order-by-id', checkAdminAuth, controller.editOrderByOrderId)
router.get('/get-order-by-search', checkAdminAuth, controller.getOrderBySearch)

// router.post('/update-orderid-by-orderid', controller.updateOrderIdByOrderId) //sd
// router.delete('/delete-all-order-except-one', controller.deleteAllOrdersExceptOne) //sd
// router.post('/order-reset', controller.orderReset) //sd
router.post('/delete-order-by-order-id', checkAdminAuth, controller.deleteOrderByOrderId)

// http://localhost:9999/api/app/order
router.get('/get-order-list', checkAuth, controller.getOrderList)
router.get('/get-order-details-for-app', checkAuth, controller.getOrderDetails)


// Export router class..
module.exports = router;
