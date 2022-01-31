const express = require('express')
const router = express.Router();
const checkAdminAuth = require("../middileware/check-admin-auth");
const { addAppVersion, editAppVersion, getAllAppVersion, getVersionDetailsById, checkingCurrectAppVersion } = require("../controller/appVersion")

// http://localhost:9999/api/admin/app-version

router.post('/add-app-version', checkAdminAuth, addAppVersion);
router.post('/edit-app-version', checkAdminAuth, editAppVersion);
router.get('/get-all-app-version', checkAdminAuth, getAllAppVersion);
router.get('/get-version-details-by-id', checkAdminAuth, getVersionDetailsById);
router.get('/checking-current-version', checkingCurrectAppVersion)

module.exports = router;