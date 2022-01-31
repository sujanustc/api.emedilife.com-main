// Main Module Required..
const express = require('express');
const checkAdminAuth = require('../middileware/check-admin-auth');
const router = express.Router();
const { getAllCronJobList } = require("../controller/cronJob")

// http://localhost:9999/api/admin/cronjob
router.get("/get-all-cronjob-list-by-admin",checkAdminAuth, getAllCronJobList)


// Export router class..
module.exports = router;
