const express = require("express");
const router = express.Router();

const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');
const {getAllPrescriptionByUser,
    renamePrescriptionByIdByUser,
    softDeletePrescriptonByUser,
    getSinglePrescriptionByIdByUser,
    uploadPrescription,
    getAllPrescriptionForApp} = require("../controller/prescription")
//User 
// http://localhost:9999/api/web/prescription

router.get('/get-all-prescription-by-user',checkAuth, getAllPrescriptionByUser )
router.post('/edit-prescription-by-id-by-user',checkAuth, renamePrescriptionByIdByUser)
router.get('/get-single-prescription-by-id',checkAuth, getSinglePrescriptionByIdByUser)
router.post('/delete-prescription-by-id-by-user',checkAuth, softDeletePrescriptonByUser)
router.post('/upload-prescription', checkAuth, uploadPrescription)

// http://localhost:9999/api/app/prescription/
router.get('/get-all-prescription-for-app', checkAuth, getAllPrescriptionForApp)

module.exports = router