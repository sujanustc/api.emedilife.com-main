const express = require('express');
const router = express.Router();
const checkAdminAuth = require('../middileware/check-admin-auth');
const { sendRequestForMedicine, getAllMedicineRequest, getSingleMedicineRequest, addAdminNoteForRequestMedicine, changeRequestMedicineStatusById } = require('../controller/requestMedicineController');

// http://localhost:9999/api/web/request-medicine
router.post("/request-for-medicine", sendRequestForMedicine)

// http://localhost:9999/api/admin/request-medicine
router.get("/get-all-medicine-request", checkAdminAuth, getAllMedicineRequest)
router.get("/get-request-medicine-by-id", checkAdminAuth, getSingleMedicineRequest)
router.post("/change-request-medicine-status-by-id", checkAdminAuth, changeRequestMedicineStatusById)
router.post("/add-admin-note", checkAdminAuth, addAdminNoteForRequestMedicine)
module.exports = router;